import { TOption, TSession } from "../types/types";


interface IPatientSessions {
    allPatientSessions: TSession[],
    filteredSessions: TSession[],
    selectedYear: number,
    selectedMonth: number,
    monthsArray: TOption[],
    yearsArr: TOption[],
    dialogModalVisible: boolean,
    deleteSessionId: number
}


export const PATIENT_SESSIONS_INITIAL: IPatientSessions = {
    allPatientSessions: [],
    filteredSessions: [],
    selectedYear: 0,
    selectedMonth: 0,
    monthsArray: [],
    yearsArr: [],
    dialogModalVisible: false,
    deleteSessionId: 0
}

type TAction = {
    type: 'UPDATE_ALL_PATIENT_SESSIONS'
    | 'UPDATE_FILTERED_SESSIONS' |
    'UPDATE_SELECTED_YEAR' |
    'UPDATE_SELECTED_MONTH' |
    'UPDATE_MONTHS_ARRAY' |
    'UPDATE_YEARS_ARRAY' |
    'UPDATE_DIALOG_MODAL_VISIBLE' |
    'UPDATE_DELETE_SESSION_ID' |
    'INITIAL_STATE',
    payload: any
}


export const PatientSessionsReducer = (state: IPatientSessions, action: TAction) => {
    switch (action.type) {
        case 'UPDATE_ALL_PATIENT_SESSIONS': return {
            ...state,
            allPatientSessions: action.payload
        };
        case 'UPDATE_DELETE_SESSION_ID': return {
            ...state,
            deleteSessionId: action.payload
        };
        case 'UPDATE_DIALOG_MODAL_VISIBLE': return {
            ...state,
            dialogModalVisible: action.payload
        };
        case 'UPDATE_FILTERED_SESSIONS': return {
            ...state,
            filteredSessions: action.payload
        };
        case 'UPDATE_MONTHS_ARRAY': return {
            ...state,
            monthsArray: action.payload
        };
        case 'UPDATE_SELECTED_MONTH': return {
            ...state,
            selectedMonth: action.payload
        };
        case 'UPDATE_SELECTED_YEAR': return {
            ...state,
            selectedYear: action.payload
        };
        case 'UPDATE_YEARS_ARRAY': return {
            ...state,
            yearsArr: action.payload()
        };
        case 'INITIAL_STATE': return action.payload;
        default: return state;
    }
}