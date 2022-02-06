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
import format from 'date-fns/format'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AvailabilityFields from './AvailabilityFields';
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

const PublishModal = (props) => {
  const theme = ThemeColour();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setErrorOpen(false) }

  // const [openSuccess, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const context = useContext(StoreContext);
  const [token] = context.token;

  const [availabilities, setAvailabilities] = useState([]);

  // useEffect(() => {
  //   console.log('availabilities')
  //   console.log(availabilities)
  // }, [availabilities])

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      if (availabilities.length < 1) {
        throw Error('Published Listings must have atleast one availability!')
      }
      const availabilitiesFormatted = availabilities;
      for (const entry of availabilitiesFormatted) {
        entry.startDate = format(entry.startDate, 'yyyy-MM-dd')
        entry.endDate = format(entry.endDate, 'yyyy-MM-dd')
      }
      const response = await fetch(`http://localhost:${backendPort}/listings/publish/${props.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          availability: availabilitiesFormatted
        })
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.error)
      } else {
        // props.setSuccess(true);
        handleClose();
        props.setPublished(true);
      }
    } catch (err) {
      setErrorMessage(err.toString());
      setErrorOpen(true);
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <PrimaryButton title='Publish' variant="contained" size='small'
          startIcon={<FlightTakeoffIcon />}
          onClick={ handleOpen }
        >
          Go Live
        </PrimaryButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-Publish-Hosting"
        >
        <form onSubmit={handlePublish}>
          <Box sx={modalStyle}>
            <FormCard sx={modalContentStyle}>
              <Typography id="modal-Publish-Hosting" variant="h5" component="h2">
                Publishing Hosting
              </Typography>
              <Typography sx={{ mt: 2 }}>
                { props.title }
              </Typography>
              <DivFormSection>
                <AvailabilityFields availabilities={ availabilities } setAvailabilities={ setAvailabilities }/>
              </DivFormSection>
              <PrimaryButton type='submit' size='large' fullWidth>
                PUBLISH
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
          </form>
        </Modal>
      </ThemeProvider>
    </div>
  );
}

PublishModal.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  // published: PropTypes.bool.isRequired,
  setPublished: PropTypes.func.isRequired,
}

export default PublishModal;
