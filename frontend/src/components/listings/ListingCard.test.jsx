import { React } from 'react'
import { shallow } from 'enzyme'
import ListingCard from './ListingCard'
import { CardContent, Rating } from '@mui/material'

describe('ListingCard', () => {
  it('displays the title', () => {
    const pic = 'shrekthumbnailexample_url'
    const wrapper = shallow(<ListingCard thumbnail={ pic } title='shrek' price='99.99' reviews={ [] }/>);
    expect(wrapper.find(CardContent).text()).toContain('shrek');
  });
  it('displays the price', () => {
    const pic = 'shrekthumbnailexample_url'
    const wrapper = shallow(<ListingCard thumbnail={ pic } title='shrek' price='99.99' reviews={ [] }/>);
    expect(wrapper.find(CardContent).text()).toContain('99.99');
  });
  it('displays the 5 stars', () => {
    const pic = 'shrekthumbnailexample_url'
    const wrapper = shallow(<ListingCard thumbnail={ pic } title='shrek' price='99.99' reviews={ [{ rating: 5, content: 'this is great' }] }/>);
    expect(wrapper.find(Rating)).toHaveLength(1);
  });
  it('displays the option buttons if editable', () => {
    const pic = 'shrekthumbnailexample_url'
    const wrapper = shallow(<ListingCard thumbnail={ pic } title='shrek' price='99.99' reviews={ [{ rating: 5, content: 'this is great' }]} editable/>);
    expect(wrapper.find('button')).toHaveLength(5);
  });
})
