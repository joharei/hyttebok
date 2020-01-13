import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { Routes } from './components/Routes';
import { useAuth } from './components/Auth/useAuth';
import { Loading } from './components/Loading';

export const App = () => {
  const { user, admin } = useAuth();

  if (!user) {
    return <Loading />;
  }

  if (!admin) {
    return <p>Ingen adgang for uvedkommede!</p>;
  }

  return (
    <>
      <CssBaseline />
      <Router>
        <Routes />
      </Router>
    </>
  );
};
