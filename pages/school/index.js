import React, { useEffect, useState } from 'react';
import Layout from '../../layouts/tatugaSchoolLayOut';
import { parseCookies } from 'nookies';
import { GetUserCookie } from '../../service/user';
import Unauthorized from '../../components/error/unauthorized';
import SchoolOnly from '../../components/error/schoolOnly';
import {
  sideMenusEnglish,
  sideMenusThai,
} from '../../data/school/menubarsHomepage';
import Head from 'next/head';
import Image from 'next/image';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { SiGoogleclassroom } from 'react-icons/si';
import {
  BsFillPeopleFill,
  BsPersonFillCheck,
  BsPersonFillX,
} from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa';
import {
  GetAllTeachers,
  GetAllTeachersNumber,
} from '../../service/school/teacher';
import NumberAnimated from '../../components/overview/numberAnimated';
import { useQuery } from 'react-query';
import {
  GetTopTenAbsent,
  GetTopTenHoliday,
  GetTopTenSick,
} from '../../service/school/attendance';
import { Pagination, Skeleton } from '@mui/material';
import ShowStudentInfo from '../../components/form/school/student/showStudentInfo';
import { useRouter } from 'next/router';
import { GetAllClassroomNumber } from '../../service/school/classroom';
import { GetAllStudentsNumber } from '../../service/school/student';

const loadingElements = [1, 2, 3, 4, 5];

function Index({
  user,
  error,
  teachersNumber,
  classroomNumber,
  studentNumber,
}) {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [triggerStudentInfo, setTriggerStudentInfo] = useState(false);
  const [currentStudentInfo, setCurrentStudentInfo] = useState();
  const [triggerAccountManagement, setTriggerAccountManagement] =
    useState(false);
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return sideMenusThai;
    } else if (user?.language === 'English') {
      return sideMenusEnglish;
    }
  });
  const topTenAbsent = useQuery(['top-ten-absent'], () => GetTopTenAbsent(), {
    enabled: false,
  });
  const topTenSick = useQuery(['top-ten-sick'], () => GetTopTenSick(), {
    enabled: false,
  });
  const teachers = useQuery(
    ['teachers', page],
    () => GetAllTeachers({ page: page }),
    { keepPreviousData: true },
  );
  const topTenHoliday = useQuery(
    ['top-ten-holiday'],
    () => GetTopTenHoliday(),
    {
      enabled: false,
    },
  );
  useEffect(() => {
    topTenAbsent.refetch();
    topTenSick.refetch();
    topTenHoliday.refetch();
  }, []);

  const handleTriggerStudentInfo = ({ student }) => {
    document.body.style.overflow = 'hidden';
    setTriggerStudentInfo(() => true);
    setCurrentStudentInfo(() => student);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(() => {
        const date = new Date();
        const formattedCreateDateTime = date.toLocaleString('th-TH', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        return formattedCreateDateTime;
      });
      setCurrentTime(() => {
        const date = new Date();
        const formattedCreateDateTime = date.toLocaleString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return formattedCreateDateTime;
      });
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(timer);
    };
  }, []);
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  } else if (error?.statusCode === 403) {
    return <SchoolOnly user={user} />;
  }

  return (
    <Layout
      sideMenus={sideMenus}
      user={user}
      teachersNumber={teachersNumber}
      classroomNumber={classroomNumber}
      router={router}
    >
      <Head>
        <title>tatuga school</title>
      </Head>

      <main className="w-full py-10 gap-10  h-max flex flex-col justify-center items-center font-Poppins  ">
        <div className="w-11/12 h-[35rem] pb-3 items-center rounded-lg flex flex-col ring-2 overflow-hidden ring-black">
          <div className="w-full bg-white h-28 flex justify-between">
            <div className="p-5 gap-2 flex flex-col">
              <span className="font-Poppins text-4xl font-semibold">
                Overview
              </span>
              <div className="flex gap-2 items-center justify-center">
                <span className="font-semibold">{currentDate} </span>
                <span>{currentTime} </span>
              </div>
            </div>
            <div className="p-5 gap-2 flex ">
              <div className="flex gap-2 items-center flex-col justify-center">
                <span className="font-semibold text-5xl">
                  <NumberAnimated n={teachersNumber} />{' '}
                </span>
                <span className="text-slate-500 font-medium font-Kanit">
                  บัญชีทั้งหมด
                </span>
              </div>
              <div className="h-full w-[1px] bg-slate-700 mx-5"></div>
              <div className="flex gap-2 items-center flex-col justify-center">
                <span className="font-semibold text-5xl">
                  <NumberAnimated n={studentNumber} />{' '}
                </span>
                <span className="text-slate-500 font-medium font-Kanit">
                  นักเรียนทั้งหมด
                </span>
              </div>
            </div>
          </div>
          <table
            className="w-11/12 h-[33rem]  flex flex-col 
            justify-start items-center gap-5 overflow-y-auto overflow-x-auto  relative "
          >
            <thead className="w-full sticky top-0 z-20">
              <tr
                className="flex self-start border-y-2 border-slate-500	
                   justify-start px-5 py-3   gap-5 items-center w-full 
                    bg-white "
              >
                <th className="w-60 flex font-semibold font-Kanit text-slate-500 justify-start">
                  ชื่อ - นามสกุล
                </th>
                <th className="w-20 flex font-semibold font-Kanit text-slate-500 justify-center">
                  รูป
                </th>
                <th className="w-60 flex font-semibold font-Kanit text-slate-500 justify-start">
                  อีเมล
                </th>

                <th className="w-60 flex font-semibold font-Kanit text-slate-500 justify-start">
                  โรงเรียน
                </th>
                <th className="w-32 flex font-semibold font-Kanit text-slate-500 justify-center">
                  สถานนะ
                </th>
                <th className="w-32 flex font-semibold font-Kanit text-slate-500 justify-center">
                  สร้างเมื่อ
                </th>
              </tr>
            </thead>
            <tbody className="flex w-full flex-col gap-5 ">
              {teachers.isLoading ? (
                <tr className="flex flex-col gap-5 ">
                  {loadingElements.map((list, index) => {
                    return (
                      <th
                        key={index}
                        className="flex justify-around gap-10 w-full"
                      >
                        <Skeleton
                          variant="rectangular"
                          width={150}
                          height={30}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={30}
                        />
                        <Skeleton
                          variant="rectangular"
                          width={300}
                          height={30}
                        />
                      </th>
                    );
                  })}
                </tr>
              ) : (
                teachers?.data?.users?.map((teacher) => {
                  const date = new Date(teacher.createAt);
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
                  return (
                    <tr
                      key={teacher.id}
                      onClick={() => {
                        setSelectTeacher(() => teacher);
                        setTriggerCreateUser(() => false);
                      }}
                      className="flex justify-start px-5 py-2 cursor-pointer 
                            gap-5 i w-full rounded-md  hover:bg-slate-100 items-center"
                    >
                      <td className="w-60 text-sm  flex justify-start truncate">
                        <div className="truncate">
                          {teacher.firstName} {teacher?.lastName}
                        </div>
                      </td>
                      <td className="w-20 flex justify-center">
                        <div
                          className="w-10 h-10 bg-blue-300 text-white rounded-md 
                            relative flex justify-center items-center overflow-hidden"
                        >
                          {teacher.picture ? (
                            <Image
                              src={teacher.picture}
                              layout="fill"
                              sizes="(max-width: 768px) 100vw"
                              className="object-cover"
                            />
                          ) : (
                            <span className="font-bold text-2xl uppercase">
                              {teacher.firstName.charAt(0)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="w-60 text-sm flex justify-start truncate">
                        {teacher.email}
                      </td>

                      <td className="w-60 flex text-sm justify-start truncate">
                        <div className="truncate">{teacher?.school}</div>
                      </td>

                      <td className="w-32 flex justify-center">
                        {teacher.isDisabled ? (
                          <div
                            className="w-full flex justify-center items-center rounded-3xl
                        bg-slate-200 text-slate-700 gap-2 text-center p-2"
                          >
                            <div className="flex justify-center items-center">
                              <BsPersonFillX />
                            </div>
                            disable
                          </div>
                        ) : (
                          <div
                            className="w-full flex justify-center items-center rounded-3xl
                           bg-green-200 text-green-700 gap-2 text-center p-2"
                          >
                            <div className="flex justify-center items-center">
                              <BsPersonFillCheck />
                            </div>
                            active
                          </div>
                        )}
                      </td>
                      <td className="w-32 flex justify-center">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <footer className="w-full mt-2 flex items-center justify-center">
            <Pagination
              count={teachers?.data?.totalPages}
              onChange={(e, page) => setPage(page)}
            />
          </footer>
        </div>
        {triggerStudentInfo && (
          <ShowStudentInfo
            setTriggerStudentInfo={setTriggerStudentInfo}
            currentStudentInfo={currentStudentInfo}
          />
        )}
        <div className=" flex w-11/12 gap-5 justify-center ">
          <div
            className="bg-white w-96 ring-2 ring-black  p-5 rounded-lg
           flex flex-col justify-start items-center"
          >
            <h3 className="font-Kanit font-normal text-red-600 mb-3">
              ขาดเรียน 10 อันดับแรก{' '}
            </h3>
            <ul className="w-max h-max  grid list-none pl-0">
              {topTenAbsent.isLoading ? (
                <div className="flex flex-col gap-3">
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                </div>
              ) : (
                topTenAbsent.data?.map((list, index) => {
                  return (
                    <li
                      onClick={() =>
                        handleTriggerStudentInfo({ student: list })
                      }
                      className="w-full transition p-2 duration-0  cursor-pointer
                       hover:bg-blue-50 relative h-max   flex justify-start gap-2 items-center"
                      key={index}
                    >
                      <div className="w-10 h-10 bg-white-400 rounded-full relative overflow-hidden">
                        <Image
                          src={list.student.picture}
                          layout="fill"
                          sizes="(max-width: 768px) 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0  items-start justify-center">
                        <div className="text-sm font-semibold flex gap-2 w-80 truncate ">
                          <span className="truncate">
                            {list.student.firstName}
                          </span>
                          <span className="truncate ">
                            {list.student?.lastName}
                          </span>
                        </div>
                        <div className="flex gap-5">
                          <span className="text-gray-600 text-sm font-normal">
                            เลขที่ {list.student.number}
                          </span>
                          <span className="text-red-600 text-sm font-bold">
                            ขาดเรียน {list.numberAbsent} ครั้ง
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-[1px] rounded-full bg-slate-200 absolute bottom-0 left-0"></div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div
            className="bg-white w-96 ring-2 ring-black  p-5 rounded-lg
           flex flex-col justify-start items-center"
          >
            <h3 className="font-Kanit font-normal text-blue-600 mb-3">
              สถิติป่วย 10 อันดับแรก{' '}
            </h3>
            <ul className="w-max h-max  grid list-none pl-0">
              {topTenSick.isLoading ? (
                <div className="flex flex-col gap-3">
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                </div>
              ) : (
                topTenSick.data?.map((list, index) => {
                  return (
                    <li
                      onClick={() =>
                        handleTriggerStudentInfo({ student: list })
                      }
                      className="w-full transition p-2 duration-0  cursor-pointer hover:bg-blue-50 relative h-max   flex justify-start gap-2 items-center"
                      key={index}
                    >
                      <div className="w-10 h-10 bg-white-400 rounded-full relative overflow-hidden">
                        <Image
                          src={list.student.picture}
                          layout="fill"
                          sizes="(max-width: 768px) 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0  items-start justify-center">
                        <div className="text-sm font-semibold flex gap-2 w-80 truncate ">
                          <span className="truncate">
                            {list.student.firstName}
                          </span>
                          <span className="truncate ">
                            {list.student?.lastName}
                          </span>
                        </div>
                        <div className="flex gap-5">
                          <span className="text-gray-600 text-sm font-normal">
                            เลขที่ {list.student.number}
                          </span>
                          <span className="text-blue-600 text-sm font-bold">
                            ป่วย {list.numberSick} ครั้ง
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-[1px] rounded-full bg-slate-200 absolute bottom-0 left-0"></div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          <div
            className="bg-white w-96 ring-2 ring-black  p-5 rounded-lg
           flex flex-col justify-start items-center"
          >
            <h3 className="font-Kanit font-normal text-orange-600 mb-3">
              สถิติลา 10 อันดับแรก{' '}
            </h3>
            <ul className="w-max h-max  grid list-none pl-0">
              {topTenHoliday.isLoading ? (
                <div className="flex flex-col gap-3">
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={20} />
                </div>
              ) : (
                topTenHoliday.data?.map((list, index) => {
                  return (
                    <li
                      onClick={() =>
                        handleTriggerStudentInfo({ student: list })
                      }
                      className="w-full transition p-2 duration-0  cursor-pointer hover:bg-blue-50 relative h-max   flex justify-start gap-2 items-center"
                      key={index}
                    >
                      <div className="w-10 h-10 bg-white-400 rounded-full relative overflow-hidden">
                        <Image
                          src={list.student.picture}
                          layout="fill"
                          sizes="(max-width: 768px) 100vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-0  items-start justify-center">
                        <div className="text-sm font-semibold flex gap-2 w-80 truncate ">
                          <span className="truncate">
                            {list.student.firstName}
                          </span>
                          <span className="truncate ">
                            {list.student?.lastName}
                          </span>
                        </div>
                        <div className="flex gap-5">
                          <span className="text-gray-600 text-sm font-normal">
                            เลขที่ {list.student.number}
                          </span>
                          <span className="text-orange-600 text-sm font-bold">
                            ลา {list.numberHoliday} ครั้ง
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-[1px] rounded-full bg-slate-200 absolute bottom-0 left-0"></div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </main>

      <footer></footer>
    </Layout>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: 'unauthorized',
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      if (user.role === 'TEACHER') {
        return {
          props: {
            error: {
              statusCode: 403,
              message: 'schoolUserOnly',
            },
          },
        };
      } else if (user.role === 'SCHOOL') {
        const teachersNumber = await GetAllTeachersNumber({
          access_token: accessToken,
        });
        const classroomNumber = await GetAllClassroomNumber({
          access_token: accessToken,
        });
        const studentNumber = await GetAllStudentsNumber({
          access_token: accessToken,
        });
        return {
          props: {
            user,
            teachersNumber,
            classroomNumber,
            studentNumber,
          },
        };
      }
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: 'unauthorized',
          },
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      if (user.role !== 'SCHOOL') {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: 'schoolUserOnly',
            },
          },
        };
      } else if (user.role === 'SCHOOL') {
        const teachersNumber = await GetAllTeachersNumber({
          access_token: accessToken,
        });
        const classroomNumber = await GetAllClassroomNumber({
          access_token: accessToken,
        });
        const studentNumber = await GetAllStudentsNumber({
          access_token: accessToken,
        });
        return {
          props: {
            classroomNumber,
            teachersNumber,
            studentNumber,
            user,
          },
        };
      }
    } catch (err) {
      console.log(err);
      return {
        props: {
          error: {
            statusCode: 401,
            message: 'unauthorized',
          },
        },
      };
    }
  }
}
