import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import {
  Assignment,
  Classroom,
  Score,
  Student,
  StudentWithScore,
  StudentWork,
} from "../models";

type InputGetAllStudentsService = {
  classroomId: string;
};
export type ResponseGetAllStudentsService = (Student & {
  score: {
    score: Score[];
    totalPoints: number;
  };
})[];
export async function GetAllStudentsService({
  classroomId,
}: InputGetAllStudentsService): Promise<ResponseGetAllStudentsService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const student = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/student/get-all-student?classroomId=${classroomId}`,
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type SetStudentPasswordService = {
  studentId: string;
};
type ResponseSetStudentPasswordService = Student;

export async function SetStudentPasswordService({
  studentId,
}: SetStudentPasswordService): Promise<ResponseSetStudentPasswordService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const student = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/student/set-password`,
      { studentId },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputResetStudentPasswordService = {
  studentId: string;
};
type ResponseResetStudentPasswordService = Student;
export async function ResetStudentPasswordService({
  studentId,
}: InputResetStudentPasswordService): Promise<ResponseResetStudentPasswordService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const student = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/student/reset-password`,
      { studentId },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetOneStudentService = {
  studentId: string;
};
type ResponseGetOneStudentService = StudentWithScore;
export async function GetOneStudentService({
  studentId,
}: InputGetOneStudentService): Promise<ResponseGetOneStudentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const student = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/student/get`,
      {
        params: {
          studentId,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetAllStudentScoresService = {
  classroomId: string;
};
export type ResponseGetAllStudentScoresService = {
  sumScoreTotal: number;
  assignments: Assignment[];
  classroom: Classroom;
  studentsScores: (Student & {
    score: {
      score: Score[];
      totalPoints: number;
    };
  } & {
    studentWorks: {
      assignment: Assignment;
      studentWork: StudentWork | null;
    }[];
  } & {
    totalPoints: number;
    grade: string;
  })[];
};
export async function GetAllStudentScoresService({
  classroomId,
}: InputGetAllStudentScoresService): Promise<ResponseGetAllStudentScoresService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/assignment/get-allStudentScores`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return students.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputCreateStudentService = {
  number: string;
  firstName: string;
  lastName: string;
  classroomId: string;
};
type ResponseCreateStudentService = Student;
export async function CreateStudentService({
  number,
  firstName,
  lastName,
  classroomId,
}: InputCreateStudentService): Promise<ResponseCreateStudentService> {
  const picture = [
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3049.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3050.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3051.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3052.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3053.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3054.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3060.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3062.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3677.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3678.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3679.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3680.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3681.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3682.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3683.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3684.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3685.PNG",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3686.PNG",
  ];
  try {
    const StringNumber = number.toString();
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const student = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/student/create?classroomId=${classroomId}`,
      {
        firstName: firstName,
        lastName: lastName,
        number: StringNumber,
        picture: picture[Math.floor(Math.random() * picture.length)],
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUpdateStudentService = {
  formData: FormData;
  studentId: string;
};
type ResponseUpdateStudentService = Student;
export async function UpdateStudentService({
  formData,
  studentId,
}: InputUpdateStudentService): Promise<ResponseUpdateStudentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const updateStudent = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/student/update`,
      formData,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return updateStudent.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDelteStudentService = {
  studentId: string;
};
type ResponseDelteStudentService = {
  message: string;
};
export async function DelteStudentService({
  studentId,
}: InputDelteStudentService): Promise<ResponseDelteStudentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const deleteStudent = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/student/delete`,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return deleteStudent.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
