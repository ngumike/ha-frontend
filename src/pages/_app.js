import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AuthProvider } from '@/contexts/AuthContext';
import { SnackbarProvider } from 'notistack';

import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@/themes';
import { createEmotionCache } from '@/utils/create-emotion-cache';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Next + MUI</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ThemeProvider theme={createTheme()}>
            <SnackbarProvider
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </SnackbarProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </AuthProvider>
    </CacheProvider>
  );
};

export default App;
