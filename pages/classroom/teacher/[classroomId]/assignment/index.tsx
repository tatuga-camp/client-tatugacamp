import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Image from "next/image";
import Layout from "../../../../../layouts/classroomLayout";
import { Skeleton, Switch } from "@mui/material";
import Head from "next/head";
import { parseCookies } from "nookies";
import Link from "next/link";
import { IoCreate } from "react-icons/io5";
import { AiOutlineSetting } from "react-icons/ai";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetUserCookieService } from "../../../../../services/user";
import { User } from "../../../../../models";
import {
  AllowStudentDeleteWorkService,
  GetOneClassroomService,
} from "../../../../../services/classroom";
import { GetAllAssignmentsService } from "../../../../../services/assignment";
import { GetAllStudentsService } from "../../../../../services/students";
import ClassroomLayout from "../../../../../layouts/classroomLayout";
import {
  SideMenusThai,
  sideMenusEnglish,
} from "../../../../../data/menubarsClassroom";
import { MdAssignment, MdQuiz } from "react-icons/md";
import ShowListAssignments from "../../../../../components/classroom/assignment/showListAssignments";
import ShowListQuizes from "../../../../../components/classroom/quize/showListQuizes";

const menuAssignments = [
  { engTitle: "Assignments", thaiTitle: "งานที่มอบหมาย", icon: MdAssignment },
  { engTitle: "Quiz", thaiTitle: "แบบทดสอบ", icon: MdQuiz },
];

function Assignment({ user }: { user: User }) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<number>(0);
  const classroom = useQuery({
    queryKey: ["classroom", router.query.classroomId],
    queryFn: () =>
      GetOneClassroomService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const [triggerAllowStudentDeleteWork, setTriggerAllowStudentDeleteWork] =
    useState(classroom?.data?.allowStudentToDeleteWork);

  useEffect(() => {
    setTriggerAllowStudentDeleteWork(() =>
      classroom?.data?.allowStudentToDeleteWork
        ? classroom?.data?.allowStudentToDeleteWork
        : false,
    );
  }, [classroom.data]);

  const handleAllowStudentDeleteWork = async () => {
    try {
      const update = await AllowStudentDeleteWorkService({
        classroomId: router.query.classroomId as string,
        allowStudentToDeleteWork: !triggerAllowStudentDeleteWork,
      });
      setTriggerAllowStudentDeleteWork(() => update.allowStudentToDeleteWork);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full bg-blue-50 pb-96 ">
      <Head>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
        <title>assignments</title>
      </Head>
      <ClassroomLayout
        sideMenus={
          user.language === "Thai"
            ? SideMenusThai({ router })
            : sideMenusEnglish({ router })
        }
      >
        <header className="flex w-full justify-start border-b-2 border-black/50 py-5 font-Kanit">
          <section className="flex flex-col gap-5 pl-20 text-xl font-semibold">
            <div className="flex w-max items-center justify-center gap-2">
              ตั้งค่า <AiOutlineSetting />
            </div>
            <div className="select-none rounded-lg p-2 ring-2 ring-blue-300">
              <Switch
                checked={triggerAllowStudentDeleteWork}
                onClick={handleAllowStudentDeleteWork}
              />
              {triggerAllowStudentDeleteWork ? (
                <span className="text-green-500">อนุญาตให้นักเรียนลบงาน</span>
              ) : (
                <span className="text-red-500">ไม่อนุญาตให้นักเรียนลบงาน</span>
              )}
            </div>
          </section>
        </header>
        <ul className="mt-5 flex w-full justify-center gap-5">
          {menuAssignments.map((menu, index) => (
            <li
              onClick={() => setActiveMenu(index)}
              key={index}
              className={`${
                activeMenu === index
                  ? "bg-main-color text-white"
                  : "bg-white text-main-color"
              } flex h-10 w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg
               font-Kanit text-lg font-semibold drop-shadow-lg transition duration-100 hover:bg-main-color 
                  hover:text-white active:scale-105  md:h-14 md:w-1/4   md:text-xl
                 `}
            >
              <div>
                {user.language === "Thai" && menu.thaiTitle}
                {user.language === "English" && menu.engTitle}
              </div>
              <menu.icon />
            </li>
          ))}
        </ul>
        <main>
          {activeMenu === 0 && <ShowListAssignments user={user} />}
          {activeMenu === 1 && <ShowListQuizes user={user} />}
        </main>
      </ClassroomLayout>
    </div>
  );
}

export default Assignment;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const cookies = parseCookies(context);
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
