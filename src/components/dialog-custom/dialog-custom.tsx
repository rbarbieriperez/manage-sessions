import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

interface IDialogCustom {
    open: boolean;
    modalTitle?: string;
    modalDesc?: string;
    acceptButtonText?: string;
    rejectButtonText?: string;
    onButtonAcceptClick?: () => void;
    onButtonRejectClick?: () => void;
    onModalClose?: () => void;
}

export default function DialogCustom({ open, acceptButtonText, onButtonAcceptClick, onButtonRejectClick, onModalClose, rejectButtonText, modalTitle, modalDesc }: IDialogCustom) {
    const [isOpen, setIsOpen] = React.useState<boolean>(open);

    React.useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const _handleButtonAccept = () => {
        setIsOpen(false);
        if (onButtonAcceptClick) onButtonAcceptClick();
    }

    const _handleButtonReject = () => {
        setIsOpen(false);
        if (onButtonRejectClick) onButtonRejectClick();
    }

    return <>
        <Dialog
            open={isOpen}
            onClose={() => (onModalClose && onModalClose())}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {modalTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {modalDesc}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={_handleButtonReject}>{rejectButtonText}</Button>
                <Button onClick={_handleButtonAccept} autoFocus>
                    {acceptButtonText}
                </Button>
            </DialogActions>
      </Dialog>   
    
    </>
}