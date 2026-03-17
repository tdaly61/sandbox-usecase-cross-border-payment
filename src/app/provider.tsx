import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors/main';
import { Spinner } from '@/components/ui/spinner/spinner';
import { defaultTheme } from '@/config/theme';
import { LogViewerProvider } from '@/hooks/log-viewer-provider';
import { AuthLoader } from '@/lib/auth';
import { queryConfig } from '@/lib/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <React.Suspense fallback={<Spinner />}>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <SnackbarProvider>
          <LogViewerProvider>
            <ErrorBoundary FallbackComponent={MainErrorFallback}>
              <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                  {import.meta.env.DEV && <ReactQueryDevtools />}
                  <AuthLoader renderLoading={() => <Spinner />}>{children}</AuthLoader>
                </QueryClientProvider>
              </HelmetProvider>
            </ErrorBoundary>
          </LogViewerProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </React.Suspense>
  );
};
