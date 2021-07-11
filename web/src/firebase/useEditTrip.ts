import React from 'react';
import { Trip, TripDetails } from '../models/Trip';
import slugify from 'slugify';
import { extractUrls } from '../utils/extractUrls';
import { notEmpty } from '../utils/notEmpty';
import firebase from '.';

export function useEditTrip(onSaveSuccess?: (slug: string) => void): {
  saveTrip: (
    tripDetails: Omit<TripDetails, 'id' | 'slug'> & Partial<Pick<TripDetails, 'id' | 'slug'>>
  ) => Promise<void>;
  loading: boolean;
  error: boolean;
} {
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

      const photoUrls = extractUrls(tripDetails.text);
      const promises = photoUrls
        .filter(({ original }) => original.includes('/root/content'))
        .map(({ original, thumbnail, title, alt }) =>
          fetch(original.replace('/content', '?$select=image,file'))
            .then((value) => value.json())
            .then((value) => ({
              url: original,
              thumbnail,
              height: value.image.height,
              width: value.image.width,
              title,
              alt,
            }))
            .catch(() => null)
        );
      const allPromises = Promise.all(promises).then((value) =>
        value.filter(notEmpty).reduce((previousValue, { url, ...rest }) => {
          if (!rest.alt) {
            delete rest.alt;
          }
          if (!rest.title) {
            delete rest.title;
          }
          return {
            ...previousValue,
            [url]: rest,
          };
        }, {})
      );

      try {
        const photos = await allPromises;
        batch.set(firebase.firestore().collection('tripPhotos').doc(id), photos);
      } catch (e) {
        console.error(e);
        setError(true);
      }

      try {
        await batch.commit();
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(true);
      }

      onSaveSuccess?.(trip.slug);
    },
  };
}
