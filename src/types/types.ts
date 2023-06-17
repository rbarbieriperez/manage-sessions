export type TUserData = {
    name: string;
    surname: string;
    clinics: Array<TClinic>;
    patients: Array<TPatient>;
    sessions: Array<TSession>;
}


export type TPatient = {
    patientId: number;
    name: string;
    surname: string;
    lastSurname: string;
    clinicId: number;
    age: number;
    sessionValue: number;
    sessionTime: number;
    family: Array<TFamily>;


};

export type TOption = {
    value: number;
    label: string;
}

export type TSession = {
    sessionId: number;
    patientId: number;
    clinicId: number;
    sessionType: string;
    sessionValue: number;
    sessionDate: string;
    sessionObs: string;
}


export type TClinic = {
    clinicId: number;
    clinicName: string;
    address: TAddress;
    contactDetails?: Array<TContactDetail>
}

export type TSessionType = {
    sessionTypeId: number;
    sessionType: string;
}

export type TFamily = {
    relationType: string;
    name: string;
    surname: string;
    lastSurname: string;
    contactType: string;
    contactDetail: string;
};

export type TContactDetail = {
    contactMethodInfo?: string;
    contactType: string;
    contactDetail: string;
}

export type TAddress = {
    fullAddress: string;
    number: string;
    additionalInfo: string;
}

export type TPages = 'login' | 'home' | 'manage-clinics' | 'manage-patients'| 'reports' | 'other-settings';
