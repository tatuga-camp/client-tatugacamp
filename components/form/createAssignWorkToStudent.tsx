import React, { useEffect, useState } from "react";
import {
  Assignment,
  Score,
  Student,
  StudentWithScore,
  User,
} from "../../models";
import Loading from "../loadings/loading";
import Swal from "sweetalert2";
import {
  AssignWorkToStudentService,
  IsCheckTypeStudent,
} from "../../services/assignment";
import { useQuery } from "@tanstack/react-query";
import { GetAllStudentsService } from "../../services/students";
import { useRouter } from "next/router";

type CreateAssignWorkToStudentProps = {
  user: User;
  setIsAssignmentStdent: React.Dispatch<React.SetStateAction<boolean>>;
  setTriggerAssignment: React.Dispatch<React.SetStateAction<boolean>>;
  assignmentCreated: Assignment;
};
function CreateAssignWorkToStudent({
  user,
  assignmentCreated,
  setIsAssignmentStdent,
  setTriggerAssignment,
}: CreateAssignWorkToStudentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState<IsCheckTypeStudent[]>();
  const handleChangeCheck = ({ studentId }: { studentId: string }) => {
    setIsChecked((prev) => {
      return prev?.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            isAssign: !student.isAssign,
          };
        }
        return student;
      });
    });
  };

  const students = useQuery({
    queryKey: ["students", router.query.classroomId],
    queryFn: () =>
      GetAllStudentsService({
        classroomId: router.query.classroomId as string,
      }),
  });

  useEffect(() => {
    if (students.isSuccess && students.data) {
      setIsChecked(() => {
        return students.data?.map((student) => {
          return {
            ...student,
            isAssign: false,
          };
        });
      });
    }
  }, [students.data]);
  //handle click to sclect all student
  const onClickCheckAll = () => {
    setIsChecked((prev) => {
      return prev?.map((student) => {
        return {
          ...student,
          isAssign: !student.isAssign,
        };
      });
    });
  };

  //handle click to assign student work
  const onClickAssignWork = async () => {
    try {
      Swal.fire({
        title: "กำลังบันทึกข้อมูล",
        html: "กรุณารอสักครู่",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      setLoading(true);
      const assign = await AssignWorkToStudentService({
        isChecked: isChecked as IsCheckTypeStudent[],
        assignmentCreated: assignmentCreated,
      });
      setIsChecked(assign);
      Swal.fire("Success", "Successfully assigned to students", "success");
      setLoading(false);
      document.body.style.overflow = "auto";

      setIsAssignmentStdent(false);
      setTriggerAssignment(false);
    } catch (err) {
      Swal.fire("error", "error", "success");
      console.error(err);
    }
  };

  return (
    <form className="w-full h-full   flex items-center  justify-center flex-col gap-10">
      <div className="text-2xl font-Kanit font-semibold">
        {user.language === "Thai" && "เลือกผู้เรียนเพื่อมอบหมายงาน"}
        {user.language === "English" && "Choose students to assign work to"}
      </div>

      <div className="lg:w-2/4  lg:h-4/6 md:w-10/12 md:h-80  flex relative items-center justify-start overflow-auto scrollbar  flex-col gap-2">
        {loading ? (
          <div className="absolute w-full  h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          isChecked?.map((student, index) => {
            const studentId = student.id;
            const oddNumber = index % 2;
            return (
              <div
                key={student.id}
                className={`grid grid-cols-4 w-full relative items-center justify-center ${
                  oddNumber === 0 ? "bg-blue-100" : "bg-orange-100"
                } py-2 
                  text-lg font-Kanit `}
              >
                {/* {student. === 201 && (
                        <div className="flex items-center justify-center left-3  absolute text-green-500">
                          <AiOutlineCheckCircle />
                        </div>
                      )}
                      {student.status?.error && (
                        <div className="flex items-center justify-center left-3 absolute text-red-600">
                          <MdError />
                        </div>
                      )} */}
                <div className="flex items-center justify-center">
                  {student.number}
                </div>
                <div className="flex items-center justify-center">
                  {student.firstName}
                </div>
                <div className="flex items-center justify-center">
                  {student?.lastName}
                </div>
                <div className="flex items-center justify-center">
                  <input
                    checked={student.isAssign}
                    onChange={() =>
                      handleChangeCheck({ studentId: student.id })
                    }
                    type="checkbox"
                    className="w-6 h-6  ring-2 
                           ring-black  text-blue-600 bg-gray-100 border-gray-300 rounded
                       focus:ring-blue-500 dark:focus:ring-blue-600
                       dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
      {!loading && (
        <div className="flex gap-5">
          <button
            type="button"
            onClick={onClickCheckAll}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {user.language === "Thai" && "เลือกผู้เรียนทั้งหมด"}
            {user.language === "English" && "Choose all students"}
          </button>
          <button
            type="button"
            onClick={onClickAssignWork}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {user.language === "Thai" && "มอบหมายงาน"}
            {user.language === "English" && "Assign"}
          </button>
        </div>
      )}
    </form>
  );
}

export default CreateAssignWorkToStudent;
