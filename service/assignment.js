import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function CreateAssignmentToAnotherClassroom({
  classrooms,
  assignmentId,
}) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const assign = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/assignment/assign-assignment-to-multiple-classroom`,
      {
        classrooms,
        assignmentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return assign;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
export async function CreateFileOnAssignment({ formFiles, assignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const heic2any = (await import('heic2any')).default;
    const filesOld = await formFiles.getAll('files');
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
      `${process.env.MAIN_SERVER_URL}/user/assignment/fileOnAssignment/upload-signurl`,
      { files, assignmentId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    for (let i = 0; i < urls.data.signurls.length; i++) {
      await fetch(urls.data.signurls[i].signurl, {
        method: 'PUT',
        headers: {
          'Content-Type': `${urls.data.signurls[i].contentType}`,
        },
        body: files[i].file,
      });
      await axios.post(
        `${process.env.MAIN_SERVER_URL}/user/assignment/fileOnAssignment/create`,
        {
          assignmentId: assignmentId,
          file: urls.data.urlAdress[i],
          type: urls.data.signurls[i].contentType,
          name: urls.data.signurls[i].fileName,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
    }

    return urls;
  } catch (err) {
    throw new Error(err);
  }
}

export async function DeleteFileOnAssignmentService({ fileOnAssignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/assignment/fileOnAssignment/delete`,
      {
        params: {
          fileOnAssignmentId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return 'Successfully';
  } catch (err) {
    throw new Error(err);
  }
}

export async function CreateAssignmentApi({
  classroomId,
  title,
  description,
  deadline,
  maxScore,
  imagesBase64,
}) {
  try {
    const maxScoreNum = Number(maxScore);
    const dateFormat = new Date(deadline);
    const cookies = parseCookies();
    const access_token = cookies.access_token;
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
      `${process.env.MAIN_SERVER_URL}/user/assignment/upload-signUrl`,
      {
        files,
        title: title,
        deadline: dateFormat,
        maxScore: maxScoreNum,
        classroomId: classroomId,
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
      }).catch((err) => console.error(err));
    }

    let updatedContent = description;
    for (let i = 0; i < imagesBase64.length; i++) {
      const base64Image = imagesBase64[i];
      const imageUrl = urls.data.baseUrls[i];
      updatedContent = updatedContent.replace(base64Image, imageUrl);
    }

    const updateAssignment = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/update`,
      {
        description: updatedContent,
        assignmentId: urls.data.assignment.id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return updateAssignment.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllAssignments({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const assignments = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/assignment/get-all-assignment`,

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
    let progresses = [];
    for (const assignment of assignments.data) {
      try {
        const cookies = parseCookies();
        const access_token = cookies.access_token;

        const progress = await axios.get(
          `${process.env.MAIN_SERVER_URL}/user/assignment/progress-assignment`,
          {
            params: {
              assignmentId: assignment.id,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        progresses.push({ ...assignment, progress: progress.data });
      } catch (err) {
        console.error(err);
        throw new Error(err);
      }
    }
    return progresses;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function GetAssignment({ assignmentId, classroomId }) {
  try {
    if (!assignmentId) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const assignment = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/assignment/get-a-assignment`,
      {
        params: {
          assignmentId: assignmentId,
          classroomId: classroomId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return assignment;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function GetAssignmentProgress({ assignments }) {
  let progresses = [];
  for (const assignment of assignments) {
    try {
      const cookies = parseCookies();
      const access_token = cookies.access_token;

      const progress = await axios.get(
        `${process.env.MAIN_SERVER_URL}/user/assignment/progress-assignment`,

        {
          params: {
            assignmentId: assignment.id,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      progresses.push({ ...assignment, progress: progress.data });
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
  return progresses;
}

export async function AssignWorkToSTudent({ isChecked, assignmentCreated }) {
  let stduentOnAssignment = [];
  for (const student of isChecked) {
    if (student[student.id] === true) {
      try {
        const cookies = parseCookies();
        const access_token = cookies.access_token;
        const assign = await axios.post(
          `${process.env.MAIN_SERVER_URL}/user/assignment/assign-work-to-student`,
          {},
          {
            params: {
              studentId: student.id,
              assignmentId: assignmentCreated.id,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        stduentOnAssignment.push({ ...student, status: 201, assign: assign });
      } catch (err) {
        console.error(err);
        stduentOnAssignment.push({ ...student, status: { error: err } });
      }
    } else if (student[student.id] === false) {
      stduentOnAssignment.push(student);
    }
  }
  return stduentOnAssignment;
}

export async function UnAssignWorkStudentService({ studentId, assignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const assign = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/assignment/unAssign-work-to-student`,
      {
        params: {
          studentId,
          assignmentId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function ViewAllAssignOnStudent({ classroomId, assignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studentWorks = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/assignment/view-all-assign-on-students`,
      {
        params: {
          classroomId: classroomId,
          assignmentId: assignmentId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return studentWorks;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function DeleteAssignment({ assignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const deleteAssignment = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/assignment/delete`,
      {
        params: {
          assignmentId: assignmentId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return deleteAssignment;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function UpdateAssignmentApi({
  assignmentId,
  title,
  description,
  deadline,
  maxScore,
  imagesBase64,
}) {
  try {
    const maxScoreNum = Number(maxScore);
    const dateFormat = new Date(deadline);
    const cookies = parseCookies();
    const access_token = cookies.access_token;
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
      `${process.env.MAIN_SERVER_URL}/user/assignment/upload-signUrl`,
      {
        assignmentId: assignmentId,
        files,
        title: title,
        deadline: dateFormat,
        maxScore: maxScoreNum,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    for (let i = 0; i < urls.data.urls.length; i++) {
      await fetch(urls.data.urls[i].SignedURL, {
        method: 'PUT',
        headers: {
          'Content-Type': `${urls.data.urls[i].contentType}`,
        },
        body: files[i].file,
      }).catch((err) => console.error(err));
    }

    let updatedContent = description;
    for (let i = 0; i < imagesBase64.length; i++) {
      const base64Image = imagesBase64[i];
      const imageUrl = urls.data.baseUrls[i];
      updatedContent = updatedContent.replace(base64Image, imageUrl);
    }

    const updatedAssignment = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/update`,
      {
        title: title,
        deadline: dateFormat,
        description: updatedContent,
        maxScore: maxScoreNum,
        assignmentId: assignmentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return updatedAssignment;
  } catch (err) {
    throw new Error(err);
  }
}

export async function ReviewStudentWork({
  studentId,
  assignmentId,
  comment,
  score,
}) {
  try {
    const scoreNum = Number(score);
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const review = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/review-student-work`,
      {
        comment: comment,
        score: scoreNum,
        isSummited: true,
        assignmentId: assignmentId,
        studentId: studentId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return review;
  } catch (err) {
    throw new Error(err);
  }
}

export async function ReviewStudentWorkNoWork({
  studentId,
  assignmentId,
  comment,
  score,
}) {
  try {
    const scoreNum = Number(score);
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const review = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/assignment/review-student-no-work`,
      {
        comment: comment,
        score: scoreNum,
        isSummited: true,
      },
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return review;
  } catch (err) {
    throw new Error(err);
  }
}

export async function DeleteStudentWork({ assignmentId, studentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const deleteStudent = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/assignment/student-work/delete`,
      {
        params: {
          assignmentId: assignmentId,
          studentId: studentId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return deleteStudent;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function ReviewStudentWorksheetApi({ body, studentWorkId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const updateStudentWork = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/review/student-worksheet`,
      { body, studentWorkId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return updateStudentWork;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function UpdatePercentAssignment({ percentage, assignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const update = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/update/percentage`,
      { percentage, assignmentId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return update.data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
