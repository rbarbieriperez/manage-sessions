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
        id: -1,
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
    const [allPatientSessions, setAllPatientSessions] = React.useState<Array<TSession>>([]);
    const [filteredSessions, setFilteredSessions] = React.useState<Array<TSession>>([]);
    const [selectedYear, setSelectedYear] = React.useState<number>(-1);
    const [selectedMonth, setSelectedMonth] = React.useState<number>(-1);


    const [monthsArray, setMonthsArr] = React.useState<Array<TOption>>([]);
    const [yearsArr, setYearsArr] = React.useState<TOption[]>([]);

    //Delete session
    const [dialogModalVisible, setDialogModalVisible] = React.useState<boolean>(false);
    const [deleteSessionId, setDeleteSessionId] = React.useState<number>(0);

    /**
     * Map all the sessions from the selected patient by date
     */
    React.useEffect(() => {
        setAllPatientSessions(UserDataProvider.sessions.filter((sesion:TSession) => (sesion.patientId === patientId)));
        _computeYearsArray();
        _computeMonthsArray();
    }, []);

    const _computeYearsArray = () => {
        const currentYear = new Date().getFullYear();
        const maxOldYear = 2010;
        setYearsArr(() => {
            let options:TOption[] = [];
            let id = 1;
            for (let i = currentYear; i >= maxOldYear; i--) {
                options.push({
                    value: id,
                    label: i.toString()
                });
                id++;
            }
            options.unshift({ value: -1, label: '-- NO FILTRAR --' });
            return options;
        });
    }

    const _computeMonthsArray = () => setMonthsArr(months.map((el) => ({ value: el.id, label: el.value })));

    const _computeDate = (date: string) => {
        dayjs.locale('es');
        const newDate = dayjs(date).format('DD/MM/YYYY');
        return dayjs(newDate, "DD/MM/YYYY").format("dddd, D [de] MMMM [del] YYYY");
    }

    const _onYearSelected = (idSelected: number) => {
        setSelectedYear(idSelected);
    }

    const _getYearLabel = (yearId: number) => Number(yearsArr.find((year) => year.value === yearId)?.label);

    const _filterSessions = (year:number, month?: number) => {
        setFilteredSessions(allPatientSessions.filter((session: TSession) => {
            const sessionValues = session.sessionDate.split('-');

            const sessionYear = Number(sessionValues[0]);
            const sessionMonth = Number(sessionValues[1]);

            const isYear = sessionYear === year;
            const isMonth = sessionMonth === month;
            if (year && month) return isYear && isMonth;

            return isYear;
        }));
    }

    React.useEffect(() => {
       if (selectedYear === -1 && selectedMonth === -1) setFilteredSessions(allPatientSessions);
       if (selectedYear !== -1 && selectedMonth === -1) _filterSessions(_getYearLabel(selectedYear), undefined);
       if (selectedYear !== -1 && selectedMonth !== -1) _filterSessions(_getYearLabel(selectedYear), selectedMonth);
    }, [selectedYear, selectedMonth, allPatientSessions]);


    const _onSelectedMonthChanged = (value: number) => {
        setSelectedMonth(value);
    }


    const _handleDeleteSession = (id: number) => {
        setDialogModalVisible(true);
        setDeleteSessionId(id);
        
    }

    const onDeleteSession = () => {
        // Copia del objeto UserDataProvider
        const userData = { ...UserDataProvider };
      
        // Eliminar la sesión del array
        const newSessionsArray = [...userData.sessions];
        newSessionsArray.splice(newSessionsArray.findIndex((session: TSession) => session.sessionId === deleteSessionId), 1);
      
        // Actualizar userData con el nuevo array de sesiones
        userData.sessions = newSessionsArray;
      
        if (_saveData(userData)) {
            onAlert('Sesión eliminada con éxito!', 'success');
            setAllPatientSessions(userData.sessions.filter((session:TSession) => session.patientId === patientId));
        } else {
            onAlert('No hemos podido eliminar la sesión', 'error');
        }
      
        // Actualizar el estado con el nuevo userData
        //setUserDataProvider(userData);
      
        // Ocultar el modal de diálogo
        setDialogModalVisible(false);
      };

    return <>
        <Grid2 container xs={12} display={"flex"} rowGap={5} paddingTop={5} justifyContent={"center"}>
            {
                allPatientSessions.length > 0 ? <>
                    <Grid2 xs={10}>
                        <SelectCustom
                            value={selectedYear.toString()}
                            onChange={_onYearSelected}
                            disabled={false}
                            label='Año'
                            optionsArr={yearsArr
                        }/>
                    </Grid2>
                    <Grid2 xs={10}>
                        <SelectCustom
                            onChange={_onSelectedMonthChanged}
                            value={selectedMonth.toString()}
                            disabled={selectedYear !== -1 ? false : true }
                            label='Mes'
                            optionsArr={monthsArray}
                        />
                    </Grid2>
                    {filteredSessions.map((sesion: TSession, index: number) => {
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
            open={dialogModalVisible}
            modalTitle='Eliminar sesión?'
            modalDesc='Si la eliminas no podrás recuperarla.'
            acceptButtonText='Eliminar'
            rejectButtonText='Cerrar'
            onButtonRejectClick={() => setDialogModalVisible(false)}
            onButtonAcceptClick={onDeleteSession}
        />
    </>
}