import React, { useEffect } from 'react';
import * as firebase from 'firebase/app';
import { Trip, TripDetails } from '../models/Trip';
import { useTripText } from './useTripText';

export function useTripDetails(slug: string) {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [tripDetails, setTripDetails] = React.useState<TripDetails | null>(
    null
  );

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
        .doc(`trips/${tripId}`)
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
            const trip = snapshot.data();
            trip && setTrip(trip);
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

  const { tripText } = useTripText(slug);

  useEffect(() => {
    if (trip && tripText) {
      setLoading(false);
      setError(false);
      setTripDetails({ ...trip, text: tripText });
    }
  }, [trip, tripText]);

  return {
    error,
    loading,
    tripDetails,
  };
}
