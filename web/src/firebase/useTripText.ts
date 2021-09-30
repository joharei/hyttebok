import React, { useEffect } from 'react';
import { useTripId } from './useTripId';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';

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
      const db = getFirestore();
      const unsubscribe = onSnapshot(
        doc(db, `tripTexts/${tripId}`),
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
