import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function GetTopTenAbsent() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const topTen = await axios.get(
      `${process.env.Server_Url}/user/school/attendance/top-10-absent`,
      {
        params: {
          page: 1,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return topTen.data;
  } catch (err) {
    throw new Error(err);
  }
}
export async function GetAllAttendanceTeacher({ teacherId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const attendances = await axios.get(
      `${process.env.Server_Url}/user/school/attendance/teacher/get-all-attendance`,
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
    return attendances.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetTopTenSick() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const topTen = await axios.get(
      `${process.env.Server_Url}/user/school/attendance/top-10-sick`,
      {
        params: {
          page: 1,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return topTen.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetTopTenHoliday() {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const topTen = await axios.get(
      `${process.env.Server_Url}/user/school/attendance/top-10-holiday`,
      {
        params: {
          page: 1,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return topTen.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAttendanceClassroom({ classroomId, teacherId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const attendance = await axios.get(
      `${process.env.Server_Url}/user/school/attendance/get-attendance-classroom`,
      {
        params: {
          classroomId: classroomId,
          teacherId: teacherId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return attendance.data;
  } catch (err) {
    throw new Error(err);
  }
}
