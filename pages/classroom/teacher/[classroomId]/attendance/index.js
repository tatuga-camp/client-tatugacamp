import React, { useEffect, useState } from 'react';
import Layout from '../../../../../layouts/classroomLayout';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { GetAllStudents } from '../../../../../service/students';
import {
  DeleteAttendance,
  GetAllAttendance,
} from '../../../../../service/attendance';
import Unauthorized from '../../../../../components/error/unauthorized';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import UpdateAttendance from '../../../../../components/form/updateAttendance';
import { Popover } from '@headlessui/react';
import { BiMessageAltError, BiNotepad } from 'react-icons/bi';
import { DownloadExcelAttendance } from '../../../../../service/dowloadFile';
import { SiMicrosoftexcel } from 'react-icons/si';
import { Skeleton } from '@mui/material';
import Head from 'next/head';
import { GetUserCookie } from '../../../../../service/user';
import { parseCookies } from 'nookies';
import {
  sideMenusEnglish,
  sideMenusThai,
} from '../../../../../data/menuBarsAttendance';
import DowloadExcelAttendacne from '../../../../../components/form/dowloadExcelAttendacne';
import ShowNoteAttendance from '../../../../../components/form/showNoteAttendance';
import { GetAllAttendanceForTeacherService } from '../../../../../service/teacher/attendance';

function Index({ error, user }) {
  const router = useRouter();
  const [selectAttendance, setSelectAttendance] = useState();
  const [triggerUpdateAttendance, setTriggerUpdateAttendance] = useState(false);
  const [triggerShowNote, setTriggerShowNote] = useState(false);
  const [selectNote, setSelectNote] = useState();
  const [sideMenus, setSideMenus] = useState();
  const attendances = useQuery(
    ['attendance'],
    () =>
      user?.schoolUser?.organization === 'school'
        ? GetAllAttendanceForTeacherService({
            classroomId: router.query.classroomId,
          })
        : GetAllAttendance({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    },
  );
  useEffect(() => {
    attendances.refetch();
    if (router.isReady) {
      if (user?.language === 'Thai') {
        setSideMenus(() => sideMenusThai({ router }));
      } else if (user?.language === 'English') {
        setSideMenus(() => sideMenusEnglish({ router }));
      }
    }
  }, [router.isReady]);

  const handleDeleteAttendance = async ({ groupId }) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'กำลังลบ...',
            html: 'รอสักครู่นะครับ...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await DeleteAttendance({ groupId });
          await attendances.refetch();
          Swal.fire('Deleted!', groupId, 'success');
        } catch (err) {
          console.log(err);
          Swal.fire(
            'Error!',
            err?.props?.response?.data?.message?.toString(),
            'error',
          );
        }
      }
    });
  };

  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }

  return (
    <div className="bg-blue-50 pb-40">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>attendance</title>
      </Head>
      <Layout checkUser={user} language={user.language} sideMenus={sideMenus}>
        <div className="w-full h-full mt-10 flex flex-col justify-center items-center pb-10 ">
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
                      user={user}
                      language={user.language}
                    />
                  )}
                </Popover.Panel>
              </>
            )}
          </Popover>

          {triggerUpdateAttendance && (
            <UpdateAttendance
              user={user}
              language={user.language}
              setTriggerUpdateAttendance={setTriggerUpdateAttendance}
              attendances={attendances}
              student={selectAttendance?.student}
              attendanceData={selectAttendance?.attendanceData}
            />
          )}

          {triggerShowNote && (
            <ShowNoteAttendance
              setTriggerShowNote={setTriggerShowNote}
              selectNote={selectNote}
            />
          )}

          {attendances.isLoading ? (
            <div className="flex flex-col gap-5 mt-5">
              <Skeleton variant="rectangular" width={700} height={40} />
              <Skeleton variant="rectangular" width={600} height={40} />
              <Skeleton variant="rectangular" width={800} height={40} />
            </div>
          ) : (
            <table
              className=" h-full  max-h-[40rem] flex flex-col w-80 md:w-[40rem]
              lg:w-[60rem] xl:w-[80rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
            >
              <thead className="w-max sticky top-0 bg-white h-max py-3 z-30">
                <tr className="flex ">
                  <th className="flex w-10 md:w-28  items-center justify-center sticky left-0 z-20 bg-white">
                    {user.language === 'Thai' && 'เลขที่'}
                    {user.language === 'English' && 'number'}
                  </th>
                  <th className="w-20 md:w-60 flex items-center justify-center sticky z-20 left-10 md:left-28 bg-white">
                    <span className="text-center">
                      {user.language === 'Thai' && 'รายชื่อ'}
                      {user.language === 'English' && "student's name"}
                    </span>
                  </th>

                  {attendances?.data?.data?.[0].dateTimes.map(
                    (status, index) => {
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
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12:
                            user.language === 'Thai'
                              ? false
                              : user.language === 'English' && true, // Use 24-hour format
                        },
                      );
                      return (
                        <th
                          key={status.groupId}
                          className="w-28 font-normal  flex items-center justify-around  bg-white 
                           relative  h-10  group cursor-pointer "
                        >
                          {status.headData?.note && (
                            <div
                              className="absolute text-[0.8rem] p-1  group-hover:hidden -top-8 bottom-0 m-auto w-5 h-5 right-1 ring-2
                           ring-black bg-white rounded-full flex items-center justify-center"
                            >
                              <BiNotepad />
                            </div>
                          )}
                          <span className="block group-hover:hidden">
                            {formattedDate}
                          </span>
                          {status.headData?.note && (
                            <div
                              onClick={() => {
                                setSelectNote(() => status.headData?.note);
                                setTriggerShowNote(() => true);
                              }}
                              className="group-hover:visible invisible h-0 w-0 flex items-center
                             text-black group-hover:text-green-500 
                                justify-center group-hover:w-5 group-hover:h-5 bg-green-100 rounded-full group-hover:scale-150 transition
                                 duration-150"
                            >
                              <BiNotepad />
                            </div>
                          )}
                          <div
                            onClick={() =>
                              handleDeleteAttendance({
                                groupId: status.groupId,
                              })
                            }
                            className="group-hover:visible invisible h-0 w-0 flex items-center text-black group-hover:text-red-500 
                                justify-center group-hover:w-5 group-hover:scale-150 transition duration-150"
                          >
                            <MdDelete />
                          </div>
                        </th>
                      );
                    },
                  )}
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
                  {user?.schoolUser?.organization === 'immigration' && (
                    <th className="w-36 flex items-center justify-center ">
                      <span className="text-center">
                        {user.language === 'Thai' && 'จำนวนเฝ้าระวัง'}
                        {user.language === 'English' && 'warn'}
                      </span>
                    </th>
                  )}
                  <th className="w-36 flex items-center justify-center ">
                    <span className="text-center">
                      {user.language === 'Thai' && 'เปอร์เซ็นมาเรียน'}
                      {user.language === 'English' && 'Percentage of present'}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="w-max">
                {attendances?.data?.data.map((item, index) => {
                  if (index !== 0) {
                    return (
                      <tr
                        key={index}
                        className="flex hover:ring-2 hover:bg-slate-200 group "
                      >
                        <td className=" w-10 md:w-28 flex items-center justify-center sticky left-0 z-20 bg-white group-hover:bg-slate-200">
                          {item.student?.number}
                        </td>
                        <td
                          className="w-20 text-xs md:text-base  md:w-60  text-left 
                        flex justify-start items-center sticky left-10 md:left-28 z-20 bg-white group-hover:bg-slate-200"
                        >
                          <span className="text-left text-xs md:text-base truncate hover:overflow-visible">
                            {item.student?.firstName} {item.student?.lastName}
                          </span>
                        </td>
                        {item.data.map((status) => {
                          return (
                            <td
                              key={status.id}
                              className="w-28 flex items-center justify-center"
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
                                  setTriggerUpdateAttendance(() => true);
                                  document.body.style.overflow = 'hidden';
                                }}
                              >
                                {status.note && (
                                  <div className="absolute text-xs p-1 top-0 bottom-0 m-auto w-5 h-5 right-1 ring-2 ring-black bg-white rounded-full flex items-center justify-center">
                                    <BiNotepad />
                                  </div>
                                )}
                                <div className="w-28  flex items-center justify-center ">
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
                                  {status.warn && (
                                    <div className="bg-red-700 w-full flex items-center justify-center py-1  text-white">
                                      {user.language === 'Thai' && 'เฝ้าระวัง'}
                                      {user.language === 'English' && 'warn'}
                                    </div>
                                  )}
                                  {!status.holiday &&
                                    !status.absent &&
                                    !status.present &&
                                    !status.sick &&
                                    !status.late &&
                                    !status.warn && (
                                      <div className="bg-gray-600 w-full flex items-center justify-center py-1  text-white">
                                        {user.language === 'Thai' &&
                                          'ไม่มีข้อมูล'}
                                        {user.language === 'English' &&
                                          'NO DATA'}
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
                        {user?.schoolUser?.organization === 'immigration' && (
                          <td className="w-36 flex items-center justify-center ">
                            <span className="text-center">
                              {item.statistics.number.warn}
                            </span>
                          </td>
                        )}
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
              `จำนวนครูสอนทั้งหมด ${attendances?.data?.data?.[0]?.sum} คาบ`}
            {user.language === 'English' &&
              `The teacher has taught this class for ${attendances?.data?.data?.[0]?.sum} periods`}
          </span>
          {attendances?.data?.data?.[0]?.dateTimes.length === 0 && (
            <div className="w-full flex items-center justify-center h-96 text-8xl">
              <span>ไม่มีข้อมูล</span>
              <div className="text-red-400">
                <BiMessageAltError />
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
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

      return {
        props: {
          user,
        },
      };
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
      return {
        props: {
          user,
        },
      };
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
  }
}
