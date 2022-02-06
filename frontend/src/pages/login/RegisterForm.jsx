import { BACKEND_PORT as backendPort } from '../../config.json'
import { React, useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
import { CardContent, Button } from '@mui/material';
import { styled } from '@mui/system';

import ThemeColour from '../../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';
import { StoreContext } from '../../utils/store';
import ErrorSnackBar from '../../components/utility/ErrorSnackBar';
import WideTextField from '../../components/utility/WideTextField';

import PropTypes from 'prop-types';
import FormCard from '../../components/utility/FormCard';

/**
 * A simple styled div to show error messages separate from snackbar popups.
 */
const RedMsgDiv = styled('div')({
  color: 'red',
  marginBottom: '0.5em'
})

/**
 * A Form used to register to AirBrb.
 * It handles the POST fetch as well as setting the token and email.
 * @param {*} setModalOpen - gets set to {false} when register is successful
 */
const RegisterForm = ({ setModalOpen }) => {
  const theme = ThemeColour();

  const [input, setInput] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  // const [confirmPass, setConfirm] = useState('');
  const [passwordMatch, setMatch] = useState(false);
  const [errorMessage, setErrorMessage] = useState('error');
  const [errorOpen, setErrorOpen] = useState(false);

  const context = useContext(StoreContext);
  const [token, setToken] = context.token;
  const setEmail = context.email[1];

  useEffect(() => {
    if (input.password === '' && input.passwordConfirm === '') {
      setMatch(true);
    } else if (input.password !== input.passwordConfirm) {
      setMatch(false);
    } else {
      setMatch(true);
    }
  }, [input])

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:${backendPort}/user/auth/register`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
          name: input.name,
        })
      })
      const data = await response.json();
      if (response.status === 200) {
        setModalOpen(false);
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', input.email);
        setToken(data.token)
        setEmail(input.email)
      } else if (response.status === 400) {
        setErrorMessage(data.error);
        setErrorOpen(true);
      }
    } catch (err) {
      setErrorMessage('Something went wrong while trying to contact the server')
      setErrorOpen(true);
    }
  }

  const handleChange = name => event => {
    setInput({ ...input, [name]: event.target.value })
  }

  return (
    <div>
      <ThemeProvider theme={theme}>
        <FormCard>
          <CardContent>
            <h1>Register for a New Account</h1>
            <form onSubmit = {handleSubmit}>
                <WideTextField
                  label="Name"
                  type="text"
                  autoFocus
                  required
                  onChange={handleChange('name')}
                />
              <WideTextField
                label="Email"
                type="text"
                required
                onChange={handleChange('email')}
              />
              <div>
                <WideTextField
                  label="Password"
                  type="password"
                  required
                  onChange={handleChange('password')}
                />
                <WideTextField
                  label="Confirm Password"
                  type="password"
                  required
                  onChange={handleChange('passwordConfirm')}
                />
              </div>
              { !passwordMatch
                ? (<RedMsgDiv>{ 'Passwords don\'t match!' }</RedMsgDiv>)
                : null}
              <Button type = 'submit' color='secondaryButton' fullWidth variant='contained' disabled={!passwordMatch}>
                Register
              </Button>
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

RegisterForm.propTypes = {
  setModalOpen: PropTypes.func.isRequired
}

export default RegisterForm;
