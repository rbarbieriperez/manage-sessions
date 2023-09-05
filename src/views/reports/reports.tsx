import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { IconButton, Typography } from '@mui/material';
import { UserDataContext } from '../../App';
import { REPORTS_INITIAL_DATA, ReportsReducer } from '../../reducers/reports-reducer';
import DateFilter from '../../components/date-filter/date-filter';
import { TClinic, TDataCategories, TOption, TPatient, TSession } from '../../types/types';
import ShowData from '../../components/show-data/show-data';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShowDataCategory from '../../components/show-data-category/show-data-category';
import AnimatedWrapper from '../../components/animated-wrapper/animated-wrapper';

interface IReports {

}

const Reports = () => {
    const UserDataProvider = React.useContext(UserDataContext);
    const [state, dispatch] = React.useReducer(ReportsReducer, REPORTS_INITIAL_DATA);
    const [dateSelected, setDateSelected] = React.useState({ initialDate: '', lastDate: '' });
    const [toggleEarnsVisibility, setToggleEarnsVisibility] = React.useState(true);
    const [earnsValue, setEarnsValue] = React.useState('*********');

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

    const handleToggleEarnsVisibility = () => {
        if (toggleEarnsVisibility) {
            setEarnsValue(state.sessionsEarns);
        } else {
            setEarnsValue('*********');
        }
        setToggleEarnsVisibility(!toggleEarnsVisibility);
    }

    const computeShowDataCategoriesData = (): TDataCategories[] => {
        const clinicIds: number[] = state.userData.clinics.map((clinic: TClinic) => clinic.clinicId);

        return clinicIds.map((clinicId: number): TDataCategories => {
            const filteredPatient = state.userData.patients.filter((patient: TPatient) => patient.clinicId === clinicId);
            return {
                header: state.userData.clinics.find((clinic: TClinic) => clinic.clinicId === clinicId).clinicName,
                values: filteredPatient.map((patient: TPatient) => patient.name + ' ' + patient.surname + ' ' + state.filteredSessions.filter((session: TSession) => session.patientId === patient.patientId).length)
            }
        })
    }

    const computeShowDataAnnualReportData = () => {
        const currentYear = new Date().getUTCFullYear();
        const filteredYearSessions = state.userData.sessions.filter((session: TSession) => session.sessionDate.includes(currentYear.toString()) === true);
        const months = [1,2,3,4,5,6,7,8,9,10,11,12];
        const monthsLabel = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        if (filteredYearSessions && Array.isArray(filteredYearSessions)) {
            return months.map((month: number) => ({
                label: monthsLabel[month -1],
                value: `$${filteredYearSessions.filter((session: TSession) => new RegExp(`^\\d{4}-${month}-\\d{1,2}$`).test(session.sessionDate) === true).reduce((acc: number, curr: TSession) => acc + curr.sessionValue, 0)}`
            }));
        }

        return [];
    }

    const computeHistoricAnnual = () => {
        const years = Array.from(new Set(state.userData.sessions.map((session: TSession) => session.sessionDate.split('-')[0]))) as number[];

        if (years && Array.isArray(years)) {
            return years.map((year: number) => ({
                label: year.toString(),
                value: `$${state.userData.sessions.filter((session: TSession) => new RegExp(`^${year}-\\d{1,2}-\\d{1,2}$`).test(session.sessionDate) === true).reduce((acc: number, curr: TSession) => acc + curr.sessionValue, 0)}`
            }));
        }

        return [];
    }

    return <>
        <Grid2 container display={"flex"} justifyContent={"center"} paddingBottom={4}>
            <Grid2 xs={12} sx={{ zIndex: 1, paddingLeft: 2, paddingBottom: 2 }}>
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
                    <Grid2 display={"flex"}>
                        <Typography fontSize={22} fontWeight={"bold"} variant="h1">Total generado: ${earnsValue}</Typography>
                        <IconButton sx={{ marginTop: -1}} onClick={handleToggleEarnsVisibility}>{toggleEarnsVisibility ? <VisibilityIcon/> : <VisibilityOffIcon/>}</IconButton>
                    </Grid2>
                    <Typography fontSize={22} fontWeight={"bold"} variant="h1">Sesiones dictadas: {state.filteredSessions.length}</Typography>
                </Grid2>
            </Grid2>

            <Grid2 xs={11} marginTop={3}>
                {
                    state.sessionsPerClinic.length !== 0 ?
                    <AnimatedWrapper title='Sesiones por clínica'
                    component={<ShowData
                        title='Sesiones por clínica'
                        data={state.sessionsPerClinic}
                    />}/>
                     : ''
                }

            </Grid2>

            <Grid2 xs={11} marginTop={3}>
                <AnimatedWrapper title='Sesiones por paciente' component={<ShowDataCategory title={"Sesiones por paciente"} data={computeShowDataCategoriesData()}/>}/>
            </Grid2>

            <Grid2 xs={11} marginTop={3}>
                <AnimatedWrapper title='Reporte Anual' component={<ShowData title={"Reporte Anual"} data={computeShowDataAnnualReportData()}/>}/>
            </Grid2>

            <Grid2 xs={11} marginTop={3}>
                <AnimatedWrapper title='Historico Anual' component={<ShowData title={"Historico Anual"} data={computeHistoricAnnual()}/>}/>
            </Grid2>
        </Grid2>
    </>
}


export default Reports;