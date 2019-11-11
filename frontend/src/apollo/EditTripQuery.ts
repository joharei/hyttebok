import { gql } from 'apollo-boost';

export const GET_EDIT_TRIP = gql`
  query GetEditTrip($slug: String!) {
    trip(slug: $slug) {
      slug
      title
      startDate
      endDate
      text
    }
  }
`;
