import React from 'react';
import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Slide, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CachedIcon from '@mui/icons-material/Cached';
import { TClinic, TContactDetail } from '../../types/types';
import SpinnerCustom from '../../components/spinner-custom/spinner-custom';

import { _searchClinc } from '../../mock-data/mockFunctions';
import { UserDataContext } from '../../App';
import { _saveData } from '../../firebase/_queries';
import { INITIAL_MANAGE_CLINICS, ManageClinicsReducer } from '../../reducers/manage-clinics-reducer';
import ClinicContactDetails from '../../components/clinic-contact-details/clinic-contact-details';



const typeOptionsArr = [
    {
        value: 1,
        label: 'Celular'
    },
    {
        value: 2,
        label: 'Correo'
    },
    {
        value: 3,
        label: 'Sitio Web'
    }
]

export default function ManageClinics() {
    const UserDataProvider = React.useContext(UserDataContext);
    const [state, dispatch] = React.useReducer(ManageClinicsReducer, INITIAL_MANAGE_CLINICS);




    React.useEffect(() => {
        dispatch({ type: 'UPDATE_USER_DATA', payload: UserDataProvider });
    }, [UserDataProvider]);

    /**
     * Add a new contact detail element to DOM.
     * Add a new empty contact details object to the data.
     */
    const _handleNewContactDetail = () => {
        console.log('state.contactDetailsEls', state.contactDetailsEls.length);
        dispatch({ type: 'UPDATE_CONTACT_DETAILS_ELS', payload: [ ...state.contactDetailsEls, <ClinicContactDetails options={typeOptionsArr} key={'clinic-' + state.contactDetailsEls.length + 1} id={state.contactDetailsEls.length} onDataChanged={onContactDetailsDataChanged}/> ]});
    }

    const onContactDetailsDataChanged = (newData: TContactDetail, id: number) => {
        dispatch({ type: 'UPDATE_CLINIC_DATA', payload: {
            ...state.clinicData,
            contactDetails: [
                ...state.clinicData.contactDetails.slice(0, id), // Copy the elements before the updated index
                { ...state.clinicData.contactDetails[id], ...newData }, // Update the element at the specified index
                ...state.clinicData.contactDetails.slice(id + 1) // Copy the elements after the updated index
              ]
        }});
    }

    /**
     * Remove the last contact details element from DOM.
     * Remove the last contact details from contactDetails data array
     */
    const _handleRemoveContactDetail = () => {
        dispatch({ type: 'UPDATE_CONTACT_DETAILS_ELS', payload: [
            ...state.contactDetailsEls.slice(0, -1)
        ]});

        dispatch({ type: 'UPDATE_CLINIC_DATA', payload: {
            ...state.clinicData,
            contactDetails: state.clinicData.contactDetails.slice(0, -1)
        }})

    }

    /**
     * Validate all the required values in order to enable the continue button
     */
    React.useEffect(() => {
        const clinicNameAndAddressBool = ![state.clinicData.clinicName, state.clinicData.address.fullAddress, state.clinicData.address.number].includes('');
        if (Array.isArray(state.clinicData.contactDetails) && state.clinicData.contactDetails.length > 0) {
            const contactDetailsBool = !(state.clinicData.contactDetails.filter((el: TContactDetail) => el.contactDetail === '' || el.contactMethodInfo === '' || el.contactType === '').length > 0);
            dispatch({ type: 'UPDATE_BUTTON_DISABLED', payload: (!clinicNameAndAddressBool || !contactDetailsBool) });
        } else {
            dispatch({ type: 'UPDATE_BUTTON_DISABLED', payload: (!clinicNameAndAddressBool) });
        }
    }, [state.clinicData]);



    /**
     * Method to handle the clinicName and address inputs change
     * @param e React.ChangeEvent<HTMLInputElement>
     */
    const _onClinicDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (e.target.getAttribute("id") === 'clinicName') {
            dispatch({ type: 'UPDATE_CLINIC_DATA', payload: {...state.clinicData, clinicName: value }});
        }

        if (['fullAddress', 'number', 'additionalInfo'].includes(e.currentTarget.getAttribute("id") || '')) {
            dispatch({ type: 'UPDATE_CLINIC_DATA', payload: {
                ...state.clinicData,
                address: {
                    ...state.clinicData.address,
                    [e.target.getAttribute("id") as string]: value
                }
            }});
        }
    }

    React.useEffect(() => {
        if (state.submitButtonClicked) {
            if (_saveData(state.userData)) {
                dispatch({ type: 'UPDATE_SPINNER_VISIBLE', payload: false });
                _openAlert('Clínica guardada con éxito!', 'success');
            } else {
                _openAlert('Error al guardar la clínica!', 'error');
            }
        }
    }, [state.submitButtonClicked]);


    const _handleAddClinic = () => {
        if (!(state.userData.clinics.find((el:TClinic) => el.clinicName === state.clinicData.clinicName ))) {
            const newClinicId = state.userData.clinics.length + 1;
            dispatch({ type: 'UPDATE_USER_DATA', payload: {
                ...state.userData,
                clinics: [
                    ...state.userData.clinics,
                    {
                        ...state.clinicData,
                        clinicId: newClinicId
                    }
                ]
            }});

            dispatch({ type: 'UPDATE_SPINNER_VISIBLE', payload: true });
            dispatch({ type: 'UPDATE_SUBMIT_BUTTON_CLICKED', payload: true });
        } else {
            _openAlert('La clínica ingresada ya existe!', 'error');
            dispatch({ type: 'INITIAL_STATE', payload: INITIAL_MANAGE_CLINICS })
        }
    }

    /* SEARCH FORM METHODS */

    /**
     * Search the clinic in the object data and map the values throughout the inputs, including
     * the contact details inputs
     */
    const _onSearchClick = () => {
        dispatch({ type: 'UPDATE_SEARCH_FORM', payload: true });
        dispatch({ type: 'UPDATE_SPINNER_VISIBLE', payload: true });

        const foundClinicData = state.userData.clinics.find((el:TClinic) => el.clinicName === state.clinicData.clinicName);
        if (foundClinicData) {
            dispatch({ type: 'UPDATE_CLINIC_DATA', payload: foundClinicData });
            dispatch({ type: 'UPDATE_MODIFIED_CLINIC_ID', payload: foundClinicData.clinicId });
            dispatch({ type: 'UPDATE_SPINNER_VISIBLE', payload: false });
            _handleSearchContactDetails(foundClinicData);
        } else {
            dispatch({ type: 'UPDATE_SPINNER_VISIBLE', payload: false });
            _openAlert('No existe la clínica ingresada!', 'error');
        }
    };

    const _handleSearchContactDetails = (clinicData: TClinic) => {
        if (clinicData.contactDetails) {
            let newContactDetails:Array<React.ReactElement> = [];
            clinicData.contactDetails.forEach((contactDetail:TContactDetail, index: number) => {
                newContactDetails.push(<ClinicContactDetails modifyData={contactDetail} options={typeOptionsArr} id={index} key={'clinic-' + index.toString()} onDataChanged={onContactDetailsDataChanged}/>);
            });

            dispatch({ type: 'UPDATE_CONTACT_DETAILS_ELS', payload: newContactDetails });
        }
    }

    const _handleModifyClinic = React.useCallback(() => {
        if (state.userData.clinics.length > 1) {
            const selectedClinicIndex = state.userData.clinics.findIndex((el: TClinic) => el.clinicId == state.modifiedClinicId);
            const newArr = state.userData.clinics.splice(selectedClinicIndex - 1, 1);
            dispatch({ type: 'UPDATE_USER_DATA', payload: {
                ...state.userData,
                clinics: [
                    ...newArr,
                    {
                        ...state.clinicData,
                        clinicId: state.modifiedClinicId
                    }
                ]
            }});
        } else {
            dispatch({ type: 'UPDATE_USER_DATA', payload: {
                ...state.userData,
                clinics: [
                    {
                        ...state.clinicData,
                        clinicId: state.modifiedClinicId
                    }
                ]
            }});
        }

        dispatch({ type: 'UPDATE_SPINNER_VISIBLE', payload: true });
        dispatch({ type: 'UPDATE_SUBMIT_BUTTON_CLICKED', payload: true });
    }, [state.clinicData]);


    const _openAlert = (message: string, type: 'success' | 'error') => {
        dispatch({ type: 'INITIAL_STATE', payload: INITIAL_MANAGE_CLINICS });
        dispatch({ type: 'UPDATE_ALERT_CONFIG', payload: { visible: true, message: message, type: type }});
        setTimeout(() => {
            dispatch({ type: 'UPDATE_ALERT_CONFIG', payload: { visible: false, message: '', type: 'error' }});
        }, 1500);
    }

    return <>
        <Grid2 container display={"flex"} justifyContent={"center"}>


            {/** MAIN COMPONENT */}
            <Grid2 xs={10} marginTop={5}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="clinicName">Nombre*</InputLabel>
                    <OutlinedInput
                        type={'text'}
                        value={state.clinicData.clinicName}
                        onChange={_onClinicDataChange}
                        id="clinicName"
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={_onSearchClick} disabled={state.clinicData?.clinicName?.length === 0}>
                                <SearchIcon/>
                            </IconButton>
                            <IconButton onClick={() => dispatch({ type: 'INITIAL_STATE', payload: INITIAL_MANAGE_CLINICS })}>
                                <CachedIcon/>
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Nombre*"
                    />
                </FormControl>
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField
                    fullWidth
                    value={state.clinicData?.address?.fullAddress}
                    onChange={_onClinicDataChange}
                    id="fullAddress"
                    label="Dirección completa*"
                    variant="outlined"
                />
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField 
                    fullWidth 
                    value={state.clinicData?.address?.number} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (/^\d{0,4}$/.test(e.target.value)) {
                            _onClinicDataChange(e);
                        }
                    }} 
                    id="number" 
                    label="Número*" 
                    variant="outlined"
                />
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField fullWidth value={state.clinicData?.address?.additionalInfo} onChange={_onClinicDataChange} id="additionalInfo" label="Información Adicional" variant="outlined"/>
            </Grid2>
            <Grid2 xs={10} marginTop={3} display={"flex"} flexWrap={"wrap"}>
                <Typography flexBasis={"100%"} marginTop={1} variant='h2' fontSize={22  }>Información de contacto</Typography>
                <IconButton disabled={state.contactDetailsEls?.length > 2} onClick={_handleNewContactDetail}>
                    <AddBoxIcon/>
                </IconButton>
                <IconButton onClick={_handleRemoveContactDetail}>
                    <RemoveCircleIcon/>
                </IconButton>
            </Grid2>
            <Grid2 xs={10} marginTop={2}>
                {state.contactDetailsEls}
            </Grid2>

            <Grid2 xs={12} marginBottom={2} textAlign={"center"}>
                {state.isSearchForm ? <Button disabled={state.buttonDisabled} onClick={_handleModifyClinic} variant="contained" color="success">Modificar</Button> : <Button disabled={state.buttonDisabled} onClick={_handleAddClinic} variant="contained" color="success">Agregar</Button>}
            </Grid2>
        </Grid2>

        <SpinnerCustom isVisible={state.spinnerVisible}/>
        {
            state.alertConfig?.visible ?
                <Slide in={state.alertConfig.visible} direction="left">
                    <Stack sx={{ width: "70%", position: "absolute", bottom: "15px", right: "0" }}>
                        <Alert variant='filled' severity={state.alertConfig.type}>{state.alertConfig.message}</Alert>
                    </Stack>
                </Slide>
            : ''
        }
    </>
}