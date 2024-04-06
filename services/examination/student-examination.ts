import axios from "axios";
import { parseCookies } from "nookies";
import { StudentOnExamination } from "../../models";

type InputCreateStudentOnExaminationService = {
  firstName: string;
  lastName: string;
  number: string;
  picture: string;
  score: number;
  studentId: string;
  examinationId: string;
};
type ResponseCreateStudentOnExaminationService = StudentOnExamination;
export async function CreateStudentOnExaminationService(
  input: InputCreateStudentOnExaminationService
): Promise<ResponseCreateStudentOnExaminationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studetOnExamination = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/studentOnExaminations`,
      responseType: "json",
      data: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return studetOnExamination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputUpdateStudentOnExaminationService = {
  query: {
    studentOnExaminationId: string;
  };
  body: {
    firstName?: string;
    lastName?: string;
    number?: string;
    picture?: string;
  };
};
type ResponseUpdateStudentOnExaminationService = StudentOnExamination;
export async function UpdateStudentOnExaminationService(
  input: InputUpdateStudentOnExaminationService
): Promise<ResponseUpdateStudentOnExaminationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studetOnExamination = await axios({
      method: "PATCH",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/studentOnExaminations`,
      responseType: "json",
      data: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return studetOnExamination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}

type InputDeleteStudentOnExaminationService = {
  studentOnExaminationId: string;
};
type ResponseDeleteStudentOnExaminationService = { message: string };
export async function DeleteStudentOnExaminationService(
  input: InputDeleteStudentOnExaminationService
): Promise<ResponseDeleteStudentOnExaminationService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studetOnExamination = await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_API}/user/examinations/studentOnExaminations`,
      responseType: "json",
      params: {
        ...input,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return studetOnExamination.data;
  } catch (err: any) {
    console.error(err.response.data);
    throw err.response.data;
  }
}
