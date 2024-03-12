import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

type InputPostRequestResetPasswordService = {
  email: string;
};
type ResponsePostRequestResetPasswordService = { message: string };
export async function PostRequestResetPasswordService({
  email,
}: InputPostRequestResetPasswordService): Promise<ResponsePostRequestResetPasswordService> {
  try {
    const res = await axios.put(
      `${process.env.MAIN_SERVER_URL}/auth/forget-password`,
      { email: email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

type InputConfirmResetPasswordService = {
  resetToken: string;
  password: string;
};
type ResponseConfirmResetPasswordService = { message: string };
export async function ConfirmResetPasswordService({
  resetToken,
  password,
}: InputConfirmResetPasswordService): Promise<ResponseConfirmResetPasswordService> {
  try {
    const res = await axios.put(
      `${process.env.MAIN_SERVER_URL}/auth/reset-password`,
      { resetToken, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputNewPasswordService = {
  password: string;
};
type ResponseNewPasswordService = { message: string };
export async function NewPasswordService({
  password,
}: InputNewPasswordService): Promise<ResponseNewPasswordService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const res = await axios.put(
      `${process.env.MAIN_SERVER_URL}/auth/new-password`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
