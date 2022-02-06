import { React, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
// import Badge from '@mui/material/Badge';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
// import { IconButton } from '@mui/material';
import PrimaryButton from './utility/PrimaryButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import MailIcon from '@mui/icons-material/Mail';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import MoreIcon from '@mui/icons-material/MoreVert';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    // padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: 'max-content',
    [theme.breakpoints.up('sm')]: {
      width: '10ch',
      '&:focus': {
        width: '15ch',
      },
    },
  },
}));

const StyledSmallInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    // padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: 'max-content',
    [theme.breakpoints.up('sm')]: {
      width: '14ch',
      '&:focus': {
        width: '15ch',
      },
    },
  },
}));

const SearchBar = () => {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxBedrooms, setMaxBedrooms] = useState('');
  const [ratings, setRatings] = useState('desc');

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      history.push(`/search?query=${search}&minbedrooms=${minBedrooms}&maxbedrooms=${maxBedrooms}&minprice=${minPrice}&maxprice=${maxPrice}&rating=${ratings}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Search>
        <form onSubmit={handleSearch}>
          <StyledInputBase
            placeholder='Where?'
            onChange={(event) => setSearch(event.target.value)}
          />
          <StyledSmallInputBase
            placeholder='Min Bedrooms'
            type='number'
            onChange={(event) => setMinBedrooms(event.target.value)}
          />
          <StyledSmallInputBase
            placeholder='Max Bedrooms'
            type='number'
            onChange={(event) => setMaxBedrooms(event.target.value)}
          />
          <StyledSmallInputBase
            placeholder='Min Price'
            type='number'
            onChange={(event) => setMinPrice(event.target.value)}
          />
          <StyledSmallInputBase
            placeholder='Max Price'
            type='number'
            onChange={(event) => setMaxPrice(event.target.value)}
          />
          <Select
            value={ratings}
            label="Rating"
            onChange={(event) => setRatings(event.target.value)}
            color='grey'
          >
            <MenuItem value={'asc'}>Highest</MenuItem>
            <MenuItem value={'desc'}>Lowest</MenuItem>
          </Select>
          <PrimaryButton type='submit' size='small' color='lightblue'
            startIcon={<SearchIcon/>}
          >
            SEARCH
          </PrimaryButton>
        </form>
      </Search>
    </>
  )
}

export default SearchBar;
