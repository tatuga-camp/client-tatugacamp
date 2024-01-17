import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Feedback } from "../models";

type InputCreateFeedbackService = {
  body: string;
  checkAuth: {
    auth?: boolean;
    unAuth?: boolean;
  };
  tag: string;
  userId: string;
};
type ResponseCreateFeedbackService = Feedback;
export async function CreateFeedbackService({
  body,
  checkAuth,
  tag,
  userId,
}: InputCreateFeedbackService): Promise<ResponseCreateFeedbackService> {
  try {
    let axiosConfig: {
      headers: any;
      params?: any;
    } = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // If user is authenticated, include userId in the request
    if (checkAuth.auth === true) {
      axiosConfig.params = {
        userId: userId,
      };
    }

    const feedback = await axios.post(
      `${process.env.MAIN_SERVER_URL}/feedback/post-feedback`,
      {
        body: body,
        tag: tag,
      },
      axiosConfig
    );

    return feedback.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
