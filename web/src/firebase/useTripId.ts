import React, { useEffect } from 'react';

export function useTripId(slug: string | undefined) {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [tripId, setTripId] = React.useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTripId(null);

    if (slug) {
      const unsubscribe = firebase
        .firestore()
        .collection('trips')
        .where('slug', '==', slug)
        .onSnapshot(
          (snapshot) => {
            const id = snapshot.docs[0].id;
            if (id) {
              setTripId(id);
            } else {
              setError(true);
            }
            setLoading(false);
          },
          (error) => {
            console.log(error);
            setError(true);
            setLoading(false);
          }
        );

      return () => unsubscribe();
    }
    return;
  }, [slug]);

  return {
    error,
    loading,
    tripId,
  };
}
