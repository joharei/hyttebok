import React from 'react';
import { Trip, TripDetails } from '../models/Trip';
import slugify from 'slugify';

export function useEditTrip(onSaveSuccess?: (slug: string) => void) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  return {
    loading,
    error,
    saveTrip: async (tripDetails: Omit<TripDetails, 'id' | 'slug'> & Partial<Pick<TripDetails, 'id' | 'slug'>>) => {
      setLoading(true);
      setError(false);

      const batch = firebase.firestore().batch();

      const trip: Trip = {
        slug: tripDetails.slug ?? slugify(tripDetails.title),
        title: tripDetails.title,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
      };
      const id = tripDetails.id ?? (await firebase.firestore().collection('trips').add(trip)).id;
      if (tripDetails.id) {
        batch.set(firebase.firestore().collection('trips').doc(tripDetails.id), trip);
      }

      batch.set(firebase.firestore().collection('tripTexts').doc(id), { text: tripDetails.text });

      try {
        await batch.commit();
        setLoading(false);
      } catch {
        setError(true);
      }

      onSaveSuccess?.(trip.slug);
    },
  };
}
