import { TClinic, TPatient, TSession, TUserData } from "../types/types";


export const _createUserDataObject = (name: string, clinics: Array<TClinic>, patients: Array<TPatient>, sessions: Array<TSession>,surname?: string): TUserData => {
    return {
        "name": name,
        "surname": surname || '',
        "clinics": clinics,
        "patients": patients,
        "sessions": sessions
    }
}