import { addDoc, collection, doc, getDoc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import initApp from './_config';
import { TUserData } from '../types/types';

const db = getFirestore(initApp());

export const _getData = async () => {
    const userId = sessionStorage.getItem('uid');
    if (userId) {

        return new Promise((res) => {
            return onSnapshot(doc(db, 'manage-sessions', userId), (doc) => {
                console.warn('Hubo cambios');
                if (doc.exists()) {
                    res(doc.data());
                } else {
                    res('no-data');
                }
            }, () => {
                res('error');
            });
        }); 

    } else {
        return 'no-id';
    }
}

export const _saveData = (data: TUserData) => {
    const userId = sessionStorage.getItem('uid');
    if (userId) {
        return setDoc(doc(db, 'manage-sessions', userId), data).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    } else {
        return 'no-id';
    }
}

/**
 * Method to store the userData backup
 */
export const saveBackup = (userData:TUserData) => {
    if (!sessionStorage.getItem('isLogged') as boolean) {
        const userId = sessionStorage.getItem('uid');

        if (userId) {
            const setCollection = collection(db, "manage-sessions", userId, "backup");
            return addDoc(setCollection, userData).then(() => {
                console.warn('We have created a new backup!');
                return true;
            }).catch(() => false);
        }
    }
}