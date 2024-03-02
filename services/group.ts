import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import {
  Group,
  MiniGroup,
  MiniGroupOnStudent,
  Student,
  StudentWithScore,
} from "../models";

type InputCreateGroupService = {
  title: string;
  classroomId: string;
  groupNumber: string;
};

type ResponseCreateGroupService = {
  group: Group;
  miniGroups: {
    data: MiniGroup;
    students: Student[];
  }[];
};
export async function CreateGroupService({
  title,
  classroomId,
  groupNumber,
}: InputCreateGroupService): Promise<ResponseCreateGroupService> {
  try {
    const numgroup = Number(groupNumber);
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    console.log(title);
    const group = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/group/create-group`,
      {
        title,
        classroomId,
        groupNumber: numgroup,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return group.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputAddStudentToGroupService = {
  studentId: string;
  groupId: string;
  miniGroupId: string;
};
type ResponseAddStudentToGroupService = MiniGroupOnStudent;
export async function AddStudentToGroupService({
  studentId,
  groupId,
  miniGroupId,
}: InputAddStudentToGroupService): Promise<ResponseAddStudentToGroupService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/group/add-student-to-group`,
      {
        studentId,
        groupId,
        miniGroupId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return group.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputRandomGroupService = {
  classroomId: string;
  groupId: string;
};
type ResponseRandomGroupService = string[];
export async function RandomGroupService({
  classroomId,
  groupId,
}: InputRandomGroupService): Promise<ResponseRandomGroupService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const group = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/group/random-group`,
      {
        groupId,
        classroomId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return group.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetGroupService = {
  groupId: string;
};
export type ResponseGetGroupService = {
  group: Group;
  miniGroups: {
    data: MiniGroup;
    students: StudentWithScore[];
  }[];
};
export async function GetGroupService({
  groupId,
}: InputGetGroupService): Promise<ResponseGetGroupService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/group/get-group`,
      {
        params: {
          groupId: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return group.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetUnGroupStudentService = {
  groupId: string;
  classroomId: string;
};
type ResponseGetUnGroupStudentService = Student[];
export async function GetUnGroupStudentService({
  groupId,
  classroomId,
}: InputGetUnGroupStudentService): Promise<ResponseGetUnGroupStudentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const ungroupStudents = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/group/get-unGroup-students`,
      {
        params: {
          groupId,
          classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return ungroupStudents.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type GetAllGroupService = {
  classroomId: string;
};
export type ResponseGetAllGroupService = Group[];
export async function GetAllGroupService({
  classroomId,
}: GetAllGroupService): Promise<ResponseGetAllGroupService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const groups = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/group/get-all-group`,
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
    return groups.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputDeleteGroupService = {
  groupId: string;
};
type ResponseDeleteGroupService = { message: string };
export async function DeleteGroupService({
  groupId,
}: InputDeleteGroupService): Promise<ResponseDeleteGroupService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/group/delete-group`,
      {
        params: {
          groupId: groupId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return group.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputRemoveStudentService = {
  groupId: string;
  studentId: string;
  miniGroupId: string;
};
type ResponseRemoveStudentService = {
  message: string;
};
export async function RemoveStudentService({
  groupId,
  studentId,
  miniGroupId,
}: InputRemoveStudentService): Promise<ResponseRemoveStudentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/group/remove-student`,
      {
        params: {
          studentId,
          miniGroupId,
          groupId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return group.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
