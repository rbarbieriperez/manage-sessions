import React from 'react';
import { TPatient, TClinic } from '../../types/types';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Button, TextField } from '@mui/material';
import SelectCustom from '../../components/select-custom/select-custom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { UserDataContext } from '../../App';
import { _saveData } from '../../firebase/_queries';
import { addSessionReducer, INITIAL_STATE } from '../../reducers/add-session-reducer';

interface IAddSession {
    onAlert: (message: string, type: 'success' | 'error') => void;
}

type TOption = {
    value: number;
    label: string;
}



export default function AddSession ({ onAlert }: IAddSession) {
    const UserDataProvider = React.useContext(UserDataContext);
    const [state, dispatch] = React.useReducer(addSessionReducer, INITIAL_STATE);

    React.useEffect(() => {
        dispatch({ type: 'UPDATE_USER_DATA', payload: UserDataProvider });
    }, [UserDataProvider]);

    const _createClinicOptionsArr: TOption[] = state.userData.clinics.reduce((acc: TOption[], curr: TClinic) => {
        return [
            ...acc,
            {
                value: curr.clinicId,
                label: curr.clinicName
            }
        ]
    }, []);

    const _createPatientsOptionsArr: TOption[] = state.userData.patients.reduce((acc: TOption[], curr: TPatient) => {
        if (curr.clinicId === state.selectedClinic) {
            return [
                ...acc,
                {
                    value: curr.patientId,
                    label: `${curr.name} ${curr.surname}-${curr.sessionValue}-${curr.sessionTime}m`
                }
            ]
        } else {
            return acc;
        }
    }, []);

    React.useEffect(() => {
        dispatch({ type: 'UPDATE_SUBMIT_BUTTON_DISABLED', payload: [state.selectedClinic, state.selectedDate, state.selectedPatient].includes(0) || [state.selectedDate].includes('') });
    }, [state.selectedClinic, state.selectedPatient, state.selectedDate]);

    const _onSelectedDateChanged = (e: dayjs.Dayjs | null) => {
        if (e) {
            dispatch({ type: 'UPDATE_SELECTED_DATE', payload: `${e.year()}-${e.month() + 1}-${e.date()}`});
        }
    }

    const _onSubmitSession = () => {
        const newSessionId = state.userData.sessions.length + 1;
        dispatch({ type: 'UPDATE_USER_DATA', payload: {
            ...state.userData,
            sessions: [...(state.userData.sessions), {
                sessionId: newSessionId,
                clinicId: state.selectedClinic,
                patientId: state.selectedPatient,
                sessionDate: state.selectedDate,
                sessionValue: state.userData.patients.find((el) => el.patientId === state.selectedPatient)?.sessionValue || 0,
                sessionObs: state.sessionObs
            }]
        }});
        dispatch({ type: 'UPDATE_SUBMIT_BUTTON_CLICKED', payload: true });
    }

    React.useEffect(() => {
        if (state.submitButtonClicked) {
            if (_saveData(state.userData)) {
               onAlert('Sesión registrada con éxito!', 'success');
            } else {
                onAlert('Ha ocurrido un error al registrar la sesión', 'error');
            }
            dispatch({ type: 'INITIAL_STATE', payload: INITIAL_STATE });
        }
    }, [state.submitButtonClicked]);

    return <>
        <Grid2 container display={"flex"} justifyContent={"center"}>
            <Grid2 xs={10} marginTop={5}>
                <SelectCustom
                    key={1}
                    disabled={state.userData.clinics.length > 0 ? false : true }
                    label='Clinicas'
                    onChange={(e: number) => dispatch({ type: 'UPDATE_SELECTED_CLINIC', payload: e })}
                    optionsArr={_createClinicOptionsArr}
                    value={state.selectedClinic.toString()}
                />
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <SelectCustom
                    key={2}
                    disabled={(state.userData.patients.length > 0 && state.selectedClinic !== 0) ? false : true }
                    label='Pacientes'
                    onChange={(e: number) => dispatch({ type: 'UPDATE_SELECTED_PATIENT', payload: e })}
                    optionsArr={_createPatientsOptionsArr}
                    value={state.selectedPatient.toString()}
                />
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <LocalizationProvider adapterLocale="es" dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker sx={{ width: "100%" }}
                        data-testid="date-picker"
                        onChange={_onSelectedDateChanged}
                        defaultValue={dayjs(state.selectedDate)}
                    />
                </LocalizationProvider>
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField value={state.sessionObs} onChange={(e:React.ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_SESSION_OBS', payload: e.target.value })} fullWidth multiline rows={4} placeholder='Observaciones de la sesión...'/>
            </Grid2>
            <Grid2 xs={12} position={"absolute"} bottom={"1rem"} textAlign={"center"}>
                <Button disabled={state.submitButtonDisabled} onClick={_onSubmitSession} variant="contained" color="success">Agregar</Button>
            </Grid2>
        </Grid2>
    </>
}