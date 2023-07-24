import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
export async function GetAllTeachers({ page }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const teachers = await axios.get(
      `${process.env.Server_Url}/user/school/teacher/get-teachers`,
      {
        params: {
          page: page,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return teachers.data;
  } catch (err) {
    throw new Error(err);
  }
}
export async function GetAllTeachersNumber({ access_token }) {
  try {
    // const cookies = parseCookies();
    // const access_token = cookies.access_token;

    const teachers = await axios.get(
      `${process.env.Server_Url}/user/school/teacher/get-teachers-number`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return teachers.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function CreateAccount({
  email,
  password,
  firstName,
  lastName,
  phone,
  school,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const teacher = await axios.post(
      `${process.env.Server_Url}/user/school/create-user`,
      {
        email,
        password,
        firstName,
        lastName,
        phone,
        school,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return teacher;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateTeacherAccount({
  email,
  firstName,
  lastName,
  phone,
  school,
  isDisabled,
  teacherId,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const teacher = await axios.put(
      `${process.env.Server_Url}/user/school/teacher/update-teacher`,
      {
        email,
        firstName,
        lastName,
        phone,
        school,
        isDisabled,
        teacherId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return teacher;
  } catch (err) {
    throw new Error(err);
  }
}

export async function ResetPassword({ password, teacherId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const updateAuth = await axios.put(
      `${process.env.Server_Url}/user/school/teacher/reset-password`,
      {
        password,
        teacherId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return updateAuth.data;
  } catch (err) {
    throw new Error(err);
  }
}
