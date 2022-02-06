import { React } from 'react';
import { CardMedia } from '@mui/material';
import { styled } from '@mui/system';

const StyledCardMedia = styled(CardMedia)({
  width: '200px',
  maxHeight: '200px',
  maxWidth: '200px',
  // boxShadow: 3,
  // margin: '5px 0px'
})

/**
 * A styled mui CardMedia, with component="img"
 * @param {*} props.image: the img source
 */
const CardThumbnail = (props) => {
  return (
    <StyledCardMedia
      component="img"
      sx={{ boxShadow: 4 }}
      { ...props }
    />
  );
}

export default CardThumbnail;
