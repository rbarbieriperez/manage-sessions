import { TClinic, TOption, TPatient } from "../types/types";


const initialPatientData:TPatient = {
    patientId: 0,
    name: '',
    surname: '',
    lastSurname: '',
    clinicId: 0,
    age: 0,
    sessionValue: 0,
    sessionTime: 0,
    family: []
}

const initialClinicData:TClinic = {
    clinicId: 0,
    clinicName: '',
    address: { additionalInfo: '', fullAddress: '', number: '' }
}

interface IUpdateDeletePatientReducer {
    buttonDisabled: boolean,
    clinicsOptionsArray: TOption[],
    patientsOnClinic: TOption[],
    selectedClinic: TClinic,
    selectedPatient: TPatient,
    selectPatientDisabled: boolean,
    formSubmitted: boolean,
    familyContactDetailsElements: React.ReactElement[],
    modalDialogOpen: boolean,
}

export const INITIAL_UPDATE_DELETE_DATA:IUpdateDeletePatientReducer = {
    buttonDisabled: true,
    clinicsOptionsArray: [],
    patientsOnClinic: [],
    selectedClinic: initialClinicData,
    selectedPatient: initialPatientData,
    selectPatientDisabled: false,
    formSubmitted: false,
    familyContactDetailsElements: [],
    modalDialogOpen: false
}

type TAction = {
    type: '',
    payload: any
}


export const updateDeletePatientReduce = (state: IUpdateDeletePatientReducer, action: TAction) => {
    
}