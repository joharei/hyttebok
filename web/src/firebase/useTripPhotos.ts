import React, { useEffect } from 'react';
import { useTripId } from './useTripId';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';

type TripPhotos = {
  [original: string]: {
    thumbnail: string;
    height: number;
    width: number;
    title?: string;
    alt?: string;
  };
};

export function useTripPhotos(slug: string | undefined): {
  tripPhotos: TripPhotos | null;
  error: boolean;
  loading: boolean;
} {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [tripPhotos, setTripPhotos] = React.useState<TripPhotos | null>(null);

  const { tripId } = useTripId(slug);
  const db = getFirestore();

  useEffect(() => {
    if (tripId) {
      const unsubscribe = onSnapshot(
        doc(db, `tripPhotos/${tripId}`),
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
  }, [db, tripId]);

  return {
    error,
    loading,
    tripPhotos,
  };
}
