import { useRouter } from "next/router";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Student, User } from "../../models";
import {
  CreateStudentService,
  ResponseGetAllStudentsService,
} from "../../services/students";
import { UseQueryResult } from "@tanstack/react-query";
import Loading from "../loadings/loading";

type ExcelTableProps = {
  setTabledata: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          number: string;
          firstName: string;
          lastName: string;
        }[]
      | undefined
    >
  >;
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
  user: User;
};

function ExcelTable({ setTabledata, students, user }: ExcelTableProps) {
  const [excelData, setExcelData] = useState("");
  const [studentData, setStudentData] = useState<
    {
      id: string;
      number: string;
      firstName: string;
      lastName: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExcelDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExcelData(e.target.value);
  };

  const handleCreateMany = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const updatedTableData: {
      id: string;
      firstName: string;
      lastName: string;
      number: string;
      Notloading: boolean;
    }[] = [];
    setLoading(true);
    for (const student of studentData) {
      try {
        const updatedStudentLoading = {
          ...student,
          Notloading: false,
        };
        updatedTableData.push(updatedStudentLoading);
        await CreateStudentService({
          firstName: student.firstName,
          lastName: student?.lastName,
          number: student.number,
          classroomId: router.query.classroomId as string,
        });

        const index = updatedTableData.findIndex((s) => s.id === student.id); // Find the index of the current student in the updatedTableData array
        const updatedStudentSuccess = {
          ...student,
          status: 200,
          Notloading: true,
        };
        updatedTableData.splice(index, 1, updatedStudentSuccess); // Replace

        students.refetch();
      } catch (err: any) {
        const index = updatedTableData.findIndex((s) => s.id === student.id); // Find the index of the current student in the updatedTableData array
        const updatedStudentSuccess = {
          ...student,
          status: 400,
          Notloading: true,
          error: err.props.response.data.message.toString(),
        };
        updatedTableData.splice(index, 1, updatedStudentSuccess); // Replace the current student with the updatedStudentSuccess object at the same index
      }
    }
    setLoading(false);
    setTabledata(() => updatedTableData);
  };

  const generateTable = () => {
    const rows = excelData.split("\n");

    const arrayOfObjects = rows.map((item) => {
      const [number, firstName, lastName] = item.split("\t");
      const uniqueId = uuidv4();
      return { id: uniqueId, number, firstName, lastName };
    });
    setStudentData(() => arrayOfObjects);
    setTabledata(() => arrayOfObjects);
  };

  return (
    <div className=" md:w-80 text-black lg:w-full lg:mx-auto ">
      <div className="mb-4 relative flex flex-col ">
        <label htmlFor="excel_data" className="block font-bold mb-2">
          {user.language === "Thai" && "คัดลอคข้อมูลจาก Excel ลงที่นี่"}
          {user.language === "English" && "Paste your Excel data here"}
        </label>
        <span className="mb-5">
          ดูคู่มือการใช้งาน{" "}
          <a
            target="_blank"
            href="https://youtu.be/dhnpacZxT7E?si=qa3qsWAOsy6nRJMH"
          >
            คลิก
          </a>
        </span>
        <textarea
          placeholder={
            user.language === "Thai"
              ? "เมื่อวางข้อมูลแล้ว ไม่ต้องปรับแต่งข้อมูลใดๆทั้งสิ้นเช่นการกด เว้นวรรค การเคาะบรรทัด"
              : "If you paste your data, don't need to modify your text by spacing or entering text down"
          }
          id="excel_data"
          name="excel_data"
          className="lg:w-96 md:w-full lg:h-72 xl:h-96 border border-gray-300 rounded-md"
          value={excelData}
          onChange={handleExcelDataChange}
        />
        {loading && (
          <div className="inset-center w-full h-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={generateTable}
        >
          {user.language === "Thai" && " 1 ตรวจสอบความถูกต้อง"}
          {user.language === "English" && " 1 Check the correction"}
        </button>
        <button
          onClick={handleCreateMany}
          className="bg-red-500 hover:bg-red-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
        >
          {user.language === "Thai" && "2 สร้างผู้เรียน"}
          {user.language === "English" && "2 Create students"}
        </button>
      </div>
    </div>
  );
}

export default ExcelTable;
