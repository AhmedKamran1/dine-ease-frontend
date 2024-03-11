import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { selectUserState } from '@/store/user/userSlice';

// Styles
import * as Styles from './review.styles';
import { FlexContainer, Text } from '../UI';
import {
  Box,
  Avatar,
  ImageList,
  ImageListItem,
  Pagination,
  Rating,
  useMediaQuery,
  Tooltip,
  IconButton,
} from '@mui/material';

// Icons
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import ReviewIcon from '@mui/icons-material/Reviews';

// Helpers
import { getError } from '@/helpers/snackbarHelpers';
import { getDate, getTimePassed } from '@/helpers/dateHelpers';

// Snackbar
import { enqueueSnackbar } from 'notistack';

// Services
import { getRestaurantReview, getUserReview } from '@/services/review';

// Components
import VoteOptions from './vote-options/vote';
import DeleteModal from '../modal/delete-modal/delete-modal';
import ReviewUpdateModal from './update-modal/update-modal';

import userImage from '@/public/assets/images/avatar.jpg';

const Review = ({ restaurantDetails = null, profileDetails = null }) => {
  const user = useSelector(selectUserState);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const reviewLimit = useRef(10);
  const offset = (page - 1) * 10;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const reviewDetails = useRef(null);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const name = profileDetails && `${profileDetails.firstName} ${profileDetails.lastName}`;

  const images = [userImage, userImage, userImage];

  const fetchRestaurantReviews = async () => {
    try {
      const response = await getRestaurantReview(
        restaurantDetails.id,
        reviewLimit.current,
        offset
      );
      setReviews(response.data.reviews);
      if (!totalPage) setTotalPage(Math.ceil(response.data.count / reviewLimit.current));
    } catch (e) {
      enqueueSnackbar({ variant: 'error', message: getError(e) });
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await getUserReview(profileDetails.id);
      setReviews(response.data);
      if (!totalPage) setTotalPage(Math.ceil(response.data.length / reviewLimit.current));
    } catch (e) {
      enqueueSnackbar({ variant: 'error', message: getError(e) });
    }
  };

  useEffect(() => {
    if (restaurantDetails?.id) fetchRestaurantReviews();
  }, [restaurantDetails?.id, page]);

  useEffect(() => {
    if (profileDetails?.id) fetchUserReviews();
  }, [profileDetails?.id]);

  const pageHandler = (event, newPage) => {
    setPage(newPage);
  };

  const handleReviewDelete = async () => {
    setReviews((prevState) =>
      prevState.filter((review) => review.id !== reviewDetails.current.id)
    );
    setShowDeleteModal(false);
  };

  const handleReviewUpdate = async (review) => {
    const updatedReviews = [...reviews];
    const updateIndex = updatedReviews.findIndex(
      (review) => review.id === reviewDetails.current.id
    );
    updatedReviews[updateIndex] = { ...updatedReviews[updateIndex], ...review };
    setReviews(updatedReviews);
    setShowUpdateModal(false);
  };

  const renderImages = () => {
    const imageCount = Math.min(images.length, 3);
    const layout = [
      { rows: 2, cols: images.length === 1 ? 2 : 1 },
      { rows: images.length === 2 ? 2 : 1, cols: 1 },
      {
        rows: 1,
        cols: 1,
        overlayText: images.length - 3,
        overlay: images.length === 3 ? false : true,
      },
    ];

    return layout.slice(0, imageCount).map((layout, index) => (
      <ImageListItem key={index} rows={layout.rows} cols={layout.cols}>
        <Image
          src={images[index]}
          alt="review-image"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        {layout.overlay && (
          <Styles.ImageCountOverlay>
            <Text variant="main" color="text.primary">
              +{layout.overlayText}
            </Text>
          </Styles.ImageCountOverlay>
        )}
      </ImageListItem>
    ));
  };

  if (!reviews.length) {
    return (
      <FlexContainer mt={10} gap={2}>
        <ReviewIcon fontSize="large" color="primary" />
        <Text variant="subHeader">Currently No Reviews</Text>
      </FlexContainer>
    );
  }

  return (
    <React.Fragment>
      {showDeleteModal && (
        <DeleteModal
          showModal={showDeleteModal}
          handleCloseModal={() => setShowDeleteModal(false)}
          deleteHandler={handleReviewDelete}
        />
      )}
      {showUpdateModal && (
        <ReviewUpdateModal
          showModal={showUpdateModal}
          handleCloseModal={() => setShowUpdateModal(false)}
          updateHandler={handleReviewUpdate}
          review={reviewDetails.current}
        />
      )}
      {reviews
        .slice(
          profileDetails ? (page - 1) * reviewLimit.current : 0,
          profileDetails ? page * reviewLimit.current : reviews.length
        )
        .map((review) => (
          <Styles.ReviewCard key={review.slug}>
            <Styles.UserDetails>
              <Avatar sx={{ width: 72, height: 72 }}>
                {review.userId.name?.slice(0, 1) || name?.slice(0, 1)}
              </Avatar>
              <Box>
                <Text variant="main" fontWeight={500} sx={{ display: 'block' }}>
                  {review.userId.name || name}
                </Text>
                <Rating
                  value={review.rating}
                  precision={0.5}
                  readOnly
                  sx={{ mt: 0.25 }}
                />
                <Text variant="sub" sx={{ display: 'block' }}>
                  {getDate(review.createdAt)}, {getTimePassed(review.createdAt)}
                </Text>
              </Box>
              {user.id === (review.userId.id || review.userId) && (
                <Styles.ReviewOptions>
                  <Tooltip title="Update Review" placement="top" arrow>
                    <IconButton
                      onClick={() => {
                        setShowUpdateModal(true);
                        reviewDetails.current = review;
                      }}
                      color="primary"
                    >
                      <Edit fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Review" placement="top" arrow>
                    <IconButton
                      onClick={() => {
                        setShowDeleteModal(true);
                        reviewDetails.current = review;
                      }}
                      color="primary"
                    >
                      <Delete fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                  </Tooltip>
                </Styles.ReviewOptions>
              )}
            </Styles.UserDetails>
            <Text variant="body" sx={{ display: 'block', mt: 2 }}>
              {review.content}
            </Text>
            <Box sx={{ width: '100%', mt: 3 }}>
              <ImageList rowHeight={isMobile ? 150 : 200} cols={2} variant="quilted">
                {renderImages()}
              </ImageList>
            </Box>
            {user.id && <VoteOptions votes={review.votes} />}
          </Styles.ReviewCard>
        ))}
      <FlexContainer>
        <Pagination
          color="primary"
          count={totalPage}
          variant="outlined"
          shape="rounded"
          sx={{
            mt: 3,
            mb: 3,
            '& .MuiPaginationItem-root:not(.Mui-selected)': {
              color: 'text.secondary',
            },
          }}
          page={page}
          onChange={pageHandler}
        />
      </FlexContainer>
    </React.Fragment>
  );
};

export default Review;
