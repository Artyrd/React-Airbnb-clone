import { React, useContext, useState } from 'react';
import { BACKEND_PORT as backendPort } from '../../config.json'
// import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ErrorSnackBar from '../../components/utility/ErrorSnackBar';

import { StoreContext } from '../../utils/store';

import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../ThemeColour';
import FormCard from '../../components/utility/FormCard';
import PrimaryButton from '../../components/utility/PrimaryButton';
import SecondaryButton from '../../components/utility/SecondaryButton';

const modalStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
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

const modalContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px'
}

const LogoutModal = () => {
  const theme = ThemeColour();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setErrorOpen(false) }
  const history = useHistory();

  const [errorMessage, setErrorMessage] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const context = useContext(StoreContext);
  const [token, setToken] = context.token;
  const setEmail = context.email[1];

  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/user/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      // regardless of outcome, remove token
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setToken(null);
      setEmail(null);

      const data = await response.json();
      if (response.status === 400) {
        setErrorMessage(data.error)
        setErrorOpen(true);
      } else {
        handleClose();
        // <Redirect to='/' />
        history.push('/');
      }
    } catch (err) {
      setErrorMessage('Something went wrong while trying to contact the server')
      setErrorOpen(true);
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        { (token === null)
          ? ''
          : (
            <IconButton title='Logout' onClick={ handleOpen }>
              <LogoutIcon color='icon' fontSize='large'/>
            </IconButton>
            )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-Logout"
          aria-describedby="modal-Confirm-Airbrb-Logout"
        >
          <Box sx={modalStyle}>
            <FormCard sx={modalContentStyle}>
              <Typography id="modal-Logout" variant="h5" component="h2">
                Logging out of Airbrb
              </Typography>
              <Typography id="modal-Confirm-Airbrb-Logout" sx={{ mt: 2 }}>
                Are you sure?
              </Typography>
              <br />
              <PrimaryButton size='large' fullWidth onClick={ handleLogout }>
                LOGOUT
              </PrimaryButton>
              <SecondaryButton variant='contained' fullWidth size='large' color='secondaryButton' onClick={handleClose}>
                CANCEL
              </SecondaryButton>
              <ErrorSnackBar
                errorMessage={ errorMessage }
                open={ errorOpen }
                setOpen={ setErrorOpen }
              />
            </FormCard>
          </Box>
        </Modal>
      </ThemeProvider>
    </div>
  );
}

export default LogoutModal;
