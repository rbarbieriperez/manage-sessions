import { IconButton, Typography } from '@mui/material';
import { signWithGmail, signWithMicrosoft } from '../../firebase/_auth';
import Grid2 from '@mui/material/Unstable_Grid2';
import React from 'react';
import texts from '../../utils/texts.json';
const gmailImg = require('../../images/gmail.png');
const emailImg = require('../../images/email.png');


interface ILogin {
    onLoginSuccess: () => void;
    onLoginError: () => void;
}

export default function Login({ onLoginSuccess, onLoginError }: ILogin) {


    const _handleGmailLogin = async () => {
        const res = await signWithGmail();

        if (res) {
            console.log('login exitoso');
            onLoginSuccess();
        } else {
            console.log('login fallido');
            onLoginError();
        }
    }


    const _handleEmailLogin = async () => {
        const res = await signWithMicrosoft();

        if (res) {
            console.log('login exitoso');
            onLoginSuccess();
        } else {
            console.log('login fallido');
            onLoginError();
        }
    }

    return <>
        <Grid2 container display={"flex"} justifyContent={"center"} rowGap={3}>
            <Grid2 paddingLeft={1} xs={10} border={1} borderRadius={3} display={"flex"} marginTop={33}>
                <IconButton onClick={_handleGmailLogin}>
                    <img width={36} src={gmailImg} alt="gmail"/>
                    <Typography marginLeft={1}>{texts["es"]["login-gmail"]}</Typography>
                </IconButton>
            </Grid2>
            <Grid2 paddingLeft={1} xs={10} border={1} borderRadius={3} display={"flex"}>
                <IconButton onClick={_handleEmailLogin}>
                    <img width={36} src={emailImg} alt="email" />
                    <Typography  marginLeft={1}>{texts["es"]["login-email"]}</Typography>
                </IconButton>
            </Grid2>
        </Grid2>
    </>
}