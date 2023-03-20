import axios from "axios";
import Error from "next/error";

export async function GetAllStudents(data) {
  try {
    const access_token = localStorage.getItem("access_token");
    const student = await axios.get(
      `${process.env.Server_Url}/user/student/get-all-student?classroomId=${data.classroomId}`,
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student;
  } catch (err) {
    throw new Error(err);
  }
}

export async function CreateStudentApi(data) {
  const picture = [
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/332251711_5899805890085945_1007978248439093741_n.jpg",
    "https://storage.googleapis.com/tatugacamp.com/Avatar%20students/335121687_1247712589490354_6188669462534140807_n.jpg",
  ];
  try {
    const converNumber = Number(data.inputObject.number);
    const StringNumber = converNumber.toString();
    const access_token = localStorage.getItem("access_token");
    const student = await axios.post(
      `${process.env.Server_Url}/user/student/create?classroomId=${data.classroomId}`,
      {
        firstName: data.inputObject.firstName,
        lastName: data.inputObject.lastName,
        number: StringNumber,
        picture: picture[Math.floor(Math.random() * 2)],
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    return student;
  } catch (err) {
    throw new Error(err);
  }
}