import { React, useState } from 'react';
import { Typography, TextField, IconButton, Stack, Tooltip } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MobileDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import format from 'date-fns/format'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import PropTypes from 'prop-types';
import PrimaryButton from '../utility/PrimaryButton';
import DivCenterContent from '../utility/DivCenterContent';

/**
 * Dynamically given fields for the number of availabilities required to be inputted
 * @param {*} availabilities - the input availabilities
 * @param {Function} setAvailabilities - the useState function to edit the availabilities
 */
const AvailabilityFields = ({ availabilities, setAvailabilities }) => {
  if (availabilities === undefined) {
    return null;
  }
  const [idCount, setIdCount] = useState(1);

  const handleAddAvailabilityField = () => {
    // const availabilityId = availabilities.length + 1;
    const newAvailabilities = [...availabilities];
    // newAvailabilities.push({ startDate: '', endDate: '' });
    newAvailabilities.push({ id: idCount, startDate: null, endDate: null });
    setAvailabilities(newAvailabilities);
    setIdCount(idCount + 1);
  }

  const addButtonStyle = {
    width: 'max-content'
  }

  return (
    <DivCenterContent>
      <PrimaryButton size='small' color='lightblue'
        onClick={ handleAddAvailabilityField }
        startIcon={<AddBoxIcon/>}
        sx={addButtonStyle}
      >
        <b>Add Availability</b>
      </PrimaryButton>
      {
      availabilities.map((availability, index) => {
        return (
          <div key={ availability.id }>
            <Typography variant='h6' component='div' color='text.heading2'>
              { `Availability ${index + 1}` }
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction='row' justifyContent="center" alignItems="center" spacing={2}>
                <MobileDatePicker
                  label='Start Date'
                  inputFormat='dd/MM/yyyy'
                  value={ availability.startDate }
                  onChange={ (value) => {
                    const newAvailabilities = [...availabilities];
                    newAvailabilities[index].startDate = value;
                    setAvailabilities(newAvailabilities);
                  }}
                  renderInput={(params) => <TextField required {...params} />}
                />
                <MobileDatePicker
                  label='End Date'
                  inputFormat='dd/MM/yyyy'
                  value={ availability.endDate }
                  onChange={ (value) => {
                    const newAvailabilities = [...availabilities];
                    newAvailabilities[index].endDate = value;
                    setAvailabilities(newAvailabilities);
                  }}
                  renderInput={(params) => <TextField required {...params} />}
                  shouldDisableDate={(day) => {
                    try {
                      // const dayString = format(day, 'yyyy-MM-dd');
                      if (format(day, 'yyyy-MM-dd') <= format(availabilities[index].startDate, 'yyyy-MM-dd')) {
                        return true;
                      } else {
                        return false;
                      }
                    } catch (err) {
                      return false;
                    }
                  }}
                />
                <Tooltip title='Remove Availability'>
                  <IconButton color='warning'
                    onClick={ () => { setAvailabilities(availabilities.filter((entry) => (entry.id !== availability.id))) }}
                  >
                    <HighlightOffIcon/>
                  </IconButton>
                </Tooltip>
              </Stack>
            </LocalizationProvider>
          </div>
        )
      })
    }
    </DivCenterContent>
  )
}

AvailabilityFields.propTypes = {
  availabilities: PropTypes.array.isRequired,
  setAvailabilities: PropTypes.func.isRequired,
}

export default AvailabilityFields;
