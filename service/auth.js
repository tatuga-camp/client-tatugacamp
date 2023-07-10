import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function PostRequestResetPassword({ email }) {
  try {
    const res = await axios.put(
      `${process.env.Server_Url}/auth/forget-password`,
      { email: email },
      {}
    );

    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function ConfirmResetPassword({ resetToken, password }) {
  try {
    const res = await axios.put(
      `${process.env.Server_Url}/auth/reset-password`,
      { resetToken, password },
      {}
    );

    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
