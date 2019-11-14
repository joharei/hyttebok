/*global process */

import ApolloClient from 'apollo-boost';
import * as firebase from 'firebase/app';
import 'firebase/auth';

export default new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  request: async operation => {
    const user = firebase.auth().currentUser;
    const token = user && (await user.getIdToken());
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});
