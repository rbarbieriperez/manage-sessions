import React from 'react';
import { Grow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';


interface IAnimatedWrapper {
    component: React.ReactElement,
    title: string
}

const AnimatedWrapper = ({ component, title }: IAnimatedWrapper) => {
    /**
     * false = show collapsed, true = show expanded
     */
    const [toggleVisibility, setToggleVisibility] = React.useState(false);


    const handleToggleVisibility = () => {
        setToggleVisibility(!toggleVisibility);
    }

    return <>
        <Grid2 container>
            {
                toggleVisibility ?
                <Grid2 xs={12}>
                    {component}
                </Grid2>
                :

                <Grid2 xs={12} padding={2} borderRadius={3} boxShadow={"rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"}>
                    <Typography fontWeight={"bold"}>{title}</Typography>
                </Grid2>

            }
            <IconButton sx={{
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
                position: "absolute",
                marginTop: "8px",
                left: "93%",
                transform: "translateX(-100%)",
                backgroundColor: 'white'

            }} onClick={handleToggleVisibility}>{toggleVisibility ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</IconButton>
        </Grid2>
    </>
}

export default AnimatedWrapper;