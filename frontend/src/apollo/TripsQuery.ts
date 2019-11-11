import { gql } from 'apollo-boost';

export const GET_TRIPS = gql`
  query GetTrips {
    trips {
      title
      slug
    }
  }
`;
