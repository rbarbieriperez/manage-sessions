import { TClinic, TFamily, TOption, TPatient } from "../types/types";


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
    modalDialogOpen: boolean,
    selectedPatientOld: TPatient
}

export const INITIAL_UPDATE_DELETE_DATA:IUpdateDeletePatientReducer = {
    buttonDisabled: true,
    clinicsOptionsArray: [],
    patientsOnClinic: [],
    selectedClinic: initialClinicData,
    selectedPatient: initialPatientData,
    selectPatientDisabled: false,
    formSubmitted: false,
    modalDialogOpen: false,
    selectedPatientOld: initialPatientData
}

type TAction = {
    type: 'UPDATE_BUTTON_DISABLED'
    | 'UPDATE_CLINICS_OPTIONS_ARRAY'
    | 'UPDATE_PATIENTS_ON_CLINIC'
    | 'UPDATE_SELECTED_CLINIC'
    | 'UPDATE_SELECTED_PATIENT'
    | 'UPDATE_SELECTED_PATIENT_OLD'
    | 'UPDATE_SELECT_PATIENT_DISABLED'
    | 'UPDATE_FORM_SUBMITTED'
    | 'UPDATE_MODAL_DIALOG_OPEN'
    | 'INITIAL_STATE'
    payload: any
}


export const updateDeletePatientReduce = (state: IUpdateDeletePatientReducer, action: TAction) => {
    switch(action.type) {
        case 'UPDATE_BUTTON_DISABLED': return {
            ...state,
            buttonDisabled: action.payload
        };
        case 'UPDATE_CLINICS_OPTIONS_ARRAY': return {
            ...state,
            clinicsOptionsArray: action.payload
        };
        case 'UPDATE_FORM_SUBMITTED': return {
            ...state,
            formSubmitted: action.payload
        };
        case 'UPDATE_MODAL_DIALOG_OPEN': return {
            ...state,
            modalDialogOpen: action.payload
        };
        case 'UPDATE_PATIENTS_ON_CLINIC': return {
            ...state,
            patientsOnClinic: action.payload
        };
        case 'UPDATE_SELECTED_CLINIC': return {
            ...state,
            selectedClinic: action.payload
        };
        case 'UPDATE_SELECTED_PATIENT': return {
            ...state,
            selectedPatient: action.payload
        };
        case 'UPDATE_SELECTED_PATIENT_OLD': return {
            ...state,
            selectedPatientOld: action.payload
        }
        case 'UPDATE_SELECT_PATIENT_DISABLED': return {
            ...state,
            selectPatientDisabled: action.payload
        };
        case 'INITIAL_STATE': return action.payload;
    }
}