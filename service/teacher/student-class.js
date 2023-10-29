import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllStudentClassService() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studentClass = await axios.get(
      `${process.env.Server_Url}/teacher/student-class/get-all`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return studentClass.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
