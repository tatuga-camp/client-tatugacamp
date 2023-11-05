import React, { useEffect, useState } from 'react';
import Layout from '../../../layouts/tatugaSchoolLayOut';
import { parseCookies } from 'nookies';
import { GetUserCookie } from '../../../service/user';
import Unauthorized from '../../../components/error/unauthorized';
import SchoolOnly from '../../../components/error/schoolOnly';
import {
  sideMenusEnglish,
  sideMenusThai,
} from '../../../data/school/menubarsHomepage';
import Head from 'next/head';
import Image from 'next/image';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { SiGoogleclassroom } from 'react-icons/si';
import {
  BsFillPeopleFill,
  BsPersonFillCheck,
  BsPersonFillX,
  BsTable,
} from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa';
import {
  GetAllTeachers,
  GetAllTeachersNumber,
} from '../../../service/school/teacher';
import NumberAnimated from '../../../components/overview/numberAnimated';
import { useQuery } from '@tanstack/react-query';
import {
  GetTopTenAbsent,
  GetTopTenHoliday,
  GetTopTenSick,
} from '../../../service/school/attendance';
import { Pagination, Skeleton } from '@mui/material';
import ShowStudentInfo from '../../../components/form/school/student/showStudentInfo';
import { useRouter } from 'next/router';
import { GetAllClassroomNumber } from '../../../service/school/classroom';
import {
  GetAllStudentsByNationlity,
  GetAllStudentsNumber,
} from '../../../service/school/student';
import ShowTeacherOverviewInfo from '../../../components/form/school/teacher/showTeacherOverviewInfo';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { formattedColorCodesArray } from '../../../data/chart/color';
import ShowTeacherOverviewInfoImmigration from '../../../components/form/school/teacher/showTeacherOverviewInfo-immigration';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'แผนภูมิแสดงสถิติภาพรวม',
    },
  },
};
const optionsPie = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const labels = ['จำนวนทั้งหมด'];

const loadingElements = [1, 2, 3, 4, 5];

function Index({ user, error }) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [triggerStudentInfo, setTriggerStudentInfo] = useState(false);
  const [currentStudentInfo, setCurrentStudentInfo] = useState();
  const [selectTeacher, setSelectTeacher] = useState();
  const [triggerTableNationality, setTriggerTableNationality] = useState(false);
  const [triggerShowTeacherInfo, setTriggerShowTeacherInfo] = useState(false);
  const [page, setPage] = useState(1);
  const [dataNationality, setDataNationality] = useState();
  const [dataNationalityTabel, setDataNationalityTabel] = useState();

  const classroomNumber = useQuery(['classroom-number'], () =>
    GetAllClassroomNumber(),
  );
  const teachersNumber = useQuery(['teachers-number'], () =>
    GetAllTeachersNumber(),
  );
  const studentNumber = useQuery(['student-number'], () =>
    GetAllStudentsNumber(),
  );
  const studentNationality = useQuery(['student-nationality'], () =>
    GetAllStudentsByNationlity(),
  );
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

  const data = {
    labels,
    datasets: [
      {
        label: 'จำนวนนักเรียน',
        data: labels.map(() => studentNumber?.data),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'จำนวนห้องเรียน',
        data: labels.map(() => classroomNumber?.data),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'จำนวนบัญชี',
        data: labels.map(() => teachersNumber?.data),
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
      },
    ],
  };

  useEffect(() => {
    setDataNationality(() => {
      let value = [];
      let nationalities = [];
      for (const key in studentNationality?.data) {
        // Access the property key and value
        const number = studentNationality?.data[key];
        value.push(number);
        nationalities.push(key);
      }

      return {
        labels: nationalities,
        datasets: [
          {
            label: 'จำนวน',
            data: value,
            backgroundColor: formattedColorCodesArray,
            borderColor: formattedColorCodesArray,
            borderWidth: 1,
          },
        ],
      };
    });
    setDataNationalityTabel(() => {
      let value = [];
      let nationalities = [];
      for (const key in studentNationality.data) {
        // Access the property key and value
        const number = studentNationality.data[key];
        nationalities.push({ nationality: key, number });
      }
      return nationalities;
    });
  }, [studentNationality.isSuccess]);

  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return sideMenusThai;
    } else if (user?.language === 'English') {
      return sideMenusEnglish;
    }
  });

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
    <div className="bg-gradient-to-t from-blue-400 to-blue-50">
      {triggerShowTeacherInfo && (
        <ShowTeacherOverviewInfoImmigration
          setTriggerShowTeacherInfo={setTriggerShowTeacherInfo}
          selectTeacher={selectTeacher}
        />
      )}
      <Layout sideMenus={sideMenus} user={user} router={router}>
        <Head>
          <title>{user.school ? user.school : user.firstName}</title>
        </Head>

        <main className="w-full py-10 gap-10  h-max flex flex-col justify-center items-center font-Poppins  ">
          <div className="w-11/12 items-center flex flex-col gap-2 justify-center">
            <span className="text-blue-600 font-semibold text-4xl font-Kanit">
              ยินดีต้อนรับ😃
            </span>
            <div className="text-blue-600 font-semibold text-7xl font-Kanit">
              {user.school ? user.school : user.firstName}
            </div>
            <div
              className={`w-24 h-24 ${
                user?.picture ? 'bg-transparent' : 'bg-gray-500'
              } rounded-full relative flex justify-center items-center overflow-hidden ring-4 ring-blue-400 `}
            >
              {user?.picture ? (
                <Image
                  src={user?.picture}
                  className="object-cover"
                  alt={`profile of ${user?.firstName}`}
                  fill
                  sizes="(max-width: 768px) 100vw"
                />
              ) : (
                <span className="text-3xl font-Kanit font-semibold text-white">
                  {user?.firstName?.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="w-11/12 h-[35rem] bg-white pb-3 items-center rounded-lg flex flex-col ring-2 overflow-hidden ring-black">
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
                    {teachersNumber.isLoading ? (
                      <Skeleton width={50} />
                    ) : (
                      <NumberAnimated n={teachersNumber.data} />
                    )}
                  </span>
                  <span className="text-slate-500 font-medium font-Kanit">
                    บัญชีทั้งหมด
                  </span>
                </div>
                <div className="h-full w-[1px] bg-slate-700 mx-5"></div>
                <div className="flex gap-2 items-center flex-col justify-center">
                  <span className="font-semibold text-5xl">
                    {studentNumber.isLoading ? (
                      <Skeleton width={50} />
                    ) : (
                      <NumberAnimated n={studentNumber.data} />
                    )}
                  </span>
                  <span className="text-slate-500 font-medium font-Kanit">
                    นักเรียนทั้งหมด
                  </span>
                </div>
              </div>
            </div>
            <table
              className="w-11/12 h-[33rem]  flex flex-col 
            justify-start items-start gap-5 bg-white overflow-y-auto overflow-x-auto  relative "
            >
              <thead className="w-max sticky top-0 z-20">
                <tr
                  className="flex  border-y-2 border-slate-500	
                    px-5 py-3  gap-5  w-max 
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
                  <th className="w-32 flex font-semibold font-Kanit text-slate-500 justify-center">
                    จำนวนนักเรียน
                  </th>
                  <th className="w-32 flex font-semibold font-Kanit text-slate-500 justify-center">
                    จำนวนห้องเรียน
                  </th>
                </tr>
              </thead>
              <tbody className="flex w-max flex-col gap-5 ">
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
                          setTriggerShowTeacherInfo(() => true);
                          document.body.style.overflow = 'hidden';
                        }}
                        className="flex justify-start px-5 py-2 cursor-pointer 
                            gap-5 i w-full rounded-md  hover:bg-slate-100 items-center"
                      >
                        <td className="w-60 text-sm  flex justify-start truncate">
                          {teachers.isFetching ? (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={30}
                            />
                          ) : (
                            <div className="truncate">
                              {teacher.firstName} {teacher?.lastName}
                            </div>
                          )}
                        </td>
                        <td className="w-20 flex justify-center">
                          {teachers.isFetching ? (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={30}
                            />
                          ) : (
                            <div
                              className="w-10 h-10 bg-blue-300 text-white rounded-md 
                            relative flex justify-center items-center overflow-hidden"
                            >
                              {teacher.picture ? (
                                <Image
                                  src={teacher.picture}
                                  className="object-cover"
                                  fill
                                  sizes="(max-width: 768px) 100vw"
                                />
                              ) : (
                                <span className="font-bold text-2xl uppercase">
                                  {teacher.firstName.charAt(0)}
                                </span>
                              )}
                            </div>
                          )}
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
                        <td className="w-32  flex justify-center">
                          <div className="font-Poppins font-semibold text-blue-600">
                            {teacher.students}
                          </div>
                        </td>
                        <td className="w-32  flex justify-center">
                          <div className="font-Poppins font-semibold text-blue-600">
                            {teacher.classrooms}
                          </div>
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
          <div className="w-11/12 flex gap-5 justify-center items-center ">
            <div className=" w-6/12 h-96 p-5  bg-white rounded-xl">
              <Bar options={options} data={data} />
            </div>
            <div
              className=" w-[30rem] h-[30rem] p-5 gap-5 relative
              bg-white rounded-xl flex-col flex justify-center items-center"
            >
              <button
                onClick={() => setTriggerTableNationality((prev) => !prev)}
                className="w-max absolute top-2 right-2 hover:bg-green-500 hover:text-green-200
               px-5 py-2 rounded-md bg-green-200 text-green-600 font-Kanit font-semibold flex items-center gap-2"
              >
                ตาราง
                <div>
                  <BsTable />
                </div>
              </button>
              <span className="font-Kanit text-xl font-semibold">
                สรุปข้อมูลสัญชาติทั้งหมด
              </span>
              {triggerTableNationality ? (
                <ul className="grid grid-cols-2 overflow-auto h-96 w-full gap-x-10  place-items-start">
                  {dataNationalityTabel?.map((nationality, index) => {
                    return (
                      <li
                        key={index}
                        className="flex gap-2 items-start justify-between w-full 
                      col-span-1 font-Kanit font-medium text-left text-base p-2"
                      >
                        <div>{nationality.nationality}</div>
                        <div>{nationality.number}</div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="w-96 h-96">
                  {studentNationality.isLoading ||
                  dataNationality === undefined ? (
                    <Skeleton height="100%" />
                  ) : (
                    <Doughnut data={dataNationality} options={optionsPie} />
                  )}
                </div>
              )}
            </div>
          </div>

          {triggerStudentInfo && (
            <ShowStudentInfo
              setTriggerStudentInfo={setTriggerStudentInfo}
              currentStudentInfo={currentStudentInfo}
            />
          )}
          <div className=" flex w-11/12 gap-5 justify-center ">
            <div
              className="bg-white w-96 ring-2 overflow-hidden ring-black  p-5 rounded-lg
           flex flex-col justify-start items-center"
            >
              <h3 className="font-Kanit font-normal text-red-600 mb-3">
                ขาดเรียน 10 อันดับแรก{' '}
              </h3>
              <ul className="w-full h-max  grid list-none pl-0">
                {topTenAbsent.isLoading ? (
                  <div className="flex w-full flex-col gap-3">
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
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
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw"
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
              className="bg-white w-96 ring-2 ring-black overflow-hidden  p-5 rounded-lg
           flex flex-col justify-start items-center"
            >
              <h3 className="font-Kanit font-normal text-blue-600 mb-3">
                สถิติป่วย 10 อันดับแรก{' '}
              </h3>
              <ul className="w-full h-max  grid list-none pl-0">
                {topTenSick.isLoading ? (
                  <div className="flex w-full flex-col gap-3">
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
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
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw"
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
              className="bg-white w-96 ring-2 overflow-hidden ring-black  p-5 rounded-lg
           flex flex-col justify-start items-center"
            >
              <h3 className="font-Kanit font-normal text-orange-600 mb-3">
                สถิติลา 10 อันดับแรก{' '}
              </h3>
              <ul className="w-full h-max  grid list-none pl-0">
                {topTenHoliday.isLoading ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
                    <Skeleton width="100%" height={40} />
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
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw"
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
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: 'unauthorized',
        },
      },
    };
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
        if (user?.schoolUser?.organization === 'school') {
          return {
            redirect: {
              permanent: false,
              destination: '/school/dashboard',
            },
          };
        } else if (user?.schoolUser?.organization === 'immigration') {
          return {
            props: {
              user,
            },
          };
        }
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
