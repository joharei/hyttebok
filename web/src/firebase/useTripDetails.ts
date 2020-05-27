import React, { useEffect } from 'react';
import { Trip, TripDetails } from '../models/Trip';
import { useTripText } from './useTripText';
import { useTripId } from './useTripId';

export function useTripDetails(slug: string | undefined) {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [tripDetails, setTripDetails] = React.useState<TripDetails | null>(null);

  const { tripId } = useTripId(slug);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    } else {
      setLoading(true);
    }
  }, [slug]);

  useEffect(() => {
    if (tripId) {
      const unsubscribe = firebase
        .firestore()
        .doc(`trips/${tripId}`)
        .withConverter({
          fromFirestore: (snapshot) => ({
            title: snapshot.data().title,
            slug: snapshot.data().slug,
            startDate: new Date(snapshot.data().startDate.seconds * 1000),
            endDate: new Date(snapshot.data().endDate.seconds * 1000),
          }),
          toFirestore: (modelObject: Trip) => modelObject,
        })
        .onSnapshot(
          (snapshot) => {
            const trip = snapshot.data();
            trip && setTrip(trip);
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

  const { tripText } = useTripText(slug);

  useEffect(() => {
    if (tripId && trip && tripText) {
      setLoading(false);
      setError(false);
      setTripDetails({ ...trip, id: tripId, text: tripText });
    }
  }, [tripId, trip, tripText]);

  return {
    error,
    loading,
    tripDetails,
  };
}
