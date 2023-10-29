import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetAllStudentsNumber() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.get(
      `${process.env.Server_Url}/user/schoolUser/student/get-student-number`,
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
      `${process.env.Server_Url}/user/schoolUser/student/get-students-by-nationality`,
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
      `${process.env.Server_Url}/user/schoolUser/student/teacher/get-students-by-nationality`,
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
const picture = [
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3049.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3050.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3051.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3052.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3053.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3054.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3060.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3062.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3677.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3678.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3679.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3680.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3681.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3682.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3683.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3684.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3685.PNG',
  'https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3686.PNG',
];
export async function CreateStudentInStudentClassService({
  number,
  firstName,
  lastName,
  studentClassId,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.post(
      `${process.env.Server_Url}/user/schoolUser/student/create`,
      {
        number,
        firstName,
        lastName,
        studentClassId,
        picture: picture[Math.floor(Math.random() * picture.length)],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return students.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateStudentInStudentClassService({
  number,
  firstName,
  lastName,
  studentId,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.put(
      `${process.env.Server_Url}/user/schoolUser/student/update`,
      {
        number,
        firstName,
        lastName,
        studentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return students.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DeleteStudentInStudentClassService({ studentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.delete(
      `${process.env.Server_Url}/user/schoolUser/student/delete`,
      {
        params: {
          studentId: studentId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return students.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAllStudentInStudentClassService({ studentClassId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const students = await axios.get(
      `${process.env.Server_Url}/user/schoolUser/student/get-all`,
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
    return students.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
