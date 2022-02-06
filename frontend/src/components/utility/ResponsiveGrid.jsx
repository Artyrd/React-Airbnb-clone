import { React } from 'react';
// import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

// const Item = styled(Paper)(({ theme }) => ({
//   ...theme.typography.body2,
//   padding: theme.spacing(2),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

const ResponsiveGrid = (props) => {
  return (
    <Box sx={{ flexGrow: 1, margin: '10px 5px' }}>
      <Grid container spacing={0} columns={{ xs: 1, sm: 2, md: 4 }} {...props}>
          { props.items }
      </Grid>
    </Box>
  );
}

ResponsiveGrid.propTypes = {
  items: PropTypes.array.isRequired
}

export default ResponsiveGrid
