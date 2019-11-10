import { gql } from 'apollo-boost';
import Query from 'react-apollo/Query';

export const IS_AUTHORIZED = gql`
    query getIsAuthorized($firebaseUid: String!) {
        isUserAuthorized(firebaseUid: $firebaseUid)
    }
`;

interface IVariables {
  firebaseUid: string;
}

export interface IAuthorizedData {
  isUserAuthorized: boolean;
}

export class IsAuthorizedQuery extends Query<IAuthorizedData, IVariables> {
}