import React, { useEffect } from 'react';
import { useTripId } from './useTripId';

type TripPhotos = {
  [original: string]: {
    thumbnail: string;
    height: number;
    width: number;
    title?: string;
    alt?: string;
  };
};

export function useTripPhotos(slug: string | undefined) {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [tripPhotos, setTripPhotos] = React.useState<TripPhotos | null>(null);

  const { tripId } = useTripId(slug);

  useEffect(() => {
    if (tripId) {
      const unsubscribe = firebase
        .firestore()
        .doc(`tripPhotos/${tripId}`)
        .onSnapshot(
          (snapshot) => {
            setLoading(false);
            setError(false);
            setTripPhotos(snapshot.data() ?? null);
          },
          (error) => {
            console.log(error);
            setError(true);
          }
        );

      return () => unsubscribe();
    }
    return;
  }, [tripId]);

  return {
    error,
    loading,
    tripPhotos,
  };
}
