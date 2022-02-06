import { BACKEND_PORT as backendPort } from '../../config.json'
import { React, useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../utils/store';
import { Card, CardContent, CardMedia, Stack } from '@mui/material';
// import { Button, CardContent, MenuItem } from '@mui/material';
// import { Button, CardContent, MenuItem, InputLabel, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
// import PropertyTypes from './PropertyTypes';
// import AmenityCategories from './AmenityCategories';
import Alerts from '../../components/utility/Alerts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ThemeColour from '../../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormCard from '../../components/utility/FormCard';
// import BedroomFields from './BedroomFields';
import AmenitiesDisplay from '../hosting/AmenitiesDisplay';
import HorizontalScrollList from '../../components/utility/HorizontalScrollList';
import PrimaryButton from '../../components/utility/PrimaryButton';
import SecondaryButton from '../../components/utility/SecondaryButton';
// import CardThumbnail from '../../components/utility/CardThumbnail';
// import SecondaryButton from '../../components/utility/SecondaryButton';
import DivFormSection from '../../components/utility/DivFormSection';
import DivCenterContent from '../../components/utility/DivCenterContent';
import ResponsiveGrid from '../../components/utility/ResponsiveGrid';
import DivPageContent from '../../components/utility/DivPageContent';
import ReviewsDisplay from '../../components/listings/ReviewsDisplay';
import BookingField from '../../components/listings/BookingField';

import format from 'date-fns/format'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import BookingsModal from '../../components/listings/BookingsModal';

const ListingPage = () => {
  // Load page theme
  const theme = ThemeColour();
  const { listingId } = useParams();

  const context = useContext(StoreContext);
  const [token] = context.token;

  // const listingId = parseInt(useParams().listingId);
  // Hosting information States
  const [input, setInput] = useState({
    title: '',
    address: {
      number: '',
      unit: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
    },
    price: '0',
    thumbnail: '',
    metadata: {
      propertyType: '',
      numBaths: '0',
      bedrooms: [],
      amenities: {},
      description: '',
      images: [],
    },
    reviews: [],
    availability: [],
    postedOn: '',
  })

  useEffect(() => {
    console.log(input)
  }, [input])

  // Alert handlers
  const [openSuccess, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('')
  const [openFail, setFail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')

  /**
   * Get the existing information for the Hosting
   */
  useEffect(async () => {
    try {
      if (!listingId) {
        throw Error('Listing ID not valid');
      }
      const response = await fetch(`http://localhost:${backendPort}/listings/${listingId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error;
      }
      const listing = data.listing;
      setInput({
        title: listing.title,
        address: listing.address,
        price: listing.price,
        thumbnail: listing.thumbnail,
        metadata: listing.metadata,
        reviews: listing.reviews,
        availability: listing.availability,
        postedOn: listing.postedOn,
      })
    } catch (err) {
      setErrorMsg(err.toString());
      setFail(true);
    }
  }, [])

  const [booking, setBooking] = useState({ startDate: null, endDate: null });
  const [bookingPrice, setBookingPrice] = useState(0)
  const [newBookings, setNewBookings] = useState(0);

  // If user selected valid dates, show their calculated booking total price
  useEffect(() => {
    if (booking.startDate && booking.endDate) {
      setBookingPrice(calcBookingPrice());
    } else {
      setBookingPrice(0)
    }
  }, [booking])

  const calcBookingPrice = () => {
    const numNights = differenceInCalendarDays(booking.endDate, booking.startDate);
    const price = parseFloat(input.price);
    const totalPrice = numNights * price;
    console.log(totalPrice);
    return totalPrice;
  }

  /**
   * Submit the booking request.
   * Date validation already done in <BookingFields/>
   */
  const submitBooking = async (event) => {
    try {
      event.preventDefault()
      const dateRange = {
        startDate: format(booking.startDate, 'yyyy-MM-dd'),
        endDate: format(booking.endDate, 'yyyy-MM-dd')
      }
      const totalPrice = calcBookingPrice();

      const response = await fetch(`http://localhost:${backendPort}/bookings/new/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          dateRange: dateRange,
          totalPrice: parseFloat(totalPrice)
        })
      })
      const data = await response.json();
      console.log(data);
      // Alert
      if (response.status === 200) {
        setSuccessMsg(`Successfully requested booking! Booking ID: ${data.bookingId}`)
        setSuccess(true);
        setNewBookings(newBookings + 1);
      } else {
        throw Error(data.error)
      }
    } catch (err) {
      setErrorMsg(err.toString())
      setFail(true);
    }
  }

  const stylesImages = {
    maxWidth: '50vw',
    width: '500px',
    boxShadow: 4,
    margin: '5px',
  }

  const totalBeds = (bedRooms) => {
    let sum = 0;
    for (const bedRoom of bedRooms) {
      const numBeds = parseInt(bedRoom.numBeds);
      if (!isNaN(numBeds)) {
        sum += numBeds;
      }
    }
    return sum;
  }

  const stylesInfoCard = {
    width: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  }

  const BookingCard = () => {
    return (
      <DivFormSection styles={ stylesInfoCard }>
        <Card sx={{ flexGrow: 1 }}>
          <CardContent>
            <DivFormSection>
              {/* <BookingsModal id={listingId}/> */}
              <BookingsModal id={listingId} title={input.title} newBookings={newBookings}/>
            </DivFormSection>
            <DivFormSection>
              <Typography variant='h4' component='div' color='text.heading2'>
                Price
              </Typography>
            </DivFormSection>
            <Typography variant='h5' component='div' color='text.heading2'>
              {`$${input.price} per night`}
            </Typography>
            <DivFormSection>
              <Typography variant='h5' component='div'>
                Request a Booking
              </Typography>
              <form onSubmit={ submitBooking }>
                <BookingField booking={ booking } setBooking={ setBooking } availabilities={input.availability} />
                <DivFormSection>
                  { bookingPrice > 0
                    ? <Typography variant='h6'>{`Booking Total: $${bookingPrice}`}</Typography>
                    : null
                  }
                </DivFormSection>
                <PrimaryButton type='submit' size='large' fullWidth>
                  Book!
                </PrimaryButton>
              </form>
              <SecondaryButton size='medium' fullWidth onClick={() => setBooking({ startDate: null, endDate: null }) }>
                Clear Selection
              </SecondaryButton>
            </DivFormSection>
          </CardContent>
        </Card>
      </DivFormSection>
    )
  };

  const DetailsCard = () => {
    return (
      <DivFormSection styles={ stylesInfoCard }>
        <FormCard>
          <CardContent>
            <Typography variant='h3' component='div'>
              Listing Information
            </Typography>
            <Typography color='text.secondary'>
              { input.postedOn ? `Posted on: ${input.postedOn.split('T')[0]}` : null }
            </Typography>
              <Typography variant='h5' component='div'>
                <b>Address</b>
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant='h6' component='div' color='text.heading2'>
                    {input.address.unit ? `${input.address.unit}/ ` : null}
                    {`${input.address.number} `}
                    {`${input.address.street}`}
                  </Typography>
                  <Typography variant='h6' component='div' color='text.heading2'>
                    {`${input.address.city}, ${input.address.state} ${input.address.postcode}`}
                  </Typography>
                  <Typography variant='h6' component='div' color='text.heading2'>
                    {`${input.address.country}`}
                  </Typography>
                </CardContent>
              </Card>
              <DivFormSection>
                <Typography variant='h5' component='div' color='text.heading2'>
                  <b>Details</b>
                </Typography>
                {/* <Card> */}
                  {/* <CardContent> */}
                    <Typography variant='h6' component='div' color='text.heading2'>
                      {`${totalBeds(input.metadata.bedrooms)} guests - ${input.metadata.bedrooms.length} bedrooms - ${input.metadata.numBaths} baths`}
                    </Typography>
                    <HorizontalScrollList>
                    { input.metadata.bedrooms.map((bedroom, index) => (
                      <Card key={ index } sx={{ minWidth: 'max-content' }}>
                        <CardContent>
                          <Typography variant='h6' component='div'>
                            { `Bedroom #${index + 1}` }
                          </Typography>
                          <Typography color="text.secondary">
                            { `${bedroom.numBeds} guests` }
                          </Typography>
                          <Typography variant="body">
                            { bedroom.description }
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                    </HorizontalScrollList>
                  {/* </CardContent> */}
                {/* </Card> */}
              </DivFormSection>
              <DivFormSection>
              <Typography variant='h5' component='div' color='text.heading2'>
                <b>Description</b>
              </Typography>
              <Card>
                <CardContent>
                  { input.metadata.description }
                </CardContent>
              </Card>
              </DivFormSection>
              <DivFormSection>
                <Typography variant='h5' component='div' color='text.heading2'>
                  <b>Amenities</b>
                </Typography>
                <Card>
                  <CardContent>
                    <AmenitiesDisplay input={ input }/>
                  </CardContent>
                </Card>
              </DivFormSection>
          </CardContent>
        </FormCard>
      </DivFormSection>
    )
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Header />
        <DivPageContent>
          <DivFormSection>
            <Typography variant='h3' component='div' color='text.heading2'>
              { input.title }
            </Typography>
            <Card>
              <CardContent>
                  <Stack direction='row'>
                    <CardMedia
                      component='img'
                      image={ input.thumbnail }
                      sx={stylesImages}
                    />
                    <HorizontalScrollList>
                    { input.metadata.images.map((imgurl, index) => (
                      <div key={ index }>
                        <CardMedia component='img' image={ imgurl } sx={stylesImages} />
                      </div>
                    ))}
                    </HorizontalScrollList>
                  </Stack>
              </CardContent>
            </Card>
          </DivFormSection>
          <DivFormSection>
            <DivCenterContent>
              <ResponsiveGrid
                items={[
                  <BookingCard key='listing-page-booking-card'/>,
                  <DetailsCard key='listing-page-details-card'/>
                ]}
              />
            </DivCenterContent>
          </DivFormSection>
          <DivFormSection>
            <ReviewsDisplay id={ listingId } newBookings={ newBookings }/>
          </DivFormSection>
        </DivPageContent>
        <Footer />
        <Alerts
          openSuccess={openSuccess}
          openFail={openFail}
          setSuccess={setSuccess}
          setFail={setFail}
          textSuccess={successMsg}
          textFail={errorMsg}
        />
      </ThemeProvider>
    </div>
  );
}

export default ListingPage;
