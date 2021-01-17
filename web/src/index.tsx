import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { ProvideAuth } from './components/Auth/useAuth';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { initFirebase } from './firebase';

initFirebase().then(() => {
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
