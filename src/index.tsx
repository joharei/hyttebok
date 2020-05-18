import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { ProvideAuth } from './components/Auth/useAuth';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

fetch('/__/firebase/init.json').then(async (response) => {
  firebase.initializeApp(await response.json());
  firebase.auth().useDeviceLanguage();
  await firebase
    .firestore()
    .enablePersistence()
    .catch(function (err) {
      if (err.code === 'failed-precondition') {
        console.log('Multiple tabs where open. Offline caching is only supported on one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.log("The current browser doesn't support offline caching.");
      }
    });

  ReactDOM.render(
    <ThemeProvider theme={createMuiTheme()}>
      <ProvideAuth>
        <App />
      </ProvideAuth>
    </ThemeProvider>,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();
});
