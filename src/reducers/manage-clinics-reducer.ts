import { TClinic, TUserData } from "../types/types";
import { _createUserDataObject } from "../utils/functions";


const clinicInitialData = {
    clinicName: '',
    address: {
        fullAddress: '',
        number: '',
        additionalInfo: ''
    },
    contactDetails: []

}

type TAlert = {
    message: string;
    visible: boolean;
    type: 'error' | 'success'
}

interface IManageClinics {
    userData: TUserData,
    contactDetailsEls: React.ReactElement[],
    clinicData: Omit<TClinic, 'clinicId'>,
    buttonDisabled: boolean,
    isSearchForm: boolean,
    spinnerVisible: boolean,
    submitButtonClicked: boolean,
    alertConfig: TAlert,
    modifiedClinicId: number
}

export const INITIAL_MANAGE_CLINICS:IManageClinics = {
    userData: _createUserDataObject('', [], [], [], ''),
    submitButtonClicked: false,
    contactDetailsEls: [],
    buttonDisabled: true,
    isSearchForm: false,
    spinnerVisible: false,
    modifiedClinicId: 0,
    clinicData: clinicInitialData,
    alertConfig: { visible: false, message: '', type: 'error' }
}


type TAction = {
    type: 'UPDATE_USER_DATA' |
    'UPDATE_SUBMIT_BUTTON_CLICKED' |
    'UPDATE_CONTACT_DETAILS_ELS' |
    'UPDATE_BUTTON_DISABLED' |
    'UPDATE_SEARCH_FORM' |
    'UPDATE_SPINNER_VISIBLE' |
    'UPDATE_MODIFIED_CLINIC_ID' |
    'UPDATE_CLINIC_DATA' |
    'UPDATE_ALERT_CONFIG' |
    'INITIAL_STATE',
    payload: any
}

export const ManageClinicsReducer = (state: IManageClinics, action: TAction) => {
    switch(action.type) {
        case 'UPDATE_ALERT_CONFIG': return {
            ...state,
            alertConfig: action.payload
        };
        case 'UPDATE_BUTTON_DISABLED': return {
            ...state,
            buttonDisabled: action.payload
        };
        case 'UPDATE_CLINIC_DATA': return {
            ...state,
            clinicData: typeof action.payload === 'object' ? action.payload : action.payload()
        };
        case 'UPDATE_CONTACT_DETAILS_ELS': return {
            ...state,
            contactDetailsEls: action.payload
        };
        case 'UPDATE_MODIFIED_CLINIC_ID': return {
            ...state,
            modifiedClinicId: action.payload
        };
        case 'UPDATE_SEARCH_FORM': return {
            ...state,
            isSearchForm: action.payload
        };
        case 'UPDATE_SPINNER_VISIBLE': return {
            ...state,
            spinnerVisible: action.payload
        };
        case 'UPDATE_SUBMIT_BUTTON_CLICKED': return {
            ...state,
            submitButtonClicked: action.payload
        };
        case 'UPDATE_USER_DATA': return {
            ...state,
            userData: action.payload
        };
        case 'INITIAL_STATE': return action.payload;
        default: return state;
    }
}