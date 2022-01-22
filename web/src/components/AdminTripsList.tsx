import { CircularProgress, Fab, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { ADMIN } from '../constants/routes';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../firebase/useTrips';
import { formatDateForDisplay } from '../utils/date';

const PREFIX = 'AdminTripsList';

const classes = {
  fab: `${PREFIX}-fab`,
  fabIcon: `${PREFIX}-fabIcon`,
  tableRowHover: `${PREFIX}-tableRowHover`,
};

const AdminTripsListUI: React.FunctionComponent = () => {
  const navigate = useNavigate();

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
              {trips.map((trip) => (
                <TableRow
                  key={trip.slug}
                  hover
                  classes={{ hover: classes.tableRowHover }}
                  onClick={() => navigate(`${ADMIN}/${trip.slug}`)}
                >
                  <TableCell component="th" scope="row">
                    {trip.title}
                  </TableCell>
                  <TableCell align="right">{formatDateForDisplay(trip.startDate)}</TableCell>
                  <TableCell align="right">{formatDateForDisplay(trip.endDate)}</TableCell>
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
        onClick={() => navigate(`${ADMIN}/new-trip`)}
      >
        <AddIcon className={classes.fabIcon} />
        Ny tur
      </Fab>
    </>
  );
};

export const AdminTripsList: React.FunctionComponent = styled(AdminTripsListUI)(({ theme: { spacing } }) => ({
  [`& .${classes.fab}`]: {
    position: 'fixed',
    bottom: spacing(2),
    right: spacing(2),
  },

  [`& .${classes.fabIcon}`]: {
    marginRight: spacing(1),
  },

  [`& .${classes.tableRowHover}`]: {
    cursor: 'pointer',
  },
}));
