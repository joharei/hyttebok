import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import * as ReactDOM from 'react-dom';
import client from './apollo/client';
import App from './App';
import Firebase, { FirebaseContext } from './components/Firebase';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  </FirebaseContext.Provider>,
  document.getElementById('root') as HTMLElement,
);
registerServiceWorker();
