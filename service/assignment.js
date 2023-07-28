import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

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
      `${process.env.Server_Url}/user/assignment/upload-signUrl`,
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
      }).catch((err) => console.log(err));
    }

    let updatedContent = description;
    for (let i = 0; i < imagesBase64.length; i++) {
      const base64Image = imagesBase64[i];
      const imageUrl = urls.data.baseUrls[i];
      updatedContent = updatedContent.replace(base64Image, imageUrl);
    }
    console.log('updatedContent', updatedContent);

    const updateAssignment = await axios.put(
      `${process.env.Server_Url}/user/assignment/update`,
      {
        description: updatedContent,
      },
      {
        params: {
          assignmentId: urls.data.assignment.id,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return updateAssignment;
  } catch (err) {
    throw new Error(err);
  }
}

export async function GetAllAssignments({ classroomId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const assignments = await axios.get(
      `${process.env.Server_Url}/user/assignment/get-all-assignment`,

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
          `${process.env.Server_Url}/user/assignment/progress-assignment`,
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
        console.log(err);
        throw new Error(err);
      }
    }
    return progresses;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

export async function GetAssignment({ assignmentId }) {
  try {
    if (!assignmentId) {
      return null;
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const assignment = await axios.get(
      `${process.env.Server_Url}/user/assignment/get-a-assignment`,
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
    return assignment;
  } catch (err) {
    console.log(err);
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
        `${process.env.Server_Url}/user/assignment/progress-assignment`,

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
      console.log(err);
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
          `${process.env.Server_Url}/user/assignment/assign-work-to-student`,
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
        console.log(err);
        stduentOnAssignment.push({ ...student, status: { error: err } });
      }
    } else if (student[student.id] === false) {
      stduentOnAssignment.push(student);
    }
  }
  return stduentOnAssignment;
}

export async function ViewAllAssignOnStudent({ classroomId, assignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studentWorks = await axios.get(
      `${process.env.Server_Url}/user/assignment/view-all-assign-on-student`,
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
    console.log(err);
    throw new Error(err);
  }
}

export async function DeleteAssignment({ assignmentId }) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const deleteAssignment = await axios.delete(
      `${process.env.Server_Url}/user/assignment/delete`,
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
    console.log(err);
    throw new Error(err);
  }
}

export async function UpdateAssignmentApi({
  assignmentId,
  title,
  description,
  deadline,
  maxScore,
}) {
  try {
    const maxScoreNum = Number(maxScore);
    const dateFormat = new Date(deadline);
    console.log(dateFormat);
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const updatedAssignment = await axios.put(
      `${process.env.Server_Url}/user/assignment/update`,
      {
        title: title,
        deadline: dateFormat,
        description: description,
        maxScore: maxScoreNum,
      },
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
      `${process.env.Server_Url}/user/assignment/review-student-work`,
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
      `${process.env.Server_Url}/user/assignment/review-student-no-work`,
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
      `${process.env.Server_Url}/user/assignment/student-work/delete`,
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
    console.log(err);
    throw new Error(err);
  }
}
