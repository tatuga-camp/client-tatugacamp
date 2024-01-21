import React, { useEffect, useState } from "react";
import { MdDelete, MdOutlinePendingActions, MdSchool } from "react-icons/md";
import { FcCancel } from "react-icons/fc";
import Head from "next/head";
import { useRouter } from "next/router";
import { Pagination, Skeleton } from "@mui/material";
import { parseCookies } from "nookies";
import Swal from "sweetalert2";
import FeedbackSankbar from "../../../components/feedback/snackbar";
import { BiDuplicate, BiNews } from "react-icons/bi";
import Link from "next/link";
import TeacherOnly from "../../../components/error/teacherOnly";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineBgColors, AiOutlineOrderedList } from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";
import AchieveClassroomComponent from "../../../components/classroom/achieveClassroom";
import UpdateOrderClassroom from "../../../components/form/updateOrderClassroom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import PendingReviews from "../../../components/classroom/pendingReviews";
import CreateClassroom from "../../../components/form/createClassroom";
import AdBanner from "../../../components/ads/adBanner";
import TatugaClassLayout from "../../../layouts/tatugaClassLayout";
import { sideMenusEnglish, sideMenusThai } from "../../../data/menubarsMain";
import { Classroom, Student, User } from "../../../models";
import {
  AchieveClassroomService,
  DeleteClassroomService,
  DuplicateClassroomService,
  GetAllAchievedClassroomsService,
  GetAllClassroomsService,
  UpdateClassroomColorService,
} from "../../../services/classroom";
import { loadingCount } from "../../../data/loadingCount";
import Loading from "../../../components/loadings/loading";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetUserCookieService } from "../../../services/user";

const classroomMenus = [
  {
    title: "Active",
    icon: <SiGoogleclassroom />,
    bgColorMain: "bg-blue-600",
    bgColorSecond: "bg-blue-100",
    textColorMain: "text-blue-600",
    textColorSecond: "text-blue-100",
  },
  {
    title: "Achieved",
    icon: <MdSchool />,
    color: "blue",
    bgColorMain: "bg-green-600",
    bgColorSecond: "bg-green-100",
    textColorMain: "text-green-600",
    textColorSecond: "text-green-100",
  },
  {
    title: "Pending review",
    icon: <MdOutlinePendingActions />,
    color: "red",
    bgColorMain: "bg-red-600",
    bgColorSecond: "bg-red-100",
    textColorMain: "text-red-600",
    textColorSecond: "text-red-100",
  },
];

function Index({ error, user }: { user: User; error: any }) {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState<{
    index: number | null;
    color: `#${string}`;
  }>({
    index: null,
    color: "#00000",
  });
  const [triggerCrateClassroom, setTriggerCreateClassroom] = useState(false);
  const [triggerUpdateOrderClassroom, setTiggerUpdateOrderClassroom] =
    useState(false);
  const [selectUpdateOrderClassroom, setSelectUpdateOrderClassroom] =
    useState<Classroom>();
  const [classroomState, setClassroomState] = useState<
    (Classroom & { selected?: boolean } & { students: Student[] })[]
  >([]);
  const [page, setPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(0);
  const [acceessFeature, setAccessFeature] = useState(false);
  const [creditClassroom, setCreditClassroom] = useState<number | "unlimited">(
    5
  );
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const classrooms = useQuery({
    queryKey: ["classrooms", page],
    queryFn: () => GetAllClassroomsService({ page: page }),
    placeholderData: keepPreviousData,
  });
  const achievedClassrooms = useQuery({
    queryKey: ["achieved-classrooms", page],
    queryFn: () => GetAllAchievedClassroomsService({ page: page }),
    placeholderData: keepPreviousData,
  });

  //refetch classrooms every time page change
  useEffect(() => {
    classrooms.refetch();
  }, [page]);

  //refetch when trigger active clssroom

  useEffect(() => {
    if (classrooms?.data) {
      setClassroomState(
        () =>
          classrooms?.data?.classrooms as (Classroom & {
            selected?: boolean;
          } & { students: Student[] })[]
      );
    }
  }, [classrooms.isFetching, page, classrooms.data]);

  const handleCheckPlan = () => {
    const classroomNumber = classrooms?.data?.classroomsTotal as number;
    if (classrooms.data && achievedClassrooms.data) {
      // check if user is free plan or subscriptions is not active
      if (user.plan === "FREE" || user.subscriptions !== "active") {
        setCreditClassroom(() => {
          let credit = 5 - classrooms?.data?.classroomsTotal;

          credit = credit - achievedClassrooms?.data?.classroomsTotal;

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
          } else {
            return credit;
          }
        });

        //check if user is TATUGA-STARTER
      } else if (
        user.plan === "TATUGA-STARTER" &&
        user.subscriptions === "active"
      ) {
        setCreditClassroom(() => {
          let credit = 20 - classroomNumber;
          credit = credit - achievedClassrooms?.data?.classroomsTotal;
          if (credit > 0) {
            setAccessFeature(() => true);
            return credit;
          } else if (credit <= 0) {
            setAccessFeature(() => false);
            return 0;
          } else {
            return credit;
          }
        });
      } else if (
        user.plan === "TATUGA-PREMIUM" &&
        user?.subscriptions === "active"
      ) {
        setCreditClassroom(() => {
          setAccessFeature(() => true);
          return "unlimited";
        });
      }
    }
  };

  useEffect(() => {
    handleCheckPlan();
    if (user) {
      if (user.plan === "FREE" || user.subscriptions !== "active") {
        setAccessFeature(() => true);
      } else if (
        user.plan === "TATUGA-STARTER" &&
        user.subscriptions === "active"
      ) {
        setCreditClassroom(() => 20);
        setAccessFeature(() => true);
      } else if (
        user.plan === "TATUGA-PREMIUM" &&
        user.subscriptions === "active"
      ) {
        setCreditClassroom(() => "unlimited");
        setAccessFeature(() => true);
      }
    }
  }, [classrooms.data, classroomState]);

  //handle open make sure to delete classroom
  const handleOpenClasssDeleted = (index: number) => {
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
  const handleCloseClasssDeleted = (index: number) => {
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
  const handleDuplicateClassroom = async ({
    classroomId,
  }: {
    classroomId: string;
  }) => {
    try {
      setLoading(() => true);
      await DuplicateClassroomService({ classroomId });
      Swal.fire("success", "duplicate classroom successfully", "success");
      await classrooms.refetch();
      setLoading(() => false);
    } catch (err: any) {
      setLoading(() => false);
      console.log("err", err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  //handle achieve classroom
  const handleAchieveClassroom = async ({
    classroomId,
  }: {
    classroomId: string;
  }) => {
    try {
      setLoading(() => true);
      await AchieveClassroomService({ classroomId });
      Swal.fire("success", "achieve classroom successfully", "success");
      await achievedClassrooms.refetch();
      await classrooms.refetch();
      setLoading(() => false);
    } catch (err: any) {
      setLoading(() => false);
      console.error(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  const handleColorChange = ({
    e,
    index,
  }: {
    e: React.ChangeEvent<HTMLInputElement>;
    index: number;
  }) => {
    setSelectedColor(() => {
      return {
        color: e.target.value as `#${string}`,
        index: index,
      };
    }); // Update the state with the selected color
  };
  const handleUpdateClassroom = async ({
    classroomId,
  }: {
    classroomId: string;
  }) => {
    try {
      setLoading(() => true);
      await UpdateClassroomColorService({
        classroomId,
        color: selectedColor.color,
      });
      await classrooms.refetch();
      Swal.fire("success", "update successfully", "success");
      setLoading(() => false);
    } catch (err: any) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      setLoading(() => false);
    }
  };

  const handleDeleteClassroom = async ({
    classroomId,
    title,
  }: {
    classroomId: string;
    title: string;
  }) => {
    let content = document.createElement("div");
    const replacedText = title.replace(/ /g, "_");
    content.innerHTML =
      "<div>กรุณาพิมพ์ข้อความนี้</div> <strong>" +
      replacedText +
      "</strong> <div>เพื่อลบห้องเรียน</div>";
    const { value } = await Swal.fire({
      title: "ยืนยันการลบห้องเรียน",
      input: "text",
      html: content,
      footer: "<strong>หากลบแล้วคุณจะไม่สามารถกู้คืนข้อมูลได้</strong>",
      showCancelButton: true,
      inputValidator: (value) => {
        if (value !== replacedText) {
          return "กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง";
        }
      },
    });
    if (value) {
      try {
        setLoadingDelete(() => true);
        await DeleteClassroomService({ classroomId });
        await achievedClassrooms.refetch();
        await classrooms.refetch();
        Swal.fire("Deleted!", "success");
        setLoadingDelete(() => false);
      } catch (err: any) {
        setLoadingDelete(() => false);
        Swal.fire(
          "error",
          err?.props?.response?.data?.message.toString(),
          "error"
        );
      }
    }
  };

  const handleNotifyOnlyPaidPlan = () => {
    Swal.fire({
      icon: "error",
      title:
        user.language === "Thai" ? "เฉพาะสมาชิกเสียเงิน" : "only paid account",
      text:
        user.language === "Thai"
          ? "สมชิกเริ่มต้นและสมาชิกพรีเมี่ยมเท่านั้นจึงจะมีสิทธิ์ลบห้องเรียน"
          : "Only tatuga starter and tatuga premium plan be able to delete classroom",
      footer:
        user.language === "Thai"
          ? '<a href="/classroom/subscriptions">สมัครสมาชิก</a>'
          : '<a href="/classroom/subscriptions">check out our subscription</a>',
    });
  };

  if (error?.statusCode === 403) {
    return <TeacherOnly user={user} />;
  }

  return (
    <div className="w-full bg-gradient-to-t relative from-blue-400 to-blue-50  lg:w-full pb-40  lg:h-full md:h-full  font-Kanit">
      <div className="md:w-60 lg:w-5/12 absolute z-20 top-0 right-0 left-0 m-auto"></div>
      <Head>
        <meta
          property="og:title"
          content="Tatuga class - เว็บไซต์จัดการชั้นเรียน"
        />
        <meta
          property="og:description"
          content="จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ รวดเร็ว - tatuga class"
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/Word%20cloud%20-%20tatuga%20class.jpg"
        />
        <meta
          property="og:image:secure_url"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/Word%20cloud%20-%20tatuga%20class.jpg"
        />
        <meta
          name="twitter:image:src"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/Word%20cloud%20-%20tatuga%20class.jpg"
        />
        <meta
          name="keywords"
          content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for 
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, `}
        />
        <meta
          name="description"
          content="จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ รวดเร็ว - tatuga class"
        />
        <title>Tatuga class - เว็บไซต์จัดการชั้นเรียน</title>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
      </Head>
      {/* {triggerUpdateOrderClassroom && (
        <UpdateOrderClassroom
          setTiggerUpdateOrderClassroom={setTiggerUpdateOrderClassroom}
          selectUpdateOrderClassroom={selectUpdateOrderClassroom}
          language={user.language}
          activeClassroomTotal={classrooms?.data?.classroomsTotal}
          classrooms={classrooms}
        />
      )} */}
      <TatugaClassLayout
        user={user}
        sideMenus={user.language === "Thai" ? sideMenusThai : sideMenusEnglish}
      >
        <div
          className={`flex    ${
            classroomState?.[0] ? "h-full pb-60 md:pb-80 lg:pb-40" : "h-screen"
          } `}
        >
          <FeedbackSankbar language={user.language} user={user} />

          <div
            className={`flex justify-center items-center md:items-start    lg:items-center  w-full h-full`}
          >
            <div className="w-full  h-max flex flex-col  justify-center items-center pb-14 ">
              <header
                className="mt-28  md:mt-2 flex flex-col justify-start items-center  rounded-lg  p-0 
             md:p-5 md:px-10 xl:px-20 w-max  relative    "
              >
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
                        {user.language === "Thai" && "สร้าง"}
                        {user.language === "English" && "Create"}
                      </span>
                      <span>
                        {user.language === "Thai" && "ห้องเรียนของคุณได้ที่นี่"}
                        {user.language === "English" && " your classroom here!"}
                      </span>
                    </div>
                  </div>
                  {/* <div className="absolute md:-top-20 lg:-top-20 lg:-left-36 ">
                  <Lottie animationData={teacherAnimation} style={style} />
                </div> */}
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                  {acceessFeature && (
                    <div className="lg:mt-20 md:mt-5 mt-20 w-full flex justify-center items-center  font-Kanit ">
                      <div className="flex gap-x-2 justify-center items-center ">
                        <span className="text-xl md:text-2xl font-bold text-[#2C7CD1] ">
                          {user.language === "Thai" && "กดเพื่อ"}
                          {user.language === "English" && "click to"}
                        </span>
                        <button
                          onClick={() => {
                            document.body.style.overflow = "hidden";
                            setTriggerCreateClassroom(() => true);
                          }}
                          className="
            bg-[#EDBA02] border-2 border-transparent border-solid text-md px-5 py-2 rounded-lg 
                font-bold font-Kanit text-white cursor-pointer
              active:border-black hover:scale-110 transition md:text-2xl duration-150 ease-in-out"
                        >
                          <span>
                            {user.language === "Thai" && "สร้าง"}
                            {user.language === "English" && "CREATE"}
                          </span>
                        </button>
                        <span className="text-xl  md:text-2xl  font-bold text-[#2C7CD1]">
                          {user.language === "Thai" && "ห้องเรียน"}
                          {user.language === "English" && "classroom"}
                        </span>
                      </div>
                    </div>
                  )}

                  {triggerCrateClassroom && (
                    <CreateClassroom
                      language={user.language}
                      setTriggerCreateClassroom={setTriggerCreateClassroom}
                      classrooms={classrooms}
                    />
                  )}

                  <div
                    className="flex gap-3 mt-20   w-80 md:w-max  rounded-lg p-2 items-center 
                flex-col md:mt-10 justify-center "
                  >
                    {(user.plan === "FREE" ||
                      user.subscriptions !== "active") && (
                      <div className="w-max p-3  bg-slate-500 text-white rounded-xl">
                        <span>
                          {user.language === "Thai"
                            ? `สมาชิกฟรี  5 ห้อง`
                            : user.language === "English" &&
                              `For free plan 5 classrooms`}
                        </span>
                      </div>
                    )}
                    {user.plan === "TATUGA-STARTER" &&
                      user.subscriptions === "active" && (
                        <div className="w-max p-3 bg-blue-500 text-white rounded-xl">
                          <span>
                            {user.language === "Thai"
                              ? `สมาชิกเริ่มต้น  20 ห้อง`
                              : user.language === "English" &&
                                `Tatuga starter plan 20 classrooms`}
                          </span>
                        </div>
                      )}
                    {user.plan === "TATUGA-PREMIUM" &&
                      user.subscriptions === "active" && (
                        <div className="w-max p-3 bg-[#ffd700] ring-2 ring-white text-black rounded-xl">
                          <span className="font-semibold text-blue-600">
                            {user.language === "Thai"
                              ? `สมาชิกพรีเมี่ยมสร้างห้องไม่จำกัด`
                              : user.language === "English" &&
                                `Tatuga Premium plan create unlimitedly`}
                          </span>
                        </div>
                      )}
                    {user.plan === "TATUGA-PREMIUM" &&
                    user.subscriptions === "active" ? (
                      <div></div>
                    ) : (
                      <div className="text-center bg-white p-3 flex flex-col h-max py-2 rounded-xl text-black ">
                        <span
                          className={`${
                            acceessFeature
                              ? "text-black"
                              : "text-red-500 font-semibold"
                          }`}
                        >
                          {user.language === "Thai"
                            ? `คุณเหลือเครดิตในการสร้างห้องเรียนอยู่ ${creditClassroom} ห้อง`
                            : user.language === "English" &&
                              `You have ${creditClassroom} credits left to create classroom`}
                        </span>
                        <span
                          className={` font-semibold text-red-500 ${
                            acceessFeature
                              ? "text-black"
                              : "text-red-500 font-semibold"
                          }`}
                        >
                          {user.language === "Thai"
                            ? `จำนวนเครดิตจะนับห้องที่สำเร็จการศึกษาแล้วด้วย`
                            : user.language === "English" &&
                              `Credit also includes achieved classrooms`}
                        </span>
                        <span>
                          สมัครเป็นสมาชิก Tatuga class{" "}
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
                {user.plan === "FREE" && (
                  <AdBanner
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                    data-ad-slot="7501763680"
                  />
                )}
              </header>

              <ul className="w-full bg-white h-20 my-5 mb-20 flex justify-center gap-2 md:gap-x-20 shadow-md">
                {classroomMenus.map((list, index) => {
                  return (
                    <li
                      onClick={() => setActiveMenu(() => index)}
                      key={index}
                      className={`w-32 md:w-40 px-2 cursor-pointer ${
                        activeMenu === index ? list.bgColorMain : "bg-white"
                      }
h-20 group ${
                        index === 0
                          ? "hover:bg-blue-600"
                          : index === 1
                          ? "hover:bg-green-600"
                          : index === 2 && "hover:bg-red-600"
                      } flex flex-col justify-center items-center`}
                    >
                      <div
                        className={` w-8 h-8 md:w-12 md:h-12 text-lg  md:text-3xl rounded-full flex items-center justify-center ${list.bgColorSecond} ${list.textColorMain}`}
                      >
                        {list.icon}
                      </div>
                      <span
                        className={`text-center text-sm md:text-base  group-hover:text-white
                    ${activeMenu === index ? "text-white" : "text-black"}
                    
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
                    className={`w-full   mx-10 h-max grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8  
                  gap-10  `}
                  >
                    {classrooms.isFetching
                      ? loadingCount.map((list, index) => {
                          return (
                            <Skeleton
                              className="col-span-2"
                              key={index}
                              variant="rectangular"
                              width="100%"
                              height={210}
                            />
                          );
                        })
                      : classroomState?.map((classroom, index) => {
                          return (
                            <div
                              style={{
                                border: `${
                                  selectedColor.index === index
                                    ? `5px solid ${selectedColor.color}`
                                    : `5px solid ${classroom.color}`
                                }`,
                                padding: "10px",
                              }}
                              key={index}
                              className={`    border-solid col-span-2 h-max min-h-[12rem]
                      rounded-3xl p-3  overflow-hidden relative  bg-white `}
                            >
                              <div className="text-right w-full">
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
                              </div>
                              {classroom.selected &&
                                (loadingDelete ? (
                                  <div className="w-full h-40 flex items-center justify-center">
                                    <Loading />
                                  </div>
                                ) : (
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
                                        {user.language === "Thai"
                                          ? "สำเร็จการศึกษา"
                                          : "Achieve classroom"}
                                      </span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTiggerUpdateOrderClassroom(
                                          () => true
                                        );
                                        setSelectUpdateOrderClassroom(
                                          () => classroom
                                        );
                                        document.body.style.overflow = "hidden";
                                      }}
                                      className="w-28 h-20
                              hover:bg-pink-100 group hover:text-pink-600 transition duration-150
                               text-4xl flex flex-col justify-center  items-center text-pink-100
                             bg-pink-600 rounded-lg"
                                    >
                                      <AiOutlineOrderedList />
                                      <span className="text-xs group-hover:text-black transition duration-150 text-white font-normal">
                                        {user.language === "Thai"
                                          ? "เปลี่ยนตำแหน่ง"
                                          : "change position"}
                                      </span>
                                    </button>

                                    <label
                                      htmlFor="dropzone-file"
                                      className="
                              hover:bg-yellow-100 cursor-pointer group hover:text-yellow-600 transition duration-150
                              w-28 h-20 text-4xl flex flex-col justify-center  items-center text-yellow-200
                             bg-yellow-600 rounded-lg"
                                    >
                                      <AiOutlineBgColors />
                                      <span className="text-xs group-hover:text-black text-white font-normal">
                                        {user.language === "Thai"
                                          ? "เปลี่ยนสี"
                                          : "Change color"}
                                      </span>
                                      <input
                                        className="opacity-0 w-0 h-0"
                                        value={selectedColor.color}
                                        onChange={(e) =>
                                          handleColorChange({ e, index })
                                        }
                                        type="color"
                                        id="dropzone-file"
                                      />
                                    </label>
                                    {user.plan !== "FREE" ? (
                                      <button
                                        onClick={() =>
                                          handleDeleteClassroom({
                                            classroomId: classroom.id,
                                            title: classroom.title,
                                          })
                                        }
                                        className="w-28 h-20
                              hover:bg-red-100 group hover:text-red-600 transition duration-150
                               text-4xl flex flex-col justify-center  items-center text-red-100
                             bg-red-600 rounded-lg"
                                      >
                                        <MdDelete />
                                        <span className="text-xs px-2 group-hover:text-black transition duration-150 text-white font-normal">
                                          {user.language === "Thai"
                                            ? "ลบห้องเรียน"
                                            : "delete"}
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={handleNotifyOnlyPaidPlan}
                                        className="w-28 h-20
                          hover:bg-gray-100 group hover:text-gray-600 transition duration-150
                           text-4xl flex flex-col justify-center  items-center text-gray-100
                         bg-gray-600 rounded-lg"
                                      >
                                        <MdDelete />
                                        <span className="text-xs px-2 group-hover:text-black transition duration-150 text-white font-normal">
                                          {user.language === "Thai"
                                            ? "ลบห้องเรียน"
                                            : "delete"}
                                        </span>
                                      </button>
                                    )}
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
                                ))}
                              <div
                                className={`${
                                  classroom.selected ? "hidden" : "block"
                                } flex  flex-col  h-40 justify-between`}
                              >
                                <div className="flex w-full justify-center gap-2 md:gap-10  items-center">
                                  <div className="flex flex-col h-28 w-3/4 md:w-40 ">
                                    <span className="text-sm md:text-lg text-gray-600 font-light truncate">
                                      {classroom.level}
                                    </span>
                                    <span className="font-bold break-words text-lg max-h-16 overflow-hidden   md:text-base text-[#EDBA02]">
                                      {classroom.title}
                                    </span>
                                    <span className="text-sm md:text-base truncate">
                                      {classroom.description}
                                    </span>
                                  </div>
                                  <div className="w-12 h-12 bg-orange-400 flex justify-center items-center text-white rounded-xl text-center">
                                    {classroom.students?.length} คน
                                  </div>
                                </div>
                                <div className="flex justify-center h-max items-center gap-2  w-full  ">
                                  <Link
                                    className="w-full"
                                    onClick={() => {
                                      localStorage.setItem(
                                        "classroomId",
                                        classroom.id
                                      );
                                    }}
                                    href={`/classroom/teacher/${classroom.id}`}
                                  >
                                    <button
                                      className="w-full md:mb-0 md:relative   h-9  rounded-lg bg-[#2C7CD1] text-white font-sans font-bold
                text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
                 active:border-solid  focus:border-2 
                focus:border-solid"
                                    >
                                      <span>
                                        {user.language === "Thai" &&
                                          "🚪เข้าชั้นเรียน"}
                                        {user.language === "English" && "Join"}
                                      </span>
                                    </button>
                                  </Link>

                                  {loading ? (
                                    <div className="w-10 h-10 p-2">
                                      <Loading />
                                    </div>
                                  ) : (
                                    user?.schoolUser?.organization !==
                                      "school" && (
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
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </main>
                  <Pagination
                    count={classrooms?.data?.totalPages}
                    onChange={(e, page) => {
                      setPage(page);
                    }}
                  />
                </div>
              )}
              {activeMenu === 1 && <AchieveClassroomComponent user={user} />}
              {activeMenu === 2 && <PendingReviews user={user} />}
            </div>
          </div>
        </div>
      </TatugaClassLayout>
    </div>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const cookies = parseCookies(ctx);
  const accessToken = cookies.access_token;
  if (accessToken) {
    try {
      const user = await GetUserCookieService({
        access_token: accessToken,
      });
      if (user.role === "SCHOOL") {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: "teacherOnly",
            },
          },
        };
      }
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
