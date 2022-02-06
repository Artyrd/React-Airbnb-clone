import { React } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import ThemeColour from '../../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';

const theme = ThemeColour();

const StyledButton = styled(Button)({
  color: theme.palette.secondaryButton.contrastText,
  margin: '4px',
})

const SecondaryButton = (props) => {
  return (
  <ThemeProvider theme={theme}>
    <StyledButton
      variant='contained'
      color='secondaryButton'
      { ...props }
    />
  </ThemeProvider>
  );
}

export default SecondaryButton;
