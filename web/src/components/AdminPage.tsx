import { AppBar, Button, Grid, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { AdminTripsList } from './AdminTripsList';
import { EditTripPage } from './EditTripPage';

const useStyles = makeStyles(({ spacing, mixins }: Theme) => ({
  content: {
    flexGrow: 1,
    padding: spacing(3),
  },
  toolbar: mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
}));

export const AdminPage: React.FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
            Admin
          </Typography>

          <Button component={RouterLink} color="inherit" to={ROUTES.LANDING}>
            Til forsiden
          </Button>
        </Toolbar>
      </AppBar>

      <main>
        <div className={classes.toolbar} />

        <Grid container justifyContent="center" className={classes.content}>
          <Routes>
            <Route path="new-trip" element={<EditTripPage />} />
            <Route path=":slug" element={<EditTripPage />} />
            <Route path="/" element={<AdminTripsList />} />
          </Routes>
        </Grid>
      </main>
    </div>
  );
};
