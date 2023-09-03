import { Button } from "@mui/material";
import React, { EventHandler } from "react";


const DownloadPWAButton = () => {
    const [supportsPWA, setSupportsPWA] = React.useState(false);
    const [promptInstall, setPromptInstall] = React.useState<any>(null);

    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setSupportsPWA(true);
            setPromptInstall(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!promptInstall) {
            return;
        }

        promptInstall.prompt();
    }

    if (!supportsPWA) {
        return null;
    }

    return <>
        <Button variant="contained" color="success" onClick={onClick}>
            Bajar App Móvil
        </Button>
    </>
}


export default DownloadPWAButton;