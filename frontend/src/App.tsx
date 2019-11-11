import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { Routes } from './components/Routes';
import { withAuthentication } from './components/Session';

const App = () => (
  <>
    <CssBaseline />
    <Router>
      <Routes />
    </Router>
  </>
);

export default withAuthentication<any>(App);
