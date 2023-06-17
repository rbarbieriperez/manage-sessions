import { TClinic, TOption, TPatient } from "../types/types";


const initialPatientData:Omit<TPatient, 'patientId'> = {
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
    clinicName: '',
    clinicId: 0,
    contactDetails: [],
    address: { additionalInfo: '', fullAddress: '', number: '' }
}


interface ICreatePatientReduce {
    patientData: Omit<TPatient, 'patientId'>;
    buttonDisabled: boolean;
    clinicsOptionsArray: TOption[];
    selectedClinic: TClinic;
    familyContactDetailsElements: React.ReactElement[];
    formSubmitted: boolean;
}


export const INITIAL_CREATE_PATIENT:ICreatePatientReduce = {
    patientData: initialPatientData,
    buttonDisabled: true,
    clinicsOptionsArray: [],
    selectedClinic: initialClinicData,
    familyContactDetailsElements: [],
    formSubmitted: false
}

type TAction = {
    type: 'SUBMIT_BUTTON_STATE'
    | 'SET_CLINICS_OPTIONS'
    | 'SET_SELECTED_CLINIC'
    | 'SET_PATIENT_DATA'
    | 'SET_CONTACTDETAILS_ELEMENTS'
    | 'FORM_SUBMITTED_STATE'
    | 'INITIAL_STATE'
    payload: any;
}

export const createPatientReduce = (state: ICreatePatientReduce, action:TAction) => {
    switch(action.type) {
        case 'FORM_SUBMITTED_STATE': return {
            ...state,
            formSubmitted: action.payload
        };
        case 'SET_CLINICS_OPTIONS': return {
            ...state,
            clinicsOptionsArray: action.payload
        };
        case 'SET_CONTACTDETAILS_ELEMENTS': return {
            ...state,
            familyContactDetailsElements: action.payload
        };
        case 'SET_PATIENT_DATA': return {
            ...state,
            patientData: action.payload
        };
        case 'SET_SELECTED_CLINIC': return {
            ...state,
            selectedClinic: action.payload
        };
        case 'SUBMIT_BUTTON_STATE': return {
            ...state,
            buttonDisabled: action.payload
        };
        case 'INITIAL_STATE': return action.payload;
        default: return state;

    }
}