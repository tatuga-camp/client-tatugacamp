import '../styles/globals.css';
import '../styles/taboo.css';
import '../styles/auth.css';
import '../styles/card.css';
import Script from 'next/script';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import NextTopLoader from 'nextjs-toploader';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);
function MyApp({ Component, pageProps: { ...pageProps } }) {
  return (
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
        <NextTopLoader showSpinner={false} />
        <Component {...pageProps} />
      </Elements>
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </QueryClientProvider>
  );
}

export default MyApp;
