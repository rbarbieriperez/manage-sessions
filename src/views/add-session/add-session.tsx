import React from 'react';
import { TPatient, TClinic, TSession } from '../../types/types';
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
import { Typography } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import DialogCustom from '../../components/dialog-custom/dialog-custom';

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

    /**
     * false = not visible, true = visible
     */
    const [toggleSeeRegisteredSessionsModal, setToggleSeeRegisteredSessionsModal] = React.useState(false);


    React.useEffect(() => {
        dispatch({ type: 'UPDATE_USER_DATA', payload: UserDataProvider });
    }, [UserDataProvider]);


    /**
     * Create clinics options array
     */
    const _createClinicOptionsArr: TOption[] = state.userData.clinics.reduce((acc: TOption[], curr: TClinic) => {
        return [
            ...acc,
            {
                value: curr.clinicId,
                label: curr.clinicName
            }
        ]
    }, []).sort((a,b) => a.label.localeCompare(b.label));

    /**
     * Create patients options array
     */
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
    }, []).sort((a,b) => a.label.localeCompare(b.label));


    /**
     * Validate the fields to determinate if the button should be disabled or not
     */
    React.useEffect(() => {
        dispatch({ type: 'UPDATE_SUBMIT_BUTTON_DISABLED', payload: [state.selectedClinic, state.selectedDate, state.selectedPatient].includes(0) || [state.selectedDate].includes('') });
    }, [state.selectedClinic, state.selectedPatient, state.selectedDate]);

    /**
     * New date was selected
     * @param e
     */
    const _onSelectedDateChanged = (e: dayjs.Dayjs | null) => {
        if (e) {
            dispatch({ type: 'UPDATE_SELECTED_DATE', payload: `${e.year()}-${e.month() + 1}-${e.date()}`});
        }
    }

    /**
     * Generates new session id and update the userData object
     */
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

    /**
     * If submit button was clicked save the userData into firestore database
     */
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


    /**
     * Method that returns an array with patient's full name and clinic where they are from,
     * based on if the client has one session registered on the current day
     * @returns {string[]}
     */
    const computePatientsWithRegisteredSessionsToday = React.useMemo((): string[] => {
        const today = dayjs();
        const todayString = today.format('YYYY-M-D');
        const sessionPatients = new Set(
            state.userData.sessions
                .filter((session: TSession) => session.sessionDate === todayString)
                .map((session: TSession) => session.patientId)
        );

        return state.userData.patients
            .filter((patient: TPatient) => sessionPatients.has(patient.patientId))
            .map((patient: TPatient) => {
                const clinic = state.userData.clinics.find((clinic: TClinic) => clinic.clinicId === patient.clinicId);
                const clinicName = clinic ? ` de ${clinic.clinicName}` : '';
                return `${patient.name} ${patient.surname}${clinicName}`;
            }).sort((a,b) => a.localeCompare(b));
    }, [state.userData.sessions]);

    /**
     * Toggle the see sessions registered today modal
     */
    const toggleSeeSessionsRegisteredTodayModal = () => {
        setToggleSeeRegisteredSessionsModal(!toggleSeeRegisteredSessionsModal);
    }

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
                        maxDate={dayjs(new Date())}
                    />
                </LocalizationProvider>
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField
                    value={state.sessionObs}
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => dispatch({ type: 'UPDATE_SESSION_OBS', payload: e.target.value })}
                    fullWidth
                    multiline
                    //rows={6}
                    minRows={6}
                    maxRows={6}
                    //sx={{ paddingBottom: "1rem"}}
                    placeholder='Observaciones de la sesión...'
                    inputProps={{
                        "maxLength": 500
                    }}
                />
                <Typography sx={{
                    position: "absolute",
                    marginTop: "-1.3rem",
                    left: "82%",
                    transform: "translateX(-50%)",
                    color: "#373737"
                }}
                variant='subtitle2'>{state.sessionObs.length}/500</Typography>
            </Grid2>
            <Grid2 xs={10} display={"flex"} alignItems={"center"}>
                <Typography
                    fontSize={12}
                    paragraph
                    component={"span"}
                    variant='subtitle2'
                    sx={{ display: "inline-block", verticalAlign: "-5px", color: "#373737"}}
                    onClick={toggleSeeSessionsRegisteredTodayModal}
                >
                    Ver pacientes con sesiones registradas el dia de hoy
                    <LaunchIcon sx={{ width: "14px", verticalAlign: "-8px"}}/>
                </Typography>
            </Grid2>
            <Grid2 xs={12} position={"absolute"} bottom={"2rem"} textAlign={"center"}>
                <Button sx={{ width: "8rem" }} disabled={state.submitButtonDisabled} onClick={_onSubmitSession} variant="contained" color="success">Agregar</Button>
            </Grid2>
        </Grid2>


        <DialogCustom
            acceptButtonText='Cerrar'
            key={'show-registered-sessions-modal'}
            modalTitle='Sesiones registradas'
            modalDesc={computePatientsWithRegisteredSessionsToday}
            onButtonAcceptClick={toggleSeeSessionsRegisteredTodayModal}
            open={toggleSeeRegisteredSessionsModal}
         />
    </>
}