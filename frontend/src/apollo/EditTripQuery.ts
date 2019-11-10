import { gql } from 'apollo-boost';
import Query from 'react-apollo/Query';
import { ITripWithText } from '../models/ITrip';

export const GET_EDIT_TRIP = gql`
    query getEditTrip($slug: String!) {
        trip(slug: $slug) {
            slug
            title
            startDate
            endDate
            text
        }
    }
`;

interface IData {
  trip: ITripWithText;
}

interface IVariables {
  slug: string;
}

export class EditTripQuery extends Query<IData, IVariables> {
}