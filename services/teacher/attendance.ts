import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Attendance, Student } from "../../models";

type InputGetAllAttendanceForTeacherService = {
  classroomId: string;
};
type ResponseGetAllAttendanceForTeacherServiceFirstValue = {
  dateTimes: {
    date: string;
    groupId: string;
    headData: {
      id: string;
      createAt: string;
      updateAt: string;
      groupId: string;
      note: string;
    };
  }[];
  sum: number;
};
type ResponseGetAllAttendanceForTeacherService = [
  ResponseGetAllAttendanceForTeacherServiceFirstValue,
  ...{
    data: Attendance[];
    statistics: {
      percent: {
        present: number;
        absent: number;
        holiday: number;
        sick: number;
        late: number;
        noData: number;
      };
      number: {
        present: number;
        absent: number;
        holiday: number;
        sick: number;
        late: number;
        warn: number;
        noData: number;
      };
    };
    student: Student;
  }[]
];
export async function GetAllAttendanceForTeacherService({
  classroomId,
}: InputGetAllAttendanceForTeacherService): Promise<ResponseGetAllAttendanceForTeacherService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const attendances = await axios.get(
      `${process.env.MAIN_SERVER_URL}/teacher/attendance/get-all`,
      {
        params: {
          classroomId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return attendances.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
