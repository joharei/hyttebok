import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Routes from './components/Routes';
import { withAuthentication } from './components/Session';

const App = () => (
  <React.Fragment>
    <CssBaseline/>
    <Router>
      <Routes/>
    </Router>
  </React.Fragment>
);

export default withAuthentication<any>(App);
