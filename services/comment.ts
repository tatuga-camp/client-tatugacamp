import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Comment } from "../models";

type InputGetCommentsService = {
  assignmentId: string;
  studentId: string;
};
type ResponseGetCommentsService = Comment;
export async function GetCommentsService({
  assignmentId,
  studentId,
}: InputGetCommentsService): Promise<ResponseGetCommentsService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const comments = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/comment/get-comment`,
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return comments.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputPostCommentService = {
  assignmentId: string;
  studentId: string;
  body: string;
};

type ResponsePostCommentService = Comment;
export async function PostCommentService({
  assignmentId,
  studentId,
  body,
}: InputPostCommentService): Promise<ResponsePostCommentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const comments = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/comment/post-comment`,
      {
        body: body,
        assignmentId: assignmentId,
        studentId: studentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return comments.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDeleteStudentCommentService = {
  studentCommentId: string;
};
type ResponseDeleteStudentCommentService = { message: string };
export async function DeleteStudentCommentService({
  studentCommentId,
}: InputDeleteStudentCommentService): Promise<ResponseDeleteStudentCommentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const deleteComment = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/comment/delete-comment-student`,
      {
        params: {
          studentCommentId: studentCommentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return deleteComment.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDeleteTeachertCommentService = {
  teacherCommentId: string;
};
type ResponseDeleteTeachertCommentService = { message: string };
export async function DeleteTeachertCommentService({
  teacherCommentId,
}: InputDeleteTeachertCommentService): Promise<ResponseDeleteTeachertCommentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const deleteComment = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/comment/delete-comment-teacher`,
      {
        params: {
          teacherCommentId: teacherCommentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return deleteComment.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
