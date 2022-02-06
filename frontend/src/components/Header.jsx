import { React, useContext } from 'react';

import { Link } from 'react-router-dom';

import { IconButton, AppBar, Toolbar } from '@mui/material';
import { ThemeProvider, } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import { StoreContext } from '../utils/store';

import LoginRegisterModal from '../pages/login/LoginRegisterModal';
import LogoutModal from '../pages/login/LogoutModal';
import PropTypes from 'prop-types';

import ThemeColour from '../ThemeColour';
import airbrbLogo from '../images/airbrb.png'

import SearchBar from './SearchBar';
import DivCenterContent from './utility/DivCenterContent';

const Header = (props) => {
  const theme = ThemeColour();
  const hideLoginButton = props.hideLogin;

  const context = useContext(StoreContext);
  const token = context.token[0];

  const headerStyle = {
    flexGrow: 1,
    height: 'maxContent',
    padding: '5px',
  }

  return (
      <ThemeProvider theme={theme} >
        {/* <Box sx={ headerStyle }> */}
          <AppBar sx={ headerStyle } color='darkblue' position='static'>
          {/* <AppBar color='darkblue' position='static' className={classes.customizeAppBar}> */}
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex' }}>
                <Link to='/'>
                  <img src={ airbrbLogo } style={{ pointerEvents: 'all', height: 'min(50px, 10vw)' }}/>
                </Link>
              </div>
              <div>
              </div>
              <div style={{ display: 'flex' }}>
                { !hideLoginButton && token === null
                  // ? { profile() }
                  ? <LoginRegisterModal />
                  : ''
                }
                { token !== null
                  ? <div>
                      <Link to='/listings' >
                        <IconButton><PublicIcon color='icon' fontSize='large'/></IconButton>
                      </Link>
                      <Link to='/hostings' >
                        <IconButton><HomeIcon color='icon' fontSize='large'/></IconButton>
                      </Link>
                    </div>
                  : ''
                }
                <LogoutModal />
              </div>
            </Toolbar>
            <DivCenterContent>
              <SearchBar />
            </DivCenterContent>
          </AppBar>
      {/* </Box> */}
    </ThemeProvider>
  )
}

Header.propTypes = {
  hideLogin: PropTypes.bool
}

export default Header;
