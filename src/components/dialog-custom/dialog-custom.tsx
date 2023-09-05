import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText } from '@mui/material';
import React from 'react';
import { ListItem } from '@mui/material';

interface IDialogCustom {
    open: boolean;
    modalTitle?: string;
    modalDesc?: string | string [] | React.ReactElement;
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

    const _computeModalDesc = (desc: string | string[] | React.ReactElement):string | React.ReactElement => {
        if (typeof desc === 'string') {
            return desc;
        }

        if (!Array.isArray(desc)) {
            return desc;
        }

        return <>
            {
                desc.map((text: string, index: number) => <ListItem disablePadding key={'dialog-custom-list-key-'+ index}>
                    <ListItemText primary={text}/>
                </ListItem>)
            }
        </>

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
                    {_computeModalDesc(modalDesc ? modalDesc : '')}
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