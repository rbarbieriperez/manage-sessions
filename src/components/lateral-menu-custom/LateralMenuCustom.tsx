import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';
import Face6Icon from '@mui/icons-material/Face6';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import React from 'react';
import { TPages } from '../../types/types';



interface ILateralCustomMenu {
    menuItemSelected: (optionName: TPages) => void;
}


export type TLateralMenuCustom = {
    toggleMenu: () => void;
}

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


const LateralMenuCustom = React.forwardRef<TLateralMenuCustom, ILateralCustomMenu>(({menuItemSelected}: ILateralCustomMenu, ref) => {
    const [isOpened, setIsOpened] = React.useState(false);

    const _toggleMenu = () => {
        setIsOpened(!isOpened);
    }

    React.useImperativeHandle(ref, () => ({
        toggleMenu() {
            _toggleMenu();
        }
    }), []);

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
            onClick={()=> _toggleMenu()}
            onKeyDown={() => _toggleMenu()}
            component="div"
        >
            <List>
                {listOptions.map((option) => (
                <ListItem key={option.index} disablePadding>
                    <ListItemButton id={option.index.toString()} onClick={(e: React.MouseEvent) => _onOptionSelected(e)}>
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
            open={isOpened}
            onClose={_toggleMenu}
        >
            {_renderList()}
        </Drawer>
    </>


});

export default LateralMenuCustom;