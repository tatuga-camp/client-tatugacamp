import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

export async function CreateGroupApi({ title, classroomId, groupNumber }) {
  try {
    const numgroup = Number(groupNumber);
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    console.log(title);
    const group = await axios.post(
      `${process.env.Server_Url}/user/group/create-group`,
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
  } catch (err) {
    throw new Error(err);
  }
}

export async function AddStudentToGroupApi({
  studentId,
  groupId,
  miniGroupId,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.post(
      `${process.env.Server_Url}/user/group/add-student-to-group`,
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
  } catch (err) {
    throw new Error(err);
  }
}
export async function RandomGroup({ classroomId, groupId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const group = await axios.put(
      `${process.env.Server_Url}/user/group/random-group`,
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
  } catch (err) {
    throw new Error(err);
  }
}
export async function GetGroup({ groupId }) {
  try {
    if (!groupId) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.get(
      `${process.env.Server_Url}/user/group/get-group`,
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
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetUnGroupStudent({ groupId, classroomId }) {
  try {
    if (!groupId || !classroomId) {
      throw new Error("Either groupId or classroomId not found");
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const ungroupStudents = await axios.get(
      `${process.env.Server_Url}/user/group/get-unGroup-students`,
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
  } catch (err) {
    throw new Error(err);
  }
}
export async function GetAllGroup({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const groups = await axios.get(
      `${process.env.Server_Url}/user/group/get-all-group`,
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
  } catch (err) {
    throw new Error(err);
  }
}
export async function DeleteGroup({ groupId }) {
  try {
    if (!groupId) {
      throw new Error("GroupId not found");
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.delete(
      `${process.env.Server_Url}/user/group/delete-group`,
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
  } catch (err) {
    throw new Error(err);
  }
}

export async function RemoveStudent({ groupId, studentId, miniGroupId }) {
  try {
    if (!groupId || !studentId || !miniGroupId) {
      throw new Error("Either groupId, studentId or miniGroupId not found");
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const group = await axios.delete(
      `${process.env.Server_Url}/user/group/remove-student`,
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
  } catch (err) {
    throw new Error(err);
  }
}
