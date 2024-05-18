import axios from "axios";
import { parseCookies } from "nookies";
import {
  Choice,
  Examination,
  FileOnQuestion,
  Question,
  StudentOnExamination,
} from "../../models";

type InputGetExaminationsService = {
  classroomId: string;
};
type ResponseGetExaminationsService = Examination[];
export async function GetExaminationsService(
  input: InputGetExaminationsService,
): Promise<ResponseGetExaminationsService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const examination = await axios({
      method: "GET",
      url: `${process.env.MAIN_SERVER_URL}/user/examinations`,
      responseType: "json",
      params: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return examination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputGetExaminationService = {
  examinationId: string;
};
export type ResponseGetExaminationService = Examination & {
  questions: (Question & {
    choices: Choice[];
    fileOnQuestions: FileOnQuestion[];
  })[];
  studentOnExaminations: StudentOnExamination[];
};
export async function GetExaminationService(
  input: InputGetExaminationService,
): Promise<ResponseGetExaminationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const examination = await axios({
      method: "GET",
      url: `${process.env.MAIN_SERVER_URL}/user/examinations/${input.examinationId}`,
      responseType: "json",

      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return examination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputCreateExaminationService = {
  timeStart?: string;
  timeEnd?: string;
  duration?: number;
  title: string;
  description?: string;
  limitAttemps?: number;
  score?: number;
  classroomId: string;
};
type ResponseCreateExaminationService = Examination;
export async function CreateExaminationService(
  input: InputCreateExaminationService,
): Promise<ResponseCreateExaminationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const examination = await axios({
      method: "POST",
      url: `${process.env.MAIN_SERVER_URL}/user/examinations`,
      responseType: "json",
      data: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return examination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputUpdateExaminationService = {
  query: {
    examinationId: string;
  };
  body: {
    timeStart?: string;
    timeEnd?: string;
    duration?: number;
    title: string;
    description?: string;
    score: number;
    classroomId: string;
  };
};
type ResponseUpdateExaminationService = Examination;
export async function UpdateExaminationService(
  input: InputUpdateExaminationService,
): Promise<ResponseUpdateExaminationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const examination = await axios({
      method: "PATCH",
      url: `${process.env.MAIN_SERVER_URL}/user/examinations`,
      responseType: "json",
      data: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return examination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputDeleteExaminationService = {
  examinationId: string;
};
type ResponseDeleteExaminationService = Examination;
export async function DeleteExaminationService(
  input: InputDeleteExaminationService,
): Promise<ResponseDeleteExaminationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const examination = await axios({
      method: "DELETE",
      url: `${process.env.MAIN_SERVER_URL}/user/examinations`,
      responseType: "json",
      params: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return examination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}
