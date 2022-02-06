import { BACKEND_PORT as backendPort } from '../../config.json'
import { React, useState, useEffect } from 'react';
import { Button, CardContent, MenuItem, InputLabel, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import PropertyTypes from './PropertyTypes';
import AmenityCategories from './AmenityCategories';
import Alerts from '../../components/utility/Alerts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ThemeColour from '../../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import WideTextField from '../../components/utility/WideTextField';
import FormCard from '../../components/utility/FormCard';
import BedroomFields from './BedroomFields';
import AmenitiesDisplay from './AmenitiesDisplay';
import { fileToDataUrl } from '../../helper/helpers';
import HorizontalScrollList from '../../components/utility/HorizontalScrollList';
import CardThumbnail from '../../components/utility/CardThumbnail';
import SecondaryButton from '../../components/utility/SecondaryButton';
import DivFormSection from '../../components/utility/DivFormSection';

const AddHostingPage = () => {
  // Load page theme
  const theme = ThemeColour();
  const propertyTypeOptions = PropertyTypes();
  const amenityCategories = AmenityCategories();
  // const [images, setImages] = useState([]);

  // const reader = new FileReader();

  const uploadImages = async (e) => {
    try {
      const files = e.target.files;
      if (!files) {
        return;
      }
      const dataImages = []
      // files.forEach(file => {
      for (let i = 0; i < files.length; i++) {
        dataImages.push(await fileToDataUrl(files[i]));
      }
      setInput({ ...input, metadata: { ...input.metadata, images: dataImages } })
    } catch (err) {
      // console.log(err);
      setErrorMsg(err.toString());
      setFail(true);
    }
  }

  const uploadThumbnail = async (e) => {
    try {
      const files = e.target.files;
      if (!files) {
        return;
      }
      const dataImage = await fileToDataUrl(files[0])
      setInput({ ...input, thumbnail: dataImage })
    } catch (err) {
      // console.log(err);
      setErrorMsg(err.toString());
      setFail(true);
    }
  }

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
  })

  const [numBedrooms, setNumBedrooms] = useState(0);

  const [selectedAmenityCat, setSelectedAmenityCat] = useState('');
  const [amenityInput, setAmenityInput] = useState('');

  useEffect(() => {
    console.log(input)
  }, [input])

  // Alert handlers
  const [openSuccess, setSuccess] = useState(false);
  const [openFail, setFail] = useState(false);
  const [errorMsg, setErrorMsg] = useState(`Could not add Hosting ${input.title}`)

  // Backend call to add a hosting of the provided information to the database
  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log(event);
    console.log('submiting!')
    if (event.key === 'Enter') {
      console.log('wha');
      return;
    }
    const response = await fetch(`http://localhost:${backendPort}/listings/new`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        title: input.title,
        address: input.address,
        price: input.price,
        thumbnail: input.thumbnail,
        metadata: input.metadata,
      })
    })
    const data = await response.json();
    console.log(data);
    // Alert
    if (response.status === 200) {
      setSuccess(true);
    } else {
      setErrorMsg(data.error)
      setFail(true);
    }
  }

  // Handle input information changes to the input object with the key, and one additional nested object key if needed.
  const handleChange = (key, key2) => (event) => {
    if (key && !key2) {
      setInput({ ...input, [key]: event.target.value })
    } else if (key && key2) {
      setInput({ ...input, [key]: { ...input[key], [key2]: event.target.value } })
    }
  }

  const addAmenity = () => {
    const amenities = input.metadata.amenities;
    if (selectedAmenityCat === '' || amenityInput === '') {
      return;
    }
    if (!amenities[selectedAmenityCat]) {
      amenities[selectedAmenityCat] = []
    }
    setInput({ ...input, metadata: { ...input.metadata, amenities: { ...amenities, [selectedAmenityCat]: [...amenities[selectedAmenityCat], amenityInput.toUpperCase()] } } })
    setAmenityInput('');
  }

  // dynamically show the bedrooms information fields based on how many bedrooms the listing has
  useEffect(() => {
    let bedrooms = input.metadata.bedrooms;
    // if user added more bedrooms, add more objects to the array
    if (numBedrooms > 0 && numBedrooms > bedrooms.length) {
      for (let roomNum = 0; roomNum < numBedrooms; roomNum++) {
        if (roomNum >= bedrooms.length) {
          bedrooms.push({ id: roomNum + 1, numBeds: '0', description: '' });
        }
      }
    // if user specified less bedrooms, trim existing array
    } else if (numBedrooms >= 0 && numBedrooms < bedrooms.length) {
      // cant use splice, because it modifies array in place and doesnt trigger re-render
      bedrooms = bedrooms.filter((bedroomObj) => (bedroomObj.id <= numBedrooms))
    }
    setInput({ ...input, metadata: { ...input.metadata, bedrooms: bedrooms } })
  }, [numBedrooms])

  return (
    <div>
      <Header />
      <ThemeProvider theme={theme}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 50 }}>
          <FormCard>
            <CardContent>
              <Typography variant='h3' component='div' color='text.heading'>
                Add a New Hosting
              </Typography>
              {/* <form name={ 'HostingInfoForm' }> */}
              <form name={ 'HostingInfoForm' } onSubmit={ handleSubmit }>
                <Typography variant='h5' component='div' color='text.heading2'>
                  Title
                </Typography>
                <WideTextField
                  autoFocus
                  required
                  label='Title'
                  type='text'
                  value={ input.title }
                  onChange={ handleChange('title') }
                />
                <Typography variant='h5' component='div' color='text.heading2'>
                  Price
                </Typography>
                <WideTextField
                  required
                  label='Price ($) per night'
                  type='number'
                  value={ input.price }
                  onChange={ handleChange('price') }
                  inputProps={{
                    step: '0.01',
                  }}
                />
                <Typography variant='h5' component='div' color='text.heading2'>
                  Address
                </Typography>
                <WideTextField
                  required
                  label='Address Number'
                  type='text'
                  value={ input.address.number }
                  fullWidth={ false }
                  onChange={ handleChange('address', 'number') }
                />
                <WideTextField
                  // required
                  label='Unit Number (blank for Houses)'
                  type='text'
                  value={ input.address.unit}
                  fullWidth={ false }
                  onChange={handleChange('address', 'unit')}
                />
                <WideTextField
                  required
                  label='Street'
                  type='text'
                  value={ input.address.street}
                  onChange={ handleChange('address', 'street') }
                />
                <WideTextField
                  required
                  label='City'
                  type='text'
                  value={ input.address.city}
                  onChange={ handleChange('address', 'city') }
                />
                <WideTextField
                  required
                  label='State'
                  type='text'
                  value={ input.address.state}
                  onChange={ handleChange('address', 'state') }
                />
                <WideTextField
                  required
                  label='Postcode'
                  type='text'
                  value={ input.address.postcode}
                  onChange={ handleChange('address', 'postcode') }
                />
                <WideTextField
                  required
                  label='Country'
                  type='text'
                  value={ input.address.country}
                  onChange={ handleChange('address', 'country') }
                />
                {/* <div style={{ paddingTop: 10, paddingBottom: 5 }}> */}
                <Typography variant='h5' component='div' color='text.heading2'>
                 Hosting Information
                </Typography>
                <WideTextField
                  select
                  label={ 'Select a Property Type' }
                  value={input.metadata.propertyType}
                  onChange={ handleChange('metadata', 'propertyType') }
                  defaultValue={{ value: 'none', label: 'Select a Property Type' }}
                  sx={{ backgroundColor: '#fff' }}
                >
                  {propertyTypeOptions.map((type, index) => (
                    <MenuItem key={ index } value={ type.value }>{ type.label }</MenuItem>
                  ))}
                </WideTextField>
                <WideTextField
                  required
                  label='Number of Bathrooms'
                  type='number'
                  value={ input.metadata.numBaths }
                  fullWidth={ false }
                  onChange={handleChange('metadata', 'numBaths')}
                />
                <WideTextField
                  required
                  label='Number of Bedrooms'
                  type='number'
                  fullWidth={ false }
                  value={ numBedrooms }
                  onChange={ (e) => { setNumBedrooms(e.target.value) }}
                />
                <BedroomFields input={ input } setInput = { setInput } />
                <Typography variant='h5' component='div'>
                  Description
                </Typography>
                <WideTextField
                  required
                  label='Hosting Description'
                  multiline
                  rows={3}
                  type='text'
                  value={ input.metadata.description }
                  onChange={handleChange('metadata', 'description')}
                />
                <div>
                  <Typography variant='h5' component='div'>
                    Amenities
                  </Typography>
                  <WideTextField
                    select
                    label={ 'Amenity Category' }
                    value={ selectedAmenityCat }
                    onChange={ (e) => { setSelectedAmenityCat(e.target.value) }}
                    sx={{ backgroundColor: '#fff' }}
                  >
                    {amenityCategories.map((category, index) => (
                      <MenuItem key={ index } value={ category }>{ category }</MenuItem>
                    ))}
                  </WideTextField>
                  <span>
                    <WideTextField
                      label='Amenity'
                      type='text'
                      value={ amenityInput }
                      onChange={ (e) => {
                        setAmenityInput(e.target.value)
                      }}
                      onKeyPress={ (e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.stopPropagation();
                          console.log('a');
                          addAmenity();
                        }
                      }}
                    />
                    <InputLabel>
                      <IconButton onClick={ addAmenity }><AddCircleIcon color='primaryButton' fontSize='medium'/></IconButton>
                      { 'Add Amenity' }
                    </InputLabel>
                  </span>
                  <AmenitiesDisplay input={ input } setInput={ setInput }/>
                </div>
                <br />
                <div>
                  <Button required type='button' variant="contained" component="label">
                    Upload Thumbnail
                    <input type="file" hidden onChange={ uploadThumbnail }/>
                  </Button>
                  { input.thumbnail === ''
                    ? null
                    : (
                      <CardThumbnail
                        image={ input.thumbnail }
                      />
                      )
                  }
                </div>
                <br />
                <DivFormSection>
                  <Button type='button' variant="contained" component="label">
                    { input.metadata.images.length === 0 ? 'Upload Images' : 'Change Images' }
                    <input type="file" multiple hidden onChange={ uploadImages }/>
                  </Button>
                  <HorizontalScrollList>
                  { input.metadata.images.map((imgurl, index) => (
                    <div key={ index }>
                      <CardThumbnail image={ imgurl } />
                    </div>
                  ))}
                  </HorizontalScrollList>
                </DivFormSection>
                <div>
                  {/* <Button type='submit' color='yellow' fullWidth variant='contained'> */}
                  {/* <SecondaryButton fullWidth onClick={ handleSubmit }> */}
                  {/* <input hidden type='submit'></input> */}
                  <SecondaryButton fullWidth type='submit'>
                    <b>Add new hosting!</b>
                  </SecondaryButton>
                </div>
              </form>
            </CardContent>
          </FormCard>
        </div>
        <Footer />
        <Alerts
          openSuccess={openSuccess}
          openFail={openFail}
          setSuccess={setSuccess}
          setFail={setFail}
          textSuccess={'Successfully added Hosting ' + input.title + '!'}
          textFail={errorMsg}
        />
      </ThemeProvider>
    </div>
  );
}

export default AddHostingPage;
