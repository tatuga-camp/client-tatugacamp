import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function CreateGradeApi({ classroomId, grandeRanges }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const gradeRange = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/grade/create`,
      { classroomId, grandeRanges },
      {
        headers: {
          Authorization: 'Bearer ' + access_token,
          'Content-Type': 'application/json',
        },
      },
    );

    return gradeRange.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllGrade({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const grades = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/grade/get-all`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: 'Bearer ' + access_token,
          'Content-Type': 'application/json',
        },
      },
    );

    return grades.data;
  } catch (err) {
    throw new Error(err);
  }
}
