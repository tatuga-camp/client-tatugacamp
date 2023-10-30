import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllAttendanceForTeacherService({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const res = await axios.get(
      `${process.env.Server_Url}/teacher/attendance/get-all`,
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
    return res;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
