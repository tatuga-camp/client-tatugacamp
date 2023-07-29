import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllStudentsNumber({ access_token }) {
  try {
    const students = await axios.get(
      `${process.env.Server_Url}/user/school/student/get-student-number`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return students.data;
  } catch (err) {
    throw new Error(err);
  }
}
