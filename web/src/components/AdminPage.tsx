import { AppBar, Button, Grid, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { AdminTripsList } from './AdminTripsList';
import { EditTripPage } from './EditTripPage';

const PREFIX = 'AdminPage';

const classes = {
  content: `${PREFIX}-content`,
  toolbar: `${PREFIX}-toolbar`,
  grow: `${PREFIX}-grow`,
};

const Root = styled('div')(({ theme: { spacing, mixins } }) => ({
  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: spacing(3),
  },

  [`& .${classes.toolbar}`]: mixins.toolbar,

  [`& .${classes.grow}`]: {
    flexGrow: 1,
  },
}));

export const AdminPage: React.FunctionComponent = () => {
  return (
    <Root>
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
    </Root>
  );
};
