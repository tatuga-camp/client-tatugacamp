import axios from 'axios';
import Error from 'next/error';
import { parseCookies } from 'nookies';

export async function UpdateScoreOnWholeClassForTeacherService({
  pointsValue,
  classroomId,
  scoreId,
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
    console.log(access_token);
    const res = await axios.put(
      `${process.env.Server_Url}/teacher/score/update/students`,
      { points, classroomId, scoreId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}
