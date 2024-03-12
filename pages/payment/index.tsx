import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import Layout from "../../layouts/tatugaClassLayout";
import {
  MenubarsMain,
  sideMenusEnglish,
  sideMenusThai,
} from "../../data/menubarsMain";
import CheckoutForm from "../../components/payments/checkoutForm";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { CheckPaymentIntentService } from "../../services/stripe-api/create-payment-intent";
import { User } from "../../models";
import Loading from "../../components/loadings/loading";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { GetUserCookieService } from "../../services/user";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Index({ user }: { user: User }) {
  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionId, setSubsctiptionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sideMenus, setSideMenus] = useState<MenubarsMain>();

  const router = useRouter();
  useEffect(() => {
    if (router.isReady && router.query.priceId) {
      const fetchCreateIntent = async () => {
        setLoading(() => true);
        const response = await CheckPaymentIntentService({
          priceId: router.query.priceId as string,
        });
        setClientSecret(() => response.clientSecret);
        setSubsctiptionId(() => response.subscriptionId);
        setLoading(() => false);
      };
      fetchCreateIntent();
    }
    // Create PaymentIntent as soon as the page loads
  }, [router.isReady]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "flat",
    },
  };
  useEffect(() => {
    setSideMenus(() => {
      if (user.language === "Thai") {
        return sideMenusThai;
      } else if (user.language === "English") {
        return sideMenusEnglish;
      }
    });
  }, []);

  return (
    <div className="full flex justify-center items-center h-screen bg-gradient-to-t from-blue-200 to-blue-200">
      <Layout user={user} sideMenus={sideMenus as MenubarsMain}>
        {clientSecret && !loading ? (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm user={user} subscriptionId={subscriptionId} />
          </Elements>
        ) : (
          <Loading />
        )}
      </Layout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (accessToken) {
    try {
      const userData = await GetUserCookieService({
        access_token: accessToken,
      });
      const user = userData;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/signIn",
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signIn",
      },
    };
  }
};
