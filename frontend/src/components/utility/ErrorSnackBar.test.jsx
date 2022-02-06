import { React } from 'react'
import { shallow } from 'enzyme'
import { Alert } from '@mui/material';
import ErrorSnackBar from './ErrorSnackBar'

describe('ErrorSnackBar', () => {
  it('displays an Alert', () => {
    const wrapper = shallow(<ErrorSnackBar errorMessage={ 'error' } open={ true } setOpen={ () => {} }/>);
    expect(wrapper.find(Alert)).toHaveLength(1);
  });

  it('displays an the error message', () => {
    const wrapper = shallow(<ErrorSnackBar errorMessage={ 'test-error-message-test' } open={ true } setOpen={ () => {} }/>);
    expect(wrapper.find(Alert).text()).toContain('test-error-message-test')
  });

  it('doesnt display an Alert without open=true', () => {
    const wrapper = shallow(<ErrorSnackBar errorMessage={ 'error' } open={ false } setOpen={ () => {} }/>);
    expect(wrapper.find(Alert).text()).not.toContain('test-error-message-test')
  });
})
