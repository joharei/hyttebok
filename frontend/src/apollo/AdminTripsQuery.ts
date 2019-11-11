import { gql } from 'apollo-boost';

export const GET_ADMIN_TRIPS = gql`
  query GetAdminTrips {
    trips {
      slug
      title
      startDate
      endDate
    }
  }
`;
