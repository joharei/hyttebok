import React, { useEffect } from 'react';
import * as firebase from 'firebase/app';

export function useTripText(slug: string) {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [tripText, setTripText] = React.useState<string | null>(null);

  const [tripId, setTripId] = React.useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = firebase
      .firestore()
      .collection('trips')
      .where('slug', '==', slug)
      .onSnapshot(
        snapshot => {
          const id = snapshot.docs[0].id;
          if (id) {
            setTripId(id);
          } else {
            setError(true);
          }
        },
        error => {
          console.log(error);
          setError(true);
        }
      );

    return () => unsubscribe();
  }, [slug]);

  useEffect(() => {
    if (tripId) {
      const unsubscribe = firebase
        .firestore()
        .doc(`tripTexts/${tripId}`)
        .onSnapshot(
          snapshot => {
            setLoading(false);
            setError(false);
            setTripText(snapshot.data()?.['text']);
          },
          error => {
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
