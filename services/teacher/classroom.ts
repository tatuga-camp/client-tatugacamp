import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Classroom } from "../../models";

type InputCreateClassroomForTeacherService = {
  title: string;
  level: string;
  description: string;
  studentClassId: string;
};
type ResponseCreateClassroomForTeacherService = Classroom;
export async function CreateClassroomForTeacherService({
  title,
  level,
  description,
  studentClassId,
}: InputCreateClassroomForTeacherService): Promise<ResponseCreateClassroomForTeacherService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.post(
      `${process.env.MAIN_SERVER_URL}/teacher/classroom/create`,
      { title, level, description, studentClassId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputGetAllActiveClassroomInTeacherService = {
  page: number;
};
type ResponseGetAllActiveClassroomInTeacherService = {
  classrooms: Classroom[] | null;
  classroomsTotal: number;
  currentPage: number;
  totalPages: number;
};

export async function GetAllActiveClassroomInTeacherService({
  page,
}: InputGetAllActiveClassroomInTeacherService): Promise<ResponseGetAllActiveClassroomInTeacherService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.MAIN_SERVER_URL}/teacher/classroom/active/get-all`,
      {
        params: {
          page,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
