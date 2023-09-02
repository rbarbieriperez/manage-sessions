import React from 'react';
import { TOption } from '../../types/types';
import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';


interface IShowData {
    title?: string,
    data: TOption[]
}


const ShowData = ({ title, data }: IShowData) => {
    return <>
        <Grid2 container borderRadius={3} boxShadow={"rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"} padding={2}>
            <Grid2 xs={12}>
                <Typography>{title}</Typography>
                { data.map((data:TOption, index:number) => <Typography key={'show-data-text-'+ index}>{data.label}: {data.value}</Typography>)}
            </Grid2>
        </Grid2>
    </>
}

export default ShowData;