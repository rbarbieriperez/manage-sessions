import { TSession, TUserData } from "../types/types"
import { _createUserDataObject } from "../utils/functions"

interface IReportsReducer {
    userData: TUserData,
    filteredSessions: TSession[],
    sessionsEarns: number,
    sessionsPerClinic: [],
}

export const REPORTS_INITIAL_DATA: IReportsReducer = {
    userData: _createUserDataObject('', [], [], [], ''),
    filteredSessions: [],
    sessionsEarns: 0,
    sessionsPerClinic: [],
}

type TAction = {
    type: 'UPDATE_USER_DATA' | 'UPDATE_FILTERED_SESSIONS' | 'UPDATE_SESSIONS_EARNS' | 'UPDATE_SESSIONS_PER_CLINIC',
    payload: any
}

export const ReportsReducer = (state: IReportsReducer, action: TAction) => {
    switch(action.type) {
        case 'UPDATE_USER_DATA': return {
            ...state,
            userData: action.payload
        };
        case 'UPDATE_FILTERED_SESSIONS': return {
            ...state,
            filteredSessions: action.payload
        };
        case 'UPDATE_SESSIONS_EARNS': return {
            ...state,
            sessionsEarns: action.payload
        };
        case 'UPDATE_SESSIONS_PER_CLINIC': return {
            ...state,
            sessionsPerClinic: action.payload
        };
    }
}