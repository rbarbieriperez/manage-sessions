import React from 'react';
import { UserDataContext } from '../../App';
import { TOption, TSession } from '../../types/types';
import Grid2 from '@mui/material/Unstable_Grid2';
import { IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import SelectCustom from '../../components/select-custom/select-custom';
import DialogCustom from '../../components/dialog-custom/dialog-custom';
import { _saveData } from '../../firebase/_queries';
import { PATIENT_SESSIONS_INITIAL, PatientSessionsReducer } from '../../reducers/patient-sessions-reducer';

interface IPatientSessions {
    patientId: number;
    onAlert: (message: string, type: 'error' | 'success') => void;
}

type TDate = {
    date: string, 
    dateId: number
}


const months = [
    {
        id: 0,
        value: '-- NO FILTRAR --'
    },
    {
        id: 1,
        value: 'Enero'
    },
    {
        id: 2,
        value: 'Febrero'
    },
    {
        id: 3,
        value: 'Marzo'
    },
    {
        id: 4,
        value: 'Abril'
    },
    {
        id: 5,
        value: 'Mayo'
    },
    {
        id: 6,
        value: 'Junio'
    },
    {
        id: 7,
        value: 'Julio'
    },
    {
        id: 8,
        value: 'Agosto'
    },
    {
        id: 9,
        value: 'Septiembre'
    },
    {
        id: 10,
        value: 'Octubre'
    },
    {
        id: 11,
        value: 'Noviembre'
    },
    {
        id: 12,
        value: 'Diciembre'
    }
]


export default function PatientSessions({ patientId, onAlert }: IPatientSessions) {
    const UserDataProvider = React.useContext(UserDataContext);
    const [state, dispatch] = React.useReducer(PatientSessionsReducer, PATIENT_SESSIONS_INITIAL)


    /**
     * Map all the sessions from the selected patient by date
     */
    React.useEffect(() => {
        dispatch({ type: 'UPDATE_ALL_PATIENT_SESSIONS', payload: UserDataProvider.sessions.filter((sesion:TSession) => (sesion.patientId === patientId))});
        _computeYearsArray();
        _computeMonthsArray();
    }, []);

    React.useEffect(() => {
        console.log(state.yearsArr);
    }, [state.yearsArr]);

    const _computeYearsArray = () => {
        const currentYear = new Date().getFullYear();
        const maxOldYear = 2010;
        dispatch({ type: 'UPDATE_YEARS_ARRAY', payload: () => {
            let options:TOption[] = [];
            let id = 1;
            for (let i = currentYear; i >= maxOldYear; i--) {
                options.push({
                    value: id,
                    label: i.toString()
                });
                id++;
            }
            options.unshift({ value: 0, label: '-- NO FILTRAR --' });
            return options;
        }});
    }

    //const _computeMonthsArray = () => setMonthsArr(months.map((el) => ({ value: el.id, label: el.value })));
    const _computeMonthsArray = () => dispatch({ type: 'UPDATE_MONTHS_ARRAY', payload: months.map((el) => ({ value: el.id, label: el.value }))});

    const _computeDate = (date: string) => {
        dayjs.locale('es');
        const newDate = dayjs(date).format('DD/MM/YYYY');
        return dayjs(newDate, "DD/MM/YYYY").format("dddd, D [de] MMMM [del] YYYY");
    }

    const _onYearSelected = (idSelected: number) => {
        dispatch({ type: 'UPDATE_SELECTED_YEAR', payload: idSelected });
    }

    const _getYearLabel = (yearId: number) => Number(state.yearsArr.find((year: TOption) => year.value === yearId)?.label);

    const _filterSessions = (year:number, month?: number) => {
        dispatch({ type: 'UPDATE_FILTERED_SESSIONS', payload: state.allPatientSessions.filter((session: TSession) => {
            const sessionValues = session.sessionDate.split('-');

            const sessionYear = Number(sessionValues[0]);
            const sessionMonth = Number(sessionValues[1]);

            const isYear = sessionYear === year;
            const isMonth = sessionMonth === month;
            if (year && month) return isYear && isMonth;

            return isYear;
        })})
    }

    React.useEffect(() => {
        if (state.selectedYear === 0 && state.selectedMonth === 0) dispatch({ type: 'UPDATE_FILTERED_SESSIONS', payload: state.allPatientSessions });
        if (state.selectedYear !== 0 && state.selectedMonth === 0) _filterSessions(_getYearLabel(state.selectedYear), undefined);
        if (state.selectedYear !== 0 && state.selectedMonth !== 0) _filterSessions(_getYearLabel(state.selectedYear), state.selectedMonth);

    }, [state.selectedYear, state.selectedMonth, state.allPatientSessions]);


    const _onSelectedMonthChanged = (value: number) => {
        dispatch({ type: 'UPDATE_SELECTED_MONTH', payload: value });
    }

    const _handleDeleteSession = (id: number) => {
        dispatch({ type: 'UPDATE_DIALOG_MODAL_VISIBLE', payload: true });
        dispatch({ type: 'UPDATE_DELETE_SESSION_ID', payload: id });
    }

    const onDeleteSession = () => {
        // Copia del objeto UserDataProvider
        const userData = { ...UserDataProvider };
        // Eliminar la sesión del array
        const newSessionsArray = [...userData.sessions];
        newSessionsArray.splice(newSessionsArray.findIndex((session: TSession) => session.sessionId === state.deleteSessionId), 1);
        // Actualizar userData con el nuevo array de sesiones
        userData.sessions = newSessionsArray;
        if (_saveData(userData)) {
            onAlert('Sesión eliminada con éxito!', 'success');
            dispatch({ type: 'UPDATE_ALL_PATIENT_SESSIONS', payload: userData.sessions.filter((session:TSession) => session.patientId === patientId)});
        } else {
            onAlert('No hemos podido eliminar la sesión', 'error');
        }
        dispatch({ type: 'UPDATE_DIALOG_MODAL_VISIBLE', payload: false });
      };

    return <>
        <Grid2 container xs={12} display={"flex"} rowGap={5} paddingTop={5} justifyContent={"center"}>
            {
                state.allPatientSessions.length > 0 ? <>
                    <Grid2 xs={10}>
                        <SelectCustom
                            value={state.selectedYear.toString()}
                            onChange={_onYearSelected}
                            disabled={false}
                            label='Año'
                            optionsArr={state.yearsArr?.length > 0 ? state.yearsArr : []}
                            showZeroValue
                        />
                    </Grid2>
                    <Grid2 xs={10}>
                        <SelectCustom
                            onChange={_onSelectedMonthChanged}
                            value={state.selectedMonth.toString()}
                            disabled={state.selectedYear !== 0 ? false : true }
                            label='Mes'
                            optionsArr={state.monthsArray?.length > 0 ? state.monthsArray : []}
                            showZeroValue
                        />
                    </Grid2>
                    {state.filteredSessions.map((sesion: TSession, index: number) => {
                        return <Grid2 key={'session-' + index} xs={10} border={1} padding={"15px"} borderRadius={5} sx={{ backgroundColor: "lightcyan" }} boxShadow={3}>
                            <Grid2 xs={12} position={"relative"}>
                                <Typography fontSize={14}>{_computeDate(sesion.sessionDate)}</Typography>
                                <Typography fontSize={14}>{sesion.sessionType}</Typography>
                                <IconButton  onClick={() => _handleDeleteSession(sesion.sessionId)} sx={{ position: "absolute", right: "-.8rem", top: "-1rem" }}>
                                    <CloseIcon sx={{ width: "16px" }}/>
                                </IconButton>
                            </Grid2>
                            <Grid2 xs={12} marginTop={2}>
                                <Typography fontSize={14}>{sesion.sessionObs}</Typography>
                            </Grid2>
                        </Grid2>
                    })}
                    </>
                :
                    <Grid2 xs={10} textAlign={"center"}>
                        <Typography>El paciente seleccionado no tiene sesiones registradas</Typography>
                    </Grid2>
            }
        </Grid2>

        <DialogCustom
            open={state.dialogModalVisible}
            modalTitle='Eliminar sesión?'
            modalDesc='Si la eliminas no podrás recuperarla.'
            acceptButtonText='Eliminar'
            rejectButtonText='Cerrar'
            onButtonRejectClick={() => dispatch({ type: 'UPDATE_DIALOG_MODAL_VISIBLE', payload: false })}
            onButtonAcceptClick={onDeleteSession}
        />
    </>
}