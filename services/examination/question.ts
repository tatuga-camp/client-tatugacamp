import axios from "axios";
import { parseCookies } from "nookies";
import { Question, QuestionType } from "../../models";

type InputCreateQuestionService = {
  score: string;
  description: string;
  examinationId: string;
  questionType: QuestionType;
};
type ResponseCreateQuestionService = Question;
export async function CreateQuestionService(
  input: InputCreateQuestionService
): Promise<ResponseCreateQuestionService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const question = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/fileOnQuestion`,
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

type InputUpdateQuestionService = {
  query: {
    questionId: string;
  };
  body: {
    score?: string;
    description?: string;
    questionType?: QuestionType;
  };
};
type ResponseUpdateQuestionService = Question;
export async function UpdateQuestionService(
  input: InputUpdateQuestionService
): Promise<ResponseUpdateQuestionService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const question = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/questions`,
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

type InputDeleteQuestionService = {
  questionId: string;
};
type ResponseDeleteQuestionService = { message: string };
export async function DeleteQuestionService(
  input: InputDeleteQuestionService
): Promise<ResponseDeleteQuestionService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const question = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/questions`,
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
