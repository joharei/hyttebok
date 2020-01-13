import { ListItem, makeStyles, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { TRIP } from '../constants/routes';
import { ReactRouterLink } from './router_links';
import { useLocation } from 'react-router-dom';
import { useTrips } from '../firebase/useTrips';
import { formatDateForDisplay } from '../utils/date';

const useStyles = makeStyles(({ mixins }: Theme) => ({
  toolbar: mixins.toolbar,
}));

interface Props {
  setTitle: (title: string) => void;
}

export const DrawerContent = ({ setTitle }: Props) => {
  const classes = useStyles();
  const location = useLocation();
  const selectedListItemRef = useRef<HTMLAnchorElement>(null);
  const [scrollToItem, setScrollToItem] = useState(true);

  const updateTitle = (title: string) => () => setTitle(title);

  const { trips, loading, error } = useTrips();

  useEffect(() => {
    if (scrollToItem && selectedListItemRef && selectedListItemRef.current) {
      selectedListItemRef.current.scrollIntoView({ block: 'center' });
      setScrollToItem(false);
    }
  }, [scrollToItem, selectedListItemRef]);

  const content = () => {
    if (loading) {
      return <CircularProgress />;
    }
    if (error || !trips) {
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
            selected={location.pathname === `${TRIP}/${trip.slug}`}
            {...{
              ref:
                location.pathname === `${TRIP}/${trip.slug}`
                  ? selectedListItemRef
                  : undefined,
            }}
          >
            <ListItemText
              primary={trip.title}
              secondary={`${formatDateForDisplay(
                trip.startDate
              )} - ${formatDateForDisplay(trip.endDate)}`}
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
