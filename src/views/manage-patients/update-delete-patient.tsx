import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import SelectCustom from '../../components/select-custom/select-custom';
import { UserDataContext } from '../../App';
import { TClinic, TFamily, TOption, TPatient } from '../../types/types';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { Button, IconButton, Typography } from '@mui/material';
import PatientData from '../../components/patient-data/patient-data';
import ContactDetails from '../../components/patient-contact-details/patient-contact-details';
import { _saveData } from '../../firebase/_queries';
import DialogCustom from '../../components/dialog-custom/dialog-custom';
import { INITIAL_UPDATE_DELETE_DATA, updateDeletePatientReduce } from '../../reducers/update-delete-patient-reducer';

const patientInitialData = {
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
    address: { additionalInfo: '', fullAddress: '', number: ''},
    contactDetails: []
}

interface IUpdateDeletePatient {
    onAlert: (message: string, type: 'error' | 'success') => void;
    onPatientSelected: (patientId: number) => void;
}


export default function UpdateDeletePatient({ onAlert, onPatientSelected }: IUpdateDeletePatient) {
    const UserDataProvider = React.useContext(UserDataContext);
    const [state, dispatch] = React.useReducer(updateDeletePatientReduce, INITIAL_UPDATE_DELETE_DATA)


    const createClinicsOptionsArray = () => UserDataProvider.clinics.reduce((acc: TOption[], curr: TClinic):TOption[] => {
        return [
            ...acc,
            {
                label: curr.clinicName,
                value: curr.clinicId
            }
        ]
    }, []);

    const createPatientsOnClinicOptionsArray = (patients: TPatient[]) => patients.reduce((acc: TOption[], curr:TPatient):TOption[] => {
        return [
            ...acc,
            {
                value: curr.patientId,
                label: `${curr.name} ${curr.surname} - ${curr.age} - $${curr.sessionValue}`
            }
        ]
    }, []);

    // Component did mount correctly
    React.useEffect(() => {
        dispatch({ type: 'UPDATE_CLINICS_OPTIONS_ARRAY', payload: createClinicsOptionsArray() });
    }, []);


    //Method to handle clinic change and set the patients on clinic
    const onClinicChange = (selectedOption:number, selectId: string) => {
        const selectedClinic:TClinic | undefined = UserDataProvider.clinics.find((clinic: TClinic) => clinic.clinicId === selectedOption);    
        dispatch({ type: 'UPDATE_SELECTED_CLINIC', payload: selectedClinic || initialClinicData });
        dispatch({ type: 'UPDATE_PATIENTS_ON_CLINIC', payload: createPatientsOnClinicOptionsArray(UserDataProvider.patients.filter((patient:TPatient) => patient.clinicId === selectedClinic?.clinicId)) });
    }

    const onPatientChange = (selectedOption: number) => {
        const foundPatient = UserDataProvider.patients.find((patient: TPatient) => patient.patientId === selectedOption);
        if (foundPatient) {
            dispatch({ type: 'UPDATE_SELECTED_PATIENT', payload: foundPatient });
            dispatch({ type: 'UPDATE_SELECT_PATIENT_DISABLED', payload: true });
            dispatch({ type: 'UPDATE_BUTTON_DISABLED', payload: false });
            onPatientSelected(foundPatient.patientId);
        }

        if (foundPatient && foundPatient.family.length > 0) {
            foundPatient.family.forEach((family: TFamily, index: number) => {
                dispatch({ type: 'UPDATE_FAMILY_CONTACT_DETAILS_ELEMENTS', payload: [
                    ...state.familyContactDetailsElements,
                    <ContactDetails key={'family-'+ index} modifyData={family} id={index} onDataChanged={onContactDetailsDataChanged}/>
                ]});
            });
        }
    }

    const onContactDetailsDataChanged = (newData: TFamily, id: number) => {
        dispatch({ type: 'UPDATE_SELECTED_PATIENT', payload: {
            ...state.selectedPatient,
            family: [
                ...state.selectedPatient.family.slice(0, id), // Copy the elements before the updated index
                { ...state.selectedPatient.family[id], ...newData }, // Update the element at the specified index
                ...state.selectedPatient.family.slice(id + 1) // Copy the elements after the updated index
              ]
        }});
    }

    const onPatientDataChanged = (data: TPatient) => {
        dispatch({ type: 'UPDATE_SELECTED_PATIENT', payload: {
            ...state.selectedPatient,
            family: state.selectedPatient.family,
            clinicId: state.selectedPatient.clinicId
        }});
    }

    const onUpdatePatient = () => {
        const data = { ...UserDataProvider };
        data.patients[data.patients.findIndex((patient: TPatient) => patient.patientId === state.selectedPatient.patientId)] = state.selectedPatient;
        
        if (_saveData(data)) {
            onAlert("Paciente modificado con éxito!", "success");
        } else {
            onAlert("Error al modificar el paciente!", "error");
        }

        dispatch({ type: 'INITIAL_STATE', payload: INITIAL_UPDATE_DELETE_DATA });
    }

    const onDeletePatient = () => {
        dispatch({ type: 'UPDATE_MODAL_DIALOG_OPEN', payload: true });
    }

     /* ------ FAMILY CONTACT DETAILS -------- */

    /**
     * Render a new family contact details element on DOM and 
     * add an empty contact details object to patient's data
     */
    const requestNewFamilyContactDetailsElement = () => {
        dispatch({ type: 'UPDATE_FAMILY_CONTACT_DETAILS_ELEMENTS', payload: [
            ...state.familyContactDetailsElements,
            <ContactDetails key={'family-' + state.familyContactDetailsElements.length + 1} id={state.familyContactDetailsElements.length} onDataChanged={onContactDetailsDataChanged}/>
        ]});
    }

    /**
     * Remove last family contact details element from DOM and from the patient's data
     */
    const removeLastFamilyContactDetailsElement = () => {
        dispatch({ type: 'UPDATE_FAMILY_CONTACT_DETAILS_ELEMENTS', payload: [
            ...state.familyContactDetailsElements.slice(0, -1)
        ]});

        dispatch({ type: 'UPDATE_SELECTED_PATIENT', payload: {
            ...state.selectedPatient,
            family: state.selectedPatient.family.slice(0, -1)
        }});
    }

    const onModalDeleteAccept = () => {
        const data = { ...UserDataProvider };
        data.patients.splice(data.patients.findIndex((patient: TPatient) => patient.patientId === state.selectedPatient.patientId), 1);
        if (_saveData(data)) {
            onAlert("Paciente eliminado con éxito!", "success");
        } else {
            onAlert("Error al eliminar el paciente!", "error");
        }

        dispatch({ type: 'INITIAL_STATE', payload: INITIAL_UPDATE_DELETE_DATA });
    }


    React.useEffect(() => {
        const patientDataBool = ![state.selectedPatient.name, state.selectedPatient.surname].includes('') && !(Number.isNaN(state.selectedPatient.sessionTime )) && !(state.selectedPatient.age === 0) && !(state.selectedPatient.sessionTime === 0);
        if (Array.isArray(state.selectedPatient.family) && state.selectedPatient.family.length > 0) {
            const contactDetailsBool = !(state.selectedPatient.family.filter((el: TFamily) => el.name === '' || el.surname === '' || el.relationType === '' || el.contactType === '' || el.contactDetail === '').length > 0);
            dispatch({ type: 'UPDATE_BUTTON_DISABLED', payload: (!patientDataBool || !contactDetailsBool)});
        } else {
            dispatch({ type: 'UPDATE_BUTTON_DISABLED', payload: (!patientDataBool)});
        }

    }, [state.selectedPatient]);


    return <>
        <Grid2 container display={"flex"} justifyContent={"center"}>
            <Grid2 xs={10} marginTop={4}>
                <SelectCustom
                    label='Clínicas'
                    optionsArr={state.clinicsOptionsArray}
                    value={state.selectedClinic?.clinicId.toString() || ''}
                    onChange={onClinicChange}
                />
            </Grid2>
            <Grid2 xs={10} marginTop={4}>
                <SelectCustom
                    label='Pacientes en clínica'
                    optionsArr={state.patientsOnClinic}
                    value={state.selectedPatient?.patientId.toString() || ''}
                    onChange={(elId: number) => onPatientChange(elId)}
                    disabled={state.selectPatientDisabled || state.patientsOnClinic.length === 0 ? true : false}
                />
            </Grid2>

            {
                state.selectedPatient.patientId !== 0 &&
                <Grid2 xs={10} marginTop={4}>
                   <PatientData
                        modifyData={state.selectedPatient} 
                        onDataChanged={onPatientDataChanged}
                        onFormReset={() => dispatch({ type: 'INITIAL_STATE', payload: INITIAL_UPDATE_DELETE_DATA })}
                        formSubmitted={state.formSubmitted}
                    />

                    <Grid2 xs={10} marginTop={3} display={"flex"} flexWrap={"wrap"}>
                        <Typography flexBasis={"100%"} marginTop={1} variant='h2' fontSize={22  }>Información de contacto</Typography>
                        <IconButton disabled={state.familyContactDetailsElements.length > 2} onClick={requestNewFamilyContactDetailsElement}>
                            <AddBoxIcon/>
                        </IconButton>
                        <IconButton onClick={removeLastFamilyContactDetailsElement}>
                            <RemoveCircleIcon/>
                        </IconButton>
                    </Grid2>
                    <Grid2 xs={12} marginTop={2}>
                        {state.familyContactDetailsElements}
                    </Grid2>
                    <Grid2 xs={10} paddingLeft={3} paddingRight={3} marginTop={2} textAlign={"center"} marginBottom={4} display={"flex"} flexDirection={"column"} rowGap={2}>
                        <Button disabled={state.buttonDisabled} onClick={onUpdatePatient} variant="contained" color="success">Modificar</Button>
                        <Button disabled={state.selectedPatient.patientId === 0} onClick={onDeletePatient} variant="contained" color="error">Eliminar</Button>
                    </Grid2>
                </Grid2>

            }
        </Grid2>

        <DialogCustom
            acceptButtonText='Eliminar'
            rejectButtonText='Cerrar'
            open={state.modalDialogOpen}
            modalTitle='Eliminar Paciente'
            modalDesc='Estás seguro que deseas eliminar este paciente?'
            onButtonAcceptClick={onModalDeleteAccept}
        />
    </>
}