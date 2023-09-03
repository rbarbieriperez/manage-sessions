import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import SelectCustom from '../../components/select-custom/select-custom';
import { UserDataContext } from '../../App';
import { TClinic, TFamily, TOption, TPatient } from '../../types/types';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Button, IconButton, Typography } from '@mui/material';
import { _saveData } from '../../firebase/_queries';
import PatientData from '../../components/patient-data/patient-data';
import ContactDetails from '../../components/patient-contact-details/patient-contact-details';
import { INITIAL_CREATE_PATIENT, createPatientReduce } from '../../reducers/create-patient-reducer';

const initialClinic:TClinic = {
    clinicName: '',
    contactDetails: [],
    clinicId: 0,
    address: { additionalInfo: '', fullAddress: '', number: ''}
}


interface ICreatePatient {
    onAlert: (message: string, type: 'error' | 'success') => void;
}


export default function CreatePatient({onAlert}:ICreatePatient) {
    const UserDataProvider = React.useContext(UserDataContext);
    const [state, dispatch] = React.useReducer(createPatientReduce, INITIAL_CREATE_PATIENT);

    const createClinicsOptionsArray = () => UserDataProvider.clinics.reduce((acc: TOption[], curr: TClinic):TOption[] => {
        return [
            ...acc,
            {
                label: curr.clinicName,
                value: curr.clinicId
            }
        ]
    }, []);


    // Component first render
    React.useEffect(() => {
        dispatch({ type: 'SET_CLINICS_OPTIONS', payload: createClinicsOptionsArray() });
        dispatch({ type: 'FORM_SUBMITTED_STATE', payload: false });
    }, [state]);


    //Method to handle clinic change
    const onClinicChange = (selectedOption:number, selectId: string) => {
        dispatch({ type: 'SET_SELECTED_CLINIC', payload: (UserDataProvider.clinics.find((clinic: TClinic) => clinic.clinicId === selectedOption)) || initialClinic});
        dispatch({ type: 'SET_PATIENT_DATA', payload: {
            ...state.patientData,
            clinicId: selectedOption
        }})
    }


    // Validate submit button state
    React.useEffect(() => {
        const patientDataBool = ![state.patientData.name, state.patientData.surname].includes('') && !(Number.isNaN(state.patientData.sessionTime )) && !(state.patientData.age === 0) && !(state.patientData.sessionTime === 0);
        if (Array.isArray(state.patientData.family) && state.patientData.family.length > 0) {
            const contactDetailsBool = !(state.patientData.family.filter((el: TFamily) => el.name === '' || el.surname === '' || el.relationType === '' || el.contactType === '' || el.contactDetail === '').length > 0);
            dispatch({ type: 'SUBMIT_BUTTON_STATE', payload: (!patientDataBool || !contactDetailsBool) });
        } else {
            dispatch({ type: 'SUBMIT_BUTTON_STATE', payload: (!patientDataBool) });
        }

    }, [state.patientData]);


    const onSubmitPatient = () => {
        const newPatientId = UserDataProvider.patients.length + 1;

        const saveDataObj = {
            ...UserDataProvider,
        }

        saveDataObj.patients.push({...state.patientData, patientId: newPatientId });

        if (_saveData(saveDataObj)) {
            onAlert("Paciente creado con éxito!", 'success');
        } else {
            onAlert("Error al crear el paciente", 'error');
        }
        dispatch({ type: 'INITIAL_STATE', payload: INITIAL_CREATE_PATIENT });
        dispatch({ type: 'FORM_SUBMITTED_STATE', payload: true });
    }

    /* ------ FAMILY CONTACT DETAILS -------- */

    /**
     * Render a new family contact details element on DOM and 
     * add an empty contact details object to patient's data
     */
    const requestNewFamilyContactDetailsElement = () => {
        dispatch({ type: 'SET_CONTACTDETAILS_ELEMENTS', payload: [
            ...state.familyContactDetailsElements,
            <ContactDetails key={'family-' + state.familyContactDetailsElements.length + 1} id={state.familyContactDetailsElements.length} onDataChanged={onContactDetailsDataChanged}/>
        ]})
    }

    const onContactDetailsDataChanged = (newData: TFamily, id: number) => {
        dispatch({ type: 'SET_PATIENT_DATA', payload: {
            ...state.patientData,
            family: [
                ...state.patientData.family.slice(0, id), // Copy the elements before the updated index
                { ...state.patientData.family[id], ...newData }, // Update the element at the specified index
                ...state.patientData.family.slice(id + 1) // Copy the elements after the updated index
              ]
        }});
    }

    /**
     * Remove last family contact details element from DOM and from the patient's data
     */
    const removeLastFamilyContactDetailsElement = () => {
        console.log(state);
        dispatch({ type: 'SET_CONTACTDETAILS_ELEMENTS', payload: [
            ...state.familyContactDetailsElements.slice(0, -1)
        ]});

        dispatch({ type: 'SET_PATIENT_DATA', payload: {
            ...state.patientData,
            family: state.patientData?.family?.slice(0, -1)
        }});
    }

    const onPatientDataChanged = (patient: TPatient) => {
        dispatch({ type: 'SET_PATIENT_DATA', payload: {
            ...patient,
            family: state.patientData.family,
            clinicId: state.patientData.clinicId
        }});
    }

    /* ------- END FAMILY CONTACT DETAILS --------- */

    return <>
        <Grid2 container xs={12} display={"flex"} justifyContent={"center"} marginTop={5}>
            <Grid2 xs={10}>
                <SelectCustom
                    optionsArr={state.clinicsOptionsArray}
                    label='Clínicas'
                    onChange={onClinicChange}
                    value={state.selectedClinic.clinicId.toString()}
                />
            </Grid2>

            <Grid2 xs={10} marginTop={4}>
                <PatientData onFormReset={() => dispatch({ type: 'INITIAL_STATE', payload: INITIAL_CREATE_PATIENT })} formSubmitted={state.formSubmitted} onDataChanged={onPatientDataChanged}/>
            </Grid2>

            <Grid2 xs={10} marginTop={3} display={"flex"} flexWrap={"wrap"}>
                <Typography flexBasis={"100%"} marginTop={1} variant='h2' fontSize={22  }>Información de contacto</Typography>
                <IconButton disabled={state.familyContactDetailsElements.length > 2} onClick={requestNewFamilyContactDetailsElement}>
                    <AddBoxIcon/>
                </IconButton>
                <IconButton disabled={state.familyContactDetailsElements.length === 0} onClick={removeLastFamilyContactDetailsElement}>
                    <RemoveCircleIcon/>
                </IconButton>
            </Grid2>
            <Grid2 xs={10} marginTop={2}>
                {state.familyContactDetailsElements}
            </Grid2>
            <Grid2 xs={12} marginTop={2} textAlign={"center"} marginBottom={4}>
                <Button disabled={state.buttonDisabled} onClick={onSubmitPatient} variant="contained" color="success">Agregar</Button>
            </Grid2>
        </Grid2>
    </>
}