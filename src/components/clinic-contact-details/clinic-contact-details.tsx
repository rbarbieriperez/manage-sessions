import React from 'react';
import { TContactDetail, TOption } from '../../types/types';
import Grid2 from '@mui/material/Unstable_Grid2';
import { TextField } from '@mui/material';
import SelectCustom from '../select-custom/select-custom';


interface IClinicContactDetails {
    id: number;
    onDataChanged: (data: TContactDetail, id: number) => void;
    modifyData?: TContactDetail;
    options: Array<TOption>
}

const initialData:TContactDetail = {
    contactDetail: '',
    contactType: '',
    contactMethodInfo: ''
}


export default function ClinicContactDetails ({id, modifyData, onDataChanged, options}:IClinicContactDetails) {
    const [data, setData] = React.useState<TContactDetail>(modifyData ? modifyData: initialData);



    /**
     * Update the contact type label based on the received value
     * @param selectVal
     */
    const onContactTypeChanged = (selectVal: number) => {
        const value = options.find((el:TOption) => el.value === selectVal)?.label;
        value && setData((prev) => ({ ...prev, contactType: value }));
    }


    /**
     * Search on the contact type options array for the value based on the received label
     * @param label
     * @returns { string }
     */
    const _getContactTypeValue = (label:string) => {
        return options.find((el: TOption) => el.label === label)?.value.toString() || '';
    };

    React.useEffect(() => {
        onDataChanged(data, id);
    });

    return <>
        <Grid2 container display={"flex"} rowGap={4} marginBottom={4}>
            <TextField
                fullWidth
                defaultValue={data.contactMethodInfo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, contactMethodInfo: e.target.value }))}
                label='Descripción*'
                variant='outlined'
            >
            </TextField>
            <SelectCustom
                value={_getContactTypeValue(data.contactType)}
                onChange={onContactTypeChanged}
                disabled={false}
                label='Tipo*'
                optionsArr={options}
            />
            <TextField
                fullWidth
                defaultValue={data.contactDetail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, contactDetail: e.target.value }))}
                label='Valor*'
                variant='outlined'
            >
            </TextField>
        </Grid2>
    </>
}