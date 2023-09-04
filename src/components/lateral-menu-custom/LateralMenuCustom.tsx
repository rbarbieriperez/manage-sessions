import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import Face6Icon from '@mui/icons-material/Face6';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import React from 'react';
import { TPages } from '../../types/types';
import Grid2 from '@mui/material/Unstable_Grid2';


const listOptions = [
    {
        index: 1,
        text: 'Agregar Sesión',
        icon: <AddBoxIcon/>
    },
    {
        index: 2,
        text: 'Administrar Clínicas',
        icon: <HouseIcon/>
    },
    {
        index: 3,
        text: 'Administrar Pacientes',
        icon: <Face6Icon/>
    },
    {
        index: 4,
        text: 'Reportes',
        icon: <AssessmentIcon/>
    },
    {
        index: 5,
        text: 'Otros Ajustes',
        icon: <SettingsIcon/>
    }
];


interface ILateralMenuCustom  {
    open: boolean;
    menuItemSelected: (optionName: TPages) => void;
    onMenuClose: () => void;
}


const LateralMenuCustom = ({ open = false, menuItemSelected, onMenuClose }: ILateralMenuCustom) => {

    const _onOptionSelected = (e: React.MouseEvent) => {
        const { id } = e.currentTarget;

        switch(id) {
            case '1': menuItemSelected('home');
                break;
            case '2': menuItemSelected('manage-clinics');
                break;
            case '3': menuItemSelected('manage-patients');
                break;
            case '4': menuItemSelected('reports');
                break;
            case '5': menuItemSelected('other-settings');
                break;
            default: console.warn('Menu option not found at LateralMenuCustom');
        }
    }

    const _renderList = () => <>
        <Box
            sx={{ width: 'auto' }}
            role="presentation"
            onClick={onMenuClose}
            component="div"
        >
            <List>
                {listOptions.map((option) => (
                <ListItem key={option.index} disablePadding>
                    <ListItemButton data-testid="menu-item" id={option.index.toString()} onClick={(e: React.MouseEvent) => _onOptionSelected(e)}>
                        <ListItemIcon>
                            {option.icon}
                        </ListItemIcon>
                        <ListItemText primary={option.text} />
                    </ListItemButton>
                </ListItem>
                ))}
            </List>

        </Box>
    </>

    return <>
        <Drawer
            anchor='left'
            open={open}
            onClose={onMenuClose}
            data-testid="menu-testid"
        >
            {_renderList()}
            <Grid2 position={"absolute"} xs={12} textAlign={"center"} bottom={10}>
                <Typography fontSize={12}>- Desarrollado por Rodrigo Barbieri 2023 -</Typography>
                <Typography fontSize={12}>¿Encontraste algun error? ¡Reportalo a rbarbieriperez@gmail.com!</Typography>
            </Grid2>
        </Drawer>
    </>
}

export default LateralMenuCustom;