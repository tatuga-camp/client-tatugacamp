import { useRouter } from "next/router";
import React, { useState } from "react";
import { User } from "../../../models";
import { useQuery } from "@tanstack/react-query";
import { GetAllAssignmentsService } from "../../../services/assignment";
import { GetAllStudentsService } from "../../../services/students";
import { IoCreate } from "react-icons/io5";
import CreateAssignment from "../../form/createAssignment";
import { Skeleton } from "@mui/material";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";

type ShowListAssignmentsProps = {
  user: User;
};
function ShowListAssignments({ user }: ShowListAssignmentsProps) {
  const router = useRouter();
  const [triggerAssignment, setTriggerAssignment] = useState(false);

  const assignments = useQuery({
    queryKey: ["assignments", router.query.classroomId],
    queryFn: () =>
      GetAllAssignmentsService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const students = useQuery({
    queryKey: ["students", router.query.classroomId],
    queryFn: () =>
      GetAllStudentsService({
        classroomId: router.query.classroomId as string,
      }),
  });

  return (
    <main className="w-full mt-20  flex flex-col items-center justify-center relative">
      <button
        onClick={() => {
          setTriggerAssignment(true);
          document.body.style.overflow = "hidden";
        }}
        className="w-96 hover:bg-main-color hover:text-white transition active:scale-105
         font-semibold flex justify-center items-center gap-2 bg-white py-3 
         drop-shadow-lg ring-1 font-Kanit ring-main-color text-main-color rounded-lg"
      >
        <CiCirclePlus />
        {user.language === "Thai" && "สร้างชิ้นงาน"}
        {user.language === "English" && "create your assignment"}
      </button>

      <div
        className={` top-0 right-0 left-0 bottom-0 m-auto righ z-40 ${
          triggerAssignment === false ? "hidden" : "fixed"
        }`}
      >
        <CreateAssignment
          user={user}
          assignments={assignments}
          setTriggerAssignment={setTriggerAssignment}
          students={students}
        />
      </div>

      {/* assignments are here */}
      <div className=" w-full mt-5 gap-5 grid place-items-center bg-slate-100 ">
        {assignments.isLoading || assignments.isFetching ? (
          <div className="flex flex-col gap-5 w-80 md:w-[40rem]">
            <Skeleton variant="rounded" width="100%" height={144} />
            <Skeleton variant="rounded" width="100%" height={144} />
            <Skeleton variant="rounded" width="100%" height={144} />
            <Skeleton variant="rounded" width="100%" height={144} />
            <Skeleton variant="rounded" width="100%" height={144} />
          </div>
        ) : (
          assignments?.data?.map((assignment, index) => {
            const deadline = new Date(assignment.deadline).toLocaleDateString(
              `${
                user.language === "Thai"
                  ? "th-TH"
                  : user.language === "English" && "en-US"
              }`,
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );
            const assignDate = new Date(assignment.createAt);

            const formatAssigDate = assignDate.toLocaleDateString(
              `${
                user.language === "Thai"
                  ? "th-TH"
                  : user.language === "English" && "en-US"
              }`,
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            );

            return (
              <Link
                href={`/classroom/teacher/${router.query.classroomId}/assignment/${assignment.id}`}
                key={index}
                className={`w-11/12 no-underline md:w-max px-2 md:max-w-lg lg:max-w-2xl group  h-36  md:px-10 md:py-5 drop-shadow-lg 
             bg-white  hover:scale-105 cursor-pointer overflow-hidden
         duration-150 transition relative
       rounded-lg flex flex-col justify-center `}
              >
                <div className="flex justify-around  w-full">
                  <div className="flex w-52  md:w-80 lg:w-96 truncate">
                    <div
                      className={`flex flex-col  justify-center h-full
                    gap-2 w-full  md:w-3/4  md:max-w-md  font-Poppins text-center
                     md:text-left text-black `}
                    >
                      <span className=" font text-base md:text-xl font-bold w-full h-max max-h-8  truncate">
                        {assignment.title}
                      </span>
                      <div className="relative text-left">
                        <div className="w-full hidden md:block bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            style={{
                              width: assignment.progress,
                            }}
                            className={` bg-blue-800 h-2 `}
                          ></div>
                        </div>
                        <div className="font-Kanit mt-2">
                          {user.language === "Thai" && "ผู้เรียนส่งงานแล้ว"}
                          {user.language === "English" &&
                            "Students has summited thier work for"}{" "}
                          {assignment.progress}
                        </div>
                        <div className="font-Kanit mt-2">
                          {user.language === "Thai" && "มอบหมายเมื่อ"}
                          {user.language === "English" && "Assign on"}{" "}
                          <span className="w-max h-max p-1 px-2 bg-orange-300 text-black rounded-lg">
                            {formatAssigDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-24 md:w-32 ring-2 py-1 md:py-2 ring-blue-400 group-hover:bg-blue-400 rounded-xl flex flex-col justify-center ">
                    <div className="flex items-center justify-center flex-col">
                      <div>
                        <span className="text-lg md:text-2xl font-Poppins font-semibold group-hover:text-white text-blue-500 truncate ">
                          {assignment.maxScore.toLocaleString()}
                        </span>
                      </div>
                      <div className="font-Poppins font-semibold group-hover:text-white text-black">
                        {user.language === "Thai" && "คะแนน"}
                        {user.language === "English" && "score"}
                      </div>
                    </div>

                    <div className="font-Poppins gap-1 text-sm flex flex-col justify-start items-center  w-full  ">
                      <span className="group-hover:text-white text-black">
                        {user.language === "Thai" && "กำหนดส่ง"}
                        {user.language === "English" && "due by"}
                      </span>
                      <span className="group-hover:text-white text-black">
                        {deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </main>
  );
}

export default ShowListAssignments;
