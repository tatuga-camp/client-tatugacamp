import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

type InputHandleSucessPaymentService = {
  subscriptionId: string;
};
type ResponseHandleSucessPaymentService = string;
export async function HandleSucessPaymentService({
  subscriptionId,
}: InputHandleSucessPaymentService): Promise<ResponseHandleSucessPaymentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const createPortalSession = await axios.post(
      `${process.env.MAIN_SERVER_URL}/stripe/success-payment`,
      { subscriptionId: subscriptionId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return createPortalSession.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
