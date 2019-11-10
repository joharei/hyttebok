import { gql } from 'apollo-boost';
import Query from 'react-apollo/Query';
import { ITrip } from '../models/ITrip';

export const GET_ADMIN_TRIPS = gql`
    query getTrips {
        trips {
            slug
            title
            startDate
            endDate
        }
    }
`;

interface IData {
  trips: ITrip[];
}

export class AdminTripsQuery extends Query<IData, {}> {
}