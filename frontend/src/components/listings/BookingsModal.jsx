import { React, useContext, useState, useEffect } from 'react';
import { BACKEND_PORT as backendPort } from '../../config.json'
import PropTypes from 'prop-types';
import { Box, Card, Chip, CardContent, Modal, Stack, Typography } from '@mui/material';
import ErrorSnackBar from '../utility/ErrorSnackBar';

import { StoreContext } from '../../utils/store';

// import { ThemeProvider } from '@mui/material/styles';
// import ThemeColour from '../../ThemeColour';
import FormCard from '../utility/FormCard';
import PrimaryButton from '../utility/PrimaryButton';
import SecondaryButton from '../utility/SecondaryButton';
// import Alerts from '../utility/Alerts';
// import format from 'date-fns/format'
import TodayIcon from '@mui/icons-material/Today';
// import AvailabilityFields from '../hostings/AvailabilityFields';
import SpanSpacedApart from '../utility/SpanSpacedApart'
import DivFormSection from '../utility/DivFormSection';
import DivCenterContent from '../utility/DivCenterContent';
import VerticalScrollList from '../utility/VerticalScrollList';

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

const BookingsModal = (props) => {
  // const theme = ThemeColour();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setErrorOpen(false) }

  // const [openSuccess, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const context = useContext(StoreContext);
  const [token] = context.token;
  const [email] = context.email;
  const [hasBooking, setHasBooking] = useState(false);
  const [bookings, setBookings] = useState([]);
  // const [availabilities, setAvailabilities] = useState([]);

  // useEffect(async () => {
  //   // if user not logged in, no bookings
  //   if (!(token && email)) {
  //     setHasBooking(false);
  //   } else {
  //     const result = await fetchUserBookings();
  //     console.log('judging...')
  //     console.log(bookings.length)
  //     if (result === true) {
  //       setHasBooking(true);
  //     } else {
  //       setHasBooking(false);
  //     }
  //   }
  // }, [])
  // }, [email, props.newBookings])

  useEffect(() => {
    if (token && email && props.id) {
      fetchUserBookings();
    } else {
      setHasBooking(false);
    }
  }, [email, props.newBookings])

  useEffect(() => {
    if (bookings.length > 0) {
      setHasBooking(true);
    }
  }, [bookings])

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/bookings`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.error)
      }
      const allBookings = data.bookings;
      const userBookings = [...allBookings.filter((booking) => ((booking.listingId === props.id) && (booking.owner === email)))];
      userBookings.sort((a, b) => (a.dateRange.startDate - b.dateRange.startDate));
      setBookings(userBookings);
    } catch (err) {
      setErrorMessage(err.toString());
      setErrorOpen(true);
    }
  }

  // const handlePublish = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (availabilities.length < 1) {
  //       throw Error('Published Listings must have atleast one availability!')
  //     }
  //     const availabilitiesFormatted = availabilities;
  //     for (const entry of availabilitiesFormatted) {
  //       entry.startDate = format(entry.startDate, 'yyyy-MM-dd')
  //       entry.endDate = format(entry.endDate, 'yyyy-MM-dd')
  //     }
  //     const response = await fetch(`http://localhost:${backendPort}/listings/publish/${props.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         availability: availabilitiesFormatted
  //       })
  //     })
  //     const data = await response.json();
  //     if (response.status !== 200) {
  //       throw Error(data.error)
  //     } else {
  //       // props.setSuccess(true);
  //       handleClose();
  //       // props.setPublished(true);
  //     }
  //   } catch (err) {
  //     setErrorMessage(err.toString());
  //     setErrorOpen(true);
  //   }
  // }

  return (
    <div key={ 'bookings-modal' }>
      <PrimaryButton title='View Your Bookings' variant="contained" size='medium' fullWidth
        startIcon={<TodayIcon />}
        onClick={ handleOpen }
        disabled={ !hasBooking }
      >
        Your Bookings
      </PrimaryButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-Bookings"
      >
      {/* <form onSubmit={handlePublish}> */}
        <Box sx={modalStyle}>
          <FormCard sx={modalContentStyle}>
            <DivFormSection>
              <DivCenterContent>
                <Typography id="modal-Bookings" variant="h4" component="div">
                  Your Bookings
                </Typography>
                <Typography textAlign='center' sx={{ mt: 2 }}>
                  { props.title }
                </Typography>
              </DivCenterContent>
            </DivFormSection>
            <VerticalScrollList>
              { bookings.map((booking, index) => (
                <Card key={ index } sx={{ width: '100%', mb: 2 }}>
                  <CardContent>
                    <Stack direction='column'>
                      <Typography variant="h7" component="div">
                        {`${booking.dateRange.startDate} - ${booking.dateRange.endDate}`}
                      </Typography>
                      <br />
                      <SpanSpacedApart>
                        {/* <Stack direction='row'> */}
                          {/* <Typography variant='h6' component='div'>
                            {'Status:'}
                          </Typography> */}
                          <Chip label={booking.status} color={ booking.status === 'pending' ? 'yellow' : booking.status === 'accepted' ? 'medblue' : 'grey' }/>
                        {/* </Stack> */}
                        <Typography variant="h7" component="div">
                          {`Total: [$${booking.totalPrice}]`}
                        </Typography>
                      </SpanSpacedApart>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </VerticalScrollList>
            {/* <PrimaryButton type='submit' size='large' fullWidth>
              PUBLISH
            </PrimaryButton> */}
            <SecondaryButton fullWidth size='large' onClick={handleClose}>
              CLOSE
            </SecondaryButton>
            <ErrorSnackBar
              errorMessage={ errorMessage }
              open={ errorOpen }
              setOpen={ setErrorOpen }
            />
          </FormCard>
        </Box>
        {/* </form> */}
      </Modal>
    </div>
  );
}

BookingsModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  newBookings: PropTypes.number
}

export default BookingsModal;
