import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { Typography } from '@mui/material';
import { UserDataContext } from '../../App';
import { REPORTS_INITIAL_DATA, ReportsReducer } from '../../reducers/reports-reducer';
import DateFilter from '../../components/date-filter/date-filter';
import { TClinic, TPages, TPatient, TSession } from '../../types/types';
import ShowData from '../../components/show-data/show-data';



interface IReports {

}

const Reports = () => {
    const UserDataProvider = React.useContext(UserDataContext);
    const [state, dispatch] = React.useReducer(ReportsReducer, REPORTS_INITIAL_DATA);
    const [dateSelected, setDateSelected] = React.useState({ initialDate: '', lastDate: '' });


    React.useEffect(() => {
        dispatch({ type: 'UPDATE_USER_DATA', payload: UserDataProvider });
    }, [UserDataProvider]);


    /**
     * Filter the sessions by initial and last dates
     */
    React.useEffect(() => {
        if (dateSelected.initialDate !== '' && dateSelected.lastDate !== '') {
            const initialDate = new Date(dateSelected.initialDate);
            const lastDate = new Date(dateSelected.lastDate);

            const filteredDates = state.userData.sessions.filter((session: TSession) => {
                const sessionDate = new Date(session.sessionDate);

                return sessionDate >= initialDate && sessionDate <= lastDate;
            });

            dispatch({ type: 'UPDATE_FILTERED_SESSIONS', payload: filteredDates });
        }
    }, [dateSelected]);

    /**
     * Handle filtered sessions state
     */
    React.useEffect(() => {
        dispatch({ type: 'UPDATE_SESSIONS_EARNS', payload: _calculateAllSessionsEarns() });
        dispatch({ type: 'UPDATE_SESSIONS_PER_CLINIC', payload: _generateSessionsPerClinicData() });
        dispatch({ type: 'UPDATE_SESSIONS_PER_PATIENT', payload: _generateSessionsPerPatientData() });
    }, [state.filteredSessions]);


    const _calculateAllSessionsEarns = (): number => {
        return state.filteredSessions.reduce((acc: number, curr: TSession) => acc + curr.sessionValue, 0);
    }

    /**
     * Generates the options data array with all the sessions per clinic
     */
    const _generateSessionsPerClinicData = () => {
        if (state.filteredSessions.length === 0) {
            return [];
        }
        const clinicIds: number[] = state.userData.clinics.map((clinic: TClinic) => clinic.clinicId);
        return clinicIds.map((clinicId: number) => ({
            label: state.userData.clinics.find((clinic: TClinic) => clinic.clinicId === clinicId).clinicName,
            value: state.filteredSessions.filter((session: TSession) => session.clinicId === clinicId).length
        }));
    }

    const _generateSessionsPerPatientData = () => {
        if (state.filteredSessions.length === 0) {
            return [];
        }

        const patientsId: number[] = state.userData.patients.map((patient: TPatient) => patient.patientId);
        return patientsId.map((patientId: number) => {
            const filteredPatient = state.userData.patients.find((patient: TPatient) => patient.patientId === patientId);
            return {
                label: filteredPatient.name + ' ' + filteredPatient.surname,
                value: state.filteredSessions.filter((session: TSession) => session.patientId === patientId).length
            }
        });
    }

    return <>
        <Grid2 container display={"flex"} justifyContent={"center"}>
            <Grid2 xs={11} marginTop={3}>
                <Typography fontSize={22} fontWeight={"bold"} variant="h1">¡Hola {state.userData.name}, aquí tienes tu reporte!</Typography>
            </Grid2>
            <Grid2 xs={11} marginTop={3}>
                <DateFilter
                    onInitialDateChanged={(initialDate: string) => setDateSelected((prev) => ({...prev, initialDate: initialDate }))}
                    onLastDateChanged={(initialDate: string) => setDateSelected((prev) => ({...prev, lastDate: initialDate }))}
                />
            </Grid2>
            <Grid2 xs={11} marginTop={3}>
                <Typography fontSize={14} variant="subtitle2">Mostrando el reporte desde <b>{dateSelected.initialDate}</b> hasta <b>{dateSelected.lastDate}</b></Typography>
            </Grid2>
            <Grid2 xs={11} marginTop={3}>
                <Typography fontSize={22} fontWeight={"bold"} variant="h1">Total generado: ${state.sessionsEarns}</Typography>
                <Typography fontSize={22} fontWeight={"bold"} variant="h1">Sesiones dictadas: {state.filteredSessions.length}</Typography>
            </Grid2>

            <Grid2 xs={11} marginTop={3}>
                {
                    state.sessionsPerClinic.length !== 0 ?
                    <ShowData
                        title='Sesiones por clínica'
                        data={state.sessionsPerClinic}
                    /> : ''
                }

            </Grid2>

            <Grid2 xs={11} marginTop={3}>
                {
                    state.sessionsPerPatient.length !== 0 ?
                    <ShowData
                        title='Sesiones por paciente'
                        data={state.sessionsPerPatient}
                    /> : ''
                }
            </Grid2>
        </Grid2>
    </>
}


export default Reports;