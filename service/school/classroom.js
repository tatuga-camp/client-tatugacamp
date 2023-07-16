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

export async function GetAllClassroom() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.Server_Url}/user/school/get-classrooms`,
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
