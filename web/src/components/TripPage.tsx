import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useTripText } from '../firebase/useTripText';
import { Markdown } from './Markdown';
import { useTripPhotos } from '../firebase/useTripPhotos';

export const TripPage: React.FunctionComponent = () => {
  const { slug } = useParams<{ slug: string }>();

  const { tripText, loading, error } = useTripText(slug);
  const { tripPhotos, loading: photosLoading, error: photosError } = useTripPhotos(slug);

  if (error || photosError) {
    return <p>Error</p>;
  }

  return (
    <Markdown
      tripText={tripText ?? undefined}
      tripPhotos={tripPhotos ?? undefined}
      loading={loading || photosLoading}
    />
  );
};
