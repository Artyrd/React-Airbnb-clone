import { React } from 'react';
import { styled } from '@mui/system';

const StyledDiv = styled('div')({
  // display: 'flex',
  // flexDirection: 'column',
  marginTop: '5px',
  marginBottom: '10px',
})

const DivFormSection = (props) => {
  return (
    <StyledDiv
      { ...props }
    />
  );
}

export default DivFormSection;
