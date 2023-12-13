import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllPendingReviews({ nextId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    if (nextId) {
      const pendingReviews = await axios.get(
        `${process.env.MAIN_SERVER_URL}/user/pending-review/get-all`,
        {
          params: {
            cursor: nextId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return pendingReviews.data;
    } else {
      const pendingReviews = await axios.get(
        `${process.env.MAIN_SERVER_URL}/user/pending-review/get-all`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return pendingReviews.data;
    }
  } catch (err) {
    throw new Error(err);
  }
}
