import { Alert, IconButton, Slide, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import CreatePatient from './create-patient';
import UpdateDeletePatient from './update-delete-patient';
import PatientSessions from './patient-sessions';

import AddBoxIcon from '@mui/icons-material/AddBox';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import InfoIcon from '@mui/icons-material/Info';
import DialogCustom from '../../components/dialog-custom/dialog-custom';

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
    /**
     * true = open, false = closed
     */
    const [helpModalOpen, setHelpModalOpen] = React.useState(false);

    const _changeFormType = (event: React.MouseEvent<HTMLElement>, newAlignment: TFormType) => {
        if (newAlignment !== null) {
            setFormType(newAlignment);
        }
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

    const computeHelpModalStructure = (): React.ReactElement => {
        return <>
            <Grid2 container xs={12}>
                <Grid2 xs={12}>
                    <AddBoxIcon fontSize='large'/>
                    <Typography variant='subtitle2'>
                        Agregar Paciente: <br/> Permite agregar un nuevo paciente al sistema,
                        indicando la clínica a la cual pertenece, información relevante y
                        métodos de contacto de su familia.
                    </Typography>
                </Grid2>
                <Grid2 xs={12}>
                    <ModeEditIcon fontSize='large'/>
                    <Typography variant='subtitle2'>
                        Modificar/Eliminar Paciente: Permite realizar una búsqueda de cualquier paciente
                        y visualizar toda su información, permitiendo así modificar o eliminar el paciente seleccionado.
                    </Typography>
                </Grid2>
                <Grid2 xs={12}>
                    <ReceiptIcon fontSize='large'/>
                    <Typography variant='subtitle2'>
                        Ver Sesiones: <br/> Permite visualizar todas las sesiones para un paciente determinado.
                        Por defecto el botón se encuentra deshabilitado. Para que este se habilite es necesario
                        seleccionar un paciente en "Modificar/Eliminar Paciente" y luego pulsar el botón.
                    </Typography>
                </Grid2>
            </Grid2>
        </>
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
                    <ModeEditIcon />
                </ToggleButton>
                <ToggleButton disabled={patientSessionsDisabled} value="sessions" aria-label="centered">   
                    <ReceiptIcon />
                </ToggleButton>
            </ToggleButtonGroup>

            <IconButton onClick={() => setHelpModalOpen(!helpModalOpen)} color='info' sx={{
                position: "absolute",
                left: "92%",
                top: "2.5rem",
                transform: "translateX(-50%)"
            }}>
                <InfoIcon/>
            </IconButton>
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

        <DialogCustom
            acceptButtonText='Cerrar'
            key={'show-registered-sessions-modal'}
            modalTitle='Administrar Pacientes'
            modalDesc={computeHelpModalStructure()}
            onButtonAcceptClick={() => setHelpModalOpen(!helpModalOpen)}
            open={helpModalOpen}
         />
    </>
}