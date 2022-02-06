import { React, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, CardActionArea, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TodayIcon from '@mui/icons-material/Today';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/system';
import SpanSpacedApart from '../utility/SpanSpacedApart';
import { useHistory } from 'react-router-dom';
import CardThumbnail from '../utility/CardThumbnail';
import PrimaryButton from '../utility/PrimaryButton';
import SecondaryButton from '../utility/SecondaryButton';
import PublishModal from '../hostings/PublishModal';
import UnPublishModal from '../hostings/UnPublishModal';
import Alerts from '../utility/Alerts';
import { averageListingRating } from '../../helper/helpers';

const ListingCard = (props) => {
  // const theme = ThemeColour();
  const history = useHistory()

  const totalBeds = (bedRooms) => {
    let sum = 0;
    for (const bedRoom of bedRooms) {
      const numBeds = parseInt(bedRoom.numBeds);
      if (!isNaN(numBeds)) {
        sum += numBeds;
      }
    }
    return sum;
  }

  const [published, setPublished] = useState(props.published)
  const [openSuccess, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (successMsg !== '') {
      setSuccess(true);
    }
    if (published) {
      setSuccessMsg('Successfully Published Hosting!')
    } else {
      setSuccessMsg('Successfully Unpublished Hosting!')
    }
  }, [published])

  const CardContainer = styled(Card)(({ theme }) => ({
    display: 'flex',
    margin: '10px',
    flexGrow: 1,
    minWidth: '350px',
    minHeight: '200px',
    maxWidth: (props.editable ? '100%' : '700px'),
    width: (props.editable ? '100%' : '450px'),
  }))
  const sxCardContainer = {
    boxShadow: 5,
  }

  const ButtonsHolder = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: 'max-content'
  }))

  const mainCardArea = {
    display: 'flex',
    flexDirection: 'row',
    minWidth: '350px',
    minHeight: '200px',
  }

  return (
    <CardContainer sx={ sxCardContainer }>
      { props.editable
        ? <Alerts
            openSuccess={openSuccess}
            setSuccess={setSuccess}
            textSuccess={successMsg}
          />
        : null
      }
      <CardActionArea onClick={ () => {
        history.push(`/listings/${props.id}`)
      }}>
        <Box sx={ mainCardArea }>
          <CardThumbnail
            image={ props.thumbnail }
            alt={ props.title }
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" color="text.heading">
                { props.title }
              </Typography>
              { !props.propertyType
                ? null
                : <Typography variant="body2" color="text.secondary">
                    { `Property Type: ${props.propertyType}` }
                  </Typography>
              }
              { !props.bedrooms
                ? null
                : <Typography variant="body2" color="text.secondary">
                    { `${totalBeds(props.bedrooms)} guests, ${props.numBaths} bath` }
                  </Typography>
              }
              <Typography variant="h5" component="div" color="text.heading">
                {`$${parseFloat(props.price)}`}
              </Typography>
              {/* <span> */}
              <Stack direction='row'>
                <Rating name="overall-rating"
                  size='small'
                  precision={0.5}
                  value={averageListingRating(props.reviews)}
                  readOnly
                  sx={{ mr: '5px' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {` (${props.reviews.length} reviews)`}
                </Typography>
              </Stack>
              {/* </span> */}
            </CardContent>
          </Box>
        </Box>
      </CardActionArea>
      { props.editable
        ? <SpanSpacedApart sx={{ flexDirection: 'column' }}>
            <ButtonsHolder>
              { published
                ? <UnPublishModal id={ props.id } title={ props.title } setPublished={ setPublished }/>
                : <PublishModal id={ props.id } title={ props.title } setPublished={ setPublished }/>
              }
              <SecondaryButton variant="contained" size='small'
                startIcon={<EditIcon />}
                onClick={ () => {
                  history.push(`/hostings/edit/${props.id}`)
                }}
              >
                Edit
              </SecondaryButton>
              <SecondaryButton variant="contained" size='small'
                startIcon={<TodayIcon />}
                onClick={ () => {
                  history.push(`/hostings/bookings/${props.id}`)
                }}
              >
                REQS
              </SecondaryButton>
            </ButtonsHolder>
            <PrimaryButton
              color='warning'
              size='small'
              startIcon={<DeleteForeverIcon />}
              onClick={ props.onDelete }
            >
              Delete
            </PrimaryButton>
          </SpanSpacedApart>
        : null
      }
    </CardContainer>
  )
}

ListingCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  reviews: PropTypes.array.isRequired,
  price: PropTypes.string.isRequired,
  // meta data
  propertyType: PropTypes.string,
  bedrooms: PropTypes.array,
  numBaths: PropTypes.string,
  // other props
  editable: PropTypes.bool,
  published: PropTypes.bool,
  onDelete: PropTypes.func
}

export default ListingCard;
