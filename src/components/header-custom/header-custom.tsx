import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Typography, IconButton } from '@mui/material';

interface IHeaderCustom {
    headerTitle?: string;
    onMenuClick?: () => void;
}

export default function HeaderCustom ({headerTitle = '', onMenuClick }: IHeaderCustom) {
    return <>
        <header>
            <Grid2 container boxShadow={3}>
                <Grid2 xs={2}>
                    <IconButton onClick={() => (onMenuClick && onMenuClick())}>
                        <MenuIcon/>
                    </IconButton>
                </Grid2>
                <Grid2 xs={10} display={"flex"}>
                    <Typography width="fit-content" position={"absolute"} margin={".6rem auto"} left={0} right={0}>{headerTitle}</Typography>
                </Grid2>
            </Grid2>
        </header>
    </>
}