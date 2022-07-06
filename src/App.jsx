import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider
} from '@mui/material';
import { LoadingProvider } from './contexts/LoadingContext';
import { AlertMessageProvider } from './contexts/AlertMessageContext';
import { WalletProvider } from './contexts/WalletContext';
import Loading from './components/Loading';
import AlertMessage from './components/AlertMessage';
import Routes from './Routes';

/* --------------------------------------------------------------------------- */

const REGEX_NUMBER_VALID = /^[0-9]*\.?[0-9]*$/;
const theme = createTheme({});

/* --------------------------------------------------------------------------- */

function App() {

  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <AlertMessageProvider>
          <WalletProvider>
            <Router>
              <Routes />
            </Router>
            <Loading />
            <AlertMessage />
          </WalletProvider>
        </AlertMessageProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
