import { Popover, Transition } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { FiChevronsLeft, FiChevronsRight, FiSidebar } from 'react-icons/fi';
import AuthButton from '../components/auth/button';
import { FiSettings, FiArrowLeftCircle } from 'react-icons/fi';
import SidebarClassroom from '../components/sidebar/sidebarClassroom';
import Image from 'next/image';
import { BsFillPeopleFill, BsPeopleFill, BsQrCodeScan } from 'react-icons/bs';
import { GiCardRandom } from 'react-icons/gi';
import { CgMenuBoxed } from 'react-icons/cg';

import { AiOutlineUserAdd, AiTwotoneStar } from 'react-icons/ai';
import CreateStudent from '../components/form/createStudent';
import { RxLapTimer } from 'react-icons/rx';
import { useRouter } from 'next/router';
import UpdateClass from '../components/form/updateClass';
import { MdEmojiPeople } from 'react-icons/md';
import AttendanceChecker from '../components/form/attendanceChecker';
import { GetOneClassroom } from '../service/classroom';
import { GetUser } from '../service/user';
import { GetAllStudents } from '../service/students';
import { useQuery } from 'react-query';
import RandomStudents from '../components/form/randomStudents';
import { IoPersonAdd, IoWarningOutline } from 'react-icons/io5';
import RandomIcon from '../components/svg/RandomIcon';
import QRCode from 'react-qr-code';
import { HiRectangleGroup } from 'react-icons/hi2';
import CreateGroup from '../components/form/createGroup';

function Layout({ children, sideMenus, language, groups }) {
  const router = useRouter();
  const [triggerRandomStudent, setTriggerRandomStudent] = useState(false);
  const user = useQuery(['user'], () => GetUser());
  const classroom = useQuery(
    ['classroom'],
    () => GetOneClassroom({ params: router.query.classroomId }),
    {
      enabled: false,
    },
  );
  const students = useQuery(
    ['students'],
    () => GetAllStudents({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    },
  );
  useEffect(() => {
    classroom.refetch();
    students.refetch();
    user.refetch();
  }, [router.isReady]);
  const [triggersidebar, setTriggerSidebar] = useState(true);
  const classroomCode =
    classroom?.data?.data?.classroomCode.slice(0, 3) +
    classroom?.data?.data?.classroomCode.slice(3);
  //covert date
  const date = new Date(classroom?.data?.data?.createAt);

  const formattedDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  //create new copy of students data
  const coppyStudentsData = students?.data?.data?.slice();

  //rearrange copy studens data to the first array is the highest score
  const highestScorePlayer = coppyStudentsData?.sort(
    (a, b) => b.score.totalPoints - a.score.totalPoints,
  )[0];

  return (
    <main className="flex justify-center items-center flex-col md:gap-5 lg:gap-10 ">
      <div className="absolute top-0 right-0 mr-5 mt-5">
        <AuthButton />
      </div>
      <Popover className="fixed top-0 left-0 mr-5 mt-5 z-40 ">
        {({ open }) => (
          <>
            {!user.isError && user?.data?.status === 200 && (
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
                  <span>menu</span>
                </div>
              </Popover.Button>
            )}
            <Transition>
              <Popover.Panel>
                {({ close }) => (
                  <SidebarClassroom
                    sideMenus={sideMenus}
                    user={user?.data?.data}
                    triggersidebar={triggersidebar}
                    close={close}
                  />
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      {!user.isError && user?.data?.status === 200 && (
        <div className="h-96    w-full  relative">
          <div className="w-full h-80  bg-gradient-to-r from-blue-400 to-orange-300  overflow-hidden">
            <div
              className=" w-full h-80  
        bg-cover  bg-center bg-no-repeat 
         bg-[url('https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png')] 
         flex items-center justify-center	"
            ></div>
          </div>
          <div
            className="w-10/12 lg:w-8/12 xl:w-6/12 max-w-6xl md:w-10/12  md:h-80  
           h-80 absolute bottom-0 right-0 left-0 m-auto flex justify-center items-end "
          >
            <header
              className=" w-full h-3/4
             rounded-3xl drop-shadow-lg mt-0 flex  flex-col-reverse md:flex-row md:gap-x-4 z-10
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
                      {classroom?.data?.data?.title}
                    </span>
                  </div>
                </div>
                <div className="mt-2  md:flex md:flex-col gap-2 text-center md:text-left ">
                  <span className="font-Kanit text-base mr-5 font-medium ">
                    {classroom?.data?.data?.description}
                  </span>
                  <div className="flex justify-start flex-col md:flex-row items-center md:items-center">
                    <span
                      className="font-Kanit font-normal px-2 tracking-wider
                 text-black text-base bg-[#EDBA02] p-1 rounded-xl"
                    >
                      {classroom?.data?.data?.level}
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
                      {language === 'Thai' && 'รหัสห้องเรียน'}
                      {language === 'English' && 'classroom code'}
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
                      document.body.style.overflow = 'hidden';
                    }}
                    className="absolute top-24 z-20 left-3 text-2xl text-gray-500 cursor-pointer
border-none flex  items-center justify-center hover:animate-spin bg-transparent animate-none 	"
                  >
                    <div className="flex items-center justify-center">
                      <FiSettings />
                    </div>
                  </Popover.Button>
                  <Popover.Panel>
                    {({ close }) => (
                      <UpdateClass
                        language={language}
                        close={close}
                        classroom={classroom?.data?.data}
                        refetch={classroom.refetch}
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
                className="bg-transparent ring-2 ring-black md:bg-white rounded-md px-4 drop-shadow-md flex items-center justify-center
              w-60 h-12 relative"
              >
                <span className="font-Kanit font-semibold text-2xl  text-gray-800">
                  {language === 'Thai' && 'รหัสห้องเรียน'}
                  {language === 'English' && "Classroom's code"}
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
                                height: 'auto',
                                maxWidth: '100%',
                                width: '100%',
                              }}
                              value={`${process.env.NEXT_PUBLIC_CLIENT_URL}/classroom/student?classroomCode=${classroomCode}`}
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
                    sizes="(max-width: 768px) 100vw"
                    layout="fill"
                    src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3064.PNG"
                    className="object-contain "
                  />
                </div>
                <div className="w-40 h-40 bg-transparent rotate-12 absolute top-3 -right-20">
                  <Image
                    sizes="(max-width: 768px) 100vw"
                    src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/IMG_3052.PNG"
                    className="object-contain"
                    layout="fill"
                  />
                </div>
                <div className="w-40 h-40 bg-transparent absolute top-3 right-20 -rotate-12">
                  <Image
                    sizes="(max-width: 768px) 100vw"
                    src="https://storage.googleapis.com/tatugacamp.com/Avatar%20students/mermaid/IMG_3205%20(1).PNG"
                    className="object-contain"
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Popover className="block md:hidden">
        {({ open }) => (
          <div>
            <Popover.Button>
              <div
                onClick={() => {
                  document.body.style.overflow = 'hidden';
                }}
                role="button"
                className="font-Kanit flex items-center my-5 justify-center gap-2 text-white
           bg-green-700 w-max p-3 rounded-2xl hover:scale-110 transition duration-150 cursor-pointer"
              >
                <div>
                  <MdEmojiPeople />
                </div>
                <span className="font-Kanit font-semibold text-lg">
                  {language === 'Thai' && 'เช็คชื่อ'}
                  {language === 'English' && 'Attendance check'}
                </span>
              </div>
            </Popover.Button>
            <Popover.Panel>
              {({ close }) => (
                <AttendanceChecker
                  language={language}
                  close={close}
                  students={students}
                />
              )}
            </Popover.Panel>
          </div>
        )}
      </Popover>
      <div className="w-10/12 md:hidden text-center  font-Kanit bg-red-500 text-white p-4 rounded-xl">
        <div className="text-2xl">
          <IoWarningOutline />
        </div>
        {language === 'Thai' &&
          'กรุณาเข้าใช้งานใน แท็บเล็ตหรือคอมพิวเตอร์ เพื่อการใช้งาน Tatuga Class ได้อย่างมีประสิทธิภาพ'}
        {language === 'English' &&
          'Please access tatuga again with tablet or computer for accessing full functionalities'}
      </div>
      {!user.isError && user?.data?.status === 200 && (
        <div className="md:flex hidden flex-col gap-3 lg:mt-0 md:pl-5 lg:pl-0 lg:w-3/4 md:w-11/12 items-center justify-center md:items-start">
          <div className="font-sans font-normal tracking-wide flex flex-wrap mt-5 md:mt-0 items-center gap-5 pl-5 md:pl-0 text-gray-400">
            <span>Overview</span>
            <Popover className="relative ">
              {({ open }) => (
                <>
                  <Popover.Button
                    onClick={() => students.refetch()}
                    className="bg-transparent border-none"
                  >
                    <div
                      aria-label="สร้างผู้เรียนของคุณ"
                      className={`
                      w-max p-3 bg-[#2C7CD1] rounded-2xl cursor-pointer flex gap-2
             hover:scale-110 transition duration-200 ease-in-out`}
                    >
                      <div className="text-white">
                        <IoPersonAdd />
                      </div>
                      <span className="font-Kanit font-semibold text-lg text-white">
                        {language === 'Thai' && 'สร้างนักเรียน'}
                        {language === 'English' && 'Create students'}
                      </span>
                    </div>
                  </Popover.Button>
                  <Popover.Panel>
                    {({ close }) => (
                      <CreateStudent
                        language={language}
                        students={students}
                        close={close}
                      />
                    )}
                  </Popover.Panel>
                </>
              )}
            </Popover>
            <div
              onClick={() =>
                router.push({
                  pathname: '/teacher-tools/timer',
                })
              }
              role="button"
              className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-orange-500 w-max p-3 rounded-2xl hover:scale-110 transition duration-150 cursor-pointer"
            >
              <div>
                <RxLapTimer />
              </div>
              <span className="font-Kanit font-semibold text-lg">
                {language === 'Thai' && 'จับเวลา'}
                {language === 'English' && 'Timer'}
              </span>
            </div>
            <Popover>
              {({ open }) => (
                <div>
                  <Popover.Button>
                    <div
                      onClick={() => {
                        document.body.style.overflow = 'hidden';
                      }}
                      role="button"
                      className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-green-700 w-max p-3 rounded-2xl hover:scale-110 transition duration-150 cursor-pointer"
                    >
                      <div>
                        <MdEmojiPeople />
                      </div>
                      <span className="font-Kanit font-semibold text-lg">
                        {language === 'Thai' && 'เช็คชื่อ'}
                        {language === 'English' && 'Attendance check'}
                      </span>
                    </div>
                  </Popover.Button>
                  <Popover.Panel>
                    {({ close }) => (
                      <AttendanceChecker
                        language={language}
                        close={close}
                        students={students}
                      />
                    )}
                  </Popover.Panel>
                </div>
              )}
            </Popover>
            <div>
              <button
                onClick={() => {
                  setTriggerRandomStudent(() => true);
                  document.body.style.overflow = 'hidden';
                }}
                role="button"
                className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-orange-500 w-max p-3 rounded-xl hover:scale-110 transition duration-150 cursor-pointer"
              >
                <div className="flex items-center justify-center">
                  <RandomIcon />
                </div>
                <span className="font-Kanit font-semibold text-lg">
                  {language === 'Thai' && 'สุ่มชื่อ'}
                  {language === 'English' && 'random student'}
                </span>
              </button>

              {triggerRandomStudent && (
                <RandomStudents
                  classroomId={router?.query?.classroomId}
                  setTriggerRandomStudent={setTriggerRandomStudent}
                  students={students?.data?.data}
                  language={language}
                />
              )}
            </div>
            <div>
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button
                      onClick={() => {
                        document.body.style.overflow = 'hidden';
                      }}
                    >
                      <div
                        className="font-Kanit flex items-center justify-center gap-2 text-white
           bg-violet-500 w-max p-3 rounded-xl hover:scale-110 relative transition duration-150 cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          <HiRectangleGroup />
                        </div>
                        <span className="font-Kanit font-semibold text-lg">
                          {language === 'Thai' && 'จัดกลุ่ม'}
                          {language === 'English' && 'create group'}
                        </span>
                      </div>
                    </Popover.Button>
                    <Popover.Panel>
                      {({ close }) => (
                        <CreateGroup
                          close={close}
                          language={language}
                          groups={groups}
                        />
                      )}
                    </Popover.Panel>
                  </>
                )}
              </Popover>
            </div>
          </div>

          <div className="grid md:grid-cols-3 grid-cols-2 w-[95%]  md:w-full gap-2 md:gap-0 ">
            <div
              className="md:w-5/6 w-full  py-1 h-16 bg-[#F2CC5B] flex items-center 
                justify-start gap-2  rounded-lg text-white"
            >
              <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                <BsPeopleFill size={20} />
              </div>
              <div className="flex items-start justify-center flex-col font-sans">
                <span className="font-bold text-2xl">
                  {students?.data?.data?.length}
                </span>
                <span className="text-sm font-medium">students</span>
              </div>
            </div>
            <div className="md:w-5/6 w-full   py-1 h-16 bg-[#503E9D] flex items-center justify-start gap-5  rounded-lg text-white">
              <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                <AiTwotoneStar size={20} />
              </div>
              <div className="flex items-start justify-center flex-col font-sans">
                <span className="font-bold text-2xl"></span>
                <span className="text-sm font-medium text-gray-200">
                  Tasks progress incoming
                </span>
              </div>
            </div>
            <div
              className=" md:w-full lg:w-full w-full col-span-2 md:col-span-1
                  py-1 h-16 bg-[#EB6297] flex items-center md:justify-start justify-center gap-5  rounded-lg text-white"
            >
              <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg ml-5">
                🥇
              </div>
              <div className="flex items-start justify-center flex-col font-sans truncate">
                <span className="font-bold text-md md:text-md lg:text-2xl truncate">
                  {highestScorePlayer?.firstName}
                </span>
                <span className="text-sm font-medium">the highest score</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <section>{children}</section>
    </main>
  );
}

export default Layout;
