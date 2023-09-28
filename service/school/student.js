import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllStudentsNumber() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
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

export async function GetAllStudentsByNationlity() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.get(
      `${process.env.Server_Url}/user/school/student/get-students-by-nationality`,
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

export async function GetAllStudentsInTeacherByNationlity({ teacherId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.get(
      `${process.env.Server_Url}/user/school/student/teacher/get-students-by-nationality`,
      {
        params: {
          teacherId: teacherId,
        },
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
