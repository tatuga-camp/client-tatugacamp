import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetUser, GetUserCookie } from '../../../../../service/user';
import { useRouter } from 'next/router';
import Unauthorized from '../../../../../components/error/unauthorized';
import FullScreenLoading from '../../../../../components/loading/FullScreenLoading';
import {
  AllowStudentDeleteWorkService,
  GetOneClassroom,
} from '../../../../../service/classroom';
import Image from 'next/image';
import CreateAssignment from '../../../../../components/form/createAssignment';
import { GetAllAssignments } from '../../../../../service/assignment';
import { GetAllStudents } from '../../../../../service/students';
import Layout from '../../../../../layouts/classroomLayout';
import { Skeleton, Switch } from '@mui/material';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import {
  sideMenusEnglish,
  sideMenusThai,
} from '../../../../../data/menubarsAssignments';
import Link from 'next/link';
import { IoCreate } from 'react-icons/io5';
import { AiOutlineSetting } from 'react-icons/ai';
import { GetAllStudentsInClassroomForTeacherService } from '../../../../../service/teacher/student';
function Assignment({ error, user }) {
  const router = useRouter();
  const classroom = useQuery(
    ['classroom'],
    () => GetOneClassroom({ params: router.query.classroomId }),
    {
      enabled: false,
    },
  );
  const assignments = useQuery(
    ['assignments'],
    () => GetAllAssignments({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    },
  );
  const students = useQuery(
    ['students'],
    () =>
      user?.schoolUser?.organization === 'school'
        ? GetAllStudentsInClassroomForTeacherService({
            classroomId: router.query.classroomId,
          })
        : GetAllStudents({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    },
  );
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return sideMenusThai();
    } else if (user?.language === 'English') {
      return sideMenusEnglish();
    }
  });
  const [triggerAssignment, setTriggerAssignment] = useState(false);
  const [triggerAllowStudentDeleteWork, setTriggerAllowStudentDeleteWork] =
    useState(classroom?.data?.data?.allowStudentToDeleteWork);

  //check whether there is authorrized acccess or not
  useEffect(() => {
    classroom.refetch();
    assignments.refetch();
    students.refetch();
  }, [router.isReady]);

  useEffect(() => {
    setTriggerAllowStudentDeleteWork(() =>
      classroom?.data?.data?.allowStudentToDeleteWork
        ? classroom?.data?.data?.allowStudentToDeleteWork
        : false,
    );
  }, [classroom.data]);

  const handleAllowStudentDeleteWork = async () => {
    try {
      const update = await AllowStudentDeleteWorkService({
        classroomId: router.query.classroomId,
        allowStudentToDeleteWork: !triggerAllowStudentDeleteWork,
      });
      setTriggerAllowStudentDeleteWork(() => update.allowStudentToDeleteWork);
    } catch (err) {
      console.log(err);
    }
  };

  if (!router.isReady) {
    return <FullScreenLoading />;
  }
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }

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
      <Layout checkUser={user} sideMenus={sideMenus} language={user.language} />
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
      <div className="">
        <main className="w-full  py-5  mt-10 flex flex-col items-center justify-center relative">
          <div
            className="bg-white w-80 md:w-[28rem] h-20 rounded-full drop-shadow-md flex items-center 
          justify-center gap-2 "
          >
            <button
              onClick={() => {
                setTriggerAssignment(true);
                document.body.style.overflow = 'hidden';
              }}
              className="w-8/12 md:w-80 border-none py-2 rounded-full
               bg-blue-100 text-center font-Poppins text-base hover:bg-[#2C7CD1] hover:text-white
text-black transition duration-150  cursor-pointer"
            >
              <div className="font-Kanit flex items-center justify-center gap-2 font-medium">
                {user.language === 'Thai' && 'สร้างชิ้นงาน'}
                {user.language === 'English' && 'create your assignment'}
                <IoCreate />
              </div>
            </button>
          </div>

          <div
            className={` top-0 right-0 left-0 bottom-0 m-auto righ z-40 ${
              triggerAssignment === false ? 'hidden' : 'fixed'
            }`}
          >
            <CreateAssignment
              language={user.language}
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
                //covert date
                const date = new Date(assignment.deadline);

                const formattedDate = date.toLocaleDateString(
                  `${
                    user.language === 'Thai'
                      ? 'th-TH'
                      : user.language === 'English' && 'en-US'
                  }`,
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  },
                );
                const assignDate = new Date(assignment.createAt);

                const formatAssigDate = assignDate.toLocaleDateString(
                  `${
                    user.language === 'Thai'
                      ? 'th-TH'
                      : user.language === 'English' && 'en-US'
                  }`,
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  },
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
                                style={{ width: assignment.progress.progress }}
                                className={` bg-blue-800 h-2 `}
                              ></div>
                            </div>
                            <div className="font-Kanit mt-2">
                              {user.language === 'Thai' && 'ผู้เรียนส่งงานแล้ว'}
                              {user.language === 'English' &&
                                'Students has summited thier work for'}{' '}
                              {assignment.progress.progress}
                            </div>
                            <div className="font-Kanit mt-2">
                              {user.language === 'Thai' && 'มอบหมายเมื่อ'}
                              {user.language === 'English' && 'Assign on'}{' '}
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
                            {user.language === 'Thai' && 'คะแนน'}
                            {user.language === 'English' && 'score'}
                          </div>
                        </div>

                        <div className="font-Poppins gap-1 text-sm flex flex-col justify-start items-center  w-full  ">
                          <span className="group-hover:text-white text-black">
                            {user.language === 'Thai' && 'กำหนดส่ง'}
                            {user.language === 'English' && 'due by'}
                          </span>
                          <span className="group-hover:text-white text-black">
                            {formattedDate}
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
      </div>
    </div>
  );
}

export default Assignment;
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/signIn',
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/auth/signIn',
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        redirect: {
          permanent: false,
          destination: '/auth/signIn',
        },
      };
    }
  }
}
