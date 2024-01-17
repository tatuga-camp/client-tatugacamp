import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Assignment, Classroom, Score, ScoreTitle } from "../models";

type InputGetAllScoresClassroomService = {
  classroomId: string;
};
type ResponseGetAllScoresClassroomService = ScoreTitle[];
export async function GetAllScoresClassroomService({
  classroomId,
}: InputGetAllScoresClassroomService): Promise<ResponseGetAllScoresClassroomService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const allScore = await axios.get(
      `${process.env.MAIN_SERVER_URL}/user/score/get-class-all-score`,
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return allScore.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUpdateScoreOnStudentService = {
  scoreId: string;
  studentId: string;
  score: number;
  inputValues: number;
};
type ResponseUpdateScoreOnStudentService = {
  score: Score;
  title: ScoreTitle;
};
export async function UpdateScoreOnStudentService({
  scoreId,
  studentId,
  score,
  inputValues,
}: InputUpdateScoreOnStudentService): Promise<ResponseUpdateScoreOnStudentService> {
  try {
    let points = 1;

    if (inputValues === 0) {
      if (!score) {
        points = 1;
      } else {
        points = score;
      }
    } else if (inputValues) {
      points = Number(inputValues);
    }
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const updateScore = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/score/individual/update`,
      {
        points: points,
      },
      {
        params: {
          scoreId: scoreId,
          studentId: studentId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return updateScore.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputUpdateScoreOnWholeGroupService = {
  scoreId: string;
  pointsValue: number;
  miniGroupId: string;
  groupId: string;
  score: number;
};

type ResponseUpdateScoreOnWholeGroupService = {
  IsSuceess: string;
}[];
export async function UpdateScoreOnWholeGroupService({
  scoreId,
  pointsValue,
  miniGroupId,
  groupId,
  score,
}: InputUpdateScoreOnWholeGroupService): Promise<ResponseUpdateScoreOnWholeGroupService> {
  try {
    let points = 1;

    if (pointsValue === 0) {
      if (!score) {
        points = 1;
      } else {
        points = score;
      }
    } else if (pointsValue) {
      points = Number(pointsValue);
    }

    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const updateScore = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/score/update/group-students`,
      {
        points,
        miniGroupId,
        groupId,
        scoreId,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return updateScore.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputResetSpecialScorePercentageService = {
  classroomId: string;
};

type ResponseResetSpecialScorePercentageService = Classroom;
export async function ResetSpecialScorePercentageService({
  classroomId,
}: InputResetSpecialScorePercentageService): Promise<ResponseResetSpecialScorePercentageService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const reset = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/score/reset-percertage`,
      {
        classroomId,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return reset.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputResetAassignmentPercentageService = {
  assignmentId: string;
};
type ResponseResetAassignmentPercentageService = Assignment;
export async function ResetAassignmentPercentageService({
  assignmentId,
}: InputResetAassignmentPercentageService): Promise<ResponseResetAassignmentPercentageService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const reset = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/score/reset-assignment-percentage`,
      {
        assignmentId,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return reset.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputAllowStudentViewScoreService = {
  classroomId: string;
  allow: boolean;
};

type ResponseAllowStudentViewScoreService = Classroom;
export async function AllowStudentViewScoreService({
  classroomId,
  allow,
}: InputAllowStudentViewScoreService): Promise<ResponseAllowStudentViewScoreService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const allowStudent = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/score/allow-score-view`,
      {
        classroomId,
        allow,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return allowStudent.data;
  } catch (err: any) {
    throw new Error(err);
  }
}

type InputCreateScoreOnClassService = {
  title: string;
  emoji: string;
  classroomId: string;
  score: number;
};
type ResponseCreateScoreOnClassService = ScoreTitle;
export async function CreateScoreOnClassService({
  title,
  emoji,
  classroomId,
  score,
}: InputCreateScoreOnClassService): Promise<ResponseCreateScoreOnClassService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const createScore = await axios.post(
      `${process.env.MAIN_SERVER_URL}/user/score/create`,
      {
        title: title,
        picture: emoji,
        score,
      },
      {
        params: {
          classroomId: classroomId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return createScore.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type InputHideScoreService = {
  scoreId: string;
};
type ResponseInputHideScoreService = ScoreTitle;
export async function HideScoreService({
  scoreId,
}: InputHideScoreService): Promise<ResponseInputHideScoreService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;

    const score = await axios.put(
      `${process.env.MAIN_SERVER_URL}/user/score/hide-score`,
      {},
      {
        params: {
          scoreId: scoreId,
        },
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return score.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
