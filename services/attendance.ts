import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import {
  Attendance,
  HeadAttendance,
  QrCodeAttendance,
  Student,
  StudentWithScore,
} from "../models";
import { Base64ToFile } from "./base64ToFile";

type InputCreateAttendanceService = {
  classroomId: string;
  attendanceDate: string;
  endAttendanceDate: string;
  students: (StudentWithScore & {
    attendance: {
      absent: boolean;
      present: boolean;
      holiday: boolean;
      sick: boolean;
      late: boolean;
    };
  })[];
  note: string;
  imagesBase64: string[];
};
type ResponseCreateAttendanceService = Attendance[];
export async function CreateAttendanceService({
  classroomId,
  attendanceDate,
  endAttendanceDate,
  students,
  note,
  imagesBase64,
}: InputCreateAttendanceService): Promise<ResponseCreateAttendanceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formatDate = new Date(attendanceDate).toISOString();
    const endAttendanceDateFormat = new Date(endAttendanceDate).toISOString();

    // check if imageBase64 containing array
    if (imagesBase64.length > 0) {
      const files = await Base64ToFile({ imagesBase64 });
      // get signURL of each files
      const urls = await axios.post(
        `${process.env.MAIN_SERVER_URL}/user/attendance/head-attendance/upload-signUrl`,
        {
          files,
          classroomId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // upload file directly to google storage from client
      for (let i = 0; i < urls.data.urls.length; i++) {
        await fetch(urls.data.urls[i].SignedURL, {
          method: "PUT",
          headers: {
            "Content-Type": `${urls.data.urls[i].contentType}`,
          },
          body: files[i].file,
        }).catch((err) => console.error(err));
      }

      // replace actual URL of each file to imageBase64
      let updatedContent = note;
      for (let i = 0; i < imagesBase64.length; i++) {
        const base64Image = imagesBase64[i];
        const imageUrl = urls.data.baseUrls[i];
        updatedContent = updatedContent.replace(base64Image, imageUrl);
      }

      // map through isChecks to get only studentId and data of attendance
      const studentIds = students.map((student) => {
        return {
          id: student.id,
          attendance: student.attendance,
        };
      });

      // create attendance
      const attendacne = await axios.post(
        `${process.env.MAIN_SERVER_URL}/user/attendance/create`,
        {
          date: formatDate,
          students: studentIds,
          note: updatedContent,
          classroomId: classroomId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return attendacne.data;

      // if request does not contain any file
    } else {
      const studentIds = students.map((student) => {
        return {
          id: student.id,
          attendance: student.attendance,
        };
      });
      const attendacne = await axios.post(
        `${process.env.MAIN_SERVER_URL}/user/attendance/create`,
        {
          date: formatDate,
          students: studentIds,
          note,
          endDate: endAttendanceDateFormat,
          classroomId: classroomId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      return attendacne.data;
    }
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputGetAllAttendanceService = {
  classroomId: string;
};

type DateTime = {
  date: string;
  groupId: string;
  headData: {
    id: string;
    createAt: string;
    updateAt: string;
    groupId: string;
    note: string;
  };
};

type StatisticsPercent = {
  present: number;
  absent: number;
  holiday: number;
  sick: number;
  late: number;
  noData: number;
};

type StatisticsNumber = {
  present: number;
  absent: number;
  holiday: number;
  sick: number;
  late: number;
  warn: number;
  noData: number;
};
export type FirstResponseGetAllAttendanceService = {
  dateTimes: DateTime[];
  sum: number;
};
export type SecondResponseGetAllAttendanceService = {
  student: Student;
  data: Attendance[];
  statistics: {
    percent: StatisticsPercent;
    number: StatisticsNumber;
  };
};
export type ResponseGetAllAttendanceService = [
  FirstResponseGetAllAttendanceService,
  SecondResponseGetAllAttendanceService[]
];
export async function GetAllAttendanceService({
  classroomId,
}: InputGetAllAttendanceService): Promise<ResponseGetAllAttendanceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const GetAllAttendacne = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/attendance/get-all`,
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
    return GetAllAttendacne.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputUpdateHeadAttendanceService = {
  imagesBase64: string[];
  note: string;
  headAttendanceId: string;
  classroomId: string;
  groupId: string;
};
type ResponseUpdateHeadAttendanceService = HeadAttendance;
export async function UpdateHeadAttendanceService({
  imagesBase64,
  note,
  headAttendanceId,
  classroomId,
  groupId,
}: InputUpdateHeadAttendanceService): Promise<ResponseUpdateHeadAttendanceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formData = new FormData();

    if (imagesBase64.length > 0) {
      const files = await Base64ToFile({ imagesBase64 });

      const urls = await axios.post(
        `${process.env.MAIN_SERVER_URL}/user/attendance/head-attendance/upload-signUrl`,
        {
          files,
          classroomId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      for (let i = 0; i < urls.data.urls.length; i++) {
        await fetch(urls.data.urls[i].SignedURL, {
          method: "PUT",
          headers: {
            "Content-Type": `${urls.data.urls[i].contentType}`,
          },
          body: files[i].file,
        }).catch((err) => console.error(err));
      }

      let updatedContent = note;
      for (let i = 0; i < imagesBase64.length; i++) {
        const base64Image = imagesBase64[i];
        const imageUrl = urls.data.baseUrls[i];
        updatedContent = updatedContent.replace(base64Image, imageUrl);
      }

      const update = await axios.put(
        `${process.env.MAIN_SERVER_URL}/user/attendance/head-attendance/update`,
        { headAttendanceId, note: updatedContent, groupId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return update.data;
    } else {
      const update = await axios.put(
        `${process.env.MAIN_SERVER_URL}/user/attendance/head-attendance/update`,
        { headAttendanceId, note, groupId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return update.data;
    }
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDeleteAttendanceService = {
  groupId: string;
};
type ResponseDeleteAttendanceService = { message: string };
export async function DeleteAttendanceService({
  groupId,
}: InputDeleteAttendanceService): Promise<ResponseDeleteAttendanceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const deleteAttendance = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/attendance/delete`,
      {
        params: {
          groupId: groupId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return deleteAttendance.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputUpdateAttendnaceService = {
  absent: boolean;
  present: boolean;
  holiday: boolean;
  sick: boolean;
  late: boolean;
  studentId: string;
  attendanceId: string;
  imagesBase64: string[];
  note: string;
  warn: boolean;
};
type ResponseUpdateAttendnaceService = Attendance;
export async function UpdateAttendnaceService({
  absent,
  present,
  holiday,
  sick,
  late,
  studentId,
  attendanceId,
  imagesBase64,
  note,
  warn,
}: InputUpdateAttendnaceService): Promise<ResponseUpdateAttendnaceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formData = new FormData();

    if (imagesBase64.length > 0) {
      const files = await Base64ToFile({ imagesBase64 });

      const urls = await axios.post(
        `${process.env.MAIN_SERVER_URL}/user/attendance/upload-signUrl`,
        {
          files,
          studentId,
          attendanceId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      for (let i = 0; i < urls.data.urls.length; i++) {
        await fetch(urls.data.urls[i].SignedURL, {
          method: "PUT",
          headers: {
            "Content-Type": `${urls.data.urls[i].contentType}`,
          },
          body: files[i].file,
        }).catch((err) => console.error(err));
      }

      let updatedContent = note;
      for (let i = 0; i < imagesBase64.length; i++) {
        const base64Image = imagesBase64[i];
        const imageUrl = urls.data.baseUrls[i];
        updatedContent = updatedContent.replace(base64Image, imageUrl);
      }

      const update = await axios.put(
        `${process.env.MAIN_SERVER_URL}/user/attendance/update`,
        {
          absent,
          present,
          holiday,
          sick,
          warn,
          late,
          note: updatedContent,
          attendanceId: attendanceId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return update.data;
    } else {
      const update = await axios.put(
        `${process.env.MAIN_SERVER_URL}/user/attendance/update`,
        {
          absent,
          present,
          holiday,
          sick,
          late,
          warn,
          note,
          attendanceId: attendanceId,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return update.data;
    }
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputGetAllQrAttendancesService = {
  classroomId: string;
};
type ResponseGetAllQrAttendancesService = QrCodeAttendance[];
export async function GetAllQrAttendancesService({
  classroomId,
}: InputGetAllQrAttendancesService): Promise<ResponseGetAllQrAttendancesService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const qrAttendances = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/attendance/get-all/qr-code`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return qrAttendances.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputCreateQrAttendanceService = {
  date: Date;
  endDate: Date;
  classroomId: string;
  expireAt: Date;
  isLimitOneBrowser: boolean;
};
type ResponseCreateQrAttendanceService = QrCodeAttendance;
export async function CreateQrAttendanceService({
  date,
  endDate,
  classroomId,
  expireAt,
  isLimitOneBrowser,
}: InputCreateQrAttendanceService): Promise<ResponseCreateQrAttendanceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const create = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/attendance/create/qr-code`,
      { date, endDate, expireAt, classroomId, isLimitOneBrowser },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return create.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputUpdateQrCodeAttendanceService = {
  qrCodeAttendanceId: string;
  expireAt: Date;
  isLimitOneBrowser: boolean;
};
type ResponseUpdateQrCodeAttendanceService = QrCodeAttendance;
export async function UpdateQrCodeAttendanceService({
  qrCodeAttendanceId,
  expireAt,
  isLimitOneBrowser,
}: InputUpdateQrCodeAttendanceService): Promise<ResponseUpdateQrCodeAttendanceService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const update = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/attendance/update/qr-code`,
      { expireAt, qrCodeAttendanceId, isLimitOneBrowser },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return update.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDeleteNoteService = {
  attendanceId: string;
};
type ResponseDeleteNoteService = Attendance;
export async function DeleteNoteService({
  attendanceId,
}: InputDeleteNoteService): Promise<ResponseDeleteNoteService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const update = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/attendance/delete-note`,
      {},
      {
        params: {
          attendanceId: attendanceId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return update.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
