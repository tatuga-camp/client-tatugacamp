import React, { useEffect, useState } from "react";
import Layout from "../../../../../layouts/classroomLayout";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { BiMessageAltError } from "react-icons/bi";
import { Skeleton, Switch } from "@mui/material";
import { SiMicrosoftexcel } from "react-icons/si";
import Swal from "sweetalert2";
import { parseCookies } from "nookies";

import { GiUpgrade } from "react-icons/gi";
import CreateGrade from "../../../../../components/form/createGrade";
import AddPercentageOnAssignment from "../../../../../components/form/addPercentageOnAssignment";
import AddPercentageOnSpecialScore from "../../../../../components/form/addPercentageOnSpecialScore";
import Link from "next/link";
import AdBanner from "../../../../../components/ads/adBanner";
import { Assignment, User } from "../../../../../models";
import { GetOneClassroomService } from "../../../../../services/classroom";
import { GetAllStudentScoresService } from "../../../../../services/students";
import { DownloadExcelScoreService } from "../../../../../services/dowloadFile";
import { AllowStudentViewScoreService } from "../../../../../services/scores";
import ClassroomLayout from "../../../../../layouts/classroomLayout";
import {
  SideMenusThai,
  sideMenusEnglish,
} from "../../../../../data/menubarsClassroom";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetUserCookieService } from "../../../../../services/user";
import { MdMoodBad } from "react-icons/md";

function Index({ user }: { user: User }) {
  const router = useRouter();
  const classroom = useQuery({
    queryKey: ["classroom", router.query.classroomId],
    queryFn: () =>
      GetOneClassroomService({
        classroomId: router.query.classroomId as string,
      }),
  });
  const studentsScores = useQuery({
    queryKey: ["studentsScores", router.query.classroomId],
    queryFn: () =>
      GetAllStudentScoresService({
        classroomId: router.query.classroomId as string,
      }),
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 10,
  });
  const [triggerCreateCreate, setTriggerCreateGrade] = useState(false);
  const [triggerAddPercentage, setTriggerAddPercentage] = useState(false);
  const [triggerAllowStudentViewScore, setTriggerAllowStudentViewScore] =
    useState(false);
  const [
    triggerAddPercentageOnSpecialScore,
    setTriggerAddPercentageOnSpecialScore,
  ] = useState(false);
  const [selectAssignment, setSelectAssignment] = useState<Assignment>();

  useEffect(() => {
    setTriggerAllowStudentViewScore(() =>
      classroom?.data?.allowStudentsToViewScores
        ? classroom?.data?.allowStudentsToViewScores
        : false
    );
  }, [classroom.data]);

  const handleDownloadFile = async () => {
    try {
      await DownloadExcelScoreService({
        classroomId: router.query.classroomId as string,
      });
      Swal.fire({
        title: "ดาวโหลดสำเร็จ",
        icon: "success",
      });
    } catch (err: any) {
      Swal.fire("error", err.message.toString(), "error");
      console.error(err);
    }
  };

  const handleTriggerCreateGrade = () => {
    setTriggerCreateGrade(() => true);
    document.body.style.overflow = "hidden";
  };

  const handleTriggerAllowStudentViewScore = async () => {
    try {
      const fetchTriggerAllow = await AllowStudentViewScoreService({
        classroomId: classroom.data?.id as string,
        allow: !triggerAllowStudentViewScore,
      });
      setTriggerAllowStudentViewScore(
        () => fetchTriggerAllow.allowStudentsToViewScores
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ClassroomLayout
      sideMenus={
        user.language === "Thai"
          ? SideMenusThai({ router })
          : sideMenusEnglish({ router })
      }
    >
      <div className="w-full font-Kanit  pb-40">
        {triggerCreateCreate && (
          <CreateGrade
            setTriggerCreateGrade={setTriggerCreateGrade}
            studentsScores={studentsScores}
          />
        )}
        {triggerAddPercentage && selectAssignment && (
          <AddPercentageOnAssignment
            selectAssignment={selectAssignment}
            studentsScores={studentsScores}
            setTriggerAddPercentage={setTriggerAddPercentage}
          />
        )}
        {triggerAddPercentageOnSpecialScore && (
          <AddPercentageOnSpecialScore
            classroom={classroom}
            studentsScores={studentsScores}
            setTriggerAddPercentageOnSpecialScore={
              setTriggerAddPercentageOnSpecialScore
            }
          />
        )}
        <Head>
          <meta
            name="viewport"
            content="width=device-width; initial-scale=1.0;"
          />
          <meta charSet="UTF-8" />
          <title>overall score</title>
        </Head>

        <div className=" w-full flex flex-col items-center justify-start mt-2">
          <header className="flex gap-4">
            <button
              className="w-max px-5 flex gap-1 mb-2 hover:scale-105 transition duration-150 active:bg-blue-800 bg-blue-500 font-Poppins font-semibold text-white rounded-lg py-2"
              onClick={handleDownloadFile}
            >
              dowload
              <div>
                <SiMicrosoftexcel />
              </div>
            </button>
            <button
              className="w-max px-5 flex gap-1 mb-2 hover:scale-105 transition items-center
             duration-150 active:bg-green-800 bg-green-500 font-Poppins font-semibold text-white rounded-lg py-2"
              onClick={handleTriggerCreateGrade}
            >
              ปรับการคำนวนเกรด
              <div>
                <GiUpgrade />
              </div>
            </button>
            <div className="flex items-center justify-center px-4 py-1 rounded-md border-2 border-black">
              <Switch
                onClick={handleTriggerAllowStudentViewScore}
                checked={triggerAllowStudentViewScore}
                inputProps={{
                  "aria-label": "Switch to allow student to view thier score",
                }}
              />
              <span>
                {triggerAllowStudentViewScore
                  ? "อนุญาตให้ผู้เรียนดูคะแนน"
                  : "ไม่อนุญาตให้ผู้เรียนดูคะแนน"}
              </span>
            </div>
          </header>
          {studentsScores.isLoading ? (
            <div className="flex flex-col gap-5 mt-5">
              <Skeleton variant="rectangular" width={700} height={40} />
              <Skeleton variant="rectangular" width={600} height={40} />
              <Skeleton variant="rectangular" width={800} height={40} />
            </div>
          ) : studentsScores?.data?.assignments.length === 0 ? (
            <div className="w-full  flex items-center justify-center h-full text-3xl mt-5">
              <span>
                {user.language === "Thai" &&
                  "ไม่มีข้อมูลเนื่องจากไม่ได้มอบหมายงานให้ผู้เรียน"}
                {user.language === "English" && "No data due to no assignments"}
              </span>
              <div className="text-red-400">
                <BiMessageAltError />
              </div>
            </div>
          ) : (
            <table
              className=" h-full  max-h-[40rem] flex flex-col w-80 md:w-[40rem]
              lg:w-[80rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
            >
              <thead className="w-max sticky top-0 border-b-2 bg-white h-max py-3 z-10">
                <tr className="flex ">
                  <th className="flex w-10 md:min-w-[10rem] md:w-max md:max-w-lg  items-center justify-center sticky left-0 bg-white">
                    {user.language === "Thai" && "เลขที่"}
                    {user.language === "English" && "number"}
                  </th>
                  <th className="w-40 md:w-44 lg:w-60 flex items-center justify-center sticky left-10 md:left-20 bg-white">
                    {user.language === "Thai" && "รายชื่อ"}
                    {user.language === "English" && "student's name"}
                  </th>

                  {studentsScores?.data?.assignments.map((assignment) => {
                    const date = new Date(assignment.createAt);
                    const formattedDate = date.toLocaleDateString(
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
                      <th key={assignment.id} className="w-40 truncate ">
                        <div className="flex  w-full flex-col items-center justify-center">
                          <span className="text-sm truncate w-40">
                            {assignment.title}
                          </span>

                          {assignment.percentage ? (
                            <div className="flex flex-col">
                              <span className="text-sm font-normal">
                                {user.language === "Thai" && "คะแนนดิบเต็ม"}
                                {user.language === "English" &&
                                  "raw scores"}{" "}
                                {` `}
                                {assignment.maxScore}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectAssignment(() => assignment);
                                  document.body.style.overflow = "hidden";
                                  setTriggerAddPercentage(() => true);
                                }}
                                className="w-20 flex justify-center items-center
                             p-1 text-white bg-green-500 rounded-lg "
                              >
                                {assignment.percentage}
                              </button>
                            </div>
                          ) : (
                            <div className="text-sm font-normal flex flex-col gap-1">
                              <button
                                onClick={() => {
                                  setSelectAssignment(() => assignment);
                                  document.body.style.overflow = "hidden";
                                  setTriggerAddPercentage(() => true);
                                }}
                                className="w-max px-2 flex justify-center items-center
                             p-1 text-white bg-blue-500 text-sm hover:scale-110 transition duration-100 "
                              >
                                ตั้งค่าเปอร์เซ็นต์
                              </button>
                              <span>
                                {user.language === "Thai" && "คะแนนเต็ม"}
                                {user.language === "English" && "scores"} {` `}
                                {assignment.maxScore}
                              </span>
                            </div>
                          )}
                          <span className="font-normal italic">
                            ({formattedDate})
                          </span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="w-40 flex  flex-col justify-start items-center">
                    <span>
                      {user.language === "Thai" && "คะแนนพิเศษ"}
                      {user.language === "English" && "motivative scores"}
                    </span>
                    {studentsScores?.data?.classroom?.specialScorePercentage ? (
                      <button
                        onClick={() => {
                          document.body.style.overflow = "hidden";
                          setTriggerAddPercentageOnSpecialScore(() => true);
                        }}
                        className="w-20 flex justify-center items-center
                   p-1 text-white bg-green-500 rounded-lg "
                      >
                        {
                          studentsScores?.data?.classroom
                            ?.specialScorePercentage
                        }
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          document.body.style.overflow = "hidden";
                          setTriggerAddPercentageOnSpecialScore(() => true);
                        }}
                        className="w-max flex px-2 hover:scale-110 text-sm transition duration-150
                       justify-center font-normal items-center
                 p-1 text-white bg-blue-500 "
                      >
                        ตั้งค่าเปอร์เซ็นต์
                      </button>
                    )}
                  </th>
                  <th className="w-40 flex flex-col justify-center items-center gap-1">
                    <div>
                      {user.language === "Thai" && "รวม"}
                      {user.language === "English" && "sum"}
                    </div>
                    <div>({studentsScores?.data?.sumScoreTotal})</div>
                    {!studentsScores?.data?.classroom
                      ?.specialScorePercentage && (
                      <div className="font-normal w-28 text-sm text-red-500">
                        **กรุณาตั้งเปอร์เซ็นต์ คะแนนพิเศษ**
                      </div>
                    )}
                  </th>
                  <th className=" w-40">
                    {user.language === "Thai" && "เกรด"}
                    {user.language === "English" && "grade"}
                  </th>
                </tr>
              </thead>
              <tbody className="w-max">
                {studentsScores?.data?.studentsScores.map((student) => {
                  const totalScore =
                    student.totalPoints + student.score.totalPoints;

                  return (
                    <tr
                      key={student.id}
                      className="flex  hover:bg-slate-200 group "
                    >
                      <th className="w-10 md:min-w-[10rem] md:w-max md:max-w-lg   text-center flex items-center justify-center bg-white group-hover:bg-slate-200 sticky left-0">
                        {student.number}
                      </th>
                      <td
                        className="w-40 md:w-44 lg:w-60  py-4 sticky left-16 flex 
                    items-center justify-start text-xs lg:text-sm md:text-base md:left-20'
                     bg-white group-hover:bg-slate-200 "
                      >
                        {student.firstName} {student?.lastName}
                      </td>
                      {student.studentWorks.map((studentWork, index) => {
                        return (
                          <td
                            key={index}
                            className="w-40 text-center  flex items-center justify-center"
                          >
                            {!studentWork.studentWork ? (
                              <div className="px-5 py-1 flex items-center justify-center gap-2 bg-red-300 text-red-700 rounded-md">
                                ไม่ส่งงาน <MdMoodBad />
                              </div>
                            ) : (
                              studentWork?.studentWork?.score?.toFixed(3)
                            )}
                          </td>
                        );
                      })}
                      <td className=" w-40 text-center  flex items-center justify-center">
                        {student?.score?.totalPoints?.toFixed(3)}
                      </td>
                      <td className=" w-40 text-center  flex items-center justify-center">
                        {totalScore?.toFixed(3)}
                      </td>
                      <td className=" w-40 text-center  flex items-center justify-center">
                        {student.grade}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ClassroomLayout>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const cookies = parseCookies(ctx);
  const accessToken = cookies.access_token;

  if (accessToken) {
    try {
      const user = await GetUserCookieService({
        access_token: accessToken,
      });
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: "/auth/signIn",
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signIn",
      },
    };
  }
};
