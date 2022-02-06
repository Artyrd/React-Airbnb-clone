import { React } from 'react';
// import { React, useState } from 'react';
import { IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
// import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const ErrorSnackBar = ({ errorMessage, open, setOpen }) => {
  // const [open, setOpen] = useState(false);
  return (
    <div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000} onClose={() => setOpen(false)}
        sx={{ width: '100%' }}>
        <Alert action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          variant='filled' severity='warning'>
          { errorMessage }
        </Alert>
      </Snackbar>
    </div>
  );
}

ErrorSnackBar.propTypes = {
  errorMessage: PropTypes.string,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
}

export default ErrorSnackBar;
