import React, { useEffect, useRef, useState } from "react";
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
import CreateAssignment from "../../../../../components/form/createAssignment";
import { useSprings, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import clamp from "lodash.clamp";
import swap from "lodash-move";

const fn =
  (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0) =>
  (index: number) =>
    active && index === originalIndex
      ? {
          y: curIndex * 50 + y,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          immediate: (key: string) => key === "y" || key === "zIndex",
        }
      : {
          y: order.indexOf(index) * 50,
          scale: 1,
          zIndex: 0,
          shadow: 1,
          immediate: false,
        };

function Assignment({ user }: { user: User }) {
  const order = useRef<number[]>([]); // Store indicies as a local ref, this represents the item order
  const router = useRouter();
  const classroom = useQuery({
    queryKey: ["classroom", router.query.classroomId],
    queryFn: () =>
      GetOneClassroomService({
        classroomId: router.query.classroomId as string,
      }),
  });
  const assignments = useQuery({
    queryKey: ["assignments", router.query.classroomId],
    queryFn: () =>
      GetAllAssignmentsService({
        classroomId: router.query.classroomId as string,
      }).then((res) => {
        order.current = res.map((_, index) => index);
        return res;
      }),
  });
  const students = useQuery({
    queryKey: ["students", router.query.classroomId],
    queryFn: () =>
      GetAllStudentsService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const [springs, api] = useSprings(
    assignments.data?.length || 0,
    fn(order.current)
  ); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  console.log(order);
  const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(
      Math.round((curIndex * 100 + y) / 100),
      0,
      assignments.data?.length ?? 0 - 1
    );
    const newOrder = swap(order.current, curIndex, curRow);
    api.start(fn(newOrder, active, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
    if (!active) order.current = newOrder;
  });

  const [triggerAssignment, setTriggerAssignment] = useState(false);
  const [triggerAllowStudentDeleteWork, setTriggerAllowStudentDeleteWork] =
    useState(classroom?.data?.allowStudentToDeleteWork);

  useEffect(() => {
    setTriggerAllowStudentDeleteWork(() =>
      classroom?.data?.allowStudentToDeleteWork
        ? classroom?.data?.allowStudentToDeleteWork
        : false
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
    <div className="w-full pb-96 bg-blue-50 ">
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

        <div className="flex w-full justify-center items-center">
          <div className="min-w-[25rem] w-max"></div>
        </div>
        <header className="flex w-full border-b-2 border-black/50 py-5 font-Kanit justify-start">
          <section className="pl-20 gap-5 text-xl flex flex-col font-semibold">
            <div className="flex w-max justify-center items-center gap-2">
              ตั้งค่า <AiOutlineSetting />
            </div>
            <div className="ring-2 select-none ring-blue-300 rounded-lg p-2">
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

        <main
          className="w-full h-full gap-20 bg-gray-100  
         flex flex-col items-center justify-center relative"
        >
          <div
            className="bg-white h-20  w-80 md:w-[28rem] rounded-full drop-shadow-md flex items-center 
          justify-center gap-2 "
          >
            <button
              onClick={() => {
                setTriggerAssignment(true);
                document.body.style.overflow = "hidden";
              }}
              className="w-8/12 md:w-80 border-none py-2 rounded-full
               bg-blue-100 text-center font-Poppins text-base hover:bg-[#2C7CD1] hover:text-white
text-black transition duration-150  cursor-pointer"
            >
              <div className="font-Kanit flex items-center justify-center gap-2 font-medium">
                {user.language === "Thai" && "สร้างชิ้นงาน"}
                {user.language === "English" && "create your assignment"}
                <IoCreate />
              </div>
            </button>
          </div>

          {/* assignments are here */}
          <div style={{ height: assignments.data?.length ?? 0 * 50 }}>
            {assignments.isLoading || assignments.isFetching ? (
              <div className="flex flex-col gap-5 w-80 md:w-[40rem]">
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
                <Skeleton variant="rounded" width="100%" height={144} />
              </div>
            ) : (
              springs.map(({ zIndex, shadow, y, scale }, index) => {
                const deadline = new Date(
                  assignments.data?.[index].deadline ?? ""
                ).toLocaleDateString(
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
                const assignDate = new Date(
                  assignments.data?.[index].createAt ?? ""
                );

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
                  <animated.div
                    {...bind(index)}
                    key={index}
                    style={{
                      touchAction: "pan-y",
                      zIndex,
                      boxShadow: shadow.to(
                        (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                      ),
                      y,
                      scale,
                    }}
                    children={
                      <div
                        // href={`/classroom/teacher/${router.query.classroomId}/assignment/${assignments.data?.[index].id}`}
                        key={index}
                        className="marker:w-11/12 no-underline md:w-max px-2 md:max-w-lg lg:max-w-2xl 
                            group  h-36  md:px-10 md:py-5 drop-shadow-lg 
                        bg-white  overflow-hidden
                           relative
                         rounded-lg flex flex-col justify-center"
                      >
                        <div className="flex justify-around  w-full">
                          <div className="flex w-52  md:w-80 lg:w-96 truncate">
                            <div
                              className={`flex flex-col  justify-center h-full
                            gap-2 w-full  md:w-3/4  md:max-w-md  font-Poppins text-center
                             md:text-left text-black `}
                            >
                              <span className=" font text-base md:text-xl font-bold w-full h-max max-h-8  truncate">
                                {assignments.data?.[index].title}
                              </span>
                              <div className="relative text-left">
                                <div className="w-full hidden md:block bg-gray-200 h-2 rounded-full overflow-hidden">
                                  <div
                                    style={{
                                      width: assignments.data?.[index].progress,
                                    }}
                                    className={` bg-blue-800 h-2 `}
                                  ></div>
                                </div>
                                <div className="font-Kanit mt-2">
                                  {user.language === "Thai" &&
                                    "ผู้เรียนส่งงานแล้ว"}
                                  {user.language === "English" &&
                                    "Students has summited thier work for"}{" "}
                                  {assignments.data?.[index].progress}
                                </div>
                                <div className="font-Kanit mt-2">
                                  {user.language === "Thai" && "มอบหมายเมื่อ"}
                                  {user.language === "English" &&
                                    "Assign on"}{" "}
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
                                  {assignments.data?.[
                                    index
                                  ].maxScore.toLocaleString()}
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
                      </div>
                    }
                  />
                );
              })
            )}
          </div>
        </main>
      </ClassroomLayout>
    </div>
  );
}

export default Assignment;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
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
