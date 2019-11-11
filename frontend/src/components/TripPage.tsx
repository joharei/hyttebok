import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { GET_TRIP_PAGE } from '../apollo/TripPageQuery';
import { useQuery } from '@apollo/react-hooks';
import {
  GetTripPage,
  GetTripPageVariables,
} from '../generated/apollo/GetTripPage';
import { useParams } from 'react-router-dom';

export const TripPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data, loading, error } = useQuery<GetTripPage, GetTripPageVariables>(
    GET_TRIP_PAGE,
    { variables: { slug } }
  );

  if (loading) {
    return <CircularProgress />;
  }
  if (error || !data) {
    return <p>Error</p>;
  }

  return (
    <Grid container>
      <Grid md={12} lg={8} xl={6} item>
        <ReactMarkdown
          source={data.trip.text.replace(
            /MEDIA_URL/g,
            'hyttebok.photos.reitan.app/'
          )}
        />
      </Grid>
    </Grid>
  );
};
