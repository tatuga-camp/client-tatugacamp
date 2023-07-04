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
      return null;
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
