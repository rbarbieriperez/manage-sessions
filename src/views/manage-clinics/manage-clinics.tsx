import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Slide, Stack, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CachedIcon from '@mui/icons-material/Cached';
import React from 'react';
import SelectCustom from '../../components/select-custom/select-custom';
import { TClinic, TContactDetail, TUserData } from '../../types/types';
import SpinnerCustom from '../../components/spinner-custom/spinner-custom';

import { _searchClinc } from '../../mock-data/mockFunctions';
import { UserDataContext } from '../../App';
import { _saveData } from '../../firebase/_queries';


interface IManageClinics {

}


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


const clinicInitialData = {
    clinicName: '',
    address: {
        fullAddress: '',
        number: '',
        additionalInfo: ''
    },
    contactDetails: []

}

type TInput = 'contactMethodInfo' | 'contactType' | 'contactDetail';

type TAlert = {
    message: string;
    visible: boolean;
}



export default function ManageClinics({}: IManageClinics) {
    

    const UserDataProvider = React.useContext(UserDataContext);
    const [userData, setUserData] = React.useState<TUserData>(UserDataProvider);

    const [contactDetailsEls, setContactDetailsEls] = React.useState<Array<React.ReactElement>>([]);
    const [clinicData, setClinicData] = React.useState<Omit<TClinic, 'clinicId'>>(clinicInitialData);
    const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);
    const [isSearchForm, setIsSearchForm] = React.useState<boolean>(false);
    const [spinnerVisible, setSpinnerVisible] = React.useState<boolean>(false);
    const [submitButtonClicked, setSubmitButtonClicked] = React.useState<boolean>(false);
    const [alertConfig, setAlertConfig] = React.useState<TAlert>();


    //Search clinic states
    const [modifiedClinicId, setModifiedClinicId] = React.useState<number>(0);



    const _onContactDetailsInputChange = (e: React.ChangeEvent<HTMLInputElement>, inputType: TInput) => {
        const contactDetailsIndex = Number(e.target.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute("id"));
        console.log(e, inputType, contactDetailsIndex);
        if (inputType && e.currentTarget) {
            _updateClinicDataContactDetails(contactDetailsIndex, inputType, e.currentTarget.value);
        }
    }

    const _onContactDetailsSelectChange = (id: number, inputType: TInput, contactDetailId: number) => {
        _updateClinicDataContactDetails(contactDetailId, inputType, (typeOptionsArr.find((el) => el.value === id)?.label || ''));
    }

    const _updateClinicDataContactDetails = (index: number, inputType: TInput, value: string) => {
        setClinicData((prev) => {
            const updatedContactDetails = [...(prev.contactDetails || [])]; // Clone the contactDetails array
            // Update the specific contactMethodInfo value at contactDetailsIndex
            updatedContactDetails[index][inputType] = value;
            // Update the clinicData state by merging the previous state with the updated contactDetails array
            return {
              ...prev,
              contactDetails: updatedContactDetails,
            };
        });
    }


    /**
     * Method to render a contactDetails element
     * @returns React.ReactElement
     */
    const _renderAddContactDetails = (contactDetailValues?: TContactDetail, key?: string):React.ReactElement => {
        return <div style={{ display: "flex", justifyContent: 'center' }} id={key ? key : contactDetailsEls.length.toString()} key={key ? key : contactDetailsEls.length.toString()}>
            <Grid2 marginBottom={3} xs={10} display={"flex"} rowGap={1} flexDirection={"column"}>
                <TextField fullWidth defaultValue={contactDetailValues?.contactMethodInfo} onChange={(e:React.ChangeEvent<HTMLInputElement>) => _onContactDetailsInputChange(e, "contactMethodInfo")} label="Descripción*" variant="outlined" />
                <SelectCustom value={contactDetailValues?.contactType} id={contactDetailsEls.length.toString()} onChange={(e:number, id: string) => _onContactDetailsSelectChange(e, "contactType", Number(id))} disabled={false} label='Tipo*' optionsArr={typeOptionsArr}/>
                <TextField fullWidth defaultValue={contactDetailValues?.contactDetail} onChange={(e:React.ChangeEvent<HTMLInputElement>) => _onContactDetailsInputChange(e, "contactDetail")} label="Valor*" variant="outlined" />
            </Grid2>
        </div>
    }



    /**
     * Add a new contact detail element to DOM.
     * Add a new empty contact details object to the data.
     */
    const _handleNewContactDetail = () => {
        const emptyContactDetail = {
            contactMethodInfo: '',
            contactType: '',
            contactDetail: ''
        }
        setContactDetailsEls((prev) => ([...(prev || []), _renderAddContactDetails()]));
        setClinicData((prev) => ({...prev, contactDetails: [...(prev?.contactDetails || []), emptyContactDetail] }));
    }


    /**
     * Remove the last contact details element from DOM.
     * Remove the last contact details from contactDetails data array
     */
    const _handleRemoveContactDetail = () => {
        setContactDetailsEls((prev) => {
            return prev.slice(0, -1);;
        });

        setClinicData((prev) => {
            return {...prev, contactDetails: prev?.contactDetails?.slice(0, -1)};
        })
    }

    /**
     * Validate all the required values in order to enable the continue button
     */
    React.useEffect(() => {
        const clinicNameAndAddressBool = ![clinicData.clinicName, clinicData.address.fullAddress, clinicData.address.number].includes('');
        if (Array.isArray(clinicData.contactDetails) && clinicData.contactDetails.length > 0) {
            const contactDetailsBool = !(clinicData.contactDetails.filter((el) => el.contactDetail === '' || el.contactMethodInfo === '' || el.contactType === '').length > 0);
            setButtonDisabled(!clinicNameAndAddressBool || !contactDetailsBool);
        } else {
            setButtonDisabled(!clinicNameAndAddressBool);
        }

        console.log(clinicData);
    }, [clinicData]);



    /**
     * Method to handle the clinicName and address inputs change
     * @param e React.ChangeEvent<HTMLInputElement>
     */
    const _onClinicDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        if (e.target.getAttribute("id") === 'clinicName') {
            setClinicData((prev) => ({...prev, clinicName: value }));
        }

        if (['fullAddress', 'number', 'additionalInfo'].includes(e.currentTarget.getAttribute("id") || '')) {
            setClinicData((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  [e.target.getAttribute("id") as string]: value
                }
              }));
        }
    }

    React.useEffect(() => {
        console.log(userData);
        if (submitButtonClicked) {
            if (_saveData(userData)) {
                setSpinnerVisible(false);
                setSubmitButtonClicked(false);
                setClinicData(clinicInitialData);
                setIsSearchForm(false);
                setContactDetailsEls([]);
            } else {
    
            } 
        }
    }, [submitButtonClicked]);


    const _handleAddClinic = () => {
        if (!(userData.clinics.find((el) => el.clinicName === clinicData.clinicName ))) {
            const newClinicId = userData.clinics.length + 1;
            setUserData((prev) => ({...prev, clinics: [ ...prev.clinics, {...clinicData, clinicId: newClinicId } ]}));
            setSpinnerVisible(true);
            setSubmitButtonClicked(true);
        } else {
            _openAlert('La clínica ingresada ya existe!');
            _resetForm();
        }
        
    }

    /* SEARCH FORM METHODS */

    /**
     * Search the clinic in the object data and map the values throughout the inputs, including
     * the contact details inputs
     */

    const _onSearchClick = React.useCallback(() => {
        setIsSearchForm(true);
        setSpinnerVisible(true);

        const foundClinicData = userData.clinics.find((el) => el.clinicName === clinicData.clinicName);

        if (foundClinicData) {
            setClinicData(foundClinicData);
            setModifiedClinicId(foundClinicData.clinicId);
            setSpinnerVisible(false);
            _handleSearchContactDetails(foundClinicData);
        } else {
            setSpinnerVisible(false);
            _openAlert('No existe la clínica ingresada!');
        }
    }, [clinicData.clinicName]);

    const _resetForm = () => {
        setClinicData(clinicInitialData);
        setButtonDisabled(true);
        setIsSearchForm(false);
        setContactDetailsEls([]);
        setSpinnerVisible(false);
        setSubmitButtonClicked(false);
    }


    const _handleSearchContactDetails = (clinicData: TClinic) => {
        if (clinicData.contactDetails) {
            console.log(clinicData.contactDetails);
            let newContactDetails:Array<React.ReactElement> = [];
            clinicData.contactDetails.forEach((contactDetail:TContactDetail, index: number) => {
                console.log(index);
                newContactDetails.push(_renderAddContactDetails(contactDetail, index.toString()));
            });
            console.log(newContactDetails);
            setContactDetailsEls(newContactDetails);
        }
    }

    const _handleModifyClinic = React.useCallback(() => {
        if (userData.clinics.length > 1) {
            const selectedClinicIndex = userData.clinics.findIndex((el) => el.clinicId == modifiedClinicId);
            const newArr = userData.clinics.splice(selectedClinicIndex - 1, 1);
            setUserData((prev) => ({...prev, clinics: [ ...newArr, {...clinicData, clinicId: modifiedClinicId } ]}));
        } else {
            setUserData((prev) => ({...prev, clinics: [{...clinicData, clinicId: modifiedClinicId }]}));
        }

        setSpinnerVisible(true);
        setSubmitButtonClicked(true);
    }, [clinicData]);


    const _openAlert = (message: string) => {
        setAlertConfig({ visible: true, message: message });

        setTimeout(() => {
            setAlertConfig({ visible: false, message: '' });
            _resetForm();
        }, 3000);
    }

    
    return <>
        <Grid2 container display={"flex"} justifyContent={"center"}>

            

            {/** MAIN COMPONENT */}
            <Grid2 xs={10} marginTop={5}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="clinicName">Nombre*</InputLabel>
                    <OutlinedInput
                        type={'text'}
                        value={clinicData.clinicName}
                        onChange={_onClinicDataChange}
                        id="clinicName"
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton onClick={_onSearchClick} disabled={clinicData.clinicName.length === 0}>
                                <SearchIcon/>
                            </IconButton>
                            <IconButton onClick={_resetForm}>
                                <CachedIcon/>
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Nombre*"
                    />
                </FormControl>
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField fullWidth value={clinicData.address.fullAddress} onChange={_onClinicDataChange} id="fullAddress" label="Dirección completa*" variant="outlined"/>
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField fullWidth value={clinicData.address.number} onChange={_onClinicDataChange} id="number" label="Número*" variant="outlined"/>
            </Grid2>
            <Grid2 xs={10} marginTop={5}>
                <TextField fullWidth value={clinicData.address.additionalInfo} onChange={_onClinicDataChange} id="additionalInfo" label="Información Adicional" variant="outlined"/>
            </Grid2>
            <Grid2 xs={10} marginTop={3} display={"flex"} flexWrap={"wrap"}>
                <Typography flexBasis={"100%"} marginTop={1} variant='h2' fontSize={22  }>Información de contacto</Typography>
                <IconButton disabled={contactDetailsEls.length > 2} onClick={_handleNewContactDetail}>
                    <AddBoxIcon/>
                </IconButton>
                <IconButton onClick={_handleRemoveContactDetail}>
                    <RemoveCircleIcon/>
                </IconButton>
            </Grid2>
            <Grid2 xs={12} marginTop={2}>
                {contactDetailsEls}
            </Grid2>

            <Grid2 xs={12} marginBottom={2} textAlign={"center"}>
                {isSearchForm ? <Button disabled={buttonDisabled} onClick={_handleModifyClinic} variant="contained" color="success">Modificar</Button> : <Button disabled={buttonDisabled} onClick={_handleAddClinic} variant="contained" color="success">Agregar</Button>}
            </Grid2>
        </Grid2>

        <SpinnerCustom isVisible={spinnerVisible}/>
        {
            alertConfig?.visible ? 
                <Slide in={alertConfig.visible} direction="left">
                    <Stack sx={{ width: "70%", position: "absolute", bottom: "15px", right: "0" }}>
                        <Alert variant='filled' severity="error">{alertConfig.message}</Alert>
                    </Stack> 
                </Slide>
            : ''
        }
    </>
}