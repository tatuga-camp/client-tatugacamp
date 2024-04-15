import axios from "axios";
import { parseCookies } from "nookies";
import { Choice, FileOnQuestion } from "../../models";

type InputCreateChoiceService = {
  description: string;
  isAnswer: boolean;
  fileUrl: string;
  fileType: string;
  questionId: string;
  examinationId: string;
};
type ResponseCreateChoiceService = Choice;
export async function CreateChoiceService(
  input: InputCreateChoiceService
): Promise<ResponseCreateChoiceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const choice = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/choices`,
      responseType: "json",
      data: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return choice.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputUpdateChoiceService = {
  query: {
    choiceId: string;
  };
  body: {
    description?: string;
    isAnswer?: boolean;
    fileUrl?: string;
    fileType?: string;
  };
};
type ResponseUpdateChoiceService = Choice;
export async function UpdateChoiceService(
  input: InputUpdateChoiceService
): Promise<ResponseUpdateChoiceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const choice = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/choices`,
      responseType: "json",
      data: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return choice.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputDeleteChoiceService = {
  choiceId: string;
};
type ResponseDeleteChoiceService = { message: string };
export async function DeleteChoiceService(
  input: InputDeleteChoiceService
): Promise<ResponseDeleteChoiceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const choice = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/choices`,
      responseType: "json",
      params: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return choice.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}
