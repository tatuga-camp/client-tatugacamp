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
      `${process.env.MAIN_SERVER_URL}/teacher/student/get-all`,
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
    console.error(err);
    throw new Error(err);
  }
}
