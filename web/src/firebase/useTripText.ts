import React, { useEffect } from 'react';
import { useTripId } from './useTripId';

export function useTripText(slug: string | undefined): { error: boolean; loading: boolean; tripText: string | null } {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [tripText, setTripText] = React.useState<string | null>(null);

  const { tripId } = useTripId(slug);

  useEffect(() => {
    setLoading(true);
  }, [slug]);

  useEffect(() => {
    if (tripId) {
      const unsubscribe = firebase
        .firestore()
        .doc(`tripTexts/${tripId}`)
        .onSnapshot(
          (snapshot) => {
            setLoading(false);
            setError(false);
            setTripText(snapshot.data()?.['text']);
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
    tripText,
  };
}
