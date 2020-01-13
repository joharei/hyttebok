import * as React from 'react';
import './firebase/client';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { ProvideAuth } from './components/Auth/useAuth';

ReactDOM.render(
  <ProvideAuth>
    <App />
  </ProvideAuth>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
