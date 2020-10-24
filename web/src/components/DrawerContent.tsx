import { ListItem, makeStyles, Theme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { TRIP } from '../constants/routes';
import { ReactRouterLink } from './router_links';
import { useLocation } from 'react-router-dom';
import { useTrips } from '../firebase/useTrips';
import { formatDateForDisplay } from '../utils/date';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles(({ mixins }: Theme) => ({
  toolbar: mixins.toolbar,
}));

interface Props {
  setTitle: (title: string) => void;
}

export const DrawerContent: React.FunctionComponent<Props> = ({ setTitle }: Props) => {
  const classes = useStyles();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const selectedListItemRef = useCallback(
    (node: HTMLElement | null) => {
      if (node !== null && !scrolled) {
        node.scrollIntoView({ block: 'center' });
        setScrolled(true);
      }
    },
    [scrolled]
  );

  const updateTitle = (title: string) => () => setTitle(title);

  const { trips, loading, error } = useTrips();

  const content = () => {
    if (loading) {
      return (
        <List>
          {[...Array(50)].map((_, i) => (
            <ListItem key={i}>
              <ListItemText primary={<Skeleton />} secondary={<Skeleton width="80%" />} />
            </ListItem>
          ))}
        </List>
      );
    }

    if (error || !trips) {
      return <p>Error</p>;
    }
    return (
      <List>
        {trips.map((trip) => (
          <ListItem
            component={ReactRouterLink}
            button
            key={trip.slug}
            to={`${TRIP}/${trip.slug}`}
            onClick={updateTitle(trip.title)}
            selected={location.pathname === `${TRIP}/${trip.slug}`}
            ref={location.pathname === `${TRIP}/${trip.slug}` ? selectedListItemRef : undefined}
          >
            <ListItemText
              primary={trip.title}
              secondary={`${formatDateForDisplay(trip.startDate)} - ${formatDateForDisplay(trip.endDate)}`}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      {content()}
    </div>
  );
};
