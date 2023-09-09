import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllPendingReviews() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const pendingReviews = await axios.get(
      `${process.env.Server_Url}/user/pending-review/get-all`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return pendingReviews.data;
  } catch (err) {
    throw new Error(err);
  }
}
