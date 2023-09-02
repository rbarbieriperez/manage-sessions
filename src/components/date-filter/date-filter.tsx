import Grid2 from "@mui/material/Unstable_Grid2";
import React from "react";
import { Typography } from '@mui/material';


import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

interface IDateFilter {
    onInitialDateChanged: (initialDate: string) => void;
    onLastDateChanged: (lastDate: string) => void;
}


const DateFilter = ({onInitialDateChanged, onLastDateChanged}: IDateFilter) => {

    React.useEffect(() => {
        onInitialDateChanged(`${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/1`);
        onLastDateChanged(`${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCDate()}`);
    }, []);

    const _parseDate = (date: dayjs.Dayjs | null): string => {
        if (date?.year() && date?.month() && date?.date()) {
            return `${date?.year()}/${date?.month() + 1}/${date?.date()}`;
        }
        return '';
    }

    return <>
        <Grid2 container display={'flex'} flexDirection={'row'}>
            <Grid2 xs={12} justifyContent={"center"}>
                <Typography>Fecha inicial</Typography>
                <LocalizationProvider adapterLocale="es" dateAdapter={AdapterDayjs}>
                    <DatePicker
                        defaultValue={dayjs(`${new Date().getUTCMonth() + 1}/01/${new Date().getUTCFullYear()}`)}
                        onChange={(value: dayjs.Dayjs | null) => onInitialDateChanged(_parseDate(value))}
                    />
                </LocalizationProvider>
            </Grid2>
            <Grid2 marginTop={3} xs={12} justifyContent={"center"}>
                <Typography>Fecha Final</Typography>
                <LocalizationProvider adapterLocale="es" dateAdapter={AdapterDayjs}>
                    <DatePicker
                        defaultValue={dayjs(`${new Date().getUTCMonth() + 1}/${new Date().getUTCDate()}/${new Date().getUTCFullYear()}`)}
                        onChange={(value: dayjs.Dayjs | null) => onLastDateChanged(_parseDate(value))}
                    />
                </LocalizationProvider>
            </Grid2>
        </Grid2>
    </>
}

export default DateFilter;