import { React } from 'react';
import { shallow } from 'enzyme';
import BedroomFields from './BedroomFields';
import WideTextField from '../../components/utility/WideTextField';

const input = {
  title: '',
  address: {
    number: '',
    unit: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
  },
  price: '0',
  thumbnail: '',
  metadata: {
    propertyType: '',
    numBaths: '0',
    bedrooms: [
      { numBeds: '1', description: 'test-bedroom-1' },
      { numBeds: '2', description: 'test-bedroom-2' }
    ],
    amenities: {},
    description: '',
    images: [],
  },
}

describe('BedroomFields', () => {
  it('displays the corrct number of Bedroom Fields', () => {
    const wrapper = shallow(<BedroomFields input={ input } setInput={ () => {} }/>);
    expect(wrapper.find(WideTextField)).toHaveLength(4);
  });

  it('displays the incremented number of Bedroom Fields, when more are added', () => {
    const inputMore = input;
    inputMore.metadata.bedrooms.push({ numBeds: '2', description: 'test-bedroom-3' })
    const wrapper = shallow(<BedroomFields input={ inputMore } setInput={ () => {} }/>);
    expect(wrapper.find(WideTextField)).toHaveLength(6);
  });

  it('displays the correct input', () => {
    const wrapper = shallow(<BedroomFields input={ input } setInput={ () => {} }/>);
    expect(wrapper.find('.bedroom-field-b-1').text()).toBe('test-bedroom-1')
  });

  it('changes input when typed into', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<BedroomFields input={ input } setInput={ onClick }/>);
    wrapper.find('.bedroom-field-b-1').simulate('change', { target: { value: 'a' } });
    // wrapper.find('.bedroom-field-b-1').simulate('change', { target: { value: 'a' } });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
})
