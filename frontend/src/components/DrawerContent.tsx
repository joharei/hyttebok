import { createStyles, WithStyles, withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { GET_TRIPS, TripsQuery } from '../apollo/TripsQuery';
import { TRIP } from '../constants/routes';
import { LinkListItem } from './router_links';

const styles = (theme: any) => createStyles({
  toolbar: theme.mixins.toolbar,
});

interface IProps extends WithStyles<typeof styles, true>, RouteComponentProps {
  setTitle: (title: string) => void,
}

function DrawerContent(props: IProps) {

  const { setTitle, classes } = props;

  return (
    <div>
      <div className={classes.toolbar}/>
      <Divider/>
      <TripsQuery query={GET_TRIPS}>
        {({ data: { trips } = { trips: [] }, loading, error }) => {
          if (loading) {
            return <CircularProgress/>;
          }
          if (error) {
            return <p>Error</p>;
          }
          return (
            <List>
              {trips.map((trip) => (
                <LinkListItem button={true} key={trip.slug} to={`${TRIP}/${trip.slug}`}
                              onClick={updateTitle(trip.title)}>
                    <ListItemText primary={trip.title}/>
                  </LinkListItem>
                ),
              )}
            </List>
          );
        }}
      </TripsQuery>
    </div>
  );

  function updateTitle(title: string) {
    return () => setTitle(title);
  }
}

export default withStyles(styles, { withTheme: true })(DrawerContent);