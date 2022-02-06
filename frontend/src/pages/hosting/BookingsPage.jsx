import { React, useContext, useState, useEffect } from 'react';
import { BACKEND_PORT as backendPort } from '../../config.json'
import { Box, Card, Chip, CardContent, Stack, Typography } from '@mui/material';
import ErrorSnackBar from '../../components/utility/ErrorSnackBar';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../utils/store';
import { parseISO, differenceInCalendarDays, startOfToday } from 'date-fns'
// import { ThemeProvider } from '@mui/material/styles';
// import ThemeColour from '../../ThemeColour';
import FormCard from '../../components/utility/FormCard';
import PrimaryButton from '../../components/utility/PrimaryButton';
import SecondaryButton from '../../components/utility/SecondaryButton';
// import Alerts from '../utility/Alerts';
// import format from 'date-fns/format'
// import TodayIcon from '@mui/icons-material/Today';
// import AvailabilityFields from '../hostings/AvailabilityFields';
import SpanSpacedApart from '../../components/utility/SpanSpacedApart'
import DivFormSection from '../../components/utility/DivFormSection';
import DivCenterContent from '../../components/utility/DivCenterContent';
import VerticalScrollList from '../../components/utility/VerticalScrollList';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ThemeProvider } from '@mui/system';
import ThemeColour from '../../ThemeColour';
import DivPageContent from '../../components/utility/DivPageContent';

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

const BookingsPage = (props) => {
  const theme = ThemeColour();
  const { hostingId } = useParams();

  const [errorMessage, setErrorMessage] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const context = useContext(StoreContext);
  const [token] = context.token;
  const [email] = context.email;
  const [input, setInput] = useState({})
  const [bookings, setBookings] = useState([]);
  const [daysPassed, setDaysPassed] = useState('');
  const [profit, setProfit] = useState('');

  const [managedBooking, setManagedBooking] = useState(0);

  useEffect(() => {
    if (token && email) {
      if (email === input.owner) {
        fetchBookings();
      }
    }
  }, [input, email, managedBooking])

  useEffect(() => {
    calcDaysPassed();
  }, [input])

  useEffect(() => {
    calcProfit();
  }, [bookings])

  const calcDaysPassed = () => {
    if (!input.postedOn) {
      return;
    }
    const posted = parseISO(input.postedOn);
    const today = startOfToday();
    const diff = differenceInCalendarDays(today, posted)
    setDaysPassed(diff.toString())
  }

  const calcProfit = () => {
    let profit = 0.0
    for (const booking of bookings) {
      if (booking.status === 'accepted') {
        profit += parseFloat(booking.totalPrice);
      }
    }
    setProfit(profit.toFixed(2));
  }

  const fetchBookings = async () => {
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
      const userBookings = [...allBookings.filter((booking) => ((booking.listingId === hostingId)))];
      userBookings.sort((a, b) => (a.dateRange.startDate - b.dateRange.startDate));
      setBookings(userBookings);
    } catch (err) {
      setErrorMessage(err.toString());
      setErrorOpen(true);
    }
  }

  const denyBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/bookings/decline/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error;
      }
      setManagedBooking(managedBooking + 1);
    } catch (err) {
      setErrorMessage(err.toString());
      setErrorOpen(true);
    }
  }

  const acceptBooking = async (bookingId) => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/bookings/accept/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error;
      }
      setManagedBooking(managedBooking + 1);
    } catch (err) {
      setErrorMessage(err.toString());
      setErrorOpen(true);
    }
  }

  /**
   * Get the existing information for the Hosting
   */
  useEffect(async () => {
    try {
      if (!hostingId) {
        throw Error('Listing ID not valid');
      }
      const response = await fetch(`http://localhost:${backendPort}/listings/${hostingId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      })
      const data = await response.json();
      console.log('editing listing of:')
      console.log(data);
      if (response.status !== 200) {
        throw data.error;
      }
      const listing = data.listing;
      setInput({
        title: listing.title,
        owner: listing.owner,
        address: listing.address,
        price: listing.price,
        thumbnail: listing.thumbnail,
        metadata: listing.metadata,
        postedOn: listing.postedOn,
      })
    } catch (err) {
      setErrorMessage(err.toString());
      setErrorOpen(true);
    }
  }, [])

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header/>
        <DivPageContent >
          <Box sx={modalStyle}>
            <FormCard sx={modalContentStyle}>
              <DivFormSection>
                <DivCenterContent>
                  <Typography id="modal-Bookings" variant="h5" component="div">
                    Your Booking Requests
                  </Typography>
                  <br/>
                  <Typography textAlign='center'>
                    { input.title }
                  </Typography>
                  <SpanSpacedApart>
                    <Typography variant='h7' sx={{ mr: '10px' }}>
                      { `Listed for: ${daysPassed} days ` }
                    </Typography>
                    <Typography variant='h7'>
                      { `Profit Made: $${profit}` }
                    </Typography>
                  </SpanSpacedApart>
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
                        <DivFormSection>
                        <SpanSpacedApart>
                            <Chip label={booking.status} color={ booking.status === 'pending' ? 'yellow' : booking.status === 'accepted' ? 'medblue' : 'grey' }/>
                            <Typography variant="h7" component="div">
                              {`Total: [$${booking.totalPrice}]`}
                            </Typography>
                          </SpanSpacedApart>
                        </DivFormSection>
                        { booking.status === 'pending'
                          ? (
                            <SpanSpacedApart>
                              <PrimaryButton size='small' onClick={ () => { acceptBooking(booking.id) }}>
                                ACCEPT
                              </PrimaryButton>
                              <SecondaryButton size='small' color='warning' onClick={ () => { denyBooking(booking.id) }}>
                                DENY
                              </SecondaryButton>
                            </SpanSpacedApart>
                            )
                          : null
                        }
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </VerticalScrollList>
              <ErrorSnackBar
                errorMessage={ errorMessage }
                open={ errorOpen }
                setOpen={ setErrorOpen }
              />
            </FormCard>
          </Box>
        </DivPageContent>
        <Footer/>
      </ThemeProvider>
    </div>
  );
}

export default BookingsPage;
