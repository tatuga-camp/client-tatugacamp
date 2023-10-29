import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllStudentsInClassroomForTeacherService({
  classroomId,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.get(
      `${process.env.Server_Url}/teacher/student/get-all`,
      {
        params: {
          classroomId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return students;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
