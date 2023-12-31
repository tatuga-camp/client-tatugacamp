import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function CreateClassroomService(inputObject) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/classroom/create`,
      {
        title: inputObject.title,
        description: inputObject.description,
        level: inputObject.level,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
  } catch (err) {
    console.log('err from service', err);
    throw new Error(err);
  }
}
export async function DuplicateClassroom({ classroomId }) {
  try {
    if (!classroomId) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/classroom/create-duplicate`,
      {},
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return classroom;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
export async function DeleteClassroom({ classroomId }) {
  const cookies = parseCookies();
  const access_token = cookies.access_token;
  try {
    const deleteClassroom = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/classroom/delete`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return deleteClassroom.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function AllowStudentDeleteWorkService({
  classroomId,
  allowStudentToDeleteWork,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classrooms = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/classroom/isAllowStudentDeleteWork`,
      {
        classroomId,
        allowStudentToDeleteWork,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return classrooms.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllClassrooms({ page, getAll }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classrooms = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/classroom/get-all-classroom`,
      {
        params: {
          page: page,
          getAll: getAll,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return classrooms.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllAchievedClassrooms({ page }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classrooms = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/classroom/get-all-achieved-classroom`,
      {
        params: {
          page: page,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return classrooms.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetOneClassroom({ params }) {
  try {
    if (!params) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/classroom/get-a-classroom/${params}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      },
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function AchieveClassroom({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/classroom/achieve-classroom`,
      {
        isAchieve: true,
        classroomId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      },
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}
export async function UnAchieveClassroom({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/classroom/unachieve-classroom`,
      {
        isUnachieve: false,
        classroomId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      },
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}
export async function UpdateClassroomColor({ classroomId, color }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/classroom/update-color`,
      {
        color: color,
        classroomId: classroomId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateClassroomOrder({ classroomId, order }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/classroom/update-order`,
      {
        order: order,
        classroomId: classroomId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateClassroom({ classroomState }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/classroom/update`,
      {
        title: classroomState.title,
        level: classroomState.level,
        description: classroomState.description,
      },
      {
        params: {
          classroomId: classroomState.id,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return classroom;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdatePercentageClassroom({
  classroomId,
  maxScore,
  percentage,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/update/classroom/speical-score/percentage`,
      {
        classroomId,
        maxScore,
        percentage,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return classroom.data;
  } catch (err) {
    throw new Error(err);
  }
}
