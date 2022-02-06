import { React } from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/system';
import ThemeColour from '../../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';

const theme = ThemeColour();

const StyledFormCard = styled(Card)({
  color: theme.palette.lightBackground.contrastText,
  backgroundColor: theme.palette.lightBackground.main,
  width: '100%',
  maxWidth: 'min(800px, 80vw)'
})

const FormCard = (props) => {
  return (
  <ThemeProvider theme={theme}>
    <StyledFormCard
      { ...props }
    />
  </ThemeProvider>
  );
}

export default FormCard;
