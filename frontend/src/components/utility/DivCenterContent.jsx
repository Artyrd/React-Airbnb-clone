import { React } from 'react';
import { styled } from '@mui/system';

const StyledDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  // justifyContent: 'center',
  alignItems: 'center',
})

const DivCenterContent = (props) => {
  return (
    <StyledDiv
      { ...props }
    />
  );
}

export default DivCenterContent;
