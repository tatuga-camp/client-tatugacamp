import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function HandleSucessPayment({ subscriptionId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const createPortalSession = await axios.post(
      `${process.env.Server_Url}/stripe/success-payment`,
      { subscriptionId: subscriptionId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return createPortalSession;
  } catch (err) {
    throw new Error(err);
  }
}
