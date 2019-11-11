import { gql } from 'apollo-boost';

export const GET_TRIP_PAGE = gql`
  query GetTripPage($slug: String!) {
    trip(slug: $slug) {
      title
      text
    }
  }
`;
