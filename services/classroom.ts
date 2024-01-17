import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Classroom } from "../models";

type InputCreateClassroomService = {
  title: string;
  description: string;
  level: string;
};
type ResponseCreateClassroomService = Classroom;
export async function CreateClassroomService({
  title,
  description,
  level,
}: InputCreateClassroomService): Promise<ResponseCreateClassroomService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/classroom/create`,
      {
        title: title,
        description: description,
        level: level,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom.data;
  } catch (err: any) {
    console.log("err from service", err);
    throw new Error(err);
  }
}

type InputDuplicateClassroomService = {
  classroomId: string;
};
type ResponseDuplicateClassroomService = Classroom;
export async function DuplicateClassroomService({
  classroomId,
}: InputDuplicateClassroomService): Promise<ResponseDuplicateClassroomService> {
  try {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classroom.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDeleteClassroomService = {
  classroomId: string;
};
type ResponseDeleteClassroomService = {
  message: string;
};
export async function DeleteClassroomService({
  classroomId,
}: InputDeleteClassroomService): Promise<ResponseDeleteClassroomService> {
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
      }
    );

    return deleteClassroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputAllowStudentDeleteWorkService = {
  classroomId: string;
  allowStudentToDeleteWork: boolean;
};
type ResponseAllowStudentDeleteWorkService = Classroom;
export async function AllowStudentDeleteWorkService({
  classroomId,
  allowStudentToDeleteWork,
}: InputAllowStudentDeleteWorkService): Promise<ResponseAllowStudentDeleteWorkService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classrooms.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetAllClassroomsService = {
  page: number;
};
type ResponseGetAllClassroomsService = {
  classrooms: Classroom[] | null;
  classroomsTotal: number;
  currentPage: number;
  totalPages: number;
};
export async function GetAllClassroomsService({
  page,
}: InputGetAllClassroomsService): Promise<ResponseGetAllClassroomsService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classrooms = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/classroom/get-all-classroom`,
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
    return classrooms.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetAllAchievedClassrooms = {
  page: number;
};
type ResponseGetAllAchievedClassrooms = {
  classrooms: Classroom[] | null;
  classroomsTotal: number;
  currentPage: number;
  totalPages: number;
};
export async function GetAllAchievedClassrooms({
  page,
}: InputGetAllAchievedClassrooms): Promise<ResponseGetAllAchievedClassrooms> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return classrooms.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetOneClassroomService = {
  classroomId: string;
};
type ResponseGetOneClassroomService = Classroom;
export async function GetOneClassroomService({
  classroomId,
}: InputGetOneClassroomService): Promise<ResponseGetOneClassroomService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/classroom/get-a-classroom`,
      {
        params: {
          classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return classroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputAchieveClassroomService = {
  classroomId: string;
};
type ResponseAchieveClassroomService = Classroom;
export async function AchieveClassroomService({
  classroomId,
}: InputAchieveClassroomService): Promise<ResponseAchieveClassroomService> {
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
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return classroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUnAchieveClassroom = {
  classroomId: string;
};
type ResponseUnAchieveClassroom = Classroom;
export async function UnAchieveClassroom({
  classroomId,
}: InputUnAchieveClassroom): Promise<ResponseUnAchieveClassroom> {
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
          "Content-Type": "application/json",
          Authorization: "Bearer " + access_token,
        },
      }
    );

    return classroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUpdateClassroomColorService = {
  classroomId: string;
  color: `#${string}`;
};
type ResponseUpdateClassroomColorService = Classroom;
export async function UpdateClassroomColorService({
  classroomId,
  color,
}: InputUpdateClassroomColorService): Promise<ResponseUpdateClassroomColorService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return classroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUpdateClassroomOrderService = {
  classroomId: string;
  order: number;
};
type ResponseUpdateClassroomOrderService = Classroom[];
export async function UpdateClassroomOrderService({
  classroomId,
  order,
}: InputUpdateClassroomOrderService): Promise<ResponseUpdateClassroomOrderService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return classroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUpdateClassroomService = {
  title: string;
  level: string;
  description: string;
  classroomId: string;
};
type ResponseUpdateClassroomService = Classroom;
export async function UpdateClassroomService({
  title,
  level,
  description,
  classroomId,
}: InputUpdateClassroomService): Promise<ResponseUpdateClassroomService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const classroom = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/classroom/update`,
      {
        title: title,
        level: level,
        description: description,
      },
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return classroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUpdatePercentageClassroomService = {
  classroomId: string;
  maxScore: string;
  percentage: string;
};
type ResponseUpdatePercentageClassroomService = Classroom;
export async function UpdatePercentageClassroomService({
  classroomId,
  maxScore,
  percentage,
}: InputUpdatePercentageClassroomService): Promise<ResponseUpdatePercentageClassroomService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return classroom.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
