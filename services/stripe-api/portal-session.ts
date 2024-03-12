import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

type ResponseProtalSessionService = string;
export async function ProtalSessionService(): Promise<ResponseProtalSessionService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const createPortalSession = await axios.post(
      `${process.env.MAIN_SERVER_URL}/stripe/create-portal-session`,
      {},
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
