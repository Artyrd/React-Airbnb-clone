import { React, useContext, useState } from 'react';
import { BACKEND_PORT as backendPort } from '../../config.json'
import PropTypes from 'prop-types';
import { Box, Modal, Typography } from '@mui/material';
import ErrorSnackBar from '../utility/ErrorSnackBar';

import { StoreContext } from '../../utils/store';

import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../ThemeColour';
import FormCard from '../utility/FormCard';
import PrimaryButton from '../utility/PrimaryButton';
import SecondaryButton from '../utility/SecondaryButton';
// import Alerts from '../utility/Alerts';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import DivFormSection from '../utility/DivFormSection';

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
  maxHeight: '70vh',
};

const modalContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '10px',
  overflowY: 'auto',
  overflowX: 'hidden'
}

const UnPublishModal = (props) => {
  const theme = ThemeColour();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setErrorOpen(false) }

  // const [openSuccess, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const context = useContext(StoreContext);
  const [token] = context.token;

  const handleUnPublish = async () => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/listings/unpublish/${props.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.error)
      } else {
        // setSuccess(true);
        handleClose();
        props.setPublished(false);
      }
    } catch (err) {
      setErrorMessage(err.toString());
      setErrorOpen(true);
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <PrimaryButton size='small' color='lightblue'
          startIcon={<FlightLandIcon />}
          onClick={handleOpen}
        >
          Unlist
        </PrimaryButton>
        {/* <Alerts
          openSuccess={openSuccess}
          setSuccess={setSuccess}
          textSuccess={'Successfully Unpublished Hosting!'}
        /> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-Confirm-Unpublish-Hosting"
        >
          <Box sx={modalStyle}>
            <FormCard sx={modalContentStyle}>
              <Typography id="modal-Confirm-Unpublish-Hosting" variant="h6" component="div">
                Unpublishing Hosting
              </Typography>
              <Typography variant="h5" component="div" align='center'>
                <b>{ props.title }</b>
              </Typography>
              <Typography color='warning.main' variant="h6" component="div">
                Are you sure?
              </Typography>
              <DivFormSection>
              </DivFormSection>
              <PrimaryButton size='large' fullWidth onClick={handleUnPublish}>
                UNLIST
              </PrimaryButton>
              <SecondaryButton fullWidth size='large' onClick={handleClose}>
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

UnPublishModal.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  // published: PropTypes.bool.isRequired,
  setPublished: PropTypes.func.isRequired,
}

export default UnPublishModal;
