import { Alert, StyledEngineProvider } from "@mui/material";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";

import "../styles/globals.css";
import "../styles/taboo.css";
import "../styles/auth.css";
import "../styles/card.css";
import Script from "next/script";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
});
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
function MyApp({ Component, pageProps: { ...pageProps } }) {
  return (
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-WZH3JD3STK"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >{` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-WZH3JD3STK');`}</Script>
        <Elements stripe={stripePromise}>
          <Component {...pageProps} />
        </Elements>
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
      </QueryClientProvider>
    </StyledEngineProvider>
  );
}

export default MyApp;
