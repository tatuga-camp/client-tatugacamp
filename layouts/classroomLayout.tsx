import { Popover, Transition } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import SidebarClassroom from "../components/sidebars/sidebarClassroom";
import Image from "next/image";
import { BsPeopleFill, BsQrCodeScan } from "react-icons/bs";
import { CgMenuBoxed } from "react-icons/cg";
import { AiOutlineQrcode } from "react-icons/ai";
import CreateStudent from "../components/form/createStudent";
import { RxLapTimer } from "react-icons/rx";
import { useRouter } from "next/router";
import UpdateClass from "../components/form/updateClass";
import { MdEmojiPeople } from "react-icons/md";
import AttendanceChecker from "../components/form/attendanceChecker";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { IoPersonAdd } from "react-icons/io5";
import QRCode from "react-qr-code";
import { HiRectangleGroup } from "react-icons/hi2";
import CreateGroup from "../components/form/createGroup";
import RandomTools from "../components/form/randomTools";
import CheckAttendanceByQrCode from "../components/form/checkAttendanceByQrCode";
import CardRandomStudent from "../components/random/cardRandomStudent";
import WheelRandomStudent from "../components/random/wheelRandomStudent";
import { RiLockPasswordFill } from "react-icons/ri";
import StudentPasswordManagement from "../components/form/studentPasswordManagement";
import Swal from "sweetalert2";
import AuthButton from "../components/auths/mainAutnButton";
import { GetUserService } from "../services/user";
import { GetOneClassroomService } from "../services/classroom";
import { GetAllStudentsService } from "../services/students";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { MenubarsMain } from "../data/menubarsMain";
import { User } from "../models";
import { ResponseGetAllGroupService } from "../services/group";
import { GetAllAnnouncementSanityService } from "../sanity/services";
import { Alert, AlertColor, AlertTitle } from "@mui/material";
import Head from "next/head";
import Script from "next/script";

type ClassroomLayoutProps = {
  children: React.ReactNode;
  sideMenus: MenubarsMain;
  groups?: UseQueryResult<ResponseGetAllGroupService, Error>;
};

function ClassroomLayout({
  children,
  sideMenus,
  groups,
}: ClassroomLayoutProps) {
  const router = useRouter();
  const [triggerRandomStudent, setTriggerRandomStudent] = useState(false);
  const [triggerRandomTools, setTriggerRandomTools] = useState(false);
  const [triggerAttendance, setTriggerAttendance] = useState(false);
  const [triggerAttendanceQrCode, setTriggerAttendanceQrCode] = useState(false);
  const [
    triggerStudentPasswordManangement,
    setTriggerStudentPasswordManagement,
  ] = useState(false);
  const [triggerRouletteRandomStudent, setTriggerRouletteRandomStudent] =
    useState(false);
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService(),
  });
  const classroom = useQuery({
    queryKey: ["classroom", router.query.classroomId as string],
    queryFn: () =>
      GetOneClassroomService({
        classroomId: router.query.classroomId as string,
      }),
  });
  const announcement = useQuery({
    queryKey: ["announcement"],
    queryFn: () => GetAllAnnouncementSanityService(),
  });
  const students = useQuery({
    queryKey: ["students", router.query.classroomId as string],
    queryFn: () =>
      GetAllStudentsService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const [triggersidebar, setTriggerSidebar] = useState(true);

  const classroomCode: string = ((classroom?.data?.classroomCode?.slice(
    0,
    3,
  ) as string) + classroom?.data?.classroomCode?.slice(3)) as string;
  //covert date
  const date = new Date(classroom?.data?.createAt as string);

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  //create new copy of students data
  const coppyStudentsData = students?.data?.slice();

  //rearrange copy studens data to the first array is the highest score
  const highestScorePlayer = coppyStudentsData?.sort(
    (a, b) => b.score.totalPoints - a.score.totalPoints,
  )[0];

  useEffect(() => {
    if (classroom.isError) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        html: "คุณไม่มีสิทธิเข้าถึงข้อมูลของบัญชีอื่น",
        icon: "error",
      });
      router.push("/classroom/teacher");
    }
  }, [classroom.isError]);

  return (
    <>
      {user.data?.plan === "FREE" && (
        <Script
          id="Adsense-id"
          onError={(e) => {
            console.error("Script failed to load", e);
          }}
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )}
      {announcement.data && (
        <Alert
          className="static md:w-full"
          severity={announcement.data.type as AlertColor}
        >
          <AlertTitle>แจ้งข่าวสาร</AlertTitle>
          {announcement.data?.title} —{" "}
          <strong>{announcement.data?.description}</strong>
        </Alert>
      )}

      <main className="relative flex  w-full flex-col items-center  justify-center md:gap-5 lg:gap-10 ">
        <div className="sticky top-2 z-50 flex w-full flex-row-reverse justify-between px-2">
          <div className=" ">
            <AuthButton />
          </div>
          <Popover>
            {() => (
              <>
                {!user.isError && (
                  <Popover.Button className="absolute z-30 h-max w-max border-none bg-transparent active:border-none">
                    <div className="ml-2 flex flex-col items-center justify-center p-2 font-Kanit ">
                      <div
                        aria-label="Show sidebar"
                        className="z-30  flex h-10 w-10 
        cursor-pointer items-center justify-center rounded-2xl bg-white   text-2xl text-black drop-shadow
        transition duration-100 ease-in-out hover:scale-125 "
                      >
                        <CgMenuBoxed />
                      </div>
                      <span className="text-black">menu</span>
                    </div>
                  </Popover.Button>
                )}
                <Transition>
                  <Popover.Panel>
                    {({ close }) => (
                      <SidebarClassroom
                        sideMenus={sideMenus}
                        user={user?.data as User}
                        close={close}
                      />
                    )}
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
        {!user.isError && (
          <div className="relative    h-96  w-full">
            <div className="h-80 w-full  overflow-hidden bg-gradient-to-r from-blue-400  to-orange-300">
              <div
                className=" relative flex  h-80 
         w-full items-center justify-center	"
              >
                <Image
                  fill
                  quality={40}
                  alt="sea backgroud"
                  className="object-cover"
                  src={
                    "https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png"
                  }
                />
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 m-auto  flex  
           h-80 w-10/12 max-w-6xl items-end justify-center md:h-80 md:w-10/12 lg:w-8/12 xl:w-6/12 "
            >
              <header
                className=" z-10 mt-0
             flex h-3/4 w-full  flex-col-reverse items-center justify-center rounded-3xl
             bg-white 
          md:flex-row md:justify-start  md:gap-x-4"
              >
                {/* text in header */}
                <div className="m-2 flex flex-col items-center justify-center font-Kanit text-2xl  font-light md:ml-10 md:block md:h-max md:w-80 lg:w-full">
                  <div className="flex w-full  flex-col items-center justify-center md:block  md:w-60   lg:w-72">
                    <span className="mr-2 hidden md:block">Welcome to</span>
                    <div className="mr-2 block md:hidden">Welcome to</div>
                    <div className="w-full break-words  hover:w-max">
                      <span className="flex  justify-center text-center font-semibold uppercase	 md:justify-start md:text-left md:text-xl lg:text-2xl">
                        {classroom?.data?.title}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2  gap-2 text-center md:flex md:flex-col md:text-left ">
                    <span className="mr-5 font-Kanit text-base font-medium ">
                      {classroom?.data?.description}
                    </span>
                    <div className="flex flex-col items-center justify-start md:flex-row md:items-center">
                      <span
                        className="rounded-xl bg-[#EDBA02] p-1 px-2
                 font-Kanit text-base font-normal tracking-wider text-black"
                      >
                        {classroom?.data?.level}
                      </span>
                      <span className="ml-5 hidden text-sm uppercase  md:block">
                        create on {formattedDate}
                      </span>
                      <div className="ml-5 mt-2 block text-sm uppercase md:hidden">
                        create on {formattedDate}
                      </div>
                    </div>
                    <div className=" mt-2 flex w-full flex-col items-center justify-center text-center  uppercase md:hidden">
                      <span className="text-lg">
                        {user.data?.language === "Thai" && "รหัสห้องเรียน"}
                        {user.data?.language === "English" && "classroom code"}
                      </span>
                      <span className="text-lg">{classroomCode}</span>
                    </div>
                  </div>
                </div>
              </header>
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button
                      onClick={() => {
                        document.body.style.overflow = "hidden";
                      }}
                      className="absolute left-3  top-24 z-20 flex cursor-pointer items-center
justify-center border-none  bg-transparent text-2xl text-gray-500 transition duration-100 hover:scale-110	"
                    >
                      <div className="flex items-center justify-center   gap-2 rounded-xl bg-blue-400 p-1 text-2xl text-white md:w-max md:text-base">
                        <FiSettings />
                        <span className="hidden font-Kanit text-sm md:block">
                          {user.data?.language === "Thai"
                            ? "แก้ไขห้องเรียน"
                            : "classroom setting"}
                        </span>
                      </div>
                    </Popover.Button>
                    <Popover.Panel>
                      {({ close }) => (
                        <UpdateClass
                          user={user.data as User}
                          close={close}
                          classroom={classroom}
                        />
                      )}
                    </Popover.Panel>
                  </>
                )}
              </Popover>
              <div
                className=" bottom-12 right-[2rem] z-20 hidden 
             flex-col items-center justify-center gap-y-3  p-2 md:absolute
            md:flex "
              >
                <div
                  className="relative flex h-12 w-60 items-center justify-center
                 rounded-md bg-transparent px-4
              ring-2 ring-black md:bg-white"
                >
                  <span className="font-Kanit text-2xl font-semibold  text-gray-800">
                    {user.data?.language === "Thai" && "รหัสห้องเรียน"}
                    {user.data?.language === "English" && "Classroom's code"}
                  </span>
                </div>

                <Popover className=" flex items-center justify-center ">
                  {({ open }) => (
                    <>
                      <Popover.Button className="flex flex-col items-center justify-center gap-5 border-none bg-transparent active:border-none ">
                        <div
                          aria-label="ขยายเพื่อดูรหัสห้องเรียน"
                          className={`
                      w-60 cursor-pointer rounded-xl bg-[#F55E00] p-3 
             transition duration-200 ease-in-out hover:scale-110`}
                        >
                          <span className="font-sans text-4xl font-bold text-white">
                            {classroomCode}
                          </span>
                        </div>
                      </Popover.Button>
                      <Popover.Panel>
                        {({ close }) => (
                          <div
                            className="fixed bottom-0 left-0 right-0  top-0 z-20 m-auto h-full w-full overflow-hidden
                      bg-white/30 backdrop-blur-md"
                            onClick={() => close()}
                          >
                            <div
                              className="fixed bottom-0 left-0 right-0 top-0 m-auto h-max w-5/6 cursor-pointer rounded-xl bg-[#F55E00] p-3 text-center transition
            duration-200 ease-in-out hover:scale-110 md:w-max"
                            >
                              <span className="font-sans text-3xl  font-bold text-white md:px-40 md:text-9xl xl:text-[15rem]">
                                {classroomCode}
                              </span>
                            </div>
                          </div>
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
                <Popover className=" flex items-center justify-center ">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className="flex flex-col items-center 
                    justify-center gap-5 border-none bg-transparent active:border-none "
                      >
                        <div className="absolute -bottom-10 text-2xl hover:scale-105">
                          <BsQrCodeScan />
                        </div>
                      </Popover.Button>
                      <Popover.Panel>
                        {({ close }) => (
                          <div
                            className="fixed bottom-0 left-0 right-0 top-0 m-auto  flex h-full w-full items-center justify-center overflow-hidden
                      bg-white/30 backdrop-blur-md"
                            onClick={() => close()}
                          >
                            <div className="h-96 w-96">
                              <QRCode
                                size={256}
                                style={{
                                  height: "auto",
                                  maxWidth: "100%",
                                  width: "100%",
                                }}
                                value={`${process.env.NEXT_PUBLIC_CLIENT_STUDENT_URL}/classroom/student?classroomCode=${classroomCode}`}
                                viewBox={`0 0 256 256`}
                              />
                            </div>
                          </div>
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>
              <div className="absolute right-20 top-0 z-10  hidden md:flex ">
                <div className="relative ">
                  <div className="relative h-40  w-40 ">
                    <Image
                      src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG"
                      className="object-contain "
                      fill
                      alt="avatar"
                      sizes="(max-width: 768px) 100vw"
                    />
                  </div>
                  <div className="absolute -right-20 top-3 h-40 w-40 rotate-12 bg-transparent">
                    <Image
                      src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3052.PNG"
                      className="object-contain"
                      fill
                      alt="avatar"
                      sizes="(max-width: 768px) 100vw"
                    />
                  </div>
                  <div className="absolute right-20 top-3 h-40 w-40 -rotate-12 bg-transparent">
                    <Image
                      src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/mermaid/IMG_3205%20(1).PNG"
                      className="object-contain"
                      fill
                      alt="avatar"
                      sizes="(max-width: 768px) 100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {triggerAttendance && (
          <AttendanceChecker
            user={user.data as User}
            setTriggerAttendance={setTriggerAttendance}
            students={students}
          />
        )}

        {triggerStudentPasswordManangement && (
          <StudentPasswordManagement
            students={students}
            setTriggerStudentPasswordManagement={
              setTriggerStudentPasswordManagement
            }
          />
        )}

        {!user.isError && (
          <div className="flex flex-col gap-5 p-5 ">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Popover className="relative ">
                {({ open }) => (
                  <>
                    <Popover.Button
                      onClick={() => students.refetch()}
                      className="bg-transparen  border-none"
                    >
                      <div
                        aria-label="สร้างผู้เรียนของคุณ"
                        className={`
                      flex h-12 w-max  cursor-pointer  items-center
             justify-center gap-2  rounded-md bg-[#2C7CD1] p-3 transition duration-200 ease-in-out hover:scale-110`}
                      >
                        <div className="flex items-center justify-center text-white ">
                          <IoPersonAdd />
                        </div>
                        <span className="font-Kanit text-lg font-semibold text-white">
                          {user.data?.language === "Thai" && "สร้างนักเรียน"}
                          {user.data?.language === "English" &&
                            "Create students"}
                        </span>
                      </div>
                    </Popover.Button>
                    <Popover.Panel>
                      {({ close }) => (
                        <CreateStudent user={user.data as User} close={close} />
                      )}
                    </Popover.Panel>
                  </>
                )}
              </Popover>

              <div
                onClick={() =>
                  router.push({
                    pathname: "/teacher-tools/timer",
                  })
                }
                role="button"
                className="flex h-12 w-max cursor-pointer items-center justify-center
           gap-2 rounded-md bg-orange-500 p-3 font-Kanit text-white transition duration-150 hover:scale-110 "
              >
                <div>
                  <RxLapTimer />
                </div>
                <span className="font-Kanit text-lg font-semibold">
                  {user.data?.language === "Thai" && "จับเวลา"}
                  {user.data?.language === "English" && "Timer"}
                </span>
              </div>

              <button
                onClick={() => {
                  setTriggerAttendance(() => true);
                  document.body.style.overflow = "hidden";
                }}
                role="button"
                className="flex h-12 w-max cursor-pointer items-center justify-center
           gap-2 rounded-md bg-green-700 p-3 font-Kanit text-white transition duration-150 hover:scale-110"
              >
                <div>
                  <MdEmojiPeople />
                </div>
                <span className="font-Kanit text-lg font-semibold">
                  {user.data?.language === "Thai" && "เช็กชื่อ"}
                  {user.data?.language === "English" && "Attendance check"}
                </span>
              </button>

              <div>
                <button
                  onClick={() => {
                    setTriggerRandomTools(() => true);
                    document.body.style.overflow = "hidden";
                  }}
                  role="button"
                  className="flex h-12 w-max cursor-pointer items-center justify-center
           gap-2 rounded-md bg-orange-500 p-3 font-Kanit text-white transition duration-150 hover:scale-110"
                >
                  <div className="flex items-center justify-center">
                    <GiPerspectiveDiceSixFacesRandom />
                  </div>
                  <span className="font-Kanit text-lg font-semibold">
                    {user.data?.language === "Thai" && "สุ่มชื่อ"}
                    {user.data?.language === "English" && "random student"}
                  </span>
                </button>
                {triggerRandomTools && (
                  <RandomTools
                    setTriggerRandomTools={setTriggerRandomTools}
                    setTriggerRouletteRandomStudent={
                      setTriggerRouletteRandomStudent
                    }
                    setTriggerRandomStudent={setTriggerRandomStudent}
                  />
                )}
                {triggerRandomStudent && (
                  <CardRandomStudent
                    classroomId={router?.query?.classroomId as string}
                    setTriggerRandomStudent={setTriggerRandomStudent}
                    students={students}
                    user={user.data as User}
                  />
                )}

                {triggerRouletteRandomStudent && (
                  <WheelRandomStudent
                    user={user.data as User}
                    students={students}
                    classroomId={router?.query?.classroomId as string}
                    setTriggerRouletteRandomStudent={
                      setTriggerRouletteRandomStudent
                    }
                  />
                )}
              </div>
              <div>
                <Popover>
                  {({ open }) => (
                    <>
                      <Popover.Button
                        onClick={() => {
                          document.body.style.overflow = "hidden";
                        }}
                      >
                        <div
                          className="relative flex h-12 w-max cursor-pointer items-center
           justify-center gap-2 rounded-md bg-violet-500 p-3 font-Kanit text-white transition duration-150 hover:scale-110"
                        >
                          <div className="flex items-center justify-center">
                            <HiRectangleGroup />
                          </div>
                          <span className="font-Kanit text-lg font-semibold">
                            {user.data?.language === "Thai" && "จัดกลุ่ม"}
                            {user.data?.language === "English" &&
                              "create group"}
                          </span>
                        </div>
                      </Popover.Button>
                      <Popover.Panel>
                        {({ close }) => (
                          <CreateGroup
                            user={user.data as User}
                            close={close}
                            groups={
                              groups as UseQueryResult<
                                ResponseGetAllGroupService,
                                Error
                              >
                            }
                          />
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>
              <div>
                {triggerAttendanceQrCode && (
                  <CheckAttendanceByQrCode
                    user={user.data as User}
                    setTriggerAttendanceQrCode={setTriggerAttendanceQrCode}
                    classroomId={classroom?.data?.id as string}
                  />
                )}
                <button
                  onClick={() => {
                    setTriggerAttendanceQrCode(() => true);
                    document.body.style.overflow = "hidden";
                  }}
                  className="relative flex h-12 w-max cursor-pointer select-none items-center justify-center
           gap-2 rounded-md bg-green-500 p-3 font-Kanit font-semibold text-white transition duration-150 hover:scale-110"
                >
                  เช็กชื่อด้วย
                  <div>
                    <AiOutlineQrcode />
                  </div>
                </button>
              </div>

              <div>
                {triggerAttendanceQrCode && (
                  <CheckAttendanceByQrCode
                    user={user.data as User}
                    setTriggerAttendanceQrCode={setTriggerAttendanceQrCode}
                    classroomId={classroom?.data?.id as string}
                  />
                )}
                <button
                  onClick={() => {
                    setTriggerStudentPasswordManagement(() => true);
                    document.body.style.overflow = "hidden";
                  }}
                  className="relative flex h-12 w-max cursor-pointer select-none items-center justify-center
           gap-2 rounded-md bg-sky-500 p-3 font-Kanit font-semibold text-white transition duration-150 hover:scale-110"
                >
                  รหัสผ่านผู้เรียน
                  <div>
                    <RiLockPasswordFill />
                  </div>
                </button>
              </div>
            </div>

            <div className=" flex flex-wrap justify-center gap-2 ">
              <div
                className="flex h-16  w-10/12 items-center justify-center gap-2 rounded-lg 
                bg-[#F2CC5B] py-1  text-white md:w-60"
              >
                <div className="ml-5 rounded-lg bg-white/40 p-3 backdrop-blur-sm">
                  <BsPeopleFill size={20} />
                </div>
                <div className="flex flex-col items-start justify-center font-sans">
                  <span className="text-2xl font-bold">
                    {students?.data?.length}
                  </span>
                  <span className="text-sm font-medium">students</span>
                </div>
              </div>

              <div
                className=" flex h-16
                  w-10/12 items-center justify-center gap-5 rounded-lg bg-[#EB6297]  px-2 py-1  text-white md:max-w-[18rem]"
              >
                <div className="ml-5 rounded-lg bg-white/40 p-3 backdrop-blur-sm">
                  🥇
                </div>
                <div className="flex flex-col items-start justify-center truncate font-sans">
                  <span className="text-md md:text-md w-max max-w-[18rem] truncate font-bold lg:text-2xl">
                    {highestScorePlayer?.firstName}
                  </span>
                  <span className="text-sm font-medium">the highest score</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <section className="w-full">{children}</section>
      </main>
    </>
  );
}

export default ClassroomLayout;
