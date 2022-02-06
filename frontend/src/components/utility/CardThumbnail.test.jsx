import { React } from 'react'
import { shallow } from 'enzyme'
import CardThumbnail from './CardThumbnail'

describe('Card Thumbnail', () => {
  it('displays a Thumbnail', () => {
    const pic = 'shrekthumbnailexample_url'
    const wrapper = shallow(<CardThumbnail image={ pic } />);
    expect(wrapper.find('image')).toHaveLength(1);
  });

  // it('displays an the error message', () => {
  //   const wrapper = shallow(<ErrorSnackBar errorMessage={ 'test-error-message-test' } open={ true } setOpen={ () => {} }/>);
  //   expect(wrapper.find(Alert).text()).toContain('test-error-message-test')
  // });

  // it('doesnt display an Alert without open=true', () => {
  //   const wrapper = shallow(<ErrorSnackBar errorMessage={ 'error' } open={ false } setOpen={ () => {} }/>);
  //   expect(wrapper.find(Alert).text()).not.toContain('test-error-message-test')
  // });
})
