import * as React from 'react';
import './firebase/client';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { ProvideAuth } from './components/Auth/useAuth';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

ReactDOM.render(
  <ThemeProvider theme={createMuiTheme()}>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </ThemeProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
