import React from 'react';
import { IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

import PropTypes from 'prop-types';

const Alerts = ({ openSuccess, openFail, setSuccess, setFail, textSuccess, textFail }) => {
  return (
    <div>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert action={
            <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setSuccess(false);
            }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          variant="filled" severity="success" sx={{ width: '100%' }}>
          {textSuccess}
        </Alert>
      </Snackbar>
      <Snackbar open={openFail} autoHideDuration={6000} onClose={() => setFail(false)}>
        <Alert action={
            <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setFail(false);
            }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          variant="filled" severity="error" sx={{ width: '100%' }}>
          {textFail}
        </Alert>
      </Snackbar>
    </div>
  )
}

Alerts.propTypes = {
  openSuccess: PropTypes.bool,
  openFail: PropTypes.bool,
  setSuccess: PropTypes.func,
  setFail: PropTypes.func,
  textSuccess: PropTypes.string,
  textFail: PropTypes.string,
}

export default Alerts;
