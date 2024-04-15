import React, { ChangeEvent, useEffect, useState } from "react";
import Layout from "../../../../../layouts/classroomLayout";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import UpdateAttendance from "../../../../../components/form/updateAttendance";
import { Popover } from "@headlessui/react";
import { BiMessageAltError, BiNotepad } from "react-icons/bi";
import { SiMicrosoftexcel } from "react-icons/si";
import { Skeleton } from "@mui/material";
import Head from "next/head";
import { parseCookies } from "nookies";
import DowloadExcelAttendacne from "../../../../../components/form/dowloadExcelAttendacne";
import ShowNoteAttendance from "../../../../../components/form/showNoteAttendance";

//Chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import Chart from "chart.js/auto";
Chart.register(CategoryScale);

import {
  DeleteAttendanceService,
  GetAllAttendanceService,
} from "../../../../../services/attendance";
import {
  Attendance,
  HeadAttendance,
  Student,
  User,
} from "../../../../../models";
import ClassroomLayout from "../../../../../layouts/classroomLayout";
import {
  SideMenusThai,
  sideMenusEnglish,
} from "../../../../../data/menubarsClassroom";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetUserCookieService } from "../../../../../services/user";

export type selectNote = {
  headAttendance: HeadAttendance;
  groupId: string;
};
export type selectAttendance = {
  student: Student;
  attendanceData: Attendance;
};

import { LuCalendarRange } from "react-icons/lu";
import { MdOutlineBarChart } from "react-icons/md";
import Image from "next/image";
import { TfiStatsUp } from "react-icons/tfi";

import { processAttendanceData } from "@/utils/processAttendanceData";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

type AttendanceStatus =
  | "present"
  | "absent"
  | "holiday"
  | "late"
  | "sick"
  | "warn";
const monthNamesEN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthNamesTH = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];
const initialData = {
  labels: monthNamesEN,
  datasets: [
    {
      label: "",
      data: [],
      backgroundColor: "",
    },
  ],
};

//main return ==================================================
function Index({ user }: { user: User }) {
  const router = useRouter();
  const [yearList, setYearList] =
    useState<{ year: number; count: any; statuses: any }[]>();
  const attendances = useQuery({
    queryKey: ["attendance", router.query.classroomId as string],
    queryFn: () =>
      GetAllAttendanceService({
        classroomId: router.query.classroomId as string,
      }).then((response) => {
        const years = processAttendanceData(response);
        setYearList(years);
        setSelectedYear(years[0].year);
        return response;
      }),
  });
  const [selectAttendance, setSelectAttendance] =
    useState<selectAttendance | null>();
  const [triggerUpdateAttendance, setTriggerUpdateAttendance] = useState(false);
  const [triggerShowNote, setTriggerShowNote] = useState(false);
  const [selectNote, setSelectNote] = useState<selectNote | null>();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedStatus, setSelectedStatus] =
    useState<AttendanceStatus>("present");
  const [chartData, setChartData] = useState(initialData);
  const handleDeleteAttendance = async ({ groupId }: { groupId: string }) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "กำลังลบ...",
            html: "รอสักครู่นะครับ...",
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          await DeleteAttendanceService({ groupId });
          await attendances.refetch();
          Swal.fire("Deleted!", groupId, "success");
        } catch (err: any) {
          console.error(err);
          Swal.fire(
            "Error!",
            err?.props?.response?.data?.message?.toString(),
            "error"
          );
        }
      }
    });
  };

  const [selectedButton, setSelectedButton] = useState<
    "information" | "stat" | "stat-month"
  >("information");
  const handleButtonClick = (
    buttonName: "information" | "stat" | "stat-month"
  ) => {
    setSelectedButton(buttonName);
  };
  //Get attendance monthly logic

  //chart==========================
  const statusTypeArray = [
    "absent",
    "holiday",
    "late",
    "present",
    "sick",
    "warn",
  ];

  const statusTypeArrayTH = [
    "ขาด",
    "ลา",
    "สาย",
    "มาเรียน",
    "ป่วย",
    "เฝ้าระวัง",
  ];

  const statusColor = [
    "rgba(209, 44, 44, 1.0)",
    "rgba(237, 186, 2, 1.0)",
    "rgba(245, 94, 0, 1.0)",
    "rgba(0, 180, 81, 1.0)",
    "rgba(18, 133, 255, 1.0)",
    "rgba(132, 10, 208, 1.0)",
  ];

  const optionChart = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: "",
      },
      datalabels: {
        color: "#ffffff",
      },
    },
  };

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(event.target.value));
    updateChartData(selectedStatus, parseInt(event.target.value));
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedStatus(value as AttendanceStatus);
    if (!selectedYear) return;
    updateChartData(value as AttendanceStatus, selectedYear);
  };

  const updateChartData = (status: AttendanceStatus, year: number) => {
    const yearData = yearList?.find((data) => data.year === year);
    if (yearData) {
      const monthsArray = yearData.statuses[status].months;

      const newChartData = {
        ...initialData,
        datasets: [
          {
            ...initialData.datasets[0],
            label: status,
            data: monthsArray,
            backgroundColor: statusColor[statusTypeArray.indexOf(status)],
          },
        ],
      };
      setChartData(newChartData);
    }
  };

  useEffect(() => {
    if (!yearList) return;
    updateChartData(selectedStatus, yearList[0].year);
  }, [yearList]);

  const getStatusLabel = () => {
    const index = statusTypeArray.findIndex(
      (status) => status === selectedStatus
    );
    return user.language === "Thai" ? statusTypeArrayTH[index] : selectedStatus;
  };

  return (
    <div className="bg-blue-50 ">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>attendance</title>
      </Head>
      <ClassroomLayout
        sideMenus={
          user.language === "Thai"
            ? SideMenusThai({ router })
            : sideMenusEnglish({ router })
        }
      >
        <div className="bg-white w-full h-full mt-3 flex flex-col justify-center items-center pb-10 pt-10  ">
          <div className=" md:w-[70%] flex flex-col md:flex-row  font-Kanit font-semibold justify-between  ">
            <div className="flex gap-1 text-[0.8rem] md:text-[1rem] md:gap-3">
              <button
                className={`hover:scale-105 transition duration-150 flex items-center justify-center gap-2 rounded-full py-2 px-3 border-[3px] border-solid border-[#EDBA02]  ${
                  selectedButton === "information"
                    ? "bg-[#EDBA02] text-white"
                    : "bg-white text-[#EDBA02] border-[#EDBA02]"
                }`}
                onClick={() => handleButtonClick("information")}
              >
                <section className="text-[1.3rem]">
                  <LuCalendarRange />
                </section>
                ภาพรวม
              </button>
              <button
                className={`hover:scale-105 transition duration-150 flex items-center justify-center gap-2 rounded-full py-2 px-3 border-[3px] border-solid border-[#FF64D4]  ${
                  selectedButton === "stat"
                    ? "bg-[#FF64D4] text-white"
                    : "bg-white text-[#FF64D4] border-[#FF64D4]"
                }`}
                onClick={() => handleButtonClick("stat")}
              >
                <section className="text-[1.3rem]">
                  <MdOutlineBarChart />
                </section>
                ข้อมูลสถิติ
              </button>
              <button
                className={`hover:scale-105 transition duration-150 flex items-center justify-center gap-2 rounded-full py-2 px-3 border-[3px] border-solid border-purple-500  ${
                  selectedButton === "stat-month"
                    ? "bg-purple-500 text-white"
                    : "bg-white text-purple-500 border-purple-500"
                }`}
                onClick={() => handleButtonClick("stat-month")}
              >
                <section className="text-[1.3rem]">
                  <TfiStatsUp />
                </section>
                สถิติรายเดือน
              </button>
            </div>

            <div className="flex items-center justify-center mt-2 md:mt-0">
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button>
                      <div className="text-[1rem] w-max flex items-center justify-center gap-2  hover:scale-105 transition duration-150  bg-white text-[#207245] font-Poppins font-semibold  rounded-full py-2 px-3 border-[3px] border-solid border-[#207245]">
                        <div>
                          <section className=" text-[0.9rem] md:text-[1rem]">
                            <SiMicrosoftexcel />
                          </section>
                        </div>
                        download
                      </div>
                    </Popover.Button>

                    <Popover.Panel>
                      {({ close }) => (
                        <DowloadExcelAttendacne close={close} user={user} />
                      )}
                    </Popover.Panel>
                  </>
                )}
              </Popover>
            </div>
          </div>

          <div className="mt-5 mb-20">
            {triggerUpdateAttendance && (
              <UpdateAttendance
                user={user}
                setTriggerUpdateAttendance={setTriggerUpdateAttendance}
                attendances={attendances}
                student={selectAttendance?.student as Student}
                attendanceData={selectAttendance?.attendanceData as Attendance}
              />
            )}

            {triggerShowNote && (
              <ShowNoteAttendance
                setTriggerShowNote={setTriggerShowNote}
                selectNote={selectNote}
                attendances={attendances}
                classroomId={router.query.classroomId as string}
              />
            )}

            {selectedButton === "information" && (
              <div>
                {attendances.isLoading ? (
                  <div className="flex flex-col gap-5 mt-5">
                    <Skeleton variant="rectangular" width={700} height={40} />
                    <Skeleton variant="rectangular" width={600} height={40} />
                    <Skeleton variant="rectangular" width={800} height={40} />
                  </div>
                ) : (
                  <div>
                    <table
                      className=" h-full  max-h-[40rem] flex flex-col w-80 md:w-[40rem]
                  lg:w-[60rem] xl:w-[70rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
                    >
                      <thead className="w-max sticky top-0  py-2 z-10 bg-white">
                        <tr className="flex text-white  bg-white">
                          <th className=" sticky left-0 z-10  bg-white ">
                            <div className="m-1 flex h-12  w-10 md:w-[5.4rem]  items-center text-xs md:text-base justify-center rounded-md bg-[#2C7CD1]">
                              {user.language === "Thai" && "เลขที่"}
                              {user.language === "English" && "number"}
                            </div>
                          </th>
                          <th className=" sticky z-10 left-12 md:left-[6rem] bg-white  ">
                            <div className="m-1 w-10 h-12 md:w-[16.5rem] flex items-center justify-center text-xs md:text-base bg-[#2C7CD1] rounded-md">
                              <span className="text-center">
                                {user.language === "Thai" && "รายชื่อ"}
                                {user.language === "English" &&
                                  "student's name"}
                              </span>
                            </div>
                          </th>

                          {attendances?.data?.meta.headAttendances.map(
                            (status, index) => {
                              const date = new Date(status.date);
                              const formattedDate = date.toLocaleDateString(
                                `${
                                  user.language === "Thai"
                                    ? "th-TH"
                                    : user.language === "English" && "en-US"
                                }`,
                                {
                                  timeZone: userTimeZone,
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12:
                                    user.language === "Thai"
                                      ? false
                                      : user.language === "English" && true, // Use 24-hour format
                                }
                              );
                              return (
                                <th
                                  key={status.groupId}
                                  className="w-28 font-normal  flex items-center justify-around bg-white text-white rounded-md 
                               relative  h-12  group cursor-pointer  "
                                >
                                  {status.headData?.note && (
                                    <div
                                      className="absolute text-[0.8rem] p-1  group-hover:hidden  bottom-0 m-auto w-5 h-5 right-2 ring-1
                               ring-white bg-[#9C2CD1] rounded-full flex items-center justify-center "
                                    >
                                      <BiNotepad />
                                    </div>
                                  )}
                                  <span className="block group-hover:hidden bg-[#2C7CD1] mx-1 mt-[0.6rem] rounded-md">
                                    {formattedDate}
                                  </span>
                                  <div
                                    onClick={() => {
                                      document.body.style.overflow = "hidden";
                                      setSelectNote(() => {
                                        return {
                                          headAttendance: status.headData,
                                          groupId: status.groupId,
                                        };
                                      });
                                      setTriggerShowNote(() => true);
                                    }}
                                    className="group-hover:visible invisible h-0 w-0 flex items-center
                                 text-black group-hover:text-green-500 
                                    justify-center group-hover:w-5 group-hover:h-5 bg-green-100 rounded-full group-hover:scale-150 transition
                                     duration-150"
                                  >
                                    <BiNotepad />
                                  </div>
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
                            }
                          )}

                          <th className="w-36 flex items-center justify-center text-xs md:text-base bg-[#2C7CD1] m-1 text-white rounded-md  ">
                            <span className="text-center">
                              {user.language === "Thai" && "เปอร์เซ็นมาเรียน"}
                              {user.language === "English" &&
                                "Percentage of present"}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      {/* Body */}
                      <tbody className="w-max">
                        {attendances?.data?.students.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="flex  hover:ring-2 hover:bg-slate-200 group text-[#2C7CD1] "
                            >
                              <td
                                key={index}
                                className={`w-10 md:w-24 flex items-center justify-center sticky left-0 z-10 bg-white group-hover:bg-slate-200`}
                              >
                                <div
                                  className={`h-12 w-10 md:w-24 flex items-center justify-center rounded-md m-1 ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  {item.student?.number}
                                </div>
                              </td>
                              <td
                                key={index}
                                className={`w-20 text-xs md:text-base md:w-[17rem] text-left
                                 flex justify-start items-center sticky left-10 md:left-[6rem] z-10
                                  bg-white group-hover:bg-slate-200`}
                              >
                                <div
                                  className={`h-12 w-20 text-xs text-start md:text-base md:w-[16.5rem] flex items-center justify-start rounded-md m-1 ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  <div className="min-w-9 min-h-9 rounded-full bg-white mx-2 ring-1 relative overflow-hidden">
                                    <Image
                                      src={item.student?.picture}
                                      alt=""
                                      fill
                                      sizes="(max-width: 768px) 100vw, 33vw"
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="text-left text-xs md:text-base truncate hover:overflow-visible">
                                    {item.student?.firstName}{" "}
                                    {item.student?.lastName}
                                  </span>
                                </div>
                              </td>
                              {item?.data?.map((status: any) => {
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
                                        document.body.style.overflow = "hidden";
                                      }}
                                    >
                                      {status.note && (
                                        <div className="absolute text-xs p-1 bottom-1 m-auto w-5 h-5 right-2 ring-1 ring-white bg-[#9C2CD1] text-white rounded-full flex items-center justify-center">
                                          <BiNotepad />
                                        </div>
                                      )}
                                      <div className="w-28 ml-[2.5rem] md:ml-0  flex items-center justify-center ">
                                        {status.present && (
                                          <div className="mx-1 w-36 h-12  bg-green-600  flex items-center  rounded-md justify-center py-2  text-white">
                                            {user.language === "Thai" &&
                                              "มาเรียน"}
                                            {user.language === "English" &&
                                              "Presnt"}
                                          </div>
                                        )}
                                        {status.absent && (
                                          <div className="mx-1 h-12 bg-red-600 w-36 flex items-center  rounded-md justify-center   text-white">
                                            {user.language === "Thai" && "ขาด"}
                                            {user.language === "English" &&
                                              "Absent"}
                                          </div>
                                        )}
                                        {status.holiday && (
                                          <div className="mx-1 h-12 bg-yellow-500 w-36 flex items-center  rounded-md  justify-center   text-white">
                                            {user.language === "Thai" && "ลา"}
                                            {user.language === "English" &&
                                              "Take a leave"}
                                          </div>
                                        )}
                                        {status.sick && (
                                          <div className="mx-1 h-12 bg-blue-500 w-36 flex items-center rounded-md  justify-center   text-white">
                                            {user.language === "Thai" && "ป่วย"}
                                            {user.language === "English" &&
                                              "sick"}
                                          </div>
                                        )}
                                        {status.late && (
                                          <div className="mx-1 h-12 bg-orange-500 w-36 flex items-center  rounded-md  justify-center  text-white">
                                            {user.language === "Thai" && "สาย"}
                                            {user.language === "English" &&
                                              "late"}
                                          </div>
                                        )}
                                        {status.warn && (
                                          <div className="mx-1 h-12 bg-red-700 w-36 flex items-center  rounded-md  justify-center   text-white">
                                            {user.language === "Thai" &&
                                              "เฝ้าระวัง"}
                                            {user.language === "English" &&
                                              "warn"}
                                          </div>
                                        )}
                                        {!status.holiday &&
                                          !status.absent &&
                                          !status.present &&
                                          !status.sick &&
                                          !status.late &&
                                          !status.warn && (
                                            <div className="mx-1 h-12 bg-gray-600 w-36 flex items-center justify-center   rounded-md   text-white">
                                              {user.language === "Thai" &&
                                                "ไม่มีข้อมูล"}
                                              {user.language === "English" &&
                                                "NO DATA"}
                                            </div>
                                          )}
                                      </div>
                                    </button>
                                  </td>
                                );
                              })}

                              {user?.schoolUser?.organization ===
                                "immigration" && (
                                <td
                                  key={index}
                                  className={`text-[#2C7CD1] font-semibold w-36 flex items-center justify-center rounded-md py-2 m-1  ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  <span className="text-center">
                                    {item.statistics?.number?.warn}
                                  </span>
                                </td>
                              )}
                              <td
                                key={index}
                                className={`md:ml-0 ml-[1.6rem] text-[#2C7CD1] font-semibold w-36 flex items-center justify-center rounded-md py-2 m-1  ${
                                  index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                                }`}
                              >
                                <span className="text-center">
                                  {item.statistics?.percent.present?.toFixed(2)}
                                  %
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <span className="mt-5 flex items-center justify-center text-center font-Kanit text-xl font-semibold ">
                  {user.language === "Thai" &&
                    `จำนวนครูสอนทั้งหมด ${attendances?.data?.meta.sum} คาบ`}
                  {user.language === "English" &&
                    `The teacher has taught this class for ${attendances?.data?.meta.sum} periods`}
                </span>
                {attendances?.data?.meta.headAttendances.length === 0 && (
                  <div className="w-full flex items-center justify-center h-96 text-8xl">
                    <span>ไม่มีข้อมูล</span>
                    <div className="text-red-400">
                      <BiMessageAltError />
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedButton === "stat" && (
              <div>
                {attendances.isLoading ? (
                  <div className="flex flex-col gap-5 mt-5">
                    <Skeleton variant="rectangular" width={700} height={40} />
                    <Skeleton variant="rectangular" width={600} height={40} />
                    <Skeleton variant="rectangular" width={800} height={40} />
                  </div>
                ) : (
                  <div>
                    <table
                      className=" h-full  max-h-[40rem] flex flex-col items-center justify-center w-80 md:w-[40rem]
                  lg:w-[60rem] xl:w-[70rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
                    >
                      <thead className="w-max sticky top-0  py-2 z-10 bg-white">
                        <tr className="flex text-white  bg-white">
                          <th className=" sticky left-0 z-10  bg-white ">
                            <div className="m-1 flex h-12  w-10 md:w-[5.4rem]  items-center justify-center text-xs md:text-base  rounded-md bg-[#2C7CD1]">
                              {user.language === "Thai" && "เลขที่"}
                              {user.language === "English" && "number"}
                            </div>
                          </th>
                          <th className=" sticky z-10 left-12 md:left-[6rem] bg-white  ">
                            <div className="m-1 w-16 h-12 md:w-[16.5rem] flex items-center justify-center text-xs md:text-base bg-[#2C7CD1] rounded-md">
                              <span className="text-center">
                                {user.language === "Thai" && "รายชื่อ"}
                                {user.language === "English" &&
                                  "student's name"}
                              </span>
                            </div>
                          </th>

                          <th className="ml-[31rem] md:ml-[26rem] lg:ml-[0rem] text-xs md:text-base bg-green-600 rounded-md m-1 w-24 flex items-center justify-center ">
                            <span className="text-center">
                              {user.language === "Thai" && "มาเรียน"}
                              {user.language === "English" && "Present"}
                            </span>
                          </th>
                          <th className="bg-orange-500 rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                            <span className="text-center">
                              {user.language === "Thai" && "มาสาย"}
                              {user.language === "English" && "late"}
                            </span>
                          </th>
                          <th className="bg-yellow-500 rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                            <span className="text-center">
                              {user.language === "Thai" && "ลา"}
                              {user.language === "English" && "take a leave"}
                            </span>
                          </th>
                          <th className="bg-[#2C7CD1] rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                            <span className="text-center">
                              {user.language === "Thai" && "ป่วย"}
                              {user.language === "English" && "sick"}
                            </span>
                          </th>
                          <th className="bg-red-600 rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                            <span className="text-center">
                              {user.language === "Thai" && "ขาดเรียน"}
                              {user.language === "English" && "absent"}
                            </span>
                          </th>
                          {user?.schoolUser?.organization === "immigration" && (
                            <th className="bg-purple-600 rounded-md m-1 w-24 flex text-xs md:text-base items-center justify-center ">
                              <span className="text-center">
                                {user.language === "Thai" && "เฝ้าระวัง"}
                                {user.language === "English" && "warn"}
                              </span>
                            </th>
                          )}

                          <th className="w-36 flex items-center justify-center text-xs md:text-base bg-[#2C7CD1] m-1 text-white rounded-md  ">
                            <span className="text-center">
                              {user.language === "Thai" && "เปอร์เซ็นมาเรียน"}
                              {user.language === "English" &&
                                "Percentage of present"}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      {/* Body */}
                      <tbody className="w-max">
                        {attendances?.data?.students.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className="flex ml-[5rem] md:ml-0  hover:ring-2 hover:bg-slate-200 group text-[#2C7CD1] "
                            >
                              <td
                                key={index}
                                className={`w-10 md:w-24 flex items-center justify-center sticky left-0 z-10 bg-white group-hover:bg-slate-200`}
                              >
                                <div
                                  className={`h-12 w-10 md:w-24 flex items-center justify-center rounded-md m-1 ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  {item.student?.number}
                                </div>
                              </td>
                              <td
                                key={index}
                                className={`w-20 text-xs md:text-base md:w-[17rem] text-left flex justify-start items-center sticky left-10 md:left-[6rem] z-10 bg-white group-hover:bg-slate-200`}
                              >
                                <div
                                  className={`h-12 w-20 text-xs text-start md:text-base md:w-[16.5rem] flex items-center justify-start rounded-md m-1 ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  <div className="min-w-9 min-h-9 rounded-full bg-white mx-2 ring-1 relative overflow-hidden">
                                    <Image
                                      src={item.student?.picture}
                                      alt=""
                                      fill
                                      sizes="(max-width: 768px) 100vw, 33vw"
                                      className="object-cover"
                                    />
                                  </div>
                                  <span className="text-left text-xs md:text-base truncate hover:overflow-visible">
                                    {item.student?.firstName}{" "}
                                    {item.student?.lastName}
                                  </span>
                                </div>
                              </td>

                              <td
                                key={index}
                                className="w-24 m-1 flex items-center justify-center ml-[26rem] lg:ml-[0rem]"
                              >
                                <span
                                  className={`  text-center rounded-md w-24 h-12 flex items-center justify-center ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  {item.statistics?.number?.present}
                                </span>
                              </td>
                              <td
                                key={index}
                                className="w-24 m-1 flex items-center justify-center "
                              >
                                <span
                                  className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  {item.statistics?.number?.late}
                                </span>
                              </td>
                              <td
                                key={index}
                                className="w-24 m-1 flex items-center justify-center "
                              >
                                <span
                                  className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  {item.statistics?.number?.holiday}
                                </span>
                              </td>
                              <td
                                key={index}
                                className="w-24 m-1 flex items-center justify-center "
                              >
                                <span
                                  className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  {item.statistics?.number?.sick}
                                </span>
                              </td>
                              <td
                                key={index}
                                className="w-24 m-1 flex items-center justify-center "
                              >
                                <span
                                  className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  {item.statistics?.number?.absent}
                                </span>
                              </td>

                              {user?.schoolUser?.organization ===
                                "immigration" && (
                                <td
                                  key={index}
                                  className={`text-[#2C7CD1] font-semibold w-36 flex items-center justify-center rounded-md py-2 m-1  ${
                                    index % 2 === 0
                                      ? "bg-white"
                                      : "bg-[#E8E8E8]"
                                  }`}
                                >
                                  <span className="text-center">
                                    {item.statistics?.number?.warn}
                                  </span>
                                </td>
                              )}
                              <td
                                key={index}
                                className={`text-[#2C7CD1] font-semibold w-36 flex items-center justify-center rounded-md py-2 m-1  ${
                                  index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                                }`}
                              >
                                <span className="text-center">
                                  {item.statistics?.percent?.present.toFixed(2)}
                                  %
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <span className="mt-5 flex items-center justify-center text-center font-Kanit text-xl font-semibold">
                      {user.language === "Thai" &&
                        `จำนวนครูสอนทั้งหมด ${attendances?.data?.meta?.sum} คาบ`}
                      {user.language === "English" &&
                        `The teacher has taught this class for ${attendances?.data?.meta?.sum} periods`}
                    </span>
                    {attendances?.data?.meta.headAttendances.length === 0 && (
                      <div className="w-full flex items-center justify-center h-96 text-8xl">
                        <span>ไม่มีข้อมูล</span>
                        <div className="text-red-400">
                          <BiMessageAltError />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {selectedButton === "stat-month" && (
              <div className="w-[24rem] h-[30rem] md:w-[50rem] md:h-[30rem] lg:w-[60rem] lg:h-[40rem] xl:w-[70rem] xl:h-[50rem]  flex flex-col  items-center gap-3 md:gap-5 mt-5">
                <div className="flex flex-col md:flex-row gap-2 md:gap-5 font-Kanit font-semibold">
                  <div className="border-solid border-2 border-black p-2 rounded-md">
                    <label>
                      {user.language === "Thai" && "กรุณาเลือกปี :"}
                      {user.language === "English" && "Select year :"}
                    </label>
                    {/* เดี๋ยวมี value กับ onChange อีก */}
                    <select
                      value={selectedYear}
                      onChange={handleYearChange}
                      className="ml-3 text-slate-400"
                    >
                      {yearList?.map((yearData) => (
                        <option key={yearData.year} value={yearData.year}>
                          {yearData.year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-solid border-2 border-black p-2 rounded-md">
                    <label>
                      {user.language === "Thai" &&
                        "กรุณาเลือกสถานะการเข้าเรียน :"}
                      {user.language === "English" && "Select status"}
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      className="ml-3 text-slate-400"
                    >
                      {statusTypeArray.map((status, index) => (
                        <option key={status} value={status}>
                          {user.language === "Thai"
                            ? statusTypeArrayTH[index]
                            : status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className=" w-10/12 h-10/12 flex flex-col gap-3 mt-10">
                  <h2 className="flex justify-center items-center font-Kanit font-semibold text-xl text-[#2C7CD1]">
                    {getStatusLabel()}
                  </h2>
                  <Bar options={optionChart} data={chartData} />
                </div>
              </div>
            )}
          </div>
        </div>
      </ClassroomLayout>
    </div>
  );
}

export default Index;

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
