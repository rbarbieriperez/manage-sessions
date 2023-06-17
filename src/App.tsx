import React from 'react';
import './App.css';
import AddSession from './views/add-session/add-session';
import clinicsData from './mock-data/clinicsData.json';
import patients from './mock-data/patients.json';
import sessionsType from './mock-data/sessionsType.json';
import HeaderCustom from './components/header-custom/header-custom';
import LateralMenuCustom, { TLateralMenuCustom } from './components/lateral-menu-custom/LateralMenuCustom';
import ManageClinics from './views/manage-clinics/manage-clinics';
import { TPages, TUserData } from './types/types';
import {_saveData } from './firebase/_queries';
import texts from './utils/texts.json';
import Login from './views/login/login';
import { _createUserDataObject } from './utils/functions';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import initApp from './firebase/_config';
import ManagePatients from './views/manage-patients/manage-patients';
import HelperScreen from './components/helper-screen/helper-screen';
import { Alert, Slide, Stack } from '@mui/material';



const initialUserData:TUserData = {
    name: '',
    surname: '',
    clinics: [],
    patients: [],
    sessions: []
}

type TAlert = {
  visible: boolean;
  message: string;
  type: 'error' | 'success'
}


export const UserDataContext = React.createContext<TUserData>(initialUserData);

function App() {
  const [currentPage, setCurrentPage] = React.useState<TPages>('login');
  const [headerText, setHeaderText] = React.useState('Agregar Sesión');
  const [userData, setUserData] = React.useState<TUserData>(initialUserData);
  const [showHelperScreen, setShowHelperScreen] = React.useState<boolean>(false);
  const lateralMenuRef = React.useRef<TLateralMenuCustom>(null);
  const [alertConfig, setAlertConfig] = React.useState<TAlert>({ visible: false, message: "", type: "error" });

  const _openMenu = () => {
    if (lateralMenuRef.current) {
      lateralMenuRef.current.toggleMenu();
    }
  }

  const _handleMenuOptionSelected = (selectedOption: TPages) => {
    setCurrentPage(selectedOption);
  }

  const _renderMenu = () => <LateralMenuCustom menuItemSelected={_handleMenuOptionSelected} ref={lateralMenuRef}/>

  /**
   * Method to handle login success, if the user is new and no data is retrieved,
   * a blank pattern object is sent
   */
  const _handleLoginSuccess = async () => {
    _getData();
    setCurrentPage('home');
  }

  const _getData = () => {
    const db = getFirestore(initApp());
    const userId = sessionStorage.getItem('uid');
    if (userId) {
      onSnapshot(doc(db, 'manage-sessions', userId), (doc) => {
        if (doc.exists()) {
            console.warn('Hubo cambios', doc.data());
            setUserData(JSON.parse(JSON.stringify(doc.data())));
        } else {
          const userName = (sessionStorage.getItem('displayName') || '').split(' ');

          const emptyData = _createUserDataObject(userName[0], [], [], [], userName[1] ? userName[1] : undefined);

          _saveData(emptyData);
        }
      }, () => {
          return 'error';
      });

    } else {
        sessionStorage.clear();
        setCurrentPage('login');
    }
  }

  const _renderPage = () => {
    switch (currentPage) {
      case 'login': return <Login onLoginSuccess={_handleLoginSuccess} onLoginError={() => {}}/>
      case 'home': return <AddSession onAlert={toggleModal} sessionTypeData={sessionsType}/>;
      case 'manage-clinics': return <ManageClinics/>;
      case 'manage-patients': return <ManagePatients/>
    }
  }

  const toggleModal = (message: string, type: 'error' | 'success') => {
    setAlertConfig({ visible: true, message: message, type: type });

    setTimeout(() => {
        setAlertConfig({ visible: false, message: "", type: 'error' });
    }, 2000);
}

  React.useEffect(() => {
    if (currentPage !== 'login') {
      setHeaderText(texts["es"][currentPage]);
    }
  }, [currentPage]);

  React.useEffect(() => {
    const id = sessionStorage.getItem('uid');
    const userName = sessionStorage.getItem('displayName');

    if (id && userName) {
      setCurrentPage('home');
      _handleLoginSuccess();
    } else {
      sessionStorage.clear();
    }
  }, []);

  React.useEffect(() => {
    if (userData.name && currentPage === "home") {
      setShowHelperScreen(userData.clinics.length === 0 || userData.patients.length === 0);
    } else {
      setShowHelperScreen(false);
    }
  }, [userData, currentPage]);


  return (
    <UserDataContext.Provider value={ userData }>
      <main>
        {currentPage !== 'login' ?  <HeaderCustom headerTitle={headerText} onMenuClick={_openMenu}/> : ''}
        {_renderPage()}
        {_renderMenu()}
        { showHelperScreen ? <HelperScreen/> : ''}

        {
            alertConfig?.visible ? 
                <Slide in={alertConfig.visible} direction="left">
                    <Stack sx={{ width: "70%", position: "absolute", bottom: "15px", right: "0" }}>
                        <Alert variant='filled' severity={alertConfig.type}>{alertConfig.message}</Alert>
                    </Stack> 
                </Slide>
            : ''
        }
      </main>
    </UserDataContext.Provider>
    
  );
}

export default App;
