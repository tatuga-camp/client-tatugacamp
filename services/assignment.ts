import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Assignment, Student, StudentWork } from "../models";
import { convertHeicFilesToJpeg } from "./convertHeicFilesToJpeg";
import { Base64ToFile } from "./base64ToFile";

type CreateAssignmentToAnotherClassroomService = {
  classrooms: string;
  assignmentId: string;
};
type ResponseCreateAssignmentToAnotherClassroomService = Assignment[];
export async function CreateAssignmentToAnotherClassroomService({
  classrooms,
  assignmentId,
}: CreateAssignmentToAnotherClassroomService): Promise<ResponseCreateAssignmentToAnotherClassroomService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return assign.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputCreateFileOnAssignmentService = {
  formFiles: FormData;
  assignmentId: string;
};
export async function CreateFileOnAssignmentService({
  formFiles,
  assignmentId,
}: InputCreateFileOnAssignmentService) {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const files = await convertHeicFilesToJpeg({ formFiles });

    const urls = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/assignment/fileOnAssignment/upload-signurl`,
      { files, assignmentId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    for (let i = 0; i < urls.data.signurls.length; i++) {
      await fetch(urls.data.signurls[i].signurl, {
        method: "PUT",
        headers: {
          "Content-Type": `${urls.data.signurls[i].contentType}`,
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    }

    return urls;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputDeleteFileOnAssignmentService = {
  fileOnAssignmentId: string;
};
type ResponseDeleteFileOnAssignmentService = string;
export async function DeleteFileOnAssignmentService({
  fileOnAssignmentId,
}: InputDeleteFileOnAssignmentService): Promise<ResponseDeleteFileOnAssignmentService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return "Successfully";
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputCreateAssignmentService = {
  classroomId: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  imagesBase64: string[];
};
type ResponseCreateAssignmentService = Assignment;
export async function CreateAssignmentService({
  classroomId,
  title,
  description,
  deadline,
  maxScore,
  imagesBase64,
}: InputCreateAssignmentService): Promise<ResponseCreateAssignmentService> {
  try {
    const maxScoreNum = Number(maxScore);
    const dateFormat = new Date(deadline);
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const files = await Base64ToFile({ imagesBase64 });
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    for (let i = 0; i < urls.data.urls.length; i++) {
      const response = await fetch(urls.data.urls[i].SignedURL, {
        method: "PUT",
        headers: {
          "Content-Type": `${urls.data.urls[i].contentType}`,
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return updateAssignment.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputGetAllAssignmentsService = {
  classroomId: string;
};
type ResponseGetAllAssignmentsService = (Assignment & { progress: string })[];
export async function GetAllAssignmentsService({
  classroomId,
}: InputGetAllAssignmentsService): Promise<ResponseGetAllAssignmentsService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const assignments = await axios.get<Assignment[]>(
      `${process.env.MAIN_SERVER_URL}/user/assignment/get-all-assignment`,

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
    let progresses: (Assignment & { progress: string })[] = [];
    for (const assignment of assignments.data) {
      const cookies = parseCookies();
      const access_token = cookies.access_token;
      const progress = await axios.get<string>(
        `${process.env.MAIN_SERVER_URL}/user/assignment/progress-assignment`,
        {
          params: {
            assignmentId: assignment.id,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      progresses.push({ ...assignment, progress: progress.data });
    }
    return progresses;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputGetAssignmentService = {
  assignmentId: string;
  classroomId: string;
};
type ResponseGetAssignmentService = Assignment;
export async function GetAssignmentService({
  assignmentId,
  classroomId,
}: InputGetAssignmentService): Promise<ResponseGetAssignmentService> {
  try {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return assignment.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputGetAssignmentProgressService = {
  assignments: Assignment[];
};
type ResponseGetAssignmentProgressService = (Assignment & {
  progress: string;
})[];
export async function GetAssignmentProgressService({
  assignments,
}: InputGetAssignmentProgressService): Promise<ResponseGetAssignmentProgressService> {
  let progresses: (Assignment & { progress: string })[] = [];
  for (const assignment of assignments) {
    try {
      const cookies = parseCookies();
      const access_token = cookies.access_token;

      const progress = await axios.get<string>(
        `${process.env.MAIN_SERVER_URL}/user/assignment/progress-assignment`,

        {
          params: {
            assignmentId: assignment.id,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      progresses.push({ ...assignment, progress: progress.data });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }
  return progresses;
}

type IsCheckType = Student & { [studentId: string]: boolean };
type InputAssignWorkToStudentService = {
  assignmentCreated: Assignment;
  isChecked: IsCheckType[];
};
type ResponseAssignWorkToStudentService = IsCheckType;
export async function AssignWorkToStudentService({
  isChecked,
  assignmentCreated,
}: InputAssignWorkToStudentService): Promise<
  ResponseAssignWorkToStudentService[]
> {
  let stduentOnAssignment: ResponseAssignWorkToStudentService[] = [];
  for (const student of isChecked) {
    if (student[student.id] === true) {
      try {
        const cookies = parseCookies();
        const access_token = cookies.access_token;
        const assign = await axios.post<null>(
          `${process.env.MAIN_SERVER_URL}/user/assignment/assign-work-to-student`,
          {},
          {
            params: {
              studentId: student.id,
              assignmentId: assignmentCreated.id,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log(stduentOnAssignment[0].status);
        stduentOnAssignment.push({
          ...student,
        });
      } catch (err) {
        console.error(err);
        stduentOnAssignment.push({ ...student });
      }
    } else if (student[student.id] === false) {
      stduentOnAssignment.push(student);
    }
  }
  return stduentOnAssignment;
}

type InputUnAssignWorkStudentService = {
  studentId: string;
  assignmentId: string;
};
type ResponseUnAssignWorkStudentService = { message: string };

export async function UnAssignWorkStudentService({
  studentId,
  assignmentId,
}: InputUnAssignWorkStudentService): Promise<ResponseUnAssignWorkStudentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const unAssign = await axios.delete(
      `${process.env.MAIN_SERVER_URL}/user/assignment/unAssign-work-to-student`,
      {
        params: {
          studentId,
          assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return unAssign.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputViewAllAssignOnStudentService = {
  classroomId: string;
  assignmentId: string;
};
type ResponseViewAllAssignOnStudentService = (Student & {
  status: "have-work" | "no-assign";
} & { studentWork: StudentWork })[];
export async function ViewAllAssignOnStudentService({
  classroomId,
  assignmentId,
}: InputViewAllAssignOnStudentService): Promise<ResponseViewAllAssignOnStudentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studentWorks = await axios.get<ResponseViewAllAssignOnStudentService>(
      `${process.env.MAIN_SERVER_URL}/user/assignment/view-all-assign-on-students`,
      {
        params: {
          classroomId: classroomId,
          assignmentId: assignmentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return studentWorks.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputDeleteAssignmentService = { assignmentId: string };
type ResponseDeleteAssignmentService = { message: string };
export async function DeleteAssignmentService({
  assignmentId,
}: InputDeleteAssignmentService): Promise<ResponseDeleteAssignmentService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return deleteAssignment.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputUpdateAssignmentService = {
  assignmentId: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  imagesBase64: string[];
};
type ResponseUpdateAssignmentService = Assignment;
export async function UpdateAssignmentService({
  assignmentId,
  title,
  description,
  deadline,
  maxScore,
  imagesBase64,
}: InputUpdateAssignmentService): Promise<ResponseUpdateAssignmentService> {
  try {
    const maxScoreNum = Number(maxScore);
    const dateFormat = new Date(deadline);
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const files = await Base64ToFile({ imagesBase64 });

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return updatedAssignment.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputReviewStudentWorkService = {
  studentId: string;
  assignmentId: string;
  score: number;
};
type ResponseReviewStudentWorkService = StudentWork;
export async function ReviewStudentWorkService({
  studentId,
  assignmentId,
  score,
}: InputReviewStudentWorkService): Promise<ResponseReviewStudentWorkService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const review = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/review-student-work`,
      {
        score: score,
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
    return review.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputReviewStudentWorkNoWorkService = {
  studentId: string;
  assignmentId: string;
  score: number;
};
type ResponseReviewStudentWorkNoWorkService = StudentWork;
export async function ReviewStudentWorkNoWorkService({
  studentId,
  assignmentId,
  score,
}: InputReviewStudentWorkNoWorkService): Promise<ResponseReviewStudentWorkNoWorkService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const review = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/assignment/review-student-no-work`,
      {
        score: score,
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
    return review.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputDeleteStudentWorkService = {
  assignmentId: string;
  studentId: string;
};
type ResponseDeleteStudentWorkService = { message: string };
export async function DeleteStudentWorkService({
  assignmentId,
  studentId,
}: InputDeleteStudentWorkService): Promise<ResponseDeleteStudentWorkService> {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return deleteStudent.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputReviewStudentWorksheetService = {
  body: string;
  studentWorkId: string;
};
type ResponseReviewStudentWorksheetService = StudentWork;
export async function ReviewStudentWorksheetService({
  body,
  studentWorkId,
}: InputReviewStudentWorksheetService): Promise<ResponseReviewStudentWorksheetService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const updateStudentWork = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/review/student-worksheet`,
      { body, studentWorkId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return updateStudentWork.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputUpdatePercentAssignmentService = {
  percentage: string;
  assignmentId: string;
};
type ResponseUpdatePercentAssignmentService = Assignment;
export async function UpdatePercentAssignmentService({
  percentage,
  assignmentId,
}: InputUpdatePercentAssignmentService): Promise<ResponseUpdatePercentAssignmentService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const update = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/assignment/update/percentage`,
      { percentage, assignmentId },
      {
        headers: {
          "Content-Type": "application/json",
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
