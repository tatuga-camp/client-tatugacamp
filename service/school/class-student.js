import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function CreateClassStudentService({
  level,
  term,
  year,
  classroom,
}) {
  try {
    const cookies = parseCookies();
    const formatDate = new Date(year).toISOString();
    const access_token = cookies.access_token;
    const classStudent = await axios.post(
      `${process.env.Server_Url}/user/schoolUser/student-class/create`,
      { level, term, year: formatDate, class: classroom },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return classStudent.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAllStudentClassService({ nextId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    if (nextId) {
      const classStudent = await axios.get(
        `${process.env.Server_Url}/user/schoolUser/student-class/get-all`,
        {
          params: {
            cursor: nextId,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      return classStudent.data;
    } else {
      const classStudent = await axios.get(
        `${process.env.Server_Url}/user/schoolUser/student-class/get-all`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      return classStudent.data;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateClassStudentService({
  level,
  term,
  year,
  classroom,
  studentClassId,
}) {
  try {
    const cookies = parseCookies();
    const formatDate = new Date(year).toISOString();
    const access_token = cookies.access_token;
    const classStudent = await axios.put(
      `${process.env.Server_Url}/user/schoolUser/student-class/update`,
      { level, term, year: formatDate, class: classroom, studentClassId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return classStudent.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DeleteStudentClassService({ studentClassId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classStudent = await axios.delete(
      `${process.env.Server_Url}/user/schoolUser/student-class/delete`,
      {
        params: {
          studentClassId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return classStudent.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
