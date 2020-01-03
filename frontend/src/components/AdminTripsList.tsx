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
import { ADMIN } from '../constants/routes';
import { useHistory } from 'react-router-dom';
import { useTrips } from '../firebase/useTrips';
import { formatDateForDisplay } from '../utils/date';

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
  const history = useHistory();

  const { trips, loading, error } = useTrips();

  if (loading) {
    return <CircularProgress />;
  }
  if (error || !trips) {
    return <p>Error</p>;
  }

  return (
    <>
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
                <TableRow
                  key={trip.slug}
                  hover
                  onClick={() => history.push(`${ADMIN}/${trip.slug}`)}
                >
                  <TableCell component="th" scope="row">
                    {trip.title}
                  </TableCell>
                  <TableCell align="right">
                    {formatDateForDisplay(trip.startDate)}
                  </TableCell>
                  <TableCell align="right">
                    {formatDateForDisplay(trip.endDate)}
                  </TableCell>
                </TableRow>
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
        onClick={() => history.push(`${ADMIN}/new-trip`)}
      >
        <AddIcon className={classes.fabIcon} />
        Ny tur
      </Fab>
    </>
  );
};
