import { BACKEND_PORT as backendPort } from '../../config.json'
import { React, useEffect, useState, useContext } from 'react';
import { StoreContext } from '../../utils/store';
import { Card, CardContent, Typography } from '@mui/material';
// import { Card, Chip, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import PropTypes from 'prop-types';
// import { styled } from '@mui/system';
import DivFormSection from '../utility/DivFormSection';
import WideTextField from '../utility/WideTextField';
import PrimaryButton from '../utility/PrimaryButton';
import Alerts from '../utility/Alerts';
import VerticalScrollList from '../utility/VerticalScrollList';
// import SpanSpacedApart from '../utility/SpanSpacedApart';

const ReviewsDisplay = (props) => {
  const context = useContext(StoreContext);
  const [token] = context.token;
  const [email] = context.email;

  const [reviews, setReviews] = useState([{ rating: 0, content: 'No reviews yet' }]);
  const [avgRating, setAvgRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [submittedReviews, setSubmittedReviews] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [bookingId, setBookingId] = useState('');

  const [openSuccess, setSuccess] = useState(false);
  const [openFail, setFail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')

  // Get the Reviews for the Listing
  useEffect(() => {
    if (props.id) {
      fetchListingReviews();
    }
  }, [submittedReviews])

  // Check if User has/had a booking, and is able to leave a review
  useEffect(() => {
    if (token && email && props.id) {
      fetchUserBookings();
    }
  }, [props.newBookings])

  useEffect(() => {
    if (reviews.length > 0) {
      const average = reviews.reduce(function (sum, review) {
        return sum + review.rating;
      }, 0) / reviews.length;
      setAvgRating(average);
    }
  }, [reviews])

  const fetchListingReviews = async () => {
    try {
      if (!props.id) {
        throw Error('Error fetching Reviews: Listing ID not valid');
      }
      const response = await fetch(`http://localhost:${backendPort}/listings/${props.id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      })
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error;
      }
      const listing = data.listing;
      if (listing.reviews.length > 0) {
        setReviews(listing.reviews);
        setNumReviews(listing.reviews.length);
      }
    } catch (err) {
      console.log(err)
      setErrorMsg(err.toString());
      setFail(true);
    }
  }

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`http://localhost:${backendPort}/bookings`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw Error(data.error)
      }
      const allBookings = data.bookings;
      const userBookings = [...allBookings.filter((booking) => (
        (booking.listingId === props.id) && (booking.owner === email) && (booking.status === 'accepted')
      ))];
      if (userBookings.length > 0) {
        userBookings.sort((a, b) => (a.dateRange.startDate - b.dateRange.startDate));
        setBookingId(userBookings[0].id)
      }
    } catch (err) {
      console.log(err)
      setErrorMsg(err.toString());
      setFail(true);
    }
  }

  const submitReview = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`http://localhost:${backendPort}/listings/${props.id}/review/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          review: {
            rating: userRating,
            content: userReview,
          }
        })
      })
      const data = await response.json();
      console.log(data);
      // Alert
      if (response.status === 200) {
        setUserRating(0);
        setUserReview('')
        setSuccess(true);
        setSubmittedReviews(submittedReviews + 1);
      } else {
        throw Error(data.error)
      }
    } catch (err) {
      setErrorMsg(err.toString())
      setFail(true);
    }
  }

  const stylesReviewsList = {
    maxHeight: '400px',
  }

  return (
    <div>
      <Card>
        <CardContent>
          {/* <SpanSpacedApart> */}
          <div>
            <Typography variant='h4'>
              Reviews
            </Typography>
            <div>
            <Rating name="overall-rating" size='Large' precision={0.5} value={avgRating} readOnly />
            <Typography variant='body2' color='text.secondary'>
              { `${numReviews} reviews` }
            </Typography>
            </div>
          </div>
          {/* </SpanSpacedApart> */}
          <VerticalScrollList sx={ stylesReviewsList }>
          { reviews.map((review, index) => (
            <DivFormSection key={ index }>
              <Card>
                <CardContent>
                  <div>
                    <Rating name="rating" size='small' value={parseInt(review.rating)} readOnly />
                  </div>
                  <Typography variant='body' component='div' sx={{ mt: 1, mb: 2 }}>
                    { review.content }
                  </Typography>
                </CardContent>
              </Card>
            </DivFormSection>
          ))}
          </VerticalScrollList>
        </CardContent>
      </Card>
      <br/>
      { !bookingId
        ? null
        : (
          <Card>
            <CardContent>
              <DivFormSection>
                <Typography variant='h5' component='div'>
                  Post a Review
                </Typography>
                <form onSubmit={submitReview}>
                  <div>
                    <Rating
                      name="your-rating"
                      required
                      value={userRating}
                      onChange={(event, newValue) => {
                        setUserRating(newValue);
                      }}
                      size='medium'
                    />
                  </div>
                  <WideTextField
                    label='How was your experience?'
                    required
                    multiline
                    rows={3}
                    type='text'
                    value={ userReview }
                    onChange={(event) => {
                      setUserReview(event.target.value)
                    }}
                  />
                  <PrimaryButton type='submit' size='large' fullWidth>
                    Submit Review!
                  </PrimaryButton>
                </form>
              </DivFormSection>
            </CardContent>
          </Card>
          )
      }
      <Alerts
        openSuccess={openSuccess}
        openFail={openFail}
        setSuccess={setSuccess}
        setFail={setFail}
        textSuccess={'Submitted Review!'}
        textFail={errorMsg}
      />
    </div>
  )
}

ReviewsDisplay.propTypes = {
  id: PropTypes.string.isRequired,
  // reviews: PropTypes.array,
  newBookings: PropTypes.number
}

export default ReviewsDisplay;
