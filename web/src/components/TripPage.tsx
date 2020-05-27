import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTripText } from '../firebase/useTripText';
import { Markdown } from './Markdown';

export const TripPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { tripText, loading, error } = useTripText(slug);

  if (error) {
    return <p>Error</p>;
  }

  return <Markdown tripText={tripText ?? undefined} loading={loading} />;
};
