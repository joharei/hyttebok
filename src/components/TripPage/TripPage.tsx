import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useTripText } from '../../firebase/useTripText';
import { Paragraph } from './Paragraph';
import { Grid, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const TripPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { tripText, loading, error } = useTripText(slug);

  if (loading) {
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h1">
            <Skeleton width={300} />
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="body1" style={{ marginBottom: 32 }}>
            <Skeleton width="50%" />
          </Typography>
        </Grid>

        <Grid item container spacing={2} style={{ marginBottom: 32 }}>
          <Grid item xs={4}>
            <Skeleton variant="rect" height={300} />
          </Grid>
          <Grid item xs={4}>
            <Skeleton variant="rect" height={300} />
          </Grid>
          <Grid item xs={4}>
            <Skeleton variant="rect" height={300} />
          </Grid>
        </Grid>

        {[...Array(5)].map((_, i) => (
          <Grid item key={i}>
            <Typography variant="body1">
              <Skeleton width={`${randomIntFromInterval(20, 100)}%`} />
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  }
  if (error || !tripText) {
    return <p>Error</p>;
  }

  return <ReactMarkdown source={tripText} renderers={{ paragraph: Paragraph }} />;
};
