import * as ReactDOM from 'react-dom';
import { App } from './App';
import registerServiceWorker from './registerServiceWorker';
import { ProvideAuth } from './components/Auth/useAuth';
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { initFirebase } from './firebase';

initFirebase().then(() => {
  ReactDOM.render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme()}>
        <ProvideAuth>
          <App />
        </ProvideAuth>
      </ThemeProvider>
    </StyledEngineProvider>,
    document.getElementById('root') as HTMLElement
  );
  registerServiceWorker();
});
