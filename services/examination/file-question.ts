import axios from "axios";
import { parseCookies } from "nookies";
import { FileOnQuestion } from "../../models";

type InputCreateFileOnQuestionService = {
  type: string;
  url: string;
  size: string;
  questionId: string;
  examinationId: string;
};
type ResponseCreateFileOnQuestionService = FileOnQuestion;
export async function CreateFileOnQuestionService(
  input: InputCreateFileOnQuestionService
): Promise<ResponseCreateFileOnQuestionService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const question = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/fileOnQuestions`,
      responseType: "json",
      data: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return question.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputDeleteFileOnQuestionService = {
  fileOnQuestionId: string;
};
type ResponseDeleteFileOnQuestionService = { message: string };
export async function DeleteFileOnQuestionService(
  input: InputDeleteFileOnQuestionService
): Promise<ResponseDeleteFileOnQuestionService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const question = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/fileOnQuestions`,
      responseType: "json",
      params: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return question.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}
