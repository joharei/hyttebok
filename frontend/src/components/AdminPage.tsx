import { createStyles, Grid, Theme, WithStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { compose } from 'react-apollo';
import { Route, RouteComponentProps } from 'react-router';
import * as ROUTES from '../constants/routes';
import AdminTripsList from './AdminTripsList';
import EditTripPage from './EditTripPage';
import { LinkButton } from './router_links';
import { withAuthorization } from './Session';

const styles = (theme: Theme) => createStyles({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
});

function AdminPage(props: WithStyles<typeof styles> & RouteComponentProps) {

  const { classes, match } = props;

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap={true} className={classes.grow}>
            Admin
          </Typography>

          <LinkButton color="inherit" to={ROUTES.LANDING}>Til forsiden</LinkButton>
        </Toolbar>
      </AppBar>

      <main>
        <div className={classes.toolbar}/>

        <Grid container={true} justify='center' className={classes.content}>
          <Route path={`${match.path}/:slug`} component={EditTripPage}/>
          <Route path={`${match.url}/`} exact={true} component={AdminTripsList}/>
        </Grid>
      </main>
    </div>
  );
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withAuthorization,
)(AdminPage);