import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import SelectCustom from '../select-custom/select-custom';
import { TextField } from '@mui/material';
import { TFamily, TOption } from '../../types/types';
import { relationshipOptionsArr, typeOptionsArr } from '../../utils/objects';

interface IContactDetails {
    id: number;
    onDataChanged: (data: TFamily, id: number) => void;
    modifyData?: TFamily;
}

const intialData:TFamily = {
    name: '',
    surname: '',
    contactDetail: '',
    contactType: '',
    lastSurname: '',
    relationType: ''
}
 
export default function ContactDetails({onDataChanged, id, modifyData }: IContactDetails) {
    const [data, setData] = React.useState<TFamily>(modifyData ? modifyData : intialData);

    /**
     * Update the relation type label based on the received value
     * @param selectVal
     */
    const onRelationTypeChanged = (selectVal: number) => {
        const value = relationshipOptionsArr.find((el:TOption) => el.value === selectVal)?.label;
        value && setData((prev) => ({ ...prev, relationType: value }));
    }

    /**
     * Update the contact type label based on the received value
     * @param selectVal
     */
    const onContactTypeChanged = (selectVal: number) => {
        const value = typeOptionsArr.find((el:TOption) => el.value === selectVal)?.label;
        value && setData((prev) => ({ ...prev, contactType: value }));
    }

    /**
     * Search on the relation type options array for the value based on the received label
     * @param label
     * @returns { string }
     */
    const _getRelationTypeValue = (label: string): string => {
        return relationshipOptionsArr.find((el: TOption) => el.label === label)?.value.toString() || '';
    }

    /**
     * Search on the contact type options array for the value based on the received label
     * @param label
     * @returns { string }
     */
    const _getContactTypeValue = (label: string):string => {
        return typeOptionsArr.find((el: TOption) => el.label === label)?.value.toString() || '';
    }

    React.useEffect(() => {
        onDataChanged(data, id);
    }, [data]);


    return <>
        <Grid2 borderRadius={3} xs={12} padding={1} boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"} container display={"flex"} rowGap={4} marginBottom={4}>
            <SelectCustom
                onChange={onRelationTypeChanged}
                label='Relación*'
                value={_getRelationTypeValue(data.relationType)}
                optionsArr={relationshipOptionsArr}
                key={'patient-contact-details-select-1'}
            />
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, name: e.target.value }))}
                label="Nombre*"
                variant="outlined"
                value={data.name}
            />
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, surname: e.target.value }))}
                label="Primer Apellido*"
                variant="outlined"
                value={data.surname}
            />
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, lastSurname: e.target.value }))} 
                label="Segundo Apellido"
                variant="outlined"
                value={data.lastSurname}
            />
            <SelectCustom
                onChange={onContactTypeChanged}
                disabled={false}
                label='Tipo*'
                optionsArr={typeOptionsArr}
                value={_getContactTypeValue(data.contactType)}
                key={'patient-contact-details-select-2'}
            />
            <TextField
                fullWidth
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData((prev) => ({...prev, contactDetail: e.target.value }))}
                label="Valor*"
                variant="outlined"
                value={data.contactDetail}
            />
        </Grid2>
    
    </>
}