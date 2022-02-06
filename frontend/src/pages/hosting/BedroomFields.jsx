import { React } from 'react';
import { Typography } from '@mui/material';
import WideTextField from '../../components/utility/WideTextField';

/**
 * Dynamically given fields for the number of bedrooms required to be inputted
 * @param {*} input - the input object for adding a general listing
 * @param {*} setInput - the setInput useState function to edit the input
 */
const BedroomFields = ({ input, setInput }) => {
  if (input.metadata.bedrooms === undefined) {
    return null;
  }
  return (
    input.metadata.bedrooms.map((bedroomObj, index) => {
      return (
      <div key={ index }>
        <Typography variant='h6' component='div' color='text.heading2'>
          { `Bedroom ${index + 1}` }
        </Typography>
        <WideTextField
          className={ `bedroom-field-a-${index + 1}` }
          required
          label='Number of bed space'
          type='number'
          fullWidth={ false }
          value={ bedroomObj.numBeds }
          onChange={ (e) => {
            const newBedrooms = input.metadata.bedrooms;
            newBedrooms[index].numBeds = e.target.value;
            setInput({ ...input, metadata: { ...input.metadata, bedrooms: newBedrooms } })
          }}
        />
        <WideTextField
          required
          className={ `bedroom-field-b-${index + 1}` }
          label='Description of bed space (e.g: 1 double bed, 2 queen beds, 1 floor mattress)'
          type='text'
          value={ bedroomObj.description }
          onChange={ (e) => {
            const newBedrooms = input.metadata.bedrooms;
            newBedrooms[index].description = e.target.value;
            setInput({ ...input, metadata: { ...input.metadata, bedrooms: newBedrooms } })
          }}
        />
      </div>
      )
    })
  )
}

export default BedroomFields;
