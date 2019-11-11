import * as React from 'react';
import { Route, Switch } from 'react-router';
import { ADMIN, LANDING, TRIP } from '../constants/routes';
import AdminPage from './AdminPage';
import ResponsiveDrawer from './ResponsiveDrawer';

export const Routes = () => (
  <Switch>
    <Route path={LANDING} exact>
      <ResponsiveDrawer />
    </Route>
    <Route path={TRIP}>
      <ResponsiveDrawer />
    </Route>
    <Route path={ADMIN}>
      <AdminPage />
    </Route>
  </Switch>
);
