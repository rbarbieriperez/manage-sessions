import React from 'react';
import { TOption, TPatient } from '../../types/types';
import Grid2 from '@mui/material/Unstable_Grid2';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import SelectCustom from '../select-custom/select-custom';
import CachedIcon from '@mui/icons-material/Cached';
import { sessionTimeOptions } from '../../utils/objects';

interface IPatientData {
    onDataChanged: (data: TPatient) => void;
    modifyData?: TPatient;
    formSubmitted: boolean;
    onFormReset: () => void;
}

const patientInitialData:TPatient = {
    patientId: 0,
    name: '',
    surname: '',
    lastSurname: '',
    age: 0,
    clinicId: 0,
    sessionTime: 0,
    sessionValue: 0,
    family: []
}

export default function PatientData({onDataChanged, modifyData, formSubmitted, onFormReset}: IPatientData) {
    const [data, setData] = React.useState<TPatient>(modifyData ? modifyData : patientInitialData);
    const lettersPattern = new RegExp("/^[A-Za-z\s]+$/");


    const onSessionTimeChanged = (selectedId: number) => {
        const value = sessionTimeOptions.find((el: TOption) => el.value === selectedId)?.label.split('m')[0];
        value && setData((prev) => ({...prev, sessionTime: Number(value) }));
    }

    const _getSessionTimeValue = (label: number): string => {
        return sessionTimeOptions.find((el:TOption) => el.label.split("m")[0] === label.toString())?.value.toString() || '0';
    }


    React.useEffect(() => {
        if (JSON.stringify(data) !== JSON.stringify(patientInitialData)) {
            onDataChanged(data);
        }
    }, [data]);

    React.useEffect(() => {
        if (formSubmitted) {
            setData(patientInitialData);
        }
    }, [formSubmitted]);


    const _handleFormReset = () => {
        setData(patientInitialData);
        onFormReset();
    }

    return <>
        <Grid2 container display={"flex"} rowGap={4}>
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="name">Nombre*</InputLabel>
                    <OutlinedInput
                        type={'text'}
                        value={data.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, name: e.target.value }))}
                        id="name"
                        role='textbox'
                        data-testid="outlined-input"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton data-testid="reset-button" onClick={_handleFormReset}>
                                    <CachedIcon/>
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Nombre*"
                />
            </FormControl>
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, surname: e.target.value }))}
                label="Primer Apellido*"
                variant="outlined"
                value={data.surname}
                inputProps={{
                    inputMode: 'text',
                    pattern: lettersPattern,
                    min: 0,
                    maxLength: 20
                }}
            />
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, lastSurname: e.target.value }))} 
                label="Segundo Apellido"
                variant="outlined"
                value={data.lastSurname}
                inputProps={{
                    inputMode: 'text',
                    pattern: lettersPattern,
                    min: 0,
                    maxLength: 20

                }}
            />
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, age: Number(e.target.value) }))}
                label="Edad*"
                variant="outlined"
                value={data.age ? data.age : ""}
                type="number"
                inputProps={{
                    min: 1,
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    role: "textbox"
                }}
            />
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, sessionValue: parseInt(e.target.value, 10) }))}
                label="Monto*"
                variant="outlined"
                value={data.sessionValue ? data.sessionValue : ""}
                type="number"
                role='textbox'
                inputProps={{
                    min: 0,
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*"
                }}
            />
            <SelectCustom
                label='Tiempo de Sesión'
                onChange={onSessionTimeChanged}
                value={_getSessionTimeValue(data.sessionTime)}
                optionsArr={sessionTimeOptions}
            />
        </Grid2>
    </>
}