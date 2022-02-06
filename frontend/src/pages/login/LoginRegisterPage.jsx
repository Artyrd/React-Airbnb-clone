import { React, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
// import { BACKEND_PORT as backendPort } from '../../config.json'
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
import { Button } from '@mui/material';
// import { Button, Card, CardContent, TextField } from '@mui/material';
// import { Button, Card, CardContent, IconButton, Link, TextField } from '@mui/material';
// import Snackbar from '@mui/material/Snackbar';

// import { ThemeProvider } from '@mui/material/styles';
// import { ThemeProvider, styled } from '@mui/material/styles';
// import ThemeColour from '../../ThemeColour';
import Header from '../../components/Header';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import PropTypes from 'prop-types';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(400px, 80vw)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

/**
 * Simple page that switches between login and register, not unlike to the LoginRegisterModal.
 * @param {String} pageMode - 'Login' or 'Register', dictates which form the page displays
 */
const LoginRegisterPage = ({ pageMode }) => {
  const [mode, setMode] = useState(pageMode);
  const [showPage, setShowPage] = useState(true);

  const [switchFormText, setSwitchFormText] = useState('')

  useEffect(() => {
    if (mode === 'Login') {
      setSwitchFormText('New to Airbrb?\nRegister!');
    } else {
      setSwitchFormText('Already registered?\nLogin!');
    }
  }, [])

  const switchForm = () => {
    if (mode === 'Login') {
      setMode('Register');
      setSwitchFormText('Already registered?\nLogin!');
    } else {
      setMode('Login');
      setSwitchFormText('New to Airbrb?\nRegister!');
    }
  };

  return (
    <div>
      <Header hideLogin />
      <Box sx={modalStyle}>
        <div>
          { (mode === 'Login')
            ? <LoginForm setModalOpen={ setShowPage }/>
            : <RegisterForm setModalOpen={ setShowPage } />
          }
        </div>
        <div>
          <Button onClick={ switchForm }>{ switchFormText }</Button>
        </div>
      </Box>
      { (showPage === false)
        ? <Redirect to='/' />
        : '' }
    </div>
  );
}

LoginRegisterPage.propTypes = {
  pageMode: PropTypes.string.isRequired
}

export default LoginRegisterPage;
