import { gql } from 'apollo-boost';
import Query from 'react-apollo/Query';

export const GET_TRIPS = gql`
    query getTrips {
        trips {
            title
            slug
        }
    }
`;

interface ITrip {
  title: string;
  slug: string;
}

interface IData {
  trips: ITrip[];
}

export class TripsQuery extends Query<IData, {}> {
}