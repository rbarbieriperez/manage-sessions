import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import { Typography } from '@mui/material';



export default function HelperScreen() {
    return <>
        <Grid2 container position={"absolute"} bottom={0} height={"95%"} width={"100%"}>
            <Grid2 zIndex={999} xs={12} textAlign={"center"} marginTop={"70%"}>
                <Typography data-testid="text">Primero agrega clínicas y pacientes para poder continuar.</Typography>
                <Typography data-testid="text">Ingresando al menu en la barra de navegación.</Typography>
            </Grid2>
            <Grid2 zIndex={99} position={"absolute"} top={0} height={"100%"} width={"100%"} sx={{ backgroundColor: 'white' }}>
            </Grid2>
        </Grid2>
    </>
}