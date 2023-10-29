import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function CreateClassroomForTeacherService({
  title,
  level,
  description,
  studentClassId,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.post(
      `${process.env.Server_Url}/teacher/classroom/create`,
      { title, level, description, studentClassId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return classroom.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAllActiveClassroomInTeacherService({ page }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.Server_Url}/teacher/classroom/active/get-all`,
      {
        params: {
          page,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return classroom.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
