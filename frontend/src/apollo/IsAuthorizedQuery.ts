import { gql } from 'apollo-boost';
import Query from 'react-apollo/Query';
import {
  IsAuthorized,
  IsAuthorizedVariables,
} from '../generated/apollo/IsAuthorized';

export const IS_AUTHORIZED = gql`
  query IsAuthorized($firebaseUid: String!) {
    isUserAuthorized(firebaseUid: $firebaseUid)
  }
`;

export class IsAuthorizedQuery extends Query<
  IsAuthorized,
  IsAuthorizedVariables
> {}
