import { TUserData } from '../types/types';
import { _createUserDataObject } from '../utils/functions';


interface IAddSessionReducer {
    selectedClinic: number,
    selectedPatient: number,
    selectedDate: string,
    sessionObs: string,
    submitButtonDisabled: boolean,
    userData: TUserData,
    submitButtonClicked: boolean
}




export const INITIAL_STATE: IAddSessionReducer = {
    selectedClinic: 0,
    selectedPatient: 0,
    selectedDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    sessionObs: '',
    submitButtonDisabled: false,
    userData: _createUserDataObject("", [], [], [], ""),
    submitButtonClicked: false
}


type TAction = {
    type: 'INITIAL_STATE'
    | 'UPDATE_USER_DATA'
    | 'UPDATE_SUBMIT_BUTTON_DISABLED'
    | 'UPDATE_SELECTED_DATE'
    | 'UPDATE_SUBMIT_BUTTON_CLICKED'
    | 'UPDATE_SELECTED_CLINIC'
    | 'UPDATE_SELECTED_PATIENT'
    | 'UPDATE_SESSION_OBS'
    payload: any
}

export const addSessionReducer = (state:IAddSessionReducer, action: TAction):IAddSessionReducer => {
    switch(action.type) {
        case 'INITIAL_STATE': return action.payload;
        case 'UPDATE_USER_DATA': return {
            ...state,
            userData: action.payload
        };
        case 'UPDATE_SELECTED_DATE': return {
            ...state,
            selectedDate: action.payload
        };
        case 'UPDATE_SUBMIT_BUTTON_CLICKED': return {
            ...state,
            submitButtonClicked: action.payload
        };
        case 'UPDATE_SUBMIT_BUTTON_DISABLED': return {
            ...state,
            submitButtonDisabled: action.payload
        };
        case 'UPDATE_SELECTED_CLINIC': return {
            ...state,
            selectedClinic: action.payload
        };
        case 'UPDATE_SELECTED_PATIENT': return {
            ...state,
            selectedPatient: action.payload
        };
        case 'UPDATE_SESSION_OBS': return {
            ...state,
            sessionObs: action.payload
        }
        default: return state;
    }
}