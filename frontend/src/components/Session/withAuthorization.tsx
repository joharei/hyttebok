import { Unsubscribe, User } from 'firebase';
import React from 'react';
import { compose } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router';
import { AuthUserContext } from '.';
import {
  IS_AUTHORIZED,
  IsAuthorizedQuery,
} from '../../apollo/IsAuthorizedQuery';
import * as ROUTES from '../../constants/routes';
import Firebase, { withFirebase } from '../Firebase';

interface Props {
  firebase: Firebase;
}

const withAuthorization = <P extends Props>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  class WithAuthorization extends React.Component<P & RouteComponentProps> {
    private listener: Unsubscribe | null = null;

    public componentDidMount(): void {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!this.condition(authUser)) {
          this.props.history.push(ROUTES.LANDING);
        }
      });
    }

    public componentWillUnmount(): void {
      if (this.listener) {
        this.listener();
      }
    }

    public render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => {
            if (authUser === null) {
              return null;
            }
            return (
              <IsAuthorizedQuery
                query={IS_AUTHORIZED}
                variables={{ firebaseUid: authUser.uid }}
              >
                {({
                  data: { isUserAuthorized } = { isUserAuthorized: false },
                  loading,
                  error,
                }) => {
                  if (loading || error) {
                    return null;
                  }
                  return isUserAuthorized ? (
                    <Component {...this.props} />
                  ) : null;
                }}
              </IsAuthorizedQuery>
            );
          }}
        </AuthUserContext.Consumer>
      );
    }

    private condition = (authUser: User | null) =>
      authUser ? authUser.email === 'johan.reitan@gmail.com' : false;
  }

  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
