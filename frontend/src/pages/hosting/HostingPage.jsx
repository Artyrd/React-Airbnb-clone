import { BACKEND_PORT as backendPort } from '../../config.json'
import { React, useEffect, useState, useContext } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import { StoreContext } from '../../utils/store';
import { useHistory } from 'react-router-dom';

import ErrorSnackBar from '../../components/utility/ErrorSnackBar';
import ListingCard from '../../components/listings/ListingCard';
import AddBoxIcon from '@mui/icons-material/AddBox';

import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../ThemeColour';
import PrimaryButton from '../../components/utility/PrimaryButton';
import SecondaryButton from '../../components/utility/SecondaryButton';
import SpanSpacedApart from '../../components/utility/SpanSpacedApart';
import DivCenterContent from '../../components/utility/DivCenterContent';
import DivPageContent from '../../components/utility/DivPageContent';
import { Box, Modal, Typography } from '@mui/material';
import FormCard from '../../components/utility/FormCard';
import DeleteForever from '@mui/icons-material/DeleteForever';

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

const HostingPage = () => {
  const theme = ThemeColour();
  const context = useContext(StoreContext);
  const history = useHistory();
  const email = context.email[0];
  const token = context.token[0];

  const [hostingsList, setHostingsList] = useState([]);

  const [errorMessage, setErrorMsg] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteHosting, setDeleteHosting] = useState({})

  useEffect(() => {
    console.log('Your Listings')
    console.log(token);
    console.log(email);
    fetchHostings();
  }, [token, email])

  useEffect(() => {
    console.log('hostingsList')
    console.log(hostingsList)
  }, [hostingsList])

  const handleDelete = async (hostingId) => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/listings/${hostingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const data = await response.json();
      if (response.status === 200) {
        const newHostings = hostingsList.filter((hosting) => (hosting.id !== hostingId))
        setHostingsList(newHostings);
      } else {
        throw Error(data.error);
      }
    } catch (err) {
      setErrorMsg(err.toString());
      setErrorOpen(true);
    }
  }

  const fetchHostings = async () => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/listings`, {
        method: 'GET',
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.error)
      }
      const allListings = data.listings;
      const hostings = allListings.filter((listing) => listing.owner === email);
      console.log('hostings:')
      console.log(hostings);
      const promiseList = [];
      for (const hosting of hostings) {
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
      const hostingsDetails = await Promise.all(promiseList);
      /*
      hostingsDetails.push(
        {
          title: 'Oceanside Villa',
          owner: 'alina@unsw.edu.au',
          address: {
            number: '1',
            unit: null,
            street: 'Kensington Street',
            city: 'Kensington',
            state: 'NSW',
            postcode: '2032',
            country: 'Australia',
          },
          price: 349.99,
          thumbnail: 'https://a0.muscache.com/im/pictures/7b00a7d1-31eb-4878-9ccf-18d4fc993d2a.jpg?im_w=1200',
          // thumbnail: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
          metadata: {
            propertyType: 'house',
            numBaths: 2,
            bedRooms: [
              { numBeds: 2, description: 'double bed' },
              { numBeds: 4, description: '2 floor mattress, 1 sofa bed' },
              { numBeds: 2, description: 'queen bed' },
            ],
            amenities: {
              bathroom: ['Bathtub', 'Hair dryer', 'Cleaning products', 'Bidet'],
              bedroom: ['Bed Linen', 'Black-out blinds', 'Extra Pillows', 'Extra Blankets'],
              laundry: ['Washing Machine', 'Dryer'],
              entertainment: ['60" TV', 'Netflix', 'Chromecast', 'Prenium Cable'],
              heating: ['Central Heating'],
              cooling: ['Central A/C'],
              homeSafety: ['Smoke alarm', 'Carbon monoxide alarm', 'Fire extinguisher', 'First aid kit'],
              internet: ['Ethernet', 'Wi-Fi'],
              office: ['Dedicated workspace'],
              kitchen: ['Refrigerator', 'Microwave', 'Pots and pans', 'Dishes and cutlery', 'Bowls, chopsticks, plates, cups, etc...', 'Freezer', 'Stove', 'Kettle', 'Rice Cooker'],
              dining: ['Dining Table'],
              location: ['Private Entrace', 'Laundromat nearby'],
              outdoor: ['Private backyard', 'BBQ Grill'],
              parking: ['1 Garage space'],
              services: ['Luggage drop-off allowed', 'Self check-in', 'Smart lock', 'Cleaning before checkout'],
            },
            description:
              'The house is located within 5minutes walk from Kyoto station, also walking distance to the shopping mall and many sightseeing spots.\nVery spacious and relaxing house at very convenient location!\nCozy and relaxing for a group of family or friends and you get to spend some time on Japanese room called Tatami!',
            images: [
              'https://a0.muscache.com/im/pictures/ac29ec4e-998f-431f-9498-3020b0103ba2.jpg?im_w=720', 'https://a0.muscache.com/im/pictures/cdf13609-3c45-4683-9b6e-9f0b8b907927.jpg?im_w=720', 'https://a0.muscache.com/im/pictures/ca7104b5-0f9b-46f5-b212-cbfd481dde64.jpg?im_w=720'
            ]
          },
          reviews: [
            {
              dateRange: {
                start: '2020-11-11T14:45:21.077Z',
                end: '2020-11-20T14:45:21.077Z'

              },
              rating: 5,
              content: 'Please take the chance to stay here. The place is beautiful and the gardens are amazing. Will definitely come back next time we are in the area.'
            },
            {
              dateRange: {
                start: '2020-11-21T14:45:21.077Z',
                end: '2020-11-24T14:45:21.077Z'

              },
              rating: 4,
              content: 'Excellent home with great history. Eric was a fantastic host. Property is short walking distance to the train station so made travel around Kyoto easy.'
            },
          ],
          availability: [
            { start: '2020-10-31', end: '2020-11-08' },
            { start: '2020-11-20', end: '2020-12-24' },
            { start: '2021-01-11', end: '2021-12-31' },
          ],
          published: true,
          postedOn: '2020-10-31T14:45:21.077Z'
        }
      )
      */
      console.log('hostings deets')
      console.log(hostingsDetails)
      setHostingsList(hostingsDetails);
    } catch (err) {
      setErrorMsg(err.toString());
      setErrorOpen(true);
    }
  }

  const LoggedOutPage = () => {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <Header/>
          <DivPageContent>
            <Typography variant="h2" component="div" color="text.heading">
              Your Hostings
            </Typography>
            <br/>
            <Typography variant="h3" component="div" color="text.heading">
              Please Login to continue
            </Typography>
          </DivPageContent>
          <Footer/>
        </ThemeProvider>
      </div>
    )
  }

  const LoggedInPage = () => {
    return (
    <div>
      <ThemeProvider theme={theme}>
        <Header/>
        <DivPageContent>
          <Modal
            open={deleteConfirmation}
            onClose={() => setDeleteConfirmation(false)}
            aria-labelledby="modal-Delete-Hosting"
            aria-describedby="modal-Confirm-Delete-Hosting"
          >
          <Box sx={modalStyle}>
            <FormCard sx={modalContentStyle}>
              <Typography id="modal-Delete-Hosting" variant="h5" component="h2">
                <b>{`Deleting Hosting:\n${deleteHosting.title}`}</b>
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Are you sure?
              </Typography>
              <br />
              <PrimaryButton size='large' fullWidth color='warning'
                onClick={ () => handleDelete(deleteHosting.id) }
                startIcon={<DeleteForever/>}
              >
                DELETE
              </PrimaryButton>
              <SecondaryButton variant='contained' fullWidth size='large' color='secondaryButton' onClick={() => setDeleteConfirmation(false)}>
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
          <SpanSpacedApart>
            <Typography variant="h2" component="div" color="text.heading">
              Your Hostings
            </Typography>
            <DivCenterContent>
              <PrimaryButton size='small' color='lightblue'
                onClick={ () => history.push('/hostings/add') }
                startIcon={<AddBoxIcon/>}
              >
                  <b>Add new Hosting</b>
              </PrimaryButton>
            </DivCenterContent>
          </SpanSpacedApart>
          {
            hostingsList.map((hosting, index) => {
              console.log('hosting')
              console.log(hosting)
              return (
                <ListingCard
                  key={ index }
                  id={ hosting.id }
                  title={ hosting.title }
                  propertyType={ hosting.metadata.propertyType }
                  bedrooms={ hosting.metadata.bedrooms }
                  numBaths={ hosting.metadata.numBaths }
                  thumbnail= {hosting.thumbnail}
                  // rating={ averageRatings(hosting.reviews) }
                  // numReviews={ hosting.reviews.length }
                  reviews={ hosting.reviews }
                  price={ hosting.price }
                  published={ hosting.published }
                  editable
                  onDelete={() => {
                    setDeleteConfirmation(true);
                    setDeleteHosting({ id: hosting.id, title: hosting.title })
                  }}
                />
              )
            })
          }
          <h1 style={{ marginTop: '50px', fontFamily: 'Trebuchet MS' }}>Recommended</h1>
        </DivPageContent>
        <Footer />
        <ErrorSnackBar
          errorMessage={ errorMessage }
          open={ errorOpen }
          setOpen={ setErrorOpen }
        />
      </ThemeProvider>
    </div>
    )
  }

  return (
    <div>
    { (token)
      ? <LoggedInPage/>
      : <LoggedOutPage/>
    }
    </div>
  )
}

export default HostingPage;
