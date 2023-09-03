import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';
import { v4 as uuidv4 } from 'uuid';

export async function CreateAttendance({
  classroomId,
  attendanceDate,
  isChecks,
  note,
  imagesBase64,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formatDate = new Date(attendanceDate).toISOString();
    const uniqueId = uuidv4();
    if (imagesBase64.length > 0) {
      const formData = new FormData();
      for (const imageBase64 of imagesBase64) {
        const response = await fetch(imageBase64);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        formData.append('files', file);
      }
      const filesOld = formData.getAll('files');
      const files = await Promise.all(
        filesOld.map(async (file) => {
          if (file.type === '') {
            const blob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
            });
            file = new File([blob], file.name, { type: 'image/jpeg' });
            return {
              file: file,
              fileName: file.name,
              fileType: file.type,
            };
          } else {
            return {
              file: file,
              fileName: file.name,
              fileType: file.type,
            };
          }
        }),
      );

      const urls = await axios.post(
        `${process.env.Server_Url}/user/attendance/head-attendance/upload-signUrl`,
        {
          files,
          groupId: uniqueId,
          classroomId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      for (let i = 0; i < urls.data.urls.length; i++) {
        const response = await fetch(urls.data.urls[i].SignedURL, {
          method: 'PUT',
          headers: {
            'Content-Type': `${urls.data.urls[i].contentType}`,
          },
          body: files[i].file,
        }).catch((err) => console.log(err));
      }

      let updatedContent = note;
      for (let i = 0; i < imagesBase64.length; i++) {
        const base64Image = imagesBase64[i];
        const imageUrl = urls.data.baseUrls[i];
        updatedContent = updatedContent.replace(base64Image, imageUrl);
      }

      const students = isChecks.map((student) => {
        return {
          id: student.id,
          attendance: student[student.id],
        };
      });

      const attendacne = await axios.post(
        `${process.env.Server_Url}/user/attendance/create`,
        {
          date: formatDate,
          groupId: uniqueId,
          students: students,
          note: updatedContent,
        },
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

      return attendacne;
    } else {
      const students = isChecks.map((student) => {
        return {
          id: student.id,
          attendance: student[student.id],
        };
      });

      const attendacne = await axios.post(
        `${process.env.Server_Url}/user/attendance/create`,
        {
          date: formatDate,
          groupId: uniqueId,
          students: students,
          note,
        },
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

      return attendacne;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAllAttendance({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const GetAllAttendacne = await axios.get(
      `${process.env.Server_Url}/user/attendance/get-all`,
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
    return GetAllAttendacne;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function DeleteAttendance({ groupId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const deleteAttendance = await axios.delete(
      `${process.env.Server_Url}/user/attendance/delete`,
      {
        params: {
          groupId: groupId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return deleteAttendance;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateAttendnaceAPI({
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
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const formData = new FormData();

    if (imagesBase64.length > 0) {
      for (const imageBase64 of imagesBase64) {
        const response = await fetch(imageBase64);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        formData.append('files', file);
      }
      const filesOld = formData.getAll('files');
      const files = await Promise.all(
        filesOld.map(async (file) => {
          if (file.type === '') {
            const blob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
            });
            file = new File([blob], file.name, { type: 'image/jpeg' });
            return {
              file: file,
              fileName: file.name,
              fileType: file.type,
            };
          } else {
            return {
              file: file,
              fileName: file.name,
              fileType: file.type,
            };
          }
        }),
      );

      const urls = await axios.post(
        `${process.env.Server_Url}/user/attendance/upload-signUrl`,
        {
          files,
          studentId,
          attendanceId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      for (let i = 0; i < urls.data.urls.length; i++) {
        const response = await fetch(urls.data.urls[i].SignedURL, {
          method: 'PUT',
          headers: {
            'Content-Type': `${urls.data.urls[i].contentType}`,
          },
          body: files[i].file,
        }).catch((err) => console.log(err));
      }

      let updatedContent = note;
      for (let i = 0; i < imagesBase64.length; i++) {
        const base64Image = imagesBase64[i];
        const imageUrl = urls.data.baseUrls[i];
        updatedContent = updatedContent.replace(base64Image, imageUrl);
      }

      const update = await axios.put(
        `${process.env.Server_Url}/user/attendance/update`,
        { absent, present, holiday, sick, warn, late, note: updatedContent },
        {
          params: {
            attendanceId: attendanceId,
          },
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      return update;
    } else {
      if (note) {
        const update = await axios.put(
          `${process.env.Server_Url}/user/attendance/update`,
          { absent, present, holiday, sick, late, note, warn },
          {
            params: {
              attendanceId: attendanceId,
            },
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        return update;
      } else if (!note) {
        const update = await axios.put(
          `${process.env.Server_Url}/user/attendance/update`,
          { absent, present, holiday, sick, late, warn },
          {
            params: {
              attendanceId: attendanceId,
            },
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        return update;
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
export async function DeleteNote({ attendanceId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const update = await axios.put(
      `${process.env.Server_Url}/user/attendance/delete-note`,
      {},
      {
        params: {
          attendanceId: attendanceId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return update;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
