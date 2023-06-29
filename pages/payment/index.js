import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/checkoutForm";
import { CheckPaymentIntent } from "../../service/stripe-api/create-payment-intent";
import { useRouter } from "next/router";
import Loading from "../../components/loading/loading";
import Unauthorized from "../../components/error/unauthorized";
import { GetUserCookie } from "../../service/user";
import { parseCookies } from "nookies";
import Layout from "../../layouts/schoolLayout";
import {
  sideMenusEnglish,
  sideMenusThai,
} from "../../data/menubarsSubscription";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Index({ user, error }) {
  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionId, setSubsctiptionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [sideMenus, setSideMenus] = useState();

  const router = useRouter();
  useEffect(() => {
    if (router.isReady && router.query.priceId) {
      const fetchCreateIntent = async () => {
        setLoading(() => true);
        const response = await CheckPaymentIntent({
          priceId: router.query.priceId,
        });
        setClientSecret(() => response.clientSecret);
        setSubsctiptionId(() => response.subscriptionId);
        setLoading(() => false);
      };
      fetchCreateIntent();
    }
    // Create PaymentIntent as soon as the page loads
  }, [router.isReady]);

  const appearance = {
    theme: "flat",
  };
  const options = {
    clientSecret,
    appearance,
  };
  useEffect(() => {
    setSideMenus(() => {
      if (user?.language === "Thai") {
        return sideMenusThai;
      } else if (user?.language === "English") {
        return sideMenusEnglish;
      }
    });
  }, []);
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }

  return (
    <div className="full flex justify-center items-center h-screen bg-gradient-to-t from-blue-200 to-blue-200">
      <Layout user={user} sideMenus={sideMenus}>
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
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;
  if (!accessToken && !query.access_token) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: "unauthorized",
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  }
}
