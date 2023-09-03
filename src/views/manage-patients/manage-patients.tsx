import { Alert, Slide, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import CreatePatient from './create-patient';
import UpdateDeletePatient from './update-delete-patient';
import PatientSessions from './patient-sessions';

import AddBoxIcon from '@mui/icons-material/AddBox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

type TFormType = 'create' | 'update-delete' | 'sessions';
type TAlert = {
    visible: boolean;
    message: string;
    type: 'error' | 'success'
}


export default function ManagePatients() {
    const [formType, setFormType] = React.useState<TFormType>('create');
    const [alertConfig, setAlertConfig] = React.useState<TAlert>({ visible: false, message: "", type: "error" });
    const [selectedPatientId, setSelectedPatientId] = React.useState<number>(0);
    const [patientSessionsDisabled, setPatientsSessionsDisabled] = React.useState<boolean>(true);


    const _changeFormType = (event: React.MouseEvent<HTMLElement>, newAlignment: TFormType) => {
        setFormType(newAlignment);
    }

    const _onPatientChanged = (id: number) => {
        if (id > 0) {
            setSelectedPatientId(id);
        }
        setPatientsSessionsDisabled(!(id > 0));
    }

    const _renderFormTypes = () => {
        switch (formType) {
            case 'create': return <CreatePatient onAlert={toggleModal}/>;
            case 'update-delete': return <UpdateDeletePatient onPatientSelected={_onPatientChanged} onAlert={toggleModal}/>;
            case 'sessions': return <PatientSessions onAlert={toggleModal} patientId={selectedPatientId}/>;
        }
    }

    const toggleModal = (message: string, type: 'error' | 'success') => {
        setAlertConfig({ visible: true, message: message, type: type });

        setTimeout(() => {
            setAlertConfig({ visible: false, message: "", type: 'error' });
        }, 2000);
    }

    return <>
        <Grid2 container xs={12} display={"flex"} justifyContent={"center"}>
            <ToggleButtonGroup
                value={formType}
                exclusive
                onChange={_changeFormType}
                aria-label="text alignment"
            >
                <ToggleButton value="create" aria-label="left aligned">
                    <AddBoxIcon />
                </ToggleButton>
                <ToggleButton value="update-delete" aria-label="centered">   
                    <ChangeCircleIcon />
                </ToggleButton>
                <ToggleButton disabled={patientSessionsDisabled} value="sessions" aria-label="centered">   
                    <ReceiptIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Grid2>

        {_renderFormTypes()}

        {
            alertConfig?.visible ? 
                <Slide in={alertConfig.visible} direction="left">
                    <Stack sx={{ width: "70%", position: "absolute", bottom: "15px", right: "0" }}>
                        <Alert variant='filled' severity={alertConfig.type}>{alertConfig.message}</Alert>
                    </Stack> 
                </Slide>
            : ''
        }
    </>
}