import { Button } from "@mui/material";
import React from "react";


const DownloadPWAButton = () => {
    const [supportsPWA, setSupportsPWA] = React.useState(false);
    const [promptInstall, setPromptInstall] = React.useState<any>(null);

    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            console.log('ejecuto');
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('transitionend', handler);
    }, []);

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!promptInstall) {
            return;
        }

        promptInstall.prompt();
    }

    return <>
        <Button sx={{ marginBottom: '10px' }} variant="contained" color="success" onClick={onClick}>
            Bajar App Móvil
        </Button>
    </>
}


export default DownloadPWAButton;