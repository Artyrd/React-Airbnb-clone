import { React, useEffect, useState } from 'react';
import { Button, Chip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { styled } from '@mui/system';
// import ThemeColour from '../../ThemeColour';
// import { ThemeProvider } from '@mui/material/styles';
// import { FormControl, InputLabel, Typography } from '@mui/material';
// import WideTextField from '../../components/utility/WideTextField';

const AmenitiesDisplay = ({ input, setInput }) => {
  // // Handle adding hosting tags
  // function handleAddTag(tag) {
  //   var tempTagList = tags;
  //   tempTagList.push(tag);
  //   setTags(tempTagList);
  //   // Add the tag as a string to send to backend
  //   tempTagList = tagString;
  //   tempTagList.push(tag.text);
  //   setTagString(tempTagList);
  // }
  // Handle removing hosting tags

  const amenities = input.metadata.amenities;
  if (amenities === undefined) {
    return null;
  }

  const DeletableButton = styled(Button)(({ theme }) => ({
    margin: '2px',
    '&:hover': {
      color: theme.palette.warning.contrastText,
      borderColor: theme.palette.warning.contrastText,
      backgroundColor: theme.palette.warning.main,
    }
  }))

  const StyledChip = styled(Chip)(({ theme }) => ({
    margin: '2px',
    color: theme.palette.darkblue.main,
  }))

  const handleDeleteTag = (category, index) => {
    if (!setInput) {
      return;
    }
    const tagList = amenities[category];
    tagList.splice(index, 1);
    if (tagList.length > 0) {
      setInput({ ...input, metadata: { ...input.metadata, amenities: { ...amenities, [category]: tagList } } })
    } else {
      const newAmenities = amenities;
      delete newAmenities[category];
      setInput({ ...input, metadata: { ...input.metadata, amenities: { ...newAmenities } } })
    }
    // tagList = tempTagList.filter(item => item !== tags[i]);
  }

  const [result, setResult] = useState([]);
  useEffect(() => {
    const newResult = [];
    // console.log(input.metadata.amenities)
    for (const category in amenities) {
      // console.log(category);
      newResult.push(
        <div key={ category }>
          <Typography variant='h6' component='div' color='text.heading2'>
            { category }
          </Typography>
          { amenities[category].map((amenity, index) => (
            (!setInput)
              ? <StyledChip key={ index } label={amenity} variant="outlined" />
              : <DeletableButton key={ index } variant="outlined" onClick={ () => handleDeleteTag(category, index) }>{ amenity }</DeletableButton>
          ))}
        </div>
      )
    }
    setResult(newResult);
  }, [input.metadata.amenities])

  return (
    <div>
      { result }
    </div>
  )
}

AmenitiesDisplay.propTypes = {
  input: PropTypes.any,
  setInput: PropTypes.func
}

export default AmenitiesDisplay;
