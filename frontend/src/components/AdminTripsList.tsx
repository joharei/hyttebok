import { createStyles, Fab, Grid, Paper, TableRow, Theme, withStyles, WithStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import { AdminTripsQuery, GET_ADMIN_TRIPS } from '../apollo/AdminTripsQuery';
import { ADMIN } from '../constants/routes';
import { formatDateString } from '../utils/date';
import { LinkTableRow } from './router_links';

const styles = (theme: Theme) => createStyles({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  fabIcon: {
    marginRight: theme.spacing.unit,
  },
});

const AdminTripsList = (props: WithStyles<typeof styles>) => {

  const { classes } = props;

  return (
    <React.Fragment>
      <AdminTripsQuery query={GET_ADMIN_TRIPS}>
        {({ data: { trips } = { trips: [] }, loading, error }) => {
          if (loading) {
            return <CircularProgress/>;
          }
          if (error) {
            return <p>Error</p>;
          }
          return (
            <Grid xs={12} md={8} lg={6} item={true}>
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
                      <LinkTableRow hover={true} key={trip.slug} to={`${ADMIN}/${trip.slug}`}>
                        <TableCell component="th" scope="row">{trip.title}</TableCell>
                        <TableCell align="right">{formatDateString(trip.startDate)}</TableCell>
                        <TableCell align="right">{formatDateString(trip.endDate)}</TableCell>
                      </LinkTableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          );
        }}
      </AdminTripsQuery>

      <Fab className={classes.fab} color="primary" variant="extended" aria-label="Add">
        <AddIcon className={classes.fabIcon}/>
        Ny tur
      </Fab>

    </React.Fragment>
  );
};

export default withStyles(styles, { withTheme: true })(AdminTripsList);