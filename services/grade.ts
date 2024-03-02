import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Grade, GradeRange } from "../models";

type InputCreateGradeService = {
  classroomId: string;
  grandeRanges: GradeRange[];
};
type ResponseCreateGradeService = Grade;
export async function CreateGradeService({
  classroomId,
  grandeRanges,
}: InputCreateGradeService): Promise<ResponseCreateGradeService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const gradeRange = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/grade/create`,
      { classroomId, grandeRanges },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return gradeRange.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetAllGradeService = {
  classroomId: string;
};
type ResponseGetAllGradeService = GradeRange[];
export async function GetAllGradeService({
  classroomId,
}: InputGetAllGradeService): Promise<ResponseGetAllGradeService> {
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
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return grades.data;
  } catch (err: any) {
    throw new Error(err);
  }
}
