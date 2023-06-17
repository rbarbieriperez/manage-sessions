import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';


type TOption = {
    value: number;
    label: string;
}

interface ISelect {
    label: string;
    onChange: (elId: number, id: string) => void;
    optionsArr: Array<TOption>;
    disabled?: boolean;
    id?: string;
    value?: string;
}


export default function SelectCustom ({ label, onChange, optionsArr, disabled = false, id = "", value}: ISelect) {
    const [selectedValue, setSelectedValue] = React.useState<number | string>("");

    const _mapOptions = () => {
        return optionsArr.map((option:TOption, index: number) => <MenuItem value={option.value} key={index + Math.random()}>{option.label}</MenuItem>);
    }

    React.useEffect(() => {
        if (selectedValue !== undefined) {
            onChange(Number(selectedValue), id);
        }
    }, [selectedValue]);

    React.useEffect(() => {
        if (value === "0") {
            setSelectedValue("");
        } else if (value) {
            setSelectedValue(value);
        }
    }, [value]);

    return <>
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedValue.toString()}
                defaultValue=''
                label={label}
                onChange={(e: SelectChangeEvent) => setSelectedValue(Number(e.target.value))}
                disabled={disabled}
                fullWidth
            >
               {_mapOptions()}
            </Select>
        </FormControl>
    </>
}