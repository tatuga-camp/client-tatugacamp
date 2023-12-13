import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function CheckPaymentIntent({ priceId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const paymentIntent = await axios.post(
      `${process.env.MAIN_SERVER_URL}/stripe/create-subscription`,
      { priceId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return paymentIntent.data;
  } catch (err) {
    throw new Error(err);
  }
}
