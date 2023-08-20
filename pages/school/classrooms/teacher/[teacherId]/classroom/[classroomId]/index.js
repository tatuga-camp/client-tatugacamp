import React, { useEffect, useState } from 'react';
import {
  GetAClassroom,
  GetAllClassroomNumber,
} from '../../../../../../../service/school/classroom';
import { GetAllTeachersNumber } from '../../../../../../../service/school/teacher';
import { GetUserCookie } from '../../../../../../../service/user';
import { parseCookies } from 'nookies';
import Unauthorized from '../../../../../../../components/error/unauthorized';
import SchoolOnly from '../../../../../../../components/error/schoolOnly';
import Layout from '../../../../../../../layouts/tatugaSchoolLayOut';
import {
  sideMenusEnglish,
  sideMenusThai,
} from '../../../../../../../data/school/menubarsHomepage';
import { useQuery } from '@tanstack/react-query';
import { GetAttendanceClassroom } from '../../../../../../../service/school/attendance';
import { useRouter } from 'next/router';
import { Skeleton } from '@mui/material';
import { Popover } from '@headlessui/react';
import { BiMessageAltError, BiNotepad } from 'react-icons/bi';
import Image from 'next/image';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { MdSchool } from 'react-icons/md';
import ShowStudentAttendanceInfo from '../../../../../../../components/form/school/student/showStudentAttendanceInfo';
import { SiMicrosoftexcel } from 'react-icons/si';
import DowloadExcelAttendacne from '../../../../../../../components/form/dowloadExcelAttendacne';
import ShowNoteAttendance from '../../../../../../../components/form/showNoteAttendance';

function Index({ user, error, teachersNumber, classroomNumber }) {
  const router = useRouter();
  const [triggerAttendanceInfo, setTriggerAttendanceInfo] = useState(false);
  const [triggerShowNote, setTriggerShowNote] = useState(false);
  const [selectNote, setSelectNote] = useState();
  const [selectAttendacne, setSelectAttendance] = useState({
    student: '',
    attendanceData: '',
  });
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return sideMenusThai;
    } else if (user?.language === 'English') {
      return sideMenusEnglish;
    }
  });
  const classroom = useQuery(['classroom'], () =>
    GetAClassroom({
      classroomId: router.query.classroomId,
      teacherId: router.query.teacherId,
    }),
  );
  const attendances = useQuery(
    ['attendance'],
    () =>
      GetAttendanceClassroom({
        classroomId: router.query.classroomId,
        teacherId: router.query.teacherId,
      }),
    {
      enabled: false,
    },
  );
  useEffect(() => {
    if (router.isReady) {
      classroom.refetch();
      attendances.refetch();
    }
  }, [router.isReady]);
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
    >
      <main className="flex w-full justify-center mt-10 flex-col font-Kanit  items-center">
        {triggerAttendanceInfo && (
          <ShowStudentAttendanceInfo
            setTriggerAttendanceInfo={setTriggerAttendanceInfo}
            student={selectAttendacne.student}
            attendanceData={selectAttendacne.attendanceData}
            user={user}
          />
        )}

        {triggerShowNote && (
          <ShowNoteAttendance
            setTriggerShowNote={setTriggerShowNote}
            selectNote={selectNote}
          />
        )}
        <div className="w-full flex justify-center pb-10">
          <div className="w-5/12 h-max flex flex-col relative rounded-lg overflow-hidden drop-shadow-md bg-white px-5  items-center justify-center ">
            <div className="w-full h-3/6 py-5 bg-blue-500 flex flex-col items-start justify-center px-5 ">
              <span className="font-normal text-white text-base">
                รายละเอียดห้องเรียน
              </span>
              <span className="font-semibold text-white text-3xl">
                {classroom?.data?.title}
              </span>
              <span className="font-normal text-white text-base">
                {classroom?.data?.level}
              </span>
              <span className="font-normal text-white text-base">
                {classroom?.data?.description}
              </span>
            </div>
            <div className="w-28 h-28  bg-blue-100 text-blue-500 flex items-center justify-center ring-2 overflow-hidden rounded-full absolute top-0 bottom-0 right-4 m-auto">
              {classroom?.data?.user?.picture ? (
                <Image
                  src={classroom?.data?.user?.picture}
                  layout="fill"
                  className="object-cover"
                  alt={`picture of ${classroom?.data?.user?.firstName}`}
                  sizes="(max-width: 768px) 100vw"
                />
              ) : (
                <span className="font-bold text-5xl uppercase">
                  {classroom?.data?.user.firstName.charAt(0)}
                </span>
              )}
            </div>
            <div className="w-full h-3/6 py-5 bg-slate-100 flex flex-col items-start justify-center px-5 ">
              <span className="font-normal text-black text-base">
                รายละเอียดครูประจำวิชา
              </span>
              <span className="font-semibold text-black text-3xl">
                {classroom?.data?.user?.firstName}{' '}
                {classroom?.data?.user?.lastName}
              </span>
              <span className="font-normal text-black text-base">
                {classroom?.data?.user?.email}
              </span>
              <div className="flex gap-2 w-full mt-2 justify-around">
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex justify-center items-center w-10 h-10 bg-orange-500 rounded-full text-white">
                    <BsFillTelephoneFill />
                  </div>
                  <span className="font-normal text-black text-base">
                    {classroom?.data?.user?.phone}
                  </span>
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex justify-center items-center w-10 h-10 bg-orange-500 rounded-full text-white">
                    <MdSchool />
                  </div>
                  <span className="font-normal text-black text-base">
                    {classroom?.data?.user?.school}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Popover>
          {({ open }) => (
            <>
              <Popover.Button>
                <div className="w-max px-5 flex gap-1 mb-2 hover:scale-105 transition duration-150 active:bg-blue-800 bg-blue-500 font-Poppins font-semibold text-white rounded-lg py-2">
                  dowload
                  <div>
                    <SiMicrosoftexcel />
                  </div>
                </div>
              </Popover.Button>

              <Popover.Panel>
                {({ close }) => (
                  <DowloadExcelAttendacne
                    close={close}
                    language={user.language}
                    teacherId={router.query.teacherId}
                  />
                )}
              </Popover.Panel>
            </>
          )}
        </Popover>

        {attendances.isLoading || attendances.isFetching ? (
          <div className="flex flex-col gap-5 mt-5">
            <Skeleton variant="rectangular" width={700} height={40} />
            <Skeleton variant="rectangular" width={600} height={40} />
            <Skeleton variant="rectangular" width={800} height={40} />
          </div>
        ) : (
          <table
            className=" h-full  max-h-[40rem] flex flex-col w-80 md:w-[40rem] lg:w-[60rem]
              2xl:w-[80rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
          >
            <thead className="w-max sticky top-0 bg-white h-max py-3 z-10">
              <tr className="flex ">
                <th className="flex w-10 md:w-28  items-center justify-center sticky left-0 bg-white">
                  {user.language === 'Thai' && 'เลขที่'}
                  {user.language === 'English' && 'number'}
                </th>
                <th className="w-20 md:w-60 flex items-center justify-center sticky left-10 md:left-20 bg-white">
                  <span className="text-center">
                    {user.language === 'Thai' && 'รายชื่อ'}
                    {user.language === 'English' && "student's name"}
                  </span>
                </th>

                {attendances?.data?.[0].dateTimes.map((status, index) => {
                  const date = new Date(status.date);
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
                    <th
                      onClick={() => {
                        if (status.headData?.note) {
                          setSelectNote(() => status.headData?.note);
                          setTriggerShowNote(() => true);
                        }
                      }}
                      key={status.groupId}
                      className={`w-32 font-normal ${
                        status.headData?.note &&
                        'hover:bg-slate-100 cursor-pointer  '
                      } flex items-end relative justify-center  h-14   `}
                    >
                      {status.headData?.note && (
                        <div
                          className="absolute text-xs p-1 -top-3 bottom-0  m-auto w-5 h-5 right-0 left-0 ring-2
                         ring-black bg-white rounded-full flex items-center justify-center"
                        >
                          <BiNotepad />
                        </div>
                      )}
                      <span className="block ">{formattedDate}</span>
                    </th>
                  );
                })}
                <th className="w-36 flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === 'Thai' && 'จำนวนเข้าเรียน'}
                    {user.language === 'English' && 'Present'}
                  </span>
                </th>
                <th className="w-36 flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === 'Thai' && 'จำนวนสาย'}
                    {user.language === 'English' && 'late'}
                  </span>
                </th>
                <th className="w-36 flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === 'Thai' && 'จำนวนลา'}
                    {user.language === 'English' && 'take a leave'}
                  </span>
                </th>
                <th className="w-36 flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === 'Thai' && 'จำนวนป่วย'}
                    {user.language === 'English' && 'sick'}
                  </span>
                </th>
                <th className="w-36 flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === 'Thai' && 'จำนวนขาดเรียน'}
                    {user.language === 'English' && 'absent'}
                  </span>
                </th>
                <th className="w-36 flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === 'Thai' && 'เปอร์เซ็นมาเรียน'}
                    {user.language === 'English' && 'Percentage of present'}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="w-max">
              {attendances?.data.map((item, index) => {
                if (index !== 0) {
                  return (
                    <tr
                      key={index}
                      className="flex hover:ring-2 hover:bg-slate-200 group "
                    >
                      <td className=" w-10 md:w-28 flex items-center justify-center sticky left-0 bg-white group-hover:bg-slate-200">
                        {item.student.number}
                      </td>
                      <td
                        className="w-20 text-xs md:text-base  md:w-60  text-left 
                        flex justify-start items-center sticky left-10 md:left-20 bg-white group-hover:bg-slate-200"
                      >
                        <span className="text-left text-xs md:text-base truncate hover:overflow-visible">
                          {item.student.firstName} {item.student?.lastName}
                        </span>
                      </td>

                      {item.data.map((status) => {
                        return (
                          <td
                            key={status.id}
                            className="w-max flex items-center justify-center"
                          >
                            <button
                              className="relative"
                              onClick={() => {
                                setSelectAttendance(() => {
                                  return {
                                    student: item.student,
                                    attendanceData: status,
                                  };
                                });
                                setTriggerAttendanceInfo(() => true);
                              }}
                            >
                              {status.note && (
                                <div className="absolute text-xs p-1 top-0 bottom-0 m-auto w-5 h-5 right-1 ring-2 ring-black bg-white rounded-full flex items-center justify-center">
                                  <BiNotepad />
                                </div>
                              )}
                              <div
                                className={`w-32 flex items-center justify-center `}
                              >
                                {status.present && (
                                  <div className="bg-green-600 w-full items-center justify-center py-1  text-white">
                                    {user.language === 'Thai' && 'มาเรียน'}
                                    {user.language === 'English' && 'Presnt'}
                                  </div>
                                )}
                                {status.absent && (
                                  <div className="bg-red-600 w-full flex items-center justify-center py-1  text-white">
                                    {user.language === 'Thai' && 'ขาด'}
                                    {user.language === 'English' && 'Absent'}
                                  </div>
                                )}
                                {status.holiday && (
                                  <div className="bg-yellow-500 w-full flex items-center justify-center py-1  text-white">
                                    {user.language === 'Thai' && 'ลา'}
                                    {user.language === 'English' &&
                                      'Take a leave'}
                                  </div>
                                )}
                                {status.sick && (
                                  <div className="bg-blue-500 w-full flex items-center justify-center py-1  text-white">
                                    {user.language === 'Thai' && 'ป่วย'}
                                    {user.language === 'English' && 'sick'}
                                  </div>
                                )}
                                {status.late && (
                                  <div className="bg-orange-500 w-full flex items-center justify-center py-1  text-white">
                                    {user.language === 'Thai' && 'สาย'}
                                    {user.language === 'English' && 'late'}
                                  </div>
                                )}
                                {!status.holiday &&
                                  !status.absent &&
                                  !status.present &&
                                  !status.sick &&
                                  !status.late && (
                                    <div className="bg-gray-600 w-full flex items-center justify-center py-1  text-white">
                                      {user.language === 'Thai' &&
                                        'ไม่มีข้อมูล'}
                                      {user.language === 'English' && 'NO DATA'}
                                    </div>
                                  )}
                              </div>
                            </button>
                          </td>
                        );
                      })}
                      <td className="w-36 flex items-center justify-center ">
                        <span className="text-center">
                          {item.statistics.number.present}
                        </span>
                      </td>
                      <td className="w-36 flex items-center justify-center ">
                        <span className="text-center">
                          {item.statistics.number.late}
                        </span>
                      </td>
                      <td className="w-36 flex items-center justify-center ">
                        <span className="text-center">
                          {item.statistics.number.holiday}
                        </span>
                      </td>
                      <td className="w-36 flex items-center justify-center ">
                        <span className="text-center">
                          {item.statistics.number.sick}
                        </span>
                      </td>
                      <td className="w-36 flex items-center justify-center ">
                        <span className="text-center">
                          {item.statistics.number.absent}
                        </span>
                      </td>
                      <td className="w-36 flex items-center justify-center ">
                        <span className="text-center">
                          {item.statistics.percent.present.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        )}
        <span className="text-center font-Kanit text-xl font-semibold mt-2">
          {user.language === 'Thai' &&
            `จำนวนครูสอนทั้งหมด ${attendances?.data?.[0]?.sum} คาบ`}
          {user.language === 'English' &&
            `The teacher has taught this class for ${attendances?.data?.[0]?.sum} periods`}
        </span>
        {attendances?.data?.[0]?.dateTimes.length === 0 && (
          <div className="w-full flex items-center justify-center h-96 text-8xl">
            <span>ไม่มีข้อมูล</span>
            <div className="text-red-400">
              <BiMessageAltError />
            </div>
          </div>
        )}
      </main>
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
