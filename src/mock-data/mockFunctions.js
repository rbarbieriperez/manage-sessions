import clinicsData from './clinicsData.json';
import patients from './patients.json';



export const _searchClinc = (clinicName) => {
    return clinicsData.data.find((el) => el.clinicName === clinicName);
}