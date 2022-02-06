import { BACKEND_PORT as backendPort } from '../config.json'
import { React, useState, useEffect, useContext } from 'react';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import Footer from '../components/Footer';
import ErrorSnackBar from '../components/utility/ErrorSnackBar';
import HorizontalScrollList from '../components/utility/HorizontalScrollList'
import ListingCard from '../components/listings/ListingCard';
import { StoreContext } from '../utils/store';
import Header from '../components/Header';
import DivPageContent from '../components/utility/DivPageContent'
import ThemeColour from '../ThemeColour';
import ResponsiveGrid from '../components/utility/ResponsiveGrid';
import DivFormSection from '../components/utility/DivFormSection';
import Banner from '../components/Banner';
import { averageListingRating } from '../helper/helpers';

const HomePage = () => {
  const theme = ThemeColour();
  const context = useContext(StoreContext);
  const [token] = context.token;
  const [email] = context.email;

  const [errorMessage, setErrorMsg] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const [listings, setListings] = useState([]);
  const [popular, setPopular] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    console.log('hello world')
    fetchListings();
  }, [])

  useEffect(() => {
    let popular = [...listings];
    popular.sort((a, b) => (b.reviews.length - a.reviews.length));
    popular = popular.filter((listing) => averageListingRating(listing.reviews) > 3);
    setPopular(popular);
  }, [listings])

  const fetchListings = async () => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/listings`, {
        method: 'GET',
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.error)
      }
      const allListings = data.listings;
      allListings.sort((a, b) => (a.title.toUpperCase().localeCompare(b.title.toUpperCase())));
      // allListings.sort((a, b) => (a.title.toUpperCase() - b.title.toUpperCase()));
      setListings([...allListings]);
    } catch (err) {
      setErrorMsg(err.toString())
      setErrorOpen(true);
    }
  }
  // if user logged in, get their bookings
  useEffect(() => {
    if (email && token) {
      fetchBookings()
    }
  }, [email])

  // if user has bookings, sort the listings according to bookings first
  useEffect(() => {
    if (bookings.length === 0) {
      return;
    }
    // const sortedListings = [...listings];
    const bookedListings = listings.filter((listing) => (bookings.includes(listing.id)));
    const otherListings = listings.filter((listing) => (!bookings.includes(listing.id)))
    const sortedListings = [...bookedListings, ...otherListings];
    setListings(sortedListings);
  }, [bookings])

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
      const userBookings = [...allBookings.filter((booking) => ((booking.owner === email) && booking.status !== 'declined'))];
      userBookings.sort((a, b) => (a.dateRange.startDate - b.dateRange.startDate));
      const bookingIds = userBookings.map((booking) => (booking.listingId));
      setBookings(bookingIds);
    } catch (err) {
      setErrorMsg(err.toString());
      setErrorOpen(true);
    }
  }

  const stylesAllListingsGrid = {
    maxWidth: '95vw',
    maxHeight: '100vh',
  }

  return (
    <div>
      <ThemeProvider theme={ theme }>
        <Header/>
        <DivPageContent>
          <Typography gutterBottom variant="h3" component="div" mt={2}>
            {'Popular Listings'}
          </Typography>
          <HorizontalScrollList>
          {
            popular.map((listing, index) => {
              return (
                <ListingCard
                  key={ index }
                  id={ listing.id }
                  title={ listing.title }
                  // propertyType={ listing.metadata.propertyType }
                  // bedrooms={ listing.metadata.bedrooms }
                  // numBaths={ listing.metadata.numBaths }
                  thumbnail= {listing.thumbnail}
                  reviews={ listing.reviews }
                  // rating={ listing.reviews }
                  // numReviews={ listing.reviews.length }
                  price={ listing.price }
                />
              )
            })
          }
          </HorizontalScrollList>
          <Banner/>
          <Typography gutterBottom variant="h3" component="div" mt={2}>
            {'All Listings'}
          </Typography>
          <DivFormSection styles={ stylesAllListingsGrid }>
            <ResponsiveGrid items={
              listings.map((listing, index) => {
                return (
                  <ListingCard
                    key={ index }
                    id={ listing.id }
                    title={ listing.title }
                    thumbnail= {listing.thumbnail}
                    reviews={ listing.reviews }
                    price={ listing.price }
                  />
                )
              })
            }/>
          </DivFormSection>
        </DivPageContent>
        <Footer />
        <ErrorSnackBar
          errorMessage={ errorMessage }
          open={ errorOpen }
          setOpen={ setErrorOpen }
        />
      </ThemeProvider>
    </div>
  );
}

export default HomePage;
