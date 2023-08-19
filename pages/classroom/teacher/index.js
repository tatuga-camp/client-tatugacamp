import React, { useEffect, useState } from 'react';
import { MdSchool } from 'react-icons/md';
import { FcCancel } from 'react-icons/fc';
import CreateClass from '../../../components/form/createClass';
import { Popover } from '@headlessui/react';
import { useQuery } from 'react-query';
import {
  AchieveClassroom,
  DuplicateClassroom,
  GetAllAchievedClassrooms,
  GetAllClassrooms,
  UpdateClassroomColor,
} from '../../../service/classroom';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetUserCookie } from '../../../service/user';
import Unauthorized from '../../../components/error/unauthorized';
import {
  Alert,
  AlertTitle,
  Pagination,
  Skeleton,
  listClasses,
} from '@mui/material';
import Layout from '../../../layouts/schoolLayout';
import { parseCookies } from 'nookies';
import Swal from 'sweetalert2';
import FeedbackSankbar from '../../../components/feedback/snackbar';
import { sideMenusEnglish, sideMenusThai } from '../../../data/menubarsSchool';
import { BiDuplicate, BiNews } from 'react-icons/bi';
import { sanityClient } from '../../../sanity';
import { myPortableTextComponents } from '../../../data/portableContent';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import Loading from '../../../components/loading/loading';
import TeacherOnly from '../../../components/error/teacherOnly';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineBgColors } from 'react-icons/ai';
import { SiGoogleclassroom } from 'react-icons/si';
import AchieveClassroomComponent from '../../../components/classroom/achieveClassroom';

const classroomMenus = [
  {
    title: 'Active classrooms',
    icon: <SiGoogleclassroom />,
    bgColorMain: 'bg-blue-600',
    bgColorSecond: 'bg-blue-100',
    textColorMain: 'text-blue-600',
    textColorSecond: 'text-blue-100',
  },
  {
    title: 'Achieved classrooms',
    icon: <MdSchool />,
    color: 'blue',
    bgColorMain: 'bg-green-600',
    bgColorSecond: 'bg-green-100',
    textColorMain: 'text-green-600',
    textColorSecond: 'text-green-100',
  },
];
function Index({ error, user, whatsNews }) {
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return sideMenusThai;
    } else if (user?.language === 'English') {
      return sideMenusEnglish;
    }
  });
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState({
    index: 0,
    color: '',
  });
  const [classroomState, setClassroomState] = useState([]);
  const [page, setPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(0);
  const [isViewNews, setIsViewNews] = useState(false);
  const [acceessFeature, setAccessFeature] = useState(false);
  const [creditClassroom, setCreditClassroom] = useState(5);
  const [loading, setLoading] = useState(false);
  const classrooms = useQuery(
    ['classrooms', page],
    () => GetAllClassrooms({ page: page }),
    { keepPreviousData: true },
  );
  const achievedClassrooms = useQuery(
    ['achieved-classrooms', page],
    () => GetAllAchievedClassrooms({ page: page }),
    { keepPreviousData: true },
  );

  useEffect(() => {
    if (user) {
      const viewNews = localStorage.getItem('IsViewNews');
      if (viewNews === whatsNews[0]._id) {
        setIsViewNews(() => true);
      } else {
        setIsViewNews(() => false);
      }
    }
    classrooms.refetch();
  }, []);

  useEffect(() => {
    setClassroomState(() => classrooms?.data?.classrooms);
  }, [classrooms.isFetching, page]);
  const handleCheckPlan = () => {
    const classroomNumber = classrooms?.data?.classroomsTotal;
    if (user.plan === 'FREE' || user?.subscriptions !== 'active') {
      setCreditClassroom(() => {
        const credit = 5 - classrooms?.data?.classroomsTotal;

        if (credit > 0) {
          setAccessFeature(() => true);
          return credit;
        } else if (credit <= 0) {
          if (classrooms?.data?.classroomsTotal === 0) {
            setAccessFeature(() => true);
          } else {
            setAccessFeature(() => false);
          }

          return 0;
        }
      });
    } else if (
      user.plan === 'TATUGA-STARTER' &&
      user?.subscriptions === 'active'
    ) {
      setCreditClassroom(() => {
        const credit = 20 - classroomNumber;
        if (credit > 0) {
          setAccessFeature(() => true);
          return credit;
        } else if (credit <= 0) {
          setAccessFeature(() => false);
          return 0;
        }
      });
    } else if (
      user.plan === 'TATUGA-PREMIUM' &&
      user?.subscriptions === 'active'
    ) {
      setCreditClassroom(() => {
        setAccessFeature(() => true);
        return 'unlimited';
      });
    }
  };

  useEffect(() => {
    if (classrooms?.data?.classroomsTotal > 0) {
      handleCheckPlan();
    } else if (classrooms?.data?.classroomsTotal === 0 && user) {
      if (user.plan === 'FREE' || user.subscriptions !== 'active') {
        setCreditClassroom(() => 5);
        setAccessFeature(() => true);
      } else if (
        user.plan === 'TATUGA-STARTER' &&
        user.subscriptions === 'active'
      ) {
        setCreditClassroom(() => 20);
        setAccessFeature(() => true);
      } else if (
        user.plan === 'TATUGA-PREMIUM' &&
        user.subscriptions === 'active'
      ) {
        setCreditClassroom(() => 'unlimited');
        setAccessFeature(() => true);
      }
    }
  }, [classrooms.isFetching, classroomState]);
  //handle open make sure to delete classroom
  const handleOpenClasssDeleted = (index) => {
    const newItems = classroomState.map((item, i) => {
      if (i === index) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  //handle make sure to cancel deleting classroom
  const handleCloseClasssDeleted = (index) => {
    const newItems = classroomState.map((item, i) => {
      if (i === index) {
        return { ...item, selected: false };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  //handle duplcate classroom
  const handleDuplicateClassroom = async ({ classroomId }) => {
    try {
      setLoading(() => true);
      await DuplicateClassroom({ classroomId });
      Swal.fire('success', 'duplicate classroom successfully', 'success');
      classrooms.refetch();
      setLoading(() => false);
    } catch (err) {
      setLoading(() => false);
      console.log('err', err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };

  //handle achieve classroom
  const handleAchieveClassroom = async ({ classroomId }) => {
    try {
      setLoading(() => true);
      await AchieveClassroom({ classroomId });
      Swal.fire('success', 'achieve classroom successfully', 'success');
      achievedClassrooms.refetch();
      classrooms.refetch();
      setLoading(() => false);
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };

  const handleColorChange = ({ e, index }) => {
    setSelectedColor(() => {
      return {
        color: e.target.value,
        index: index,
      };
    }); // Update the state with the selected color
  };
  const handleUpdateClassroom = async ({ classroomId }) => {
    try {
      setLoading(() => true);
      classrooms.refetch();
      await UpdateClassroomColor({ classroomId, color: selectedColor.color });
      Swal.fire('success', 'update successfully', 'success');
      setLoading(() => false);
    } catch (err) {
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      setLoading(() => false);
    }
  };
  const handleReadNews = () => {
    localStorage.setItem('IsViewNews', whatsNews[0]._id);
    setIsViewNews(() => true);
  };

  if (error?.statusCode === 401) {
    return <Unauthorized />;
  } else if (error?.statusCode === 403) {
    return <TeacherOnly user={user} />;
  }

  return (
    <div className="w-full bg-gradient-to-t relative from-blue-400 to-blue-50  lg:w-full pb-40  lg:h-full md:h-full  font-Kanit">
      <div className="md:w-60 lg:w-5/12 absolute z-20 top-0 right-0 left-0 m-auto"></div>
      <Head>
        <meta property="og:title" content={`TaTuga class`} />
        <meta
          property="og:description"
          content="ห้องเรีัยน tatuga จาก tatuga camp"
        />
        <meta property="og:image" content="/thumnail/thumnail.jpg" />
        <meta property="og:image:secure_url" content="/thumnail/thumnail.jpg" />
        <meta name="twitter:image:src" content="/thumnail/thumnail.jpg" />
        <meta
          name="keywords"
          content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for 
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, `}
        />
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="ห้องเรียนจาก Tatuga camp ที่จะพาคุณครูไปสู่การบริหารห้องเรียนอย่างสะดวกและสนุก กับ tatuga class"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`Teacher class`}</title>
      </Head>

      <div
        className={`flex    ${
          classroomState?.[0] ? 'h-full pb-60 md:pb-80 lg:pb-40' : 'h-screen'
        } `}
      >
        <Layout user={user} sideMenus={sideMenus} />
        <FeedbackSankbar language={user.language} />

        <Popover>
          {({ open }) => (
            <div className="fixed   bottom-20 z-20 right-7 flex justify-center items-end flex-col ">
              <Popover.Panel>
                {({ close }) => {
                  return (
                    <div
                      className=" bg-gradient-to-r  from-slate-50 to-blue-100 mb-2 p-5
             w-max max-w-3xl h-max max-h-96 rounded-xl overflow-y-auto"
                    >
                      <ul className="list-none pl-5">
                        {whatsNews.map((news) => {
                          const date = new Date(news._createdAt);
                          const options = {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          };

                          if (user.language === 'Thai') {
                            options.hour12 = false;
                            options.hourCycle = 'h23';
                          }

                          const formattedDate = date.toLocaleDateString(
                            user.language === 'Thai' ? 'th-TH' : 'en-US',
                            options,
                          );
                          return (
                            <li
                              key={news._id}
                              className="w-full max-w-2xl mt-2 h-max  flex flex-col"
                            >
                              <h4 className="">{formattedDate}</h4>
                              <PortableText
                                value={
                                  user.language === 'Thai'
                                    ? news.NewsThai
                                    : user.language === 'English' &&
                                      news.NewsEnglish
                                }
                                components={myPortableTextComponents}
                              />
                              <div className="w-full h-[2px] mt-2 bg-orange-400"></div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                }}
              </Popover.Panel>
              <Popover.Button
                onClick={handleReadNews}
                className="flex justify-center items-center gap-2 group hover:ring-2 active:ring-4
                 hover:bg-slate-200 bg-white p-3 rounded-xl drop-shadow-md"
              >
                <div className="relative flex items-center justify-center">
                  {!isViewNews && (
                    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-sky-400 opacity-75"></span>
                  )}
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </div>

                <span>
                  {user.language === 'Thai' && 'มีอะไรใหม่?'}
                  {user.language === 'English' && "What's news?"}
                </span>
                <div className="text-xl flex items-center justify-center">
                  <BiNews />
                </div>
              </Popover.Button>
            </div>
          )}
        </Popover>
        <div
          className={`flex justify-center items-center md:items-start    lg:items-center  w-full h-full`}
        >
          <div className="w-full  h-max flex flex-col  justify-center items-center pb-14 ">
            <header className="mt-28 md:mt-2  rounded-lg  p-0  md:p-5 md:px-10 xl:px-20 w-max  relative     ">
              <div className=" w-full  flex items-center justify-center   bg-transparent">
                <div
                  className="xl:w-[35rem] w-40    md:w-96 p-20 flex flex-col items-center justify-center
                    leading-[3.5rem] md:mt-32 lg:mt-20   py-5 rounded-lg 
                  h-10 md:h-max z-10 relative "
                >
                  <div
                    className="xl:text-6xl text-xl w-40 md:w-96 lg:w-[30rem] mt-20 md:mt-0 
                      md:text-center md:text-2xl font-semibold  
                  font-Kanit tracking-wider  "
                  >
                    <span className="md:text-8xl text-5xl hover:text-[#2C7CD1] text-black duration-150 transition">
                      {user.language === 'Thai' && 'สร้าง'}
                      {user.language === 'English' && 'Create'}
                    </span>
                    <span>
                      {user.language === 'Thai' && 'ห้องเรียนของคุณได้ที่นี่'}
                      {user.language === 'English' && ' your classroom here!'}
                    </span>
                  </div>
                </div>
                {/* <div className="absolute md:-top-20 lg:-top-20 lg:-left-36 ">
                  <Lottie animationData={teacherAnimation} style={style} />
                </div> */}
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <Popover className="relative">
                  {({ open }) => (
                    <>
                      {acceessFeature && (
                        <div className="lg:mt-20 md:mt-5 mt-20 w-full flex justify-center items-center  font-Kanit ">
                          <div className="flex gap-x-2 justify-center items-center ">
                            <span className="text-xl md:text-2xl font-bold text-[#2C7CD1] ">
                              {user.language === 'Thai' && 'กดเพื่อ'}
                              {user.language === 'English' && 'click to'}
                            </span>
                            <Popover.Button
                              className={`
                ${open ? '' : 'text-opacity-90'}
            bg-[#EDBA02] border-2 border-transparent border-solid text-md px-5 py-2 rounded-lg 
                font-bold font-Kanit text-white cursor-pointer
              active:border-black hover:scale-110 transition md:text-2xl duration-150 ease-in-out"`}
                            >
                              <span>
                                {user.language === 'Thai' && 'สร้าง'}
                                {user.language === 'English' && 'CREATE'}
                              </span>
                            </Popover.Button>
                            <span className="text-xl  md:text-2xl  font-bold text-[#2C7CD1]">
                              {user.language === 'Thai' && 'ห้องเรียน'}
                              {user.language === 'English' && 'classroom'}
                            </span>
                          </div>
                        </div>
                      )}
                      <Popover.Panel>
                        {({ close }) => (
                          <div className=" fixed top-0 right-0 left-0 bottom-0 m-auto righ z-20">
                            <CreateClass
                              language={user.language}
                              close={close}
                              refetch={classrooms.refetch}
                            />
                          </div>
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
                <div
                  className="flex gap-3 mt-20   w-80 md:w-max  rounded-lg p-2 items-center 
                flex-col md:mt-10 justify-center "
                >
                  {(user.plan === 'FREE' ||
                    user.subscriptions !== 'active') && (
                    <div className="w-max p-3  bg-slate-500 text-white rounded-xl">
                      <span>
                        {user.language === 'Thai'
                          ? `สมาชิกฟรี  5 ห้อง`
                          : user.language === 'English' &&
                            `For free plan 5 classrooms`}
                      </span>
                    </div>
                  )}
                  {user.plan === 'TATUGA-STARTER' &&
                    user.subscriptions === 'active' && (
                      <div className="w-max p-3 bg-blue-500 text-white rounded-xl">
                        <span>
                          {user.language === 'Thai'
                            ? `สมาชิกเริ่มต้น  20 ห้อง`
                            : user.language === 'English' &&
                              `Tatuga starter plan 20 classrooms`}
                        </span>
                      </div>
                    )}
                  {user.plan === 'TATUGA-PREMIUM' &&
                    user.subscriptions === 'active' && (
                      <div className="w-max p-3 bg-[#ffd700] ring-2 ring-white text-black rounded-xl">
                        <span className="font-semibold text-blue-600">
                          {user.language === 'Thai'
                            ? `สมาชิกพรีเมี่ยมสร้างห้องไม่จำกัด`
                            : user.language === 'English' &&
                              `Tatuga Premium plan create unlimitedly`}
                        </span>
                      </div>
                    )}
                  {user.plan === 'TATUGA-PREMIUM' &&
                  user.subscriptions === 'active' ? (
                    <div></div>
                  ) : (
                    <div className="text-center bg-white p-3 flex flex-col h-max py-2 rounded-xl text-black ">
                      <span
                        className={`${
                          acceessFeature
                            ? 'text-black'
                            : 'text-red-500 font-semibold'
                        }`}
                      >
                        {user.language === 'Thai'
                          ? `คุณเหลือเครดิตในการสร้างห้องเรียนอยู่ ${creditClassroom} ห้อง`
                          : user.language === 'English' &&
                            `You have ${creditClassroom} credits left to create classroom`}
                      </span>
                      <span>
                        สมัครเป็นสมาชิก Tatuga class{' '}
                        <Link href="/classroom/subscriptions">
                          <span className="text-blue-400 underline cursor-pointer">
                            คลิก
                          </span>
                        </Link>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <ul className="w-full bg-white h-20 my-5 mb-20 flex justify-center gap-2 md:gap-x-20 shadow-md">
              {classroomMenus.map((list, index) => {
                return (
                  <li
                    onClick={() => setActiveMenu(() => index)}
                    key={index}
                    className={`w-40 md:w-max px-2 cursor-pointer ${
                      activeMenu === index ? list.bgColorMain : 'bg-white'
                    }
h-20 group ${
                      index === 0 ? 'hover:bg-blue-600' : 'hover:bg-green-600'
                    } flex flex-col justify-center items-center`}
                  >
                    <div
                      className={` w-8 h-8 md:w-12 md:h-12 text-lg  md:text-3xl rounded-full flex items-center justify-center ${list.bgColorSecond} ${list.textColorMain}`}
                    >
                      {list.icon}
                    </div>
                    <span
                      className={`text-center text-sm md:text-base  group-hover:text-white
                    ${activeMenu === index ? 'text-white' : 'text-black'}
                    
                    `}
                    >
                      {list.title}
                    </span>
                  </li>
                );
              })}
            </ul>
            {/* classrooms are here  */}

            {activeMenu === 0 && (
              <div className="flex  flex-col gap-10 justify-start items-center w-11/12 h-max">
                <main
                  className={`w-full  mx-10 h-max grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8  gap-10
            ${classroomState?.[0] ? 'flex' : 'hidden'} `}
                >
                  {classrooms.isLoading ? (
                    <div className="  col-span-8 justify-center  flex flex-wrap gap-10">
                      <Skeleton
                        variant="rectangular"
                        width={320}
                        height={210}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={320}
                        height={210}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={320}
                        height={210}
                      />
                      <Skeleton
                        variant="rectangular"
                        width={320}
                        height={210}
                      />
                    </div>
                  ) : (
                    classroomState?.map((classroom, index) => {
                      return (
                        <div
                          style={{
                            border: `${
                              selectedColor.index === index
                                ? `2px solid ${selectedColor.color}`
                                : `2px solid ${classroom.color}`
                            }`,
                            outline: `${
                              selectedColor.index === index
                                ? `4px solid ${selectedColor.color}`
                                : `4px solid  ${classroom.color}`
                            }`,
                            padding: '10px',
                          }}
                          key={index}
                          className={` border-2   border-solid col-span-2 h-max min-h-[12rem]
                      rounded-3xl p-3  overflow-hidden relative  bg-white `}
                        >
                          <div className="text-right w-full">
                            {loading ? (
                              <Loading />
                            ) : (
                              <div className="text-3xl absolute right-4 top-3">
                                {!classroom.selected && (
                                  <div
                                    onClick={() =>
                                      handleOpenClasssDeleted(index)
                                    }
                                    role="button"
                                    className="text-gray-700 text-base   hover:text-red-500 
                          cursor-pointer flex"
                                  >
                                    <BsThreeDotsVertical />
                                  </div>
                                )}
                                {classroom.selected && (
                                  <div className="flex gap-x-4">
                                    <div
                                      role="button"
                                      onClick={() => {
                                        handleCloseClasssDeleted(index);
                                      }}
                                      className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                                    >
                                      <FcCancel />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {classroom.selected && (
                            <div className="w-full  h-40 items-center flex justify-center gap-3">
                              <button
                                onClick={() =>
                                  handleAchieveClassroom({
                                    classroomId: classroom.id,
                                  })
                                }
                                className="w-28 h-20
                              hover:bg-blue-100 group hover:text-blue-600 transition duration-150
                               text-4xl flex flex-col justify-center  items-center text-blue-100
                             bg-blue-600 rounded-lg"
                              >
                                <MdSchool />
                                <span className="text-xs group-hover:text-black transition duration-150 text-white font-normal">
                                  {user.language === 'Thai'
                                    ? 'สำเร็จการศึกษา'
                                    : 'Achieve classroom'}
                                </span>
                              </button>
                              <label
                                htmlFor="dropzone-file"
                                className="
                              hover:bg-yellow-100 group hover:text-yellow-600 transition duration-150
                              w-28 h-20 text-4xl flex flex-col justify-center  items-center text-yellow-200
                             bg-yellow-600 rounded-lg"
                              >
                                <AiOutlineBgColors />
                                <span className="text-xs group-hover:text-black text-white font-normal">
                                  {user.language === 'Thai'
                                    ? 'เปลี่ยนสี'
                                    : 'Change color'}
                                </span>
                                <input
                                  className="opacity-0 w-0 h-0"
                                  value={selectedColor}
                                  onChange={(e) =>
                                    handleColorChange({ e, index })
                                  }
                                  type="color"
                                  id="dropzone-file"
                                />
                              </label>
                              {loading ? (
                                <div className="absolute bottom-2 right-0 left-0 m-auto">
                                  <Loading />
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleUpdateClassroom({
                                      classroomId: classroom.id,
                                    })
                                  }
                                  className="w-max h-max px-3 py-1 rounded-lg hover:bg-green-400
                               text-white bg-green-600 absolute bottom-2 right-0 left-0 m-auto"
                                >
                                  update
                                </button>
                              )}
                            </div>
                          )}
                          <div
                            className={`${
                              classroom.selected ? 'hidden' : 'block'
                            } flex  flex-col h-full justify-between`}
                          >
                            <div className="flex w-full justify-center gap-2 md:gap-10  items-center">
                              <div className="flex flex-col w-3/4 md:w-40 ">
                                <span className="text-sm md:text-lg text-gray-600 font-light truncate">
                                  {classroom.level}
                                </span>
                                <span className="font-bold break-words text-lg md:text-base text-[#EDBA02]">
                                  {classroom.title}
                                </span>
                                <span className="text-sm md:text-base truncate">
                                  {classroom.description}
                                </span>
                              </div>
                              <div className="w-12 h-12 bg-orange-400 flex justify-center items-center text-white rounded-xl text-center">
                                {classroom.studentNumber} คน
                              </div>
                            </div>
                            <div className="flex justify-center items-center gap-2 pt-4 pb-3  w-full lg:mt-5 ">
                              <button
                                onClick={() => {
                                  localStorage.setItem(
                                    'classroomId',
                                    classroom.id,
                                  );
                                  router.push({
                                    pathname: `/classroom/teacher/${classroom.id}`,
                                  });
                                }}
                                className="w-3/4 mb-3 md:mb-0 md:relative   h-9  rounded-lg bg-[#2C7CD1] text-white font-sans font-bold
                text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
                 active:border-solid  focus:border-2 
                focus:border-solid"
                              >
                                <span>
                                  {user.language === 'Thai' &&
                                    '🚪เข้าชั้นเรียน'}
                                  {user.language === 'English' && 'Join'}
                                </span>
                              </button>
                              {loading ? (
                                <div className="w-10 h-10 p-2">
                                  <Loading />
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleDuplicateClassroom({
                                      classroomId: classroom.id,
                                    })
                                  }
                                  aria-label="button to duplicate classroom"
                                  className="text-lg w-10 h-10 p-2 rounded-md text-white
                         bg-blue-400 flex items-center justify-center transition hover:bg-blue-600 duration-150"
                                >
                                  <BiDuplicate />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </main>
                <Pagination
                  count={classrooms?.data?.totalPages}
                  onChange={(e, page) => setPage(page)}
                />
              </div>
            )}
            {activeMenu === 1 && <AchieveClassroomComponent user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;
  const querySanity = `*[_type == "whatsNews"]`;
  const whatsNews = await sanityClient.fetch(querySanity);

  const sortDateWhatsNews = whatsNews.sort(
    (a, b) => new Date(b._createdAt) - new Date(a._createdAt),
  );
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
      if (user.role === 'SCHOOL') {
        return {
          props: {
            user,
            whatsNews: sortDateWhatsNews,
            error: {
              statusCode: 403,
              message: 'teacherOnly',
            },
          },
        };
      }
      return {
        props: {
          user,
          whatsNews: sortDateWhatsNews,
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
      if (user.role === 'SCHOOL') {
        return {
          props: {
            user,
            whatsNews: sortDateWhatsNews,
            error: {
              statusCode: 403,
              message: 'teacherOnly',
            },
          },
        };
      }
      return {
        props: {
          user,
          whatsNews: sortDateWhatsNews,
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
