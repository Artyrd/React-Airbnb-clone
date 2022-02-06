import { React } from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';

const CustomTextField = styled(TextField)({
  backgroundColor: '#fff'
})

const customTextFieldProps = ({
  // autoFocus: true,
  variant: 'outlined',
  margin: 'normal',
  // required: true,
  fullWidth: true,
})

const WideTextField = (props) => {
  return (
    <CustomTextField
      { ...customTextFieldProps }
      { ...props }
    />
  );
}

export default WideTextField;
