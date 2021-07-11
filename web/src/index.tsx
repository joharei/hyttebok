import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { ProvideAuth } from './components/Auth/useAuth';
import { createTheme, ThemeProvider } from '@material-ui/core';
import { initFirebase } from './firebase';

initFirebase().then(() => {
  ReactDOM.render(
    <ThemeProvider theme={createTheme()}>
      <ProvideAuth>
        <App />
      </ProvideAuth>
    </ThemeProvider>,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();
});
