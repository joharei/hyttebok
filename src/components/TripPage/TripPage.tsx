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

  return <ReactMarkdown source={tripText} renderers={{ paragraph: Paragraph }} />;
};
