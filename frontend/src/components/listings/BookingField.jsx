import { React } from 'react';
import { TextField, Stack } from '@mui/material';
import MobileDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import format from 'date-fns/format'
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import PropTypes from 'prop-types';
// import DivCenterContent from '../utility/DivCenterContent';
import DivFormSection from '../utility/DivFormSection';

/**
 * Dynamically given fields for the number of availabilities required to be inputted
 * @param {Object} booking - the booking intput
 * @param {Function} setBooking - the useState function to edit the booking input
 * @param {Array} availabilities - the listing availabilities
 */
// const BookingField = ({ booking, setBooking, availabilities }) => {
const BookingField = ({ booking, setBooking, availabilities }) => {
  // const [booking, setBooking] = useState({ startDate: null, endDate: null });

  /**
   * Checks if a selected date falls in the listing's available range.
   * Also checks if the start and end dates both fall within the same availability range.
   * @param {*} day - a Date object day
   * @param {string} period - specify if the given day is the 'start' or 'end' date.
   * @returns true if the date is within an availability range, false otherwise
   */
  const checkAvailable = (day, period) => {
    try {
      const dayString = format(day, 'yyyy-MM-dd');
      for (const availability of availabilities) {
        if (availability.startDate <= dayString && availability.endDate >= dayString) {
          if (period === 'start' && (booking.endDate)) {
            const bookedEndDate = format(booking.endDate, 'yyyy-MM-dd');
            if (availability.startDate <= bookedEndDate && availability.endDate >= bookedEndDate) {
              return true;
            } else {
              return false;
            }
          } else if (period === 'end' && (booking.startDate)) {
            const bookedStartDate = format(booking.startDate, 'yyyy-MM-dd')
            if (availability.startDate <= bookedStartDate && availability.endDate >= bookedStartDate) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        }
      }
      return false;
    } catch (err) {
      return true;
    }
  }

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack direction='row' alignItems="center" flexWrap='wrap'>
          <DivFormSection>
            <MobileDatePicker
              label='Start Date'
              inputFormat='dd/MM/yyyy'
              value={ booking.startDate }
              onChange={ (value) => {
                const newBooking = { startDate: value, endDate: booking.endDate }
                setBooking(newBooking);
              }}
              renderInput={(params) => <TextField disabled required {...params} />}
              shouldDisableDate={(day) => {
                return (!checkAvailable(day, 'start'))
              }}
            />
          </DivFormSection>
          <DivFormSection>
            <MobileDatePicker
              label='End Date'
              inputFormat='dd/MM/yyyy'
              value={ booking.endDate }
              onChange={ (value) => {
                const newBooking = { startDate: booking.startDate, endDate: value }
                setBooking(newBooking);
              }}
              renderInput={(params) => <TextField disabled required {...params} />}
              shouldDisableDate={(day) => {
                try {
                  if (format(day, 'yyyy-MM-dd') <= format(booking.startDate, 'yyyy-MM-dd')) {
                    return true;
                  } else {
                    return (!checkAvailable(day, 'end'))
                  }
                } catch (err) {
                  return false;
                }
              }}
            />
          </DivFormSection>
        </Stack>
      </LocalizationProvider>
    </div>
  )
}

BookingField.propTypes = {
  availabilities: PropTypes.array.isRequired,
  booking: PropTypes.object.isRequired,
  setBooking: PropTypes.func.isRequired,
}

export default BookingField;
