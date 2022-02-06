import { React } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import ThemeColour from '../../ThemeColour';
import { ThemeProvider } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primaryButton.contrastText,
  margin: '4px',
}))

/**
 * A styled mui Button to be the 'Primary Button' theme colour
 */
const PrimaryButton = (props) => {
  const theme = ThemeColour();
  return (
    <ThemeProvider theme={theme}>
      <StyledButton
        variant='contained'
        color='primaryButton'
        { ...props }
      />
    </ThemeProvider>
  );
}

export default PrimaryButton;
