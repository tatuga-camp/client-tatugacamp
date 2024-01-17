import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";

type InputDownloadExcelAttendanceService = {
  classroomId: string;
  absent: boolean;
  present: boolean;
  holiday: boolean;
  sick: boolean;
  warn: boolean;
  late: boolean;
  teacherId: string;
};
export async function DownloadExcelAttendanceService({
  classroomId,
  absent,
  present,
  holiday,
  sick,
  warn,
  late,
  teacherId,
}: InputDownloadExcelAttendanceService): Promise<void> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    axios
      .post(
        `${process.env.MAIN_SERVER_URL}/excel/download/attendance`,
        {
          absent,
          present,
          holiday,
          sick,
          late,
          warn,
          teacherId,
          classroomId: classroomId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          responseType: "blob", // to receive binary data
        }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "attendance.xlsx"); // set the filename for download
        document.body.appendChild(link);
        link.click();
      });
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDownloadExcelScoreService = {
  classroomId: string;
};
export async function DownloadExcelScoreService({
  classroomId,
}: InputDownloadExcelScoreService): Promise<void> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    axios
      .get(`${process.env.MAIN_SERVER_URL}/excel/download/scores`, {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        responseType: "blob", // to receive binary data
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "scores.xlsx"); // set the filename for download
        document.body.appendChild(link);
        link.click();
      });
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
