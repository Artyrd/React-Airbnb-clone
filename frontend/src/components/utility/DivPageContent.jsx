import { React } from 'react';
import { styled } from '@mui/system';

const StyledDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  // justifyContent: 'center'
  minHeight: 'calc(100vh - 150px)',
  margin: '10px',
})

const DivPageContent = (props) => {
  return (
    <StyledDiv
      { ...props }
    />
  );
}

export default DivPageContent;
