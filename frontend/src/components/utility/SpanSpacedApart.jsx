import { React } from 'react';
import { styled } from '@mui/system';

const StyledSpan = styled('span')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
})

const SpanSpacedApart = (props) => {
  return (
    <StyledSpan
      { ...props }
    />
  );
}

export default SpanSpacedApart;
