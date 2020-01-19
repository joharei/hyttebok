import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useTripText } from '../../firebase/useTripText';
import { Paragraph } from './Paragraph';

export const TripPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { tripText, loading, error } = useTripText(slug);

  if (loading) {
    return <CircularProgress />;
  }
  if (error || !tripText) {
    return <p>Error</p>;
  }

  return (
    <Grid container>
      <Grid md={12} lg={8} xl={6} item>
        <ReactMarkdown source={tripText} renderers={{ paragraph: Paragraph }} />
      </Grid>
    </Grid>
  );
};
