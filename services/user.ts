import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { User } from "../models";

type ResponseGetUserService = User;
export async function GetUserService(): Promise<ResponseGetUserService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    if (!access_token) {
      throw new Error({ title: "Unauthorized", statusCode: 401 });
    }
    const user = await axios.get(`${process.env.MAIN_SERVER_URL}/users/me`, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    return user.data;
  } catch (err: any) {
    if (err.response.status === 401) {
      throw new Error({ title: "Unauthorized", statusCode: 401 });
    } else {
      throw new Error(err);
    }
  }
}

type InputGetUserCookieService = {
  access_token: string;
};
type ResponseGetUserCookieService = User;
export async function GetUserCookieService({
  access_token,
}: InputGetUserCookieService): Promise<ResponseGetUserCookieService> {
  try {
    const user = await axios.get(`${process.env.MAIN_SERVER_URL}/users/me`, {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });

    return user.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
type InputUploadProfilePictureService = {
  formData: FormData;
};
type ResponseUploadProfilePictureService = User;
export async function UploadProfilePictureService({
  formData,
}: InputUploadProfilePictureService): Promise<ResponseUploadProfilePictureService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    if (!access_token) {
      throw new Error({ title: "Unauthorized", statusCode: 401 });
    }
    const profile = await axios.post(
      `${process.env.MAIN_SERVER_URL}/users/upload`,
      formData,
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return profile.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

type InputUpdateUserService = {
  firstName: string;
  lastName: string;
  school: string;
  phone: string;
  language: string;
};
type ResponseUpdateUserService = User;
export async function UpdateUserService({
  firstName,
  lastName,
  school,
  phone,
  language,
}: InputUpdateUserService): Promise<ResponseUpdateUserService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const updateData = await axios.put(
      `${process.env.MAIN_SERVER_URL}/users/update-user`,
      {
        firstName: firstName,
        lastName: lastName,
        school: school,
        phone: phone,
        language: language,
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return updateData.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
