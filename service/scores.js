import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';
export async function GetAllScoresClassroom({ classroomId }) {
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
      },
    );
    return allScore;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateScoreOnStudent({
  scoreId,
  studentId,
  score,
  inputValues,
}) {
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
      },
    );

    return updateScore;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateScoreOnWholeClass(
  { scoreId, score },
  inputValues,
  classroomId,
) {
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
      `${process.env.MAIN_SERVER_URL}/user/score/update/score/students`,
      {
        points: points,
        scoreId: scoreId,
        classroomId: classroomId,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return updateScore;
  } catch (err) {
    throw new Error(err);
  }
}

export async function UpdateScoreOnWholeGroup({
  scoreId,
  pointsValue,
  miniGroupId,
  groupId,
  score,
}) {
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
      },
    );
    return updateScore;
  } catch (err) {
    throw new Error(err);
  }
}
export async function ResetSpecialScorePercentage({ classroomId }) {
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
      },
    );
    return reset.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function ResetAassignmentPercentage({ assignmentId }) {
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
      },
    );
    return reset.data;
  } catch (err) {
    throw new Error(err);
  }
}
export async function AllowStudentViewScore({ classroomId, allow }) {
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
      },
    );
    return allowStudent.data;
  } catch (err) {
    throw new Error(err);
  }
}

export async function CreateScoreOnClass({ title, emoji, classroomId, score }) {
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
      },
    );
    return createScore;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}

export async function HideScore({ scoreId }) {
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
      },
    );
    return score;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
}
