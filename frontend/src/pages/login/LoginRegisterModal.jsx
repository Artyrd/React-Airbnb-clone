import { React, useState } from 'react';
// import { BACKEND_PORT as backendPort } from '../../config.json'
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Button, IconButton } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
// import { Button, Card, CardContent, TextField } from '@mui/material';
// import { Button, Card, CardContent, IconButton, Link, TextField } from '@mui/material';
// import Snackbar from '@mui/material/Snackbar';

import { ThemeProvider } from '@mui/material/styles';
// import { ThemeProvider, styled } from '@mui/material/styles';
import ThemeColour from '../../ThemeColour';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

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
 * A modal popup which displays the login and register form
 */
const LoginRegisterModal = () => {
  const theme = ThemeColour();
  const [mode, setMode] = useState('Login');
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setMode('Login')
  };

  // The text prompting users to use either register or login
  const [switchFormText, setSwitchFormText] = useState(
    'New to Airbrb?\nRegister!'
  )
  // Switches between login and register forms
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
      <ThemeProvider theme={theme}>
        <IconButton title='Login/ Register' onClick={ handleOpen }>
          <LoginIcon color='icon' fontSize='large'/>
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-Login-Register"
          aria-describedby="modal-Login-Register-To-Airbrb"
        >
          <Box sx={modalStyle}>
            <div>
              { (mode === 'Login')
                ? <LoginForm setModalOpen={ setOpen }/>
                : <RegisterForm setModalOpen={ setOpen } />
              }
            </div>
            <div>
              <Button onClick={ switchForm }>{ switchFormText }</Button>
            </div>
          </Box>
        </Modal>
      </ThemeProvider>
    </div>
  );
}

export default LoginRegisterModal;
