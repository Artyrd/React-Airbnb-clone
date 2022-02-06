import { BACKEND_PORT as backendPort } from '../config.json'
import { React, useMemo, useState, useEffect, useContext } from 'react';
import { Typography } from '@mui/material';
import { ThemeProvider } from '@mui/system';
import Footer from '../components/Footer';
import ErrorSnackBar from '../components/utility/ErrorSnackBar';
import ListingCard from '../components/listings/ListingCard';
import { StoreContext } from '../utils/store';
import Header from '../components/Header';
import DivPageContent from '../components/utility/DivPageContent'
import ThemeColour from '../ThemeColour';
import ResponsiveGrid from '../components/utility/ResponsiveGrid';
import DivFormSection from '../components/utility/DivFormSection';
import { useLocation } from 'react-router-dom';
import { averageListingRating } from '../helper/helpers';

const SearchPage = () => {
  const theme = ThemeColour();
  const context = useContext(StoreContext);
  const [token] = context.token;
  const [email] = context.email;

  const [errorMessage, setErrorMsg] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  // const [params, setParams] = useState({})
  // const searchParams = useQuery();

  useEffect(() => {
    console.log(listings);
  }, [listings])

  function useQuery () {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  const query = useQuery();
  console.log(query);
  console.log(query.toString());
  // const price = (query.get('price'))
  const { pathName } = useLocation();

  useEffect(() => {
    console.log('hello world')
    console.log(query.get('query'))
    console.log(query.get('bedrooms'))
    console.log(query.get('price'))
    fetchListings();
  }, [pathName, query])

  /**
   * Fetches the searched listings.
   * Converts the entire listing objects to JSONs and searching within that.
   * Prodces a better search than just comparing title, city, etc...
   */
  const fetchListings = async () => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/listings`, {
        method: 'GET',
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.error)
      }
      let allListings = data.listings;
      const promiseList = [];
      for (const hosting of allListings) {
        promiseList.push(
          fetch(`http://localhost:${backendPort}/listings/${hosting.id}`, {
            method: 'GET',
          })
            .then((response) => {
              return response.json();
            })
            .then((responseJSON) => {
              console.log('res JSON')
              console.log(responseJSON);
              if (responseJSON.listing) {
                return responseJSON.listing;
              } else {
                throw Error(responseJSON.error)
              }
            })
            .then((listing) => {
              const listingInfo = { ...listing, id: hosting.id }
              return listingInfo;
            })
            .catch((err) => {
              throw Error(`Error fetching details of ${hosting.id}: ` + err)
            })
        )
      }
      allListings = await Promise.all(promiseList);
      const searchQuery = query.get('query').toUpperCase()
      const searchQueries = searchQuery.split(' ');
      allListings.sort((a, b) => (a.title.toUpperCase().localeCompare(b.title.toUpperCase())));
      // filter search query
      const listingJSONs = allListings.map((listing) => JSON.stringify(listing));
      const searchedListings = listingJSONs.filter((listingJSON) => listingJSON.toUpperCase().includes(...searchQueries));
      let result = searchedListings.map((listingJSON) => JSON.parse(listingJSON));
      // filter search bedrooms
      const minBed = query.get('minbedrooms')
      if (minBed) {
        result = result.filter((listing) => (listing.metadata.bedrooms.length >= parseInt(minBed)));
      }
      const maxBed = query.get('maxbedrooms')
      if (maxBed) {
        result = result.filter((listing) => (listing.metadata.bedrooms.length <= parseInt(maxBed)));
      }

      const minPrice = query.get('minprice')
      if (minPrice) {
        result = result.filter((listing) => (parseFloat(listing.price) >= parseFloat(minPrice)));
      }
      const maxPrice = query.get('maxprice')
      if (maxPrice) {
        result = result.filter((listing) => (parseFloat(listing.price) <= parseFloat(maxPrice)));
      }
      if (query.get('ratings') === 'desc') {
        result.sort((a, b) => (averageListingRating(b.reviews) - averageListingRating(a.reviews)));
      } else {
        result.sort((a, b) => (averageListingRating(a.reviews) - averageListingRating(b.reviews)));
      }
      setListings(result);
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
            {'Searched Listings'}
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

export default SearchPage;
