import Layout from "@/components/layout/Layout";
import React, { useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";

import { trafficdata, transportportal } from "@/theme";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  const router = useRouter();
  const { pathname } = router;

  const healthCheckRoute = ["/health-check"];
  const displayProviders = !healthCheckRoute.includes(pathname);

  useEffect(() => {
    if (pageProps.dehydratedState) {
      queryClient.setQueryData(['dehydratedState'], pageProps.dehydratedState);
    }
  }, [pageProps.dehydratedState, queryClient]);

  return (
    <>
      {displayProviders ? (
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
              <ThemeProvider
                theme={
                  process.env.NEXT_PUBLIC_THEME_PROVIDER === "trafficdata"
                    ? trafficdata
                    : transportportal
                }
              >
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ThemeProvider>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </SessionProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
