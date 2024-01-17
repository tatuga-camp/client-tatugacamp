import axios from "axios";
import Error from "next/error";
import { parseCookies } from "nookies";
import { StudentClass } from "../../models";

type ResponseGetAllStudentClassService = StudentClass[];
export async function GetAllStudentClassService(): Promise<ResponseGetAllStudentClassService> {
  try {
    const cookies = parseCookies();
    const access_token = cookies.access_token;
    const studentClass = await axios.get(
      `${process.env.MAIN_SERVER_URL}/teacher/student-class/get-all`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return studentClass.data;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}
