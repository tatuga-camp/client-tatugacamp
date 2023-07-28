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
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa';
import { GetAllTeachersNumber } from '../../service/school/teacher';
import NumberAnimated from '../../components/overview/numberAnimated';
import { useQuery } from 'react-query';
import {
  GetTopTenAbsent,
  GetTopTenHoliday,
  GetTopTenSick,
} from '../../service/school/attendance';
import { Skeleton } from '@mui/material';
import ShowStudentInfo from '../../components/form/school/student/showStudentInfo';
import { useRouter } from 'next/router';
import { GetAllClassroomNumber } from '../../service/school/classroom';

function Index({ user, error, teachersNumber, classroomNumber }) {
  const [page, setPage] = useState(1);
  const router = useRouter();
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

      <main className="w-full py-10 gap-10 h-max flex flex-col justify-center items-center font-Poppins  ">
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
        return {
          props: {
            user,
            teachersNumber,
            classroomNumber,
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
        return {
          props: {
            classroomNumber,
            teachersNumber,
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
