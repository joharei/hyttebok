import { gql } from 'apollo-boost';

export const SAVE_TRIP = gql`
  mutation SaveTrip($trip: TripInput!) {
    saveTrip(trip: $trip) {
      id
      slug
      title
      startDate
      endDate
      text
    }
  }
`;
