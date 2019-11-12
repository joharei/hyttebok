import * as React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import * as ReactDOM from 'react-dom';
import client from './apollo/client';
import { App } from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { ProvideAuth } from './components/Auth/useAuth';

ReactDOM.render(
  <ApolloProvider client={client}>
    <ProvideAuth>
      <App />
    </ProvideAuth>
  </ApolloProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
