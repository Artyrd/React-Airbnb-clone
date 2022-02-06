import { React } from 'react'
import { styled } from '@mui/system';
import PropTypes from 'prop-types';

const StyledDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  overflowX: 'scroll',
  width: '100%',
  marginTop: '4px',
  marginBottom: '4px',
}))

const InnerStrip = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: 'max-content',
  '& > *': {
    marginRight: '5px'
  }
}))

const HorizontalScrollList = ({ children, sx }) => {
  return (
    <StyledDiv style={ sx }>
      <InnerStrip>
        { children }
      </InnerStrip>
    </StyledDiv>
  )
}

HorizontalScrollList.propTypes = {
  children: PropTypes.any,
  sx: PropTypes.any,
}

export default HorizontalScrollList;
