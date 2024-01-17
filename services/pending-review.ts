import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { Assignment, Classroom, Student, StudentWork } from "../models";

type InputGetAllPendingReviewsService = {
  nextId: string;
};
type ResponseGetAllPendingReviewsService = {
  cursor: string | null;
  pendingReview: {
    assignment: Assignment;
    classroom: Classroom;
    student: Student;
    studentWorks: StudentWork;
  };
};
export async function GetAllPendingReviewsService({
  nextId,
}: InputGetAllPendingReviewsService): Promise<ResponseGetAllPendingReviewsService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    if (nextId) {
      const pendingReviews = await axios.get(
        `${process.env.MAIN_SERVER_URL}/user/pending-review/get-all`,
        {
          params: {
            cursor: nextId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return pendingReviews.data;
    } else {
      const pendingReviews = await axios.get(
        `${process.env.MAIN_SERVER_URL}/user/pending-review/get-all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return pendingReviews.data;
    }
  } catch (err: any) {
    throw new Error(err);
  }
}
