import { React } from 'react';

// import { Link } from 'react-router-dom';

import { Box, AppBar, Toolbar } from '@mui/material';
import { ThemeProvider, } from '@mui/material/styles';

import ThemeColour from '../ThemeColour';

const Footer = () => {
  const theme = ThemeColour();

  const footerStyle = {
    flexGrow: 1,
    height: 'maxContent'
  }

  return (
    <div>
      <Box sx={ footerStyle }>
        <ThemeProvider theme={theme} >
          <AppBar color='darkblue' position='static'>
          {/* <AppBar color='darkblue' position='static' className={classes.customizeAppBar}> */}
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
              <div>about</div>
              <div>help</div>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      </Box>
    </div>
  )
}

export default Footer;
