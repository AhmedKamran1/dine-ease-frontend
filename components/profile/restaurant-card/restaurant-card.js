import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';

// Services
import { getUserRestaurants } from '@/services';

// Styles
import * as Styles from './restaurant-card.styles';
import { Card, CardMedia, Chip, Grid } from '@mui/material';
import { FlexContainer, PrimaryButton, Text } from '@/components/UI';

// Icons
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocationIcon from '@mui/icons-material/LocationOn';

// Helpers
import { getError } from '@/helpers/snackbarHelpers';
import { getFileUrl } from '@/helpers/fileHelpers';

// Utils
import { Status } from '@/utils/constants';

const RestaurantCard = () => {
  const [restaurants, setRestaurants] = useState([]);

  const fetchUserRestaurants = async () => {
    try {
      const response = await getUserRestaurants();
      setRestaurants(response.data);
    } catch (e) {
      enqueueSnackbar({ variant: 'error', message: getError(e) });
    }
  };

  useEffect(() => {
    fetchUserRestaurants();
  }, []);

  const statusColors = {
    [Status.APPROVED]: 'success',
    [Status.PENDING]: 'info',
    [Status.REJECTED]: 'error',
  };

  if (restaurants.length === 0) {
    return (
      <FlexContainer mt={10} gap={2} textAlign="center">
        <RestaurantMenuIcon fontSize="large" color="primary" />
        <Text variant="subHeader">Currently No Restaurants</Text>
      </FlexContainer>
    );
  }

  return (
    <Grid container justifyContent="center" spacing={2}>
      {restaurants.map((restaurant, index) => (
        <Grid item xs={12} md={12} key={index}>
          <Card
            sx={{
              height: '180px',
              display: 'flex',
            }}
          >
            <CardMedia sx={{ height: '100%', width: '40%', position: 'relative' }}>
              <Image
                src={
                  (restaurant.cover &&
                    getFileUrl(
                      process.env.AWS_S3_RESTAURANT_BUCKET,
                      `${restaurant.id}/cover/${restaurant.cover}`
                    )) ||
                  '/assets/images/bg-placeholder.png'
                }
                alt="menu-item"
                sizes="100vw"
                fill
                style={{ objectFit: 'cover' }}
              />
            </CardMedia>
            <Styles.CardContentContainer>
              <Chip
                label={restaurant.status}
                color={statusColors[restaurant.status]}
                variant="outlined"
                sx={{ position: 'absolute', top: 5, right: 5 }}
              />
              {restaurant.featured && (
                <Chip
                  label={restaurant.featured && 'Featured'}
                  color="secondary"
                  variant="outlined"
                  sx={{ position: 'absolute', top: 40, right: 5 }}
                />
              )}
              <Text variant="main" color="text.secondary" fontWeight={800}>
                {restaurant.name}
              </Text>
              <Styles.IconContainer>
                <RestaurantMenuIcon color="primary" />
                <Text variant="sub" color="text.secondary">
                  {restaurant.cuisine.join(' / ')}
                </Text>
              </Styles.IconContainer>
              <Styles.IconContainer>
                <LocationIcon color="primary" />
                <Text variant="sub" color="text.secondary">
                  {restaurant.address}
                </Text>
              </Styles.IconContainer>
              <FlexContainer sx={{ position: 'absolute', right: 15, bottom: 10, gap: 1 }}>
                <Link href={`/restaurant/${restaurant.slug}`}>
                  <PrimaryButton>
                    <Text variant="sub" fontWeight={800}>
                      View
                    </Text>
                  </PrimaryButton>
                </Link>
                <Link href={`/restaurant/dashboard/${restaurant.slug}/overview`}>
                  <PrimaryButton>
                    <Text variant="sub" fontWeight={800}>
                      Dashboard
                    </Text>
                  </PrimaryButton>
                </Link>
              </FlexContainer>
            </Styles.CardContentContainer>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RestaurantCard;
