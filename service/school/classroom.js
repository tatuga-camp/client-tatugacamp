import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function RetrieveClassroom({ classroomCode }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.Server_Url}/user/school/retrive-classroom`,
      {
        params: {
          classroomCode: classroomCode,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAClassroom({ teacherId, classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.Server_Url}/user/school/classroom/get-classroom`,
      {
        params: {
          teacherId: teacherId,
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllClassroom({ page }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.Server_Url}/user/school/classroom/get-classrooms`,
      {
        params: {
          page: page,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllClassroomNumber({ access_token }) {
  try {
    const classroom = await axios.get(
      `${process.env.Server_Url}/user/school/classroom/get-classrooms-number`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom.data;
  } catch (err) {
    throw new Error(err);
  }
}
