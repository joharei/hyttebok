import { gql } from 'apollo-boost';
import Query from 'react-apollo/Query';

export const GET_TRIP_PAGE = gql`
    query getTripPage($slug: String!) {
        trip(slug: $slug) {
            title
            text
        }
    }
`;

interface ITrip {
  title: string;
  text: string;
}

interface IData {
  trip: ITrip;
}

interface IVariables {
  slug: string;
}

export class TripPageQuery extends Query<IData, IVariables> {
}