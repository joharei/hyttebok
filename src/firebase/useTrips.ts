import React, { useEffect } from 'react';
import { Trip } from '../models/Trip';

export function useTrips() {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [trips, setTrips] = React.useState<Trip[]>([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('trips')
      .orderBy('endDate', 'desc')
      .withConverter({
        fromFirestore: snapshot => ({
          title: snapshot.data().title,
          slug: snapshot.data().slug,
          startDate: new Date(snapshot.data().startDate.seconds * 1000),
          endDate: new Date(snapshot.data().endDate.seconds * 1000),
        }),
        toFirestore: (modelObject: Trip) => modelObject,
      })
      .onSnapshot(
        snapshot => {
          setLoading(false);
          setError(false);
          setTrips(snapshot.docs.map(doc => doc.data()));
        },
        error => {
          console.log(error);
          setError(true);
        }
      );

    return () => unsubscribe();
  }, []);

  return {
    error,
    loading,
    trips,
  };
}
