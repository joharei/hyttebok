import { Container, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Hidden from '@mui/material/Hidden';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import * as ROUTES from '../constants/routes';
import { DrawerContent } from './DrawerContent';
import { TripPage } from './TripPage';
import { useAuth } from './Auth/useAuth';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';

const PREFIX = 'ResponsiveDrawer';

const classes = {
  appBar: `${PREFIX}-appBar`,
  firstParagraph: `${PREFIX}-firstParagraph`,
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  menuButton: `${PREFIX}-menuButton`,
  root: `${PREFIX}-root`,
  toolbar: `${PREFIX}-toolbar`,
  grow: `${PREFIX}-grow`,
};

const Root = styled('div')(({ theme: { breakpoints, spacing, mixins } }) => ({
  [`& .${classes.appBar}`]: {
    marginLeft: drawerWidth,
    [breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },

  [`& .${classes.firstParagraph}`]: {
    marginTop: spacing(3),
  },

  [`& .${classes.drawer}`]: {
    [breakpoints.up('md')]: {
      flexShrink: 0,
      width: drawerWidth,
    },
  },

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: 20,
    [breakpoints.up('md')]: {
      display: 'none',
    },
  },

  [`&.${classes.root}`]: {
    display: 'flex',
  },

  [`& .${classes.toolbar}`]: mixins.toolbar,

  [`& .${classes.grow}`]: {
    flexGrow: 1,
  },
}));

const drawerWidth = 300;

export const ResponsiveDrawer = () => {
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
    <Root className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={toggleDrawer}
            className={classes.menuButton}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap className={classes.grow}>
            {title}
          </Typography>
          <div style={{ display: 'flex' }}>
            <Hidden mdUp>
              <Tooltip title="Til adminsiden">
                <IconButton component={RouterLink} color="inherit" to={ROUTES.ADMIN} size="large">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Logg ut">
                <IconButton color="inherit" onClick={signOut} size="large">
                  <LockIcon />
                </IconButton>
              </Tooltip>
            </Hidden>
            <Hidden mdDown>
              <Button component={RouterLink} color="inherit" to={ROUTES.ADMIN}>
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
        <Hidden mdDown>
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
        <Routes>
          <Route path=":slug" element={<TripPage />} />
          <Route path="/" element={renderRootPage()} />
        </Routes>
      </Container>
    </Root>
  );
};
