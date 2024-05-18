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
    <main className="relative mt-20  flex w-full flex-col items-center justify-center">
      <button
        onClick={() => {
          setTriggerAssignment(true);
          document.body.style.overflow = "hidden";
        }}
        className="flex w-96 items-center justify-center gap-2
         rounded-lg bg-white py-3 font-Kanit font-semibold text-main-color ring-1 
         ring-main-color drop-shadow-lg transition hover:bg-main-color hover:text-white active:scale-105"
      >
        <CiCirclePlus />
        {user.language === "Thai" && "สร้างชิ้นงาน"}
        {user.language === "English" && "create your assignment"}
      </button>

      {triggerAssignment && (
        <CreateAssignment
          user={user}
          assignments={assignments}
          setTriggerAssignment={setTriggerAssignment}
          students={students}
        />
      )}

      {/* assignments are here */}
      <div className=" mt-5 grid w-full place-items-center gap-5 bg-slate-100 ">
        {assignments.isLoading || assignments.isFetching ? (
          <div className="flex w-80 flex-col gap-5 md:w-[40rem]">
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
              },
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
              },
            );

            return (
              <Link
                href={`/classroom/teacher/${router.query.classroomId}/assignment/${assignment.id}`}
                key={index}
                className={`group relative flex h-36 w-11/12 cursor-pointer flex-col  justify-center  overflow-hidden rounded-lg bg-white 
             px-2  no-underline drop-shadow-lg transition
         duration-150 hover:scale-105 md:w-max
       md:max-w-lg md:px-10 md:py-5 lg:max-w-2xl `}
              >
                <div className="flex w-full  justify-around">
                  <div className="flex w-52  truncate md:w-80 lg:w-96">
                    <div
                      className={`flex h-full  w-full flex-col
                    justify-center gap-2  text-center  font-Poppins  text-black md:w-3/4
                     md:max-w-md md:text-left `}
                    >
                      <span className=" font h-max max-h-8 w-full truncate text-base font-bold  md:text-xl">
                        {assignment.title}
                      </span>
                      <div className="relative text-left">
                        <div className="hidden h-2 w-full overflow-hidden rounded-full bg-gray-200 md:block">
                          <div
                            style={{
                              width: assignment.progress,
                            }}
                            className={` h-2 bg-blue-800 `}
                          ></div>
                        </div>
                        <div className="mt-2 font-Kanit">
                          {user.language === "Thai" && "ผู้เรียนส่งงานแล้ว"}
                          {user.language === "English" &&
                            "Students has summited thier work for"}{" "}
                          {assignment.progress}
                        </div>
                        <div className="mt-2 font-Kanit">
                          {user.language === "Thai" && "มอบหมายเมื่อ"}
                          {user.language === "English" && "Assign on"}{" "}
                          <span className="h-max w-max rounded-lg bg-orange-300 p-1 px-2 text-black">
                            {formatAssigDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex w-24 flex-col justify-center rounded-xl py-1 ring-2 ring-blue-400 group-hover:bg-blue-400 md:w-32 md:py-2 ">
                    <div className="flex flex-col items-center justify-center">
                      <div>
                        <span className="truncate font-Poppins text-lg font-semibold text-blue-500 group-hover:text-white md:text-2xl ">
                          {assignment.maxScore.toLocaleString()}
                        </span>
                      </div>
                      <div className="font-Poppins font-semibold text-black group-hover:text-white">
                        {user.language === "Thai" && "คะแนน"}
                        {user.language === "English" && "score"}
                      </div>
                    </div>

                    <div className="flex w-full flex-col items-center justify-start gap-1 font-Poppins  text-sm  ">
                      <span className="text-black group-hover:text-white">
                        {user.language === "Thai" && "กำหนดส่ง"}
                        {user.language === "English" && "due by"}
                      </span>
                      <span className="text-black group-hover:text-white">
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
