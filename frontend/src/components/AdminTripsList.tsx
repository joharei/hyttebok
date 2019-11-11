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
import { AdminTripsQuery, GET_ADMIN_TRIPS } from '../apollo/AdminTripsQuery';
import { ADMIN } from '../constants/routes';
import { formatDateString } from '../utils/date';
import { LinkTableRow } from './router_links';

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

  return (
    <>
      <AdminTripsQuery query={GET_ADMIN_TRIPS}>
        {({ data: { trips } = { trips: [] }, loading, error }) => {
          if (loading) {
            return <CircularProgress />;
          }
          if (error) {
            return <p>Error</p>;
          }
          return (
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
                    {trips.map(trip => (
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
          );
        }}
      </AdminTripsQuery>

      <Fab
        className={classes.fab}
        color="primary"
        variant="extended"
        aria-label="Add"
      >
        <AddIcon className={classes.fabIcon} />
        Ny tur
      </Fab>
    </>
  );
};
