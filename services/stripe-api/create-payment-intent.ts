import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

type InputCheckPaymentIntentService = {
  priceId: string;
};
type ResponseCheckPaymentIntentService = {
  clientSecret: string;
  subscriptionId: string;
};
export async function CheckPaymentIntentService({
  priceId,
}: InputCheckPaymentIntentService): Promise<ResponseCheckPaymentIntentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const paymentIntent = await axios.post(
      `${process.env.MAIN_SERVER_URL}/stripe/create-subscription`,
      { priceId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return paymentIntent.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
