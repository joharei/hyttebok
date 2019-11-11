import { ListItem, makeStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { GET_TRIPS, TripsQuery } from '../apollo/TripsQuery';
import { TRIP } from '../constants/routes';
import { ReactRouterLink } from './router_links';

const useStyles = makeStyles(({ mixins }: Theme) => ({
  toolbar: mixins.toolbar,
}));

interface Props extends RouteComponentProps {
  setTitle: (title: string) => void;
}

export const DrawerContent = ({ setTitle }: Props) => {
  const classes = useStyles();

  const updateTitle = (title: string) => () => setTitle(title);

  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <TripsQuery query={GET_TRIPS}>
        {({ data: { trips } = { trips: [] }, loading, error }) => {
          if (loading) {
            return <CircularProgress />;
          }
          if (error) {
            return <p>Error</p>;
          }
          return (
            <List>
              {trips.map(trip => (
                <ListItem
                  component={ReactRouterLink}
                  button
                  key={trip.slug}
                  to={`${TRIP}/${trip.slug}`}
                  onClick={updateTitle(trip.title)}
                >
                  <ListItemText primary={trip.title} />
                </ListItem>
              ))}
            </List>
          );
        }}
      </TripsQuery>
    </div>
  );
};
