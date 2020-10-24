import { AppBar, Button, Grid, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { AdminTripsList } from './AdminTripsList';
import { EditTripPage } from './EditTripPage';
import { ReactRouterLink } from './router_links';

const useStyles = makeStyles(({ spacing, mixins }: Theme) => ({
  content: {
    flexGrow: 1,
    padding: spacing(3),
  },
  toolbar: mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
}));

export const AdminPage: React.FunctionComponent = () => {
  const classes = useStyles();
  const { path, url } = useRouteMatch();

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
            Admin
          </Typography>

          <Button component={ReactRouterLink} color="inherit" to={ROUTES.LANDING}>
            Til forsiden
          </Button>
        </Toolbar>
      </AppBar>

      <main>
        <div className={classes.toolbar} />

        <Grid container justify="center" className={classes.content}>
          <Switch>
            <Route exact path={`${path}/new-trip`} component={EditTripPage} />
            <Route path={`${path}/:slug`} component={EditTripPage} />
            <Route path={`${url}/`} exact component={AdminTripsList} />
          </Switch>
        </Grid>
      </main>
    </div>
  );
};
