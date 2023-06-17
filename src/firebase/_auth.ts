import initApp from "./_config";
import { GoogleAuthProvider, getAuth, signInWithPopup, OAuthProvider, signInWithRedirect, UserCredential } from 'firebase/auth';

initApp();


const providerGoogle = new GoogleAuthProvider();
//provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
const auth = getAuth();

const providerHotmail = new OAuthProvider('microsoft.com');
providerHotmail.setCustomParameters({
    prompt: 'consent',
    login_hint: 'user@firstadd.onmicrosoft.com'
});


export const signWithGmail = () => {
    return signInWithPopup(auth, providerGoogle).then((res:UserCredential) => {
        const credential = GoogleAuthProvider.credentialFromResult(res);
        const token = credential?.accessToken;

        const { uid, displayName } = res.user;


        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('displayName', displayName || '');

        return true;
    }).catch(() => {
        return false;
    });
};




export const signWithMicrosoft = () => {
    return signInWithPopup(auth, providerHotmail).then((res) => {
        const credential = OAuthProvider.credentialFromResult(res);
        const accessToken = credential?.accessToken;
        const idToken = credential?.idToken;

        const { uid, displayName } = res.user;
        console.log(res.user);

        sessionStorage.clear();
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('displayName', displayName || '');
        return true;
    }).catch(() => {
        return false;
    });
}