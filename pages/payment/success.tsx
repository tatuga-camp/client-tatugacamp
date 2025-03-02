import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import * as SuccesfulAnimation from "../../components/animations/jsons/79952-successful.json";
import { useRouter } from "next/router";
import Head from "next/head";
import { useStripe } from "@stripe/react-stripe-js";
import { FcDisclaimer } from "react-icons/fc";
import Loading from "../../components/loadings/loading";
import { HandleSucessPaymentService } from "../../services/stripe-api/sucesspayment";
import Link from "next/link";

function Success() {
  const stripe = useStripe();
  const [message, setMessage] = useState<string>();
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [url, setUrl] = useState<string>();
  const [loadingPayment, setLoadingPayment] = useState(true);
  const style = {
    height: 300,
  };
  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    if (!clientSecret) {
      return;
    }
    if (stripe && router.isReady) {
      stripe
        .retrievePaymentIntent(clientSecret)
        .then(async ({ paymentIntent }) => {
          switch (paymentIntent?.status) {
            case "succeeded":
              const response = await HandleSucessPaymentService({
                subscriptionId: router.query.subscriptionId as string,
              });
              setLoadingPayment(() => false);
              setUrl(() => response);
              setMessage("Payment succeeded!");
              break;
            case "processing":
              setLoadingPayment(() => true);
              setMessage("Your payment is processing.");
              break;
            case "requires_payment_method":
              setIsError(() => true);
              setLoadingPayment(() => false);
              setMessage("Your payment was not successful, please try again.");
              break;
            default:
              setIsError(() => true);
              setLoadingPayment(() => false);
              setMessage("Something went wrong.");
              break;
          }
        });
    }
  }, [stripe, router.isReady]);

  return (
    <div className="w-screen flex justify-center items-center h-screen bg-green-500">
      <Head>
        <title>{message}</title>
      </Head>
      <div className="w-10/12 h-max md:w-6/12 lg:w-5/12 bg-white rounded-2xl p-5 flex flex-col items-center justify-center  text-center drop-shadow-xl font-Poppins ">
        {loadingPayment ? (
          <div className="flex flex-col justify-center items-center">
            <span>please wait...</span>
            <Loading />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-9">
            <span className="font-semibold text-xl  text-green-500">
              {message}
            </span>
            {isError ? (
              <div className=" text-8xl flex items-center justify-center">
                <FcDisclaimer />
              </div>
            ) : (
              <Lottie animationData={SuccesfulAnimation} style={style} />
            )}
            {isError && (
              <div className="flex gap-5">
                <button
                  onClick={() =>
                    router.push({
                      pathname: "/classroom/teacher",
                    })
                  }
                  className="w-20 py-2 bg-blue-500 font-Poppins font-medium  rounded-lg text-white"
                >
                  home
                </button>
                <button
                  onClick={() =>
                    router.push({
                      pathname: "/classroom/subscriptions",
                    })
                  }
                  className="w-20 py-2 bg-blue-500 font-Poppins font-medium  rounded-lg text-white"
                >
                  retry
                </button>
              </div>
            )}
            {!isError && (
              <div className="w-full flex gap-5 justify-center">
                <button
                  onClick={() =>
                    router.push({
                      pathname: "/classroom/teacher",
                    })
                  }
                  className="bg-blue-500 font-semibold text-white p-3 rounded-lg hover:scale-110 transition duration-150"
                >
                  home
                </button>
                <Link
                  href={url as string}
                  className="bg-green-500 font-semibold text-white p-3 rounded-lg hover:scale-110 transition duration-150"
                >
                  check payment
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default Success;
