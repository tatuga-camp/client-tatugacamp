import React, { useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import Loading from "./loading/loading";

export default function CheckoutForm({ subscriptionId, user }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCard, setIsCard] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_CLIENT_URL}/payment/success?subscriptionId=${subscriptionId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
    defaultValues: {
      billingDetails: {
        email: user.email,
      },
    },
  };

  return (
    <form
      id="payment-form"
      className="flex flex-col items-center gap-2"
      onSubmit={handleSubmit}
    >
      {isCard && (
        <LinkAuthenticationElement
          id="link-authentication-element"
          options={{ defaultValues: { email: user.email } }}
        />
      )}
      <PaymentElement
        onChange={(event) => {
          if (event.value.type === "card") {
            setIsCard(() => true);
          } else if (event.value.type !== "card") {
            setIsCard(() => false);
          }
        }}
        id="payment-element"
        options={paymentElementOptions}
      />
      <button
        className="w-max h-max bg-blue-500 text-white rounded-xl drop-shadow p-2 font-Poppins "
        disabled={isLoading || !stripe || !elements}
        id="submit"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="flex justify-center items-center" id="spinner">
              <Loading />
            </div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
