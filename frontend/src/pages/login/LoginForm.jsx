import { React, useState, useContext } from 'react';
import { BACKEND_PORT as backendPort } from '../../config.json'
import { CardContent } from '@mui/material';
import { StoreContext } from '../../utils/store';
import ErrorSnackBar from '../../components/utility/ErrorSnackBar';

import { ThemeProvider } from '@mui/material/styles';
import ThemeColour from '../../ThemeColour';

import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import WideTextField from '../../components/utility/WideTextField';
import FormCard from '../../components/utility/FormCard';
import PrimaryButton from '../../components/utility/PrimaryButton';

/**
 * A Form used to login to AirBrb.
 * It handles the POST fetch as well as setting the login token and email.
 * @param {*} setModalOpen - gets set to {false} when login is successful
 */
const LoginForm = ({ setModalOpen }) => {
  const theme = ThemeColour();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const context = useContext(StoreContext);
  const setEmail = context.email[1];
  const [token, setToken] = context.token;

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`http://localhost:${backendPort}/user/auth/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
        })
      })
      const data = await response.json();
      if (response.status === 200) {
        setModalOpen(false);
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', emailInput);
        setToken(data.token);
        setEmail(emailInput);
      } else {
        setErrorMessage(data.error)
        setErrorOpen(true);
      }
    } catch (err) {
      setErrorMessage('Something went wrong while trying to contact the server')
      setErrorOpen(true);
    }
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormCard>
          <CardContent>
            <h1>Login to AirBrb</h1>
            <form onSubmit = {handleSubmit }>
              <WideTextField
                label='Email'
                type='text'
                autoFocus
                required
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <WideTextField
                label='Password'
                type='password'
                required
                autoComplete='current-password'
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              <PrimaryButton type='submit' fullWidth>
                Login
              </PrimaryButton>
            </form>
            <ErrorSnackBar
              errorMessage={ errorMessage }
              open={ errorOpen }
              setOpen={ setErrorOpen }
            />
          </CardContent>
        </FormCard>
      </ThemeProvider>
      { (token !== null) ? <Redirect to='/' /> : null }
    </div>
  );
}

LoginForm.propTypes = {
  setModalOpen: PropTypes.func.isRequired
}

export default LoginForm;
