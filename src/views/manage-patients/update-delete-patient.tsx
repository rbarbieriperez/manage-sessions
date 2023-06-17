import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import SelectCustom from '../../components/select-custom/select-custom';
import { UserDataContext } from '../../App';
import { TClinic, TFamily, TOption, TPatient } from '../../types/types';
import CachedIcon from '@mui/icons-material/Cached';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { relationshipOptionsArr, sessionTimeOptions, typeOptionsArr } from '../../utils/objects';
import PatientData from '../../components/patient-data/patient-data';
import ContactDetails from '../../components/patient-contact-details/patient-contact-details';
import { _saveData } from '../../firebase/_queries';
import DialogCustom from '../../components/dialog-custom/dialog-custom';

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

type TInput = 'name' | 'surname' | 'lastSurname' | 'contactType' | 'contactDetail' | 'relationType';

export default function UpdateDeletePatient({ onAlert, onPatientSelected }: IUpdateDeletePatient) {
    const UserDataProvider = React.useContext(UserDataContext);
    const [buttonDisable, setButtonDisabled] = React.useState<boolean>(true);

    //selects
    const [clinicsOptionsArray, setClinicsOptionsArray] = React.useState<TOption[]>([]);
    const [patientsOnClinic, setPatientsOnClinic] = React.useState<TOption[]>([]);
    const [selectedClinic, setSelectedClinic] = React.useState<TClinic>(initialClinicData);
    const [selectedPatient, setSelectedPatient] = React.useState<TPatient>(patientInitialData);
    const [selectPatientDisabled, setSelectPatientDisabled] = React.useState<boolean>(false);


    const [formSubmitted, setFormSubmitted] = React.useState<boolean>(false);
    
    const [familyContactDetailsElements, setFamilyContactDetailsElements] = React.useState<React.ReactElement[]>([]);

    const [modalDialogOpen, setModalDialogOpen] = React.useState<boolean>(false);

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

    const resetForm = () => {
        setClinicsOptionsArray(createClinicsOptionsArray());
        setSelectedClinic(initialClinicData);
        setSelectedPatient(patientInitialData);
        setFormSubmitted(false);
        setButtonDisabled(true);
        setSelectPatientDisabled(false);
        setPatientsOnClinic([]);
        setModalDialogOpen(false);
    }

    // Component did mount correctly
    React.useEffect(() => {
        setClinicsOptionsArray(createClinicsOptionsArray());
    }, []);


    //Method to handle clinic change and set the patients on clinic
    const onClinicChange = (selectedOption:number, selectId: string) => {
        const selectedClinic:TClinic | undefined = UserDataProvider.clinics.find((clinic: TClinic) => clinic.clinicId === selectedOption);
        setSelectedClinic(selectedClinic || initialClinicData);
        setPatientsOnClinic(createPatientsOnClinicOptionsArray(UserDataProvider.patients.filter((patient:TPatient) => patient.clinicId === selectedClinic?.clinicId)));
    }

    const onPatientChange = (selectedOption: number) => {
        const foundPatient = UserDataProvider.patients.find((patient: TPatient) => patient.patientId === selectedOption);
        if (foundPatient) {
            setSelectedPatient(foundPatient);
            setSelectPatientDisabled(true);
            setButtonDisabled(false);
            onPatientSelected(foundPatient.patientId);
        }

        if (foundPatient && foundPatient.family.length > 0) {
            foundPatient.family.forEach((family: TFamily, index: number) => {
                setFamilyContactDetailsElements((prev) => ([...prev, <ContactDetails key={'family-'+ index} modifyData={family} id={index} onDataChanged={onContactDetailsDataChanged}/>]))
            });
        }
    }

    const onContactDetailsDataChanged = (newData: TFamily, id: number) => {
        console.log('ejecuto on datachanged');
        setSelectedPatient((prev) => ({
            ...prev,
            family: [
              ...prev.family.slice(0, id), // Copy the elements before the updated index
              { ...prev.family[id], ...newData }, // Update the element at the specified index
              ...prev.family.slice(id + 1) // Copy the elements after the updated index
            ]
        }));
    }

    const onPatientDataChanged = (data: TPatient) => {
        setSelectedPatient((prev) => ({...data, family: prev.family, clinicId: prev.clinicId }));
    }

    const onUpdatePatient = () => {
        const data = { ...UserDataProvider };
        data.patients[data.patients.findIndex((patient: TPatient) => patient.patientId === selectedPatient.patientId)] = selectedPatient;
        
        if (_saveData(data)) {
            onAlert("Paciente modificado con éxito!", "success");
        } else {
            onAlert("Error al modificar el paciente!", "error");
        }

        resetForm();
    }

    const onDeletePatient = () => {
        setModalDialogOpen(true);
    }

     /* ------ FAMILY CONTACT DETAILS -------- */

    /**
     * Render a new family contact details element on DOM and 
     * add an empty contact details object to patient's data
     */
    const requestNewFamilyContactDetailsElement = () => {
        setFamilyContactDetailsElements((prev) => ([...(prev || []), <ContactDetails key={'family-' + prev.length + 1} id={prev.length} onDataChanged={onContactDetailsDataChanged}/>]));
    }

    /**
     * Remove last family contact details element from DOM and from the patient's data
     */
    const removeLastFamilyContactDetailsElement = () => {
        setFamilyContactDetailsElements((prev) => {
            return prev.slice(0, -1);;
        });

        setSelectedPatient((prev) => {
            return {...prev, family: prev?.family?.slice(0, -1)};
        })
    }

    const onModalDeleteAccept = () => {
        const data = { ...UserDataProvider };
        data.patients.splice(data.patients.findIndex((patient: TPatient) => patient.patientId === selectedPatient.patientId), 1);
        if (_saveData(data)) {
            onAlert("Paciente eliminado con éxito!", "success");
        } else {
            onAlert("Error al eliminar el paciente!", "error");
        }

        resetForm();
    }


    React.useEffect(() => {
        const patientDataBool = ![selectedPatient.name, selectedPatient.surname].includes('') && !(Number.isNaN(selectedPatient.sessionTime )) && !(selectedPatient.age === 0) && !(selectedPatient.sessionTime === 0);
        if (Array.isArray(selectedPatient.family) && selectedPatient.family.length > 0) {
            const contactDetailsBool = !(selectedPatient.family.filter((el) => el.name === '' || el.surname === '' || el.relationType === '' || el.contactType === '' || el.contactDetail === '').length > 0);
            setButtonDisabled(!patientDataBool || !contactDetailsBool);
        } else {
            setButtonDisabled(!patientDataBool);
        }

    }, [selectedPatient]);

    React.useEffect(() => {
        console.log(selectedPatient);
    }, [selectedPatient]);

    return <>
        <Grid2 container display={"flex"} justifyContent={"center"}>
            <Grid2 xs={10} marginTop={4}>
                <SelectCustom
                    label='Clínicas'
                    optionsArr={clinicsOptionsArray}
                    value={selectedClinic?.clinicId.toString() || ''}
                    onChange={onClinicChange}
                />
            </Grid2>
            <Grid2 xs={10} marginTop={4}>
                <SelectCustom
                    label='Pacientes en clínica'
                    optionsArr={patientsOnClinic}
                    value={selectedPatient?.patientId.toString() || ''}
                    onChange={(elId: number) => onPatientChange(elId)}
                    disabled={selectPatientDisabled || patientsOnClinic.length === 0 ? true : false}
                />
            </Grid2>

            {
                selectedPatient.patientId !== 0 &&
                <Grid2 xs={10} marginTop={4}>
                   <PatientData
                        modifyData={selectedPatient} 
                        onDataChanged={onPatientDataChanged}
                        onFormReset={resetForm}
                        formSubmitted={formSubmitted}
                    />

                    <Grid2 xs={10} marginTop={3} display={"flex"} flexWrap={"wrap"}>
                        <Typography flexBasis={"100%"} marginTop={1} variant='h2' fontSize={22  }>Información de contacto</Typography>
                        <IconButton disabled={familyContactDetailsElements.length > 2} onClick={requestNewFamilyContactDetailsElement}>
                            <AddBoxIcon/>
                        </IconButton>
                        <IconButton onClick={removeLastFamilyContactDetailsElement}>
                            <RemoveCircleIcon/>
                        </IconButton>
                    </Grid2>
                    <Grid2 xs={12} marginTop={2}>
                        {familyContactDetailsElements}
                    </Grid2>
                    <Grid2 xs={10} paddingLeft={3} paddingRight={3} marginTop={2} textAlign={"center"} marginBottom={4} display={"flex"} flexDirection={"column"} rowGap={2}>
                        <Button disabled={buttonDisable} onClick={onUpdatePatient} variant="contained" color="success">Modificar</Button>
                        <Button disabled={selectedPatient.patientId === 0} onClick={onDeletePatient} variant="contained" color="error">Eliminar</Button>
                    </Grid2>
                </Grid2>

            }
        </Grid2>

        <DialogCustom
            acceptButtonText='Eliminar'
            rejectButtonText='Cerrar'
            open={modalDialogOpen}
            modalTitle='Eliminar Paciente'
            modalDesc='Estás seguro que deseas eliminar este paciente?'
            onButtonAcceptClick={onModalDeleteAccept}
        />
    </>
}