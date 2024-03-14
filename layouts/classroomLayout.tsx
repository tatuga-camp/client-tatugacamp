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
import { Alert, AlertTitle } from "@mui/material";

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
    3
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
    (a, b) => b.score.totalPoints - a.score.totalPoints
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
      {announcement.data && (
        <Alert className="   md:w-full" severity="warning">
          <AlertTitle>แจ้งข่าวสาร</AlertTitle>
          {announcement.data?.title} —{" "}
          <strong>{announcement.data?.description}</strong>
        </Alert>
      )}
      <main className="flex justify-center relative items-center  flex-col md:gap-5 lg:gap-10 ">
        <div className="absolute top-0 right-0 mr-5 mt-5">
          <AuthButton />
        </div>
        <Popover className=" top-0 left-0 mr-5 mt-5 z-40 absolute ">
          {({ open }) => (
            <>
              {!user.isError && (
                <Popover.Button className="w-max bg-transparent h-max border-none active:border-none z-30 absolute">
                  <div className="flex p-2 ml-2 flex-col font-Kanit justify-center items-center ">
                    <div
                      aria-label="Show sidebar"
                      className="text-2xl  z-30 w-10 h-10 
        flex justify-center items-center bg-white rounded-2xl   text-black drop-shadow cursor-pointer
        hover:scale-125 transition duration-100 ease-in-out "
                    >
                      <CgMenuBoxed />
                    </div>
                    <span className="text-white">menu</span>
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
        {!user.isError && (
          <div className="h-96    w-full  relative">
            <div className="w-full h-80  bg-gradient-to-r from-blue-400 to-orange-300  overflow-hidden">
              <div
                className=" w-full h-80  relative 
         flex items-center justify-center	"
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
              className="w-10/12 lg:w-8/12 xl:w-6/12 max-w-6xl md:w-10/12  md:h-80  
           h-80 absolute bottom-0 right-0 left-0 m-auto flex justify-center items-end "
            >
              <header
                className=" w-full h-3/4
             rounded-3xl mt-0 flex  flex-col-reverse md:flex-row md:gap-x-4 z-10
             bg-white 
          items-center md:justify-start  justify-center"
              >
                {/* text in header */}
                <div className="font-Kanit text-2xl font-light md:ml-10 m-2 md:w-80 lg:w-full  md:h-max md:block flex flex-col items-center justify-center">
                  <div className="flex md:block  items-center justify-center w-full md:w-60  lg:w-72   flex-col">
                    <span className="mr-2 md:block hidden">Welcome to</span>
                    <div className="mr-2 md:hidden block">Welcome to</div>
                    <div className="w-full hover:w-max  break-words">
                      <span className="md:text-xl  lg:text-2xl flex justify-center md:justify-start	 font-semibold text-center md:text-left uppercase">
                        {classroom?.data?.title}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2  md:flex md:flex-col gap-2 text-center md:text-left ">
                    <span className="font-Kanit text-base mr-5 font-medium ">
                      {classroom?.data?.description}
                    </span>
                    <div className="flex justify-start flex-col md:flex-row items-center md:items-center">
                      <span
                        className="font-Kanit font-normal px-2 tracking-wider
                 text-black text-base bg-[#EDBA02] p-1 rounded-xl"
                      >
                        {classroom?.data?.level}
                      </span>
                      <span className="text-sm ml-5 uppercase hidden  md:block">
                        create on {formattedDate}
                      </span>
                      <div className="text-sm ml-5 uppercase md:hidden block mt-2">
                        create on {formattedDate}
                      </div>
                    </div>
                    <div className=" w-full flex justify-center flex-col items-center uppercase md:hidden  text-center mt-2">
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
                      className="absolute top-24  z-20 left-3 text-2xl text-gray-500 cursor-pointer
border-none flex  items-center justify-center hover:scale-110 transition duration-100 bg-transparent	"
                    >
                      <div className="flex md:text-base text-2xl   md:w-max bg-blue-400 p-1 rounded-xl text-white gap-2 items-center justify-center">
                        <FiSettings />
                        <span className="text-sm hidden md:block font-Kanit">
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
                className=" items-center justify-center gap-y-3 hidden 
             md:absolute md:flex flex-col bottom-12  right-[2rem] z-20
            p-2 "
              >
                <div
                  className="bg-transparent ring-2 ring-black md:bg-white rounded-md px-4
                 flex items-center justify-center
              w-60 h-12 relative"
                >
                  <span className="font-Kanit font-semibold text-2xl  text-gray-800">
                    {user.data?.language === "Thai" && "รหัสห้องเรียน"}
                    {user.data?.language === "English" && "Classroom's code"}
                  </span>
                </div>

                <Popover className=" flex items-center justify-center ">
                  {({ open }) => (
                    <>
                      <Popover.Button className="bg-transparent border-none active:border-none flex flex-col justify-center items-center gap-5 ">
                        <div
                          aria-label="ขยายเพื่อดูรหัสห้องเรียน"
                          className={`
                      w-60 p-3 bg-[#F55E00] rounded-xl cursor-pointer 
             hover:scale-110 transition duration-200 ease-in-out`}
                        >
                          <span className="font-sans font-bold text-4xl text-white">
                            {classroomCode}
                          </span>
                        </div>
                      </Popover.Button>
                      <Popover.Panel>
                        {({ close }) => (
                          <div
                            className="w-full h-full fixed z-20  overflow-hidden right-0 left-0 top-0 bottom-0 m-auto
                      bg-white/30 backdrop-blur-md"
                            onClick={() => close()}
                          >
                            <div
                              className="w-5/6 md:w-max p-3 h-max fixed right-0 text-center left-0 top-0 bottom-0 m-auto bg-[#F55E00] rounded-xl cursor-pointer
            hover:scale-110 transition duration-200 ease-in-out"
                            >
                              <span className="font-sans font-bold  text-3xl md:text-9xl xl:text-[15rem] text-white md:px-40">
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
                        className="bg-transparent border-none active:border-none 
                    flex flex-col justify-center items-center gap-5 "
                      >
                        <div className="text-2xl hover:scale-105 absolute -bottom-10">
                          <BsQrCodeScan />
                        </div>
                      </Popover.Button>
                      <Popover.Panel>
                        {({ close }) => (
                          <div
                            className="w-full h-full fixed flex items-center justify-center  overflow-hidden right-0 left-0 top-0 bottom-0 m-auto
                      bg-white/30 backdrop-blur-md"
                            onClick={() => close()}
                          >
                            <div className="w-96 h-96">
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
              <div className="absolute right-20 z-10 top-0  hidden md:flex ">
                <div className="relative ">
                  <div className="w-40 h-40  relative ">
                    <Image
                      src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG"
                      className="object-contain "
                      fill
                      alt="avatar"
                      sizes="(max-width: 768px) 100vw"
                    />
                  </div>
                  <div className="w-40 h-40 bg-transparent rotate-12 absolute top-3 -right-20">
                    <Image
                      src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3052.PNG"
                      className="object-contain"
                      fill
                      alt="avatar"
                      sizes="(max-width: 768px) 100vw"
                    />
                  </div>
                  <div className="w-40 h-40 bg-transparent absolute top-3 right-20 -rotate-12">
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
            <div className="flex justify-center items-center gap-2 flex-wrap">
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
                      w-max p-3 bg-[#2C7CD1]  cursor-pointer  gap-2
             hover:scale-110 rounded-md  transition duration-200 ease-in-out h-12 flex items-center justify-center`}
                      >
                        <div className="text-white flex items-center justify-center ">
                          <IoPersonAdd />
                        </div>
                        <span className="font-Kanit font-semibold text-lg text-white">
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
                className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-orange-500 w-max p-3 rounded-md hover:scale-110 transition duration-150 cursor-pointer h-12 "
              >
                <div>
                  <RxLapTimer />
                </div>
                <span className="font-Kanit font-semibold text-lg">
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
                className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-green-700 w-max p-3 rounded-md hover:scale-110 transition duration-150 cursor-pointer h-12"
              >
                <div>
                  <MdEmojiPeople />
                </div>
                <span className="font-Kanit font-semibold text-lg">
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
                  className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-orange-500 w-max p-3 rounded-md hover:scale-110 transition duration-150 cursor-pointer h-12"
                >
                  <div className="flex items-center justify-center">
                    <GiPerspectiveDiceSixFacesRandom />
                  </div>
                  <span className="font-Kanit font-semibold text-lg">
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
                          className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-violet-500 w-max p-3 rounded-md hover:scale-110 relative transition duration-150 cursor-pointer h-12"
                        >
                          <div className="flex items-center justify-center">
                            <HiRectangleGroup />
                          </div>
                          <span className="font-Kanit font-semibold text-lg">
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
                  className="font-Kanit select-none font-semibold flex items-center justify-center gap-2 text-white
           bg-green-500 w-max p-3 rounded-md hover:scale-110 relative transition duration-150 cursor-pointer h-12"
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
                  className="font-Kanit select-none font-semibold flex items-center justify-center gap-2 text-white
           bg-sky-500 w-max p-3 rounded-md hover:scale-110 relative transition duration-150 cursor-pointer h-12"
                >
                  รหัสผ่านผู้เรียน
                  <div>
                    <RiLockPasswordFill />
                  </div>
                </button>
              </div>
            </div>

            <div className=" flex gap-2 flex-wrap justify-center ">
              <div
                className="w-10/12 md:w-60  py-1 h-16 bg-[#F2CC5B] flex items-center 
                justify-center gap-2  rounded-lg text-white"
              >
                <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                  <BsPeopleFill size={20} />
                </div>
                <div className="flex items-start justify-center flex-col font-sans">
                  <span className="font-bold text-2xl">
                    {students?.data?.length}
                  </span>
                  <span className="text-sm font-medium">students</span>
                </div>
              </div>

              <div
                className=" w-10/12 md:max-w-[18rem]
                  py-1 h-16 px-2 bg-[#EB6297] flex items-center  justify-center gap-5  rounded-lg text-white"
              >
                <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                  🥇
                </div>
                <div className="flex items-start justify-center flex-col font-sans truncate">
                  <span className="font-bold text-md md:text-md lg:text-2xl w-max max-w-[18rem] truncate">
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
