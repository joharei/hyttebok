import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Unsubscribe, User } from 'firebase';
import React from 'react';
import { AuthUserContext } from '.';
import client from '../../apollo/client';
import { IS_AUTHORIZED } from '../../apollo/IsAuthorizedQuery';
import Firebase, { withFirebase } from '../Firebase';
import { IsAuthorized } from '../../generated/apollo/IsAuthorized';

interface State {
  authUser: User | null;
  unauthorizedDialogOpen: boolean;
}

interface Props {
  firebase: Firebase;
}

const withAuthentication = <P extends Props>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  class WithAuthentication extends React.Component<P, State> {
    private listener: Unsubscribe | null = null;

    constructor(props: Readonly<P>) {
      super(props);

      this.state = {
        authUser: null,
        unauthorizedDialogOpen: false,
      };
    }

    public componentDidMount(): void {
      if (this.props.firebase !== undefined) {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
          authUser => {
            authUser
              ? client
                  .query<IsAuthorized>({
                    query: IS_AUTHORIZED,
                    variables: {
                      firebaseUid: authUser.uid,
                    },
                  })
                  .then(value => {
                    if (value.loading) {
                      return;
                    }
                    if (value.errors) {
                      this.setState({
                        authUser: null,
                        unauthorizedDialogOpen: false,
                      });
                    }
                    if (value.data.isUserAuthorized) {
                      this.setState({
                        authUser,
                        unauthorizedDialogOpen: false,
                      });
                    } else {
                      this.props.firebase.doSignOut().then(() => {
                        this.setState({
                          authUser: null,
                          unauthorizedDialogOpen: true,
                        });
                      });
                    }
                  })
              : this.setState({ authUser: null });
          }
        );
      }
    }

    public componentWillUnmount(): void {
      if (this.listener !== null) {
        this.listener();
      }
    }

    public render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <div>
            <Component {...(this.props as any)} />

            <Dialog
              open={this.state.unauthorizedDialogOpen}
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Ingen adgang!</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Denne siden er privat, og slipper bare inn spesielt utvalgte!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary" autoFocus>
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </AuthUserContext.Provider>
      );
    }

    private handleClose = () => {
      this.setState({ unauthorizedDialogOpen: false });
    };
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
