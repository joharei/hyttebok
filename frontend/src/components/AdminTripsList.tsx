import {
  CircularProgress,
  Fab,
  Grid,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { GET_ADMIN_TRIPS } from '../apollo/AdminTripsQuery';
import { ADMIN } from '../constants/routes';
import { formatDateString } from '../utils/date';
import { LinkTableRow } from './router_links';
import { useQuery } from '@apollo/react-hooks';
import { GetAdminTrips } from '../generated/apollo/GetAdminTrips';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  fab: {
    position: 'fixed',
    bottom: spacing(2),
    right: spacing(2),
  },
  fabIcon: {
    marginRight: spacing(1),
  },
}));

export const AdminTripsList = () => {
  const classes = useStyles();

  const { data, loading, error } = useQuery<GetAdminTrips>(GET_ADMIN_TRIPS);

  if (loading) {
    return <CircularProgress />;
  }
  if (error || !data) {
    return <p>Error</p>;
  }

  return (
    <div>
      <Grid xs={12} md={8} lg={6} item>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tittel</TableCell>
                <TableCell align="right">Start</TableCell>
                <TableCell align="right">Slutt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.trips.map(trip => (
                <LinkTableRow
                  hover
                  key={trip.slug}
                  to={`${ADMIN}/${trip.slug}`}
                >
                  <TableCell component="th" scope="row">
                    {trip.title}
                  </TableCell>
                  <TableCell align="right">
                    {formatDateString(trip.startDate)}
                  </TableCell>
                  <TableCell align="right">
                    {formatDateString(trip.endDate)}
                  </TableCell>
                </LinkTableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Fab
        className={classes.fab}
        color="primary"
        variant="extended"
        aria-label="Add"
      >
        <AddIcon className={classes.fabIcon} />
        Ny tur
      </Fab>
    </div>
  );
};
