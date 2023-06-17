import { Box, CircularProgress } from '@mui/material';
import React from 'react';


interface ISpinnerCustom {
    isVisible: boolean;
}

export default function SpinnerCustom ({ isVisible }: ISpinnerCustom) {
    return <div hidden={!isVisible} style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, backgroundColor: "white", zIndex: '999'}}>
        <Box marginTop={40} textAlign={"center"}>
            <CircularProgress />
        </Box>
    </div>
}