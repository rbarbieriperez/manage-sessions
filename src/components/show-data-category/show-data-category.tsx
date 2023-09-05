import React from 'react';
import { TDataCategories } from '../../types/types';
import { Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';




interface IShowDataCategory {
    data: TDataCategories[],
    title: string
}


const ShowDataCategory = ({ data, title }: IShowDataCategory) => {
    return <>
        <Grid2 container xs={12} borderRadius={3} boxShadow={"rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"} padding={2}>
            {data.map((element: TDataCategories, index: number) => <Grid2 key={'show-data-category-key-' + index}>
                <Typography fontWeight={"bold"}>{title}</Typography>
                <Typography variant='subtitle2' fontWeight={"bold"}>{element.header}</Typography>
                {element.values.map((value: string, index: number) => <Typography key={'show-data-category-patient-key' + index} variant='subtitle2' sx={{marginLeft: 3}}>{value}</Typography>)}
            </Grid2>)}
        </Grid2>
    </>;
}

export default ShowDataCategory;