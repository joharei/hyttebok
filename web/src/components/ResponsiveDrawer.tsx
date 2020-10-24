import { Container, makeStyles, Theme, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useState } from 'react';
import { Route, RouteComponentProps } from 'react-router';
import * as ROUTES from '../constants/routes';
import { DrawerContent } from './DrawerContent';
import { ReactRouterLink } from './router_links';
import { TripPage } from './TripPage';
import { useAuth } from './Auth/useAuth';

const drawerWidth = 300;

const useStyles = makeStyles(({ breakpoints, spacing, mixins }: Theme) => ({
  appBar: {
    marginLeft: drawerWidth,
    [breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  firstParagraph: {
    marginTop: spacing(3),
  },
  drawer: {
    [breakpoints.up('md')]: {
      flexShrink: 0,
      width: drawerWidth,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  menuButton: {
    marginRight: 20,
    [breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    display: 'flex',
  },
  toolbar: mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
}));

export const ResponsiveDrawer: React.FunctionComponent<RouteComponentProps> = ({
  match: { path, url },
}: RouteComponentProps) => {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const [title, setTitle] = useState('Hyttebok');

  const { signOut } = useAuth();

  function renderRootPage() {
    return (
      <>
        <Typography paragraph className={classes.firstParagraph}>
          Fordi vi har glemt å skrive i hytteboka (<q>analog</q> / <q>manuell</q>) fra dag 1 ble denne digitale
          hytteboka opprinnelig laget hjemme som en oppsummering av bruk av hytta på basis as almanakker, bilder og
          andre kilder 2 år etter at vi kjøpte den.
        </Typography>
        <Typography paragraph>
          Ideen var at dette skulle føres inn i den analoge hytteboka med penn en dag jeg hadde god tid og hadde gått
          dagens tur.
        </Typography>
        <Typography paragraph>
          I ettertid har det vist seg at det aldri vil skje, og at det heller ikke er praktisk. Derfor er denne
          hytteboka nå blitt til <q>Faktisk hyttebok</q>, og inneholder alle turene (med et visst etterslep...) vi har
          hatt på hytta, inkludert bilder og kart over turene.
        </Typography>
      </>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton color="inherit" aria-label="Open drawer" onClick={toggleDrawer} className={classes.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
            {title}
          </Typography>
          <div style={{ display: 'flex' }}>
            <Hidden mdUp>
              <Tooltip title="Til adminsiden">
                <IconButton component={ReactRouterLink} color="inherit" to={ROUTES.ADMIN}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logg ut">
                <IconButton color="inherit" onClick={signOut}>
                  <LockIcon />
                </IconButton>
              </Tooltip>
            </Hidden>
            <Hidden smDown>
              <Button component={ReactRouterLink} color="inherit" to={ROUTES.ADMIN}>
                Til adminsiden
              </Button>
              <Button color="inherit" onClick={signOut}>
                Logg ut
              </Button>
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <DrawerContent
              setTitle={(title) => {
                setTitle(title);
                toggleDrawer();
              }}
            />
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <DrawerContent setTitle={setTitle} />
          </Drawer>
        </Hidden>
      </nav>
      <Container component="main" maxWidth="lg">
        <div className={classes.toolbar} />
        <Route path={`${path}/:slug`} component={TripPage} />
        <Route path={`${url}/`} exact render={renderRootPage} />
      </Container>
    </div>
  );
};
