import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { SchoolUser, User } from "../models";

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
  firstName?: string;
  lastName?: string;
  school?: string;
  phone?: string;
  language?: string;
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

export type ResponseSignInJWTService = {
  user: User;
  access_token: string;
  schoolUser?: SchoolUser;
};

export async function SignInJWTService({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ResponseSignInJWTService> {
  try {
    const user = await axios.post(
      `${process.env.MAIN_SERVER_URL}/auth/sign-in/`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return user.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type InputSignUpJWTService = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
type ResponseSignUpJWTService = {
  user: User;
  access_token: string;
};
export async function SignUpJWTService({
  email,
  password,
  firstName,
  lastName,
}: InputSignUpJWTService): Promise<ResponseSignUpJWTService> {
  try {
    const user = await axios.post(
      `${process.env.MAIN_SERVER_URL}/auth/sign-up/`,
      {
        email,
        password,
        firstName,
        lastName,
        provider: "JWT",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return user.data;
  } catch (error: any) {
    console.error(error);
    throw error.response.data;
  }
}
