import { React } from 'react'
import { styled } from '@mui/system';
import PropTypes from 'prop-types';

const StyledDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  width: '100%',
  height: '100%',
  marginTop: '4px',
  marginBottom: '4px',
}))

const InnerStrip = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  // height: '100%',
  '& > *': {
    marginBottom: '5px',
    height: 'max-content'
  }
}))

const VerticalScrollList = ({ children, sx }) => {
  return (
    <StyledDiv style={ sx }>
      <InnerStrip>
        { children }
      </InnerStrip>
    </StyledDiv>
  )
}

VerticalScrollList.propTypes = {
  children: PropTypes.any,
  sx: PropTypes.any,
}

export default VerticalScrollList;
