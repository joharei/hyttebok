import { Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useState } from 'react';
import { compose } from 'react-apollo';
import { Route, RouteComponentProps } from 'react-router';
import * as ROUTES from '../constants/routes';
import DrawerContent from './DrawerContent';
import Firebase, { withFirebase } from './Firebase';
import { LinkButton } from './router_links';
import { AuthUserContext } from './Session';
import TripPage from './TripPage';

const drawerWidth = 300;

const styles = (theme: any) => createStyles({
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      flexShrink: 0,
      width: drawerWidth,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  grow: {
    flexGrow: 1,
  },
});

interface IProps extends WithStyles<typeof styles, true>, RouteComponentProps {
  firebase: Firebase,
}

function ResponsiveDrawer(props: IProps) {

  const { firebase, match, classes, theme } = props;

  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const [title, setTitle] = useState('Hyttebok');

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={toggleDrawer}
            className={classes.menuButton}
          >
            <Icon>menu</Icon>
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap={true} className={classes.grow}>
            {title}
          </Typography>
          <AuthUserContext.Consumer>
            {authUser =>
              authUser
                ? (
                  <div>
                    <LinkButton color="inherit" to={ROUTES.ADMIN}>Til adminsiden</LinkButton>
                    <Button color="inherit" onClick={firebase.doSignOut}>Logg ut</Button>
                  </div>
                )
                : <Button color="inherit" onClick={firebase.doSignInWithGoogle}>Logg inn</Button>
            }
          </AuthUserContext.Consumer>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Hidden smUp={true} implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={toggleDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Route path={match.path} render={renderDrawerContent}
            />
          </Drawer>
        </Hidden>
        <Hidden xsDown={true} implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open={true}
          >
            <Route path={match.path} render={renderDrawerContent}/>
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        <Route path={`${match.path}/:slug`} component={TripPage}/>
        <Route path={`${match.url}/`} exact={true} render={renderRootPage}/>
      </main>
    </div>
  );

  function renderDrawerContent(routeProps: RouteComponentProps) {
    return <DrawerContent {...routeProps} setTitle={setTitle}/>;
  }

  function renderRootPage() {
    return (
      <Grid container={true}>
        <Grid item={true} md={12} lg={8} xl={6}>
          <Typography paragraph={true}>
            Fordi vi har glemt å skrive i hytteboka (<q>analog</q> / <q>manuell</q>) fra dag 1 ble denne digitale
            hytteboka opprinnelig laget hjemme som en oppsummering av bruk av hytta på basis as almanakker, bilder og
            andre kilder 2 år etter at vi kjøpte den.
          </Typography>
          <Typography paragraph={true}>
            Ideen var at dette skulle føres inn i den analoge hytteboka med penn en dag jeg hadde god tid og hadde gått
            dagens tur.
          </Typography>
          <Typography paragraph={true}>
            I ettertid har det vist seg at det aldri vil skje, og at det heller ikke er praktisk. Derfor er denne
            hytteboka nå blitt til <q>Faktisk hyttebok</q>, og inneholder alle turene (med et visst etterslep...) vi har
            hatt på hytta, inkludert bilder og kart over turene.
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  withFirebase,
)(ResponsiveDrawer);