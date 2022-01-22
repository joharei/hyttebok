import { ListItem, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { TRIP } from '../constants/routes';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTrips } from '../firebase/useTrips';
import { formatDateForDisplay } from '../utils/date';

const PREFIX = 'DrawerContent';

const classes = {
  toolbar: `${PREFIX}-toolbar`,
};

const Root = styled('div')(({ theme: { mixins } }) => ({
  [`& .${classes.toolbar}`]: mixins.toolbar,
}));

interface Props {
  setTitle: (title: string) => void;
}

export const DrawerContent: React.FunctionComponent<Props> = ({ setTitle }: Props) => {
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
            component={RouterLink}
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
    <Root>
      <div className={classes.toolbar} />
      <Divider />
      {content()}
    </Root>
  );
};
