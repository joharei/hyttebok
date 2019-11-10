import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { RouteComponentProps } from 'react-router';
import { GET_TRIP_PAGE, TripPageQuery } from '../apollo/TripPageQuery';

export default function(props: RouteComponentProps<{ slug: string }>) {
  const { match } = props;

  return (
    <TripPageQuery query={GET_TRIP_PAGE} variables={{ slug: match.params.slug }}>
      {({ data: { trip } = { trip: null }, loading, error }) => {
        if (loading) {
          return <CircularProgress/>;
        }
        if (error) {
          return <p>Error</p>;
        }
        return (
          <Grid container={true}>
            <Grid md={12} lg={8} xl={6} item={true}>
              <ReactMarkdown
                source={trip ? trip.text.replace(/MEDIA_URL/g, 'hyttebok.photos.reitan.app/') : 'Nothing here'}/>
            </Grid>
          </Grid>
        );
      }}
    </TripPageQuery>
  );
}