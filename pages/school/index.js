import React, { useEffect, useState } from "react";
import Layout from "../../layouts/tatugaSchoolLayOut";
import { parseCookies } from "nookies";
import { GetUserCookie } from "../../service/user";
import Unauthorized from "../../components/error/unauthorized";
import SchoolOnly from "../../components/error/schoolOnly";
import {
  sideMenusEnglish,
  sideMenusThai,
} from "../../data/school/menubarsHomepage";
import Head from "next/head";
import Image from "next/image";
import { AiOutlineUserAdd } from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import CreateAccount from "../../components/form/school/createAccount";
import { GetAllTeachersNumber } from "../../service/school/teacher";
import NumberAnimated from "../../components/overview/numberAnimated";

function Index({ user, error, teachersNumber }) {
  const [currentDate, setCurrentDate] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [triggerAccountManagement, setTriggerAccountManagement] =
    useState(false);
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === "Thai") {
      return sideMenusThai;
    } else if (user?.language === "English") {
      return sideMenusEnglish;
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(() => {
        const date = new Date();
        const formattedCreateDateTime = date.toLocaleString("th-TH", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return formattedCreateDateTime;
      });
      setCurrentTime(() => {
        const date = new Date();
        const formattedCreateDateTime = date.toLocaleString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
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
    <Layout
      currentTime={currentTime}
      currentDate={currentDate}
      sideMenus={sideMenus}
      user={user}
    >
      <Head>
        <title>tatuga school</title>
      </Head>
      {triggerAccountManagement && (
        <CreateAccount
          user={user}
          close={triggerAccountManagement}
          setTriggerAccountManagement={setTriggerAccountManagement}
        />
      )}
      <main className="w-full h-screen flex justify-center items-center font-Poppins bg-slate-100 ">
        <div className="w-11/12 h-[90%] grid grid-cols-8 grid-rows-5 gap-5 ">
          <button
            onClick={() => {
              setTriggerAccountManagement(() => true);
              document.body.style.overflow = "hidden";
            }}
            className="row-span-1 col-span-2 transition duration-150 hover:bg-blue-400 group bg-white drop-shadow-lg
             rounded-lg
           flex justify-center gap-10 items-center relative"
          >
            <div
              className="flex justify-center items-center text-3xl 
            w-16 h-16 rounded-full text-blue-600 group-hover:text-black group-hover:bg-white transition bg-blue-100 "
            >
              <AiOutlineUserAdd />
            </div>
            <div className="flex flex-col  items-start">
              <span className="font-semibold text-2xl text-black font-Kanit group-hover:text-white">
                <NumberAnimated n={teachersNumber} />{" "}
                <span className="text-sm font-normal">บัญชี</span>
              </span>
              <span className="font-normal text-slate-500 font-Kanit text-base group-hover:text-slate-100">
                เพิ่ม/จัดการ บัญชี
              </span>
            </div>
          </button>
          <button
            className="row-span-1 col-span-2 transition duration-150 hover:bg-green-400 group bg-white drop-shadow-lg rounded-lg
           flex justify-center gap-10 items-center relative"
          >
            <div
              className="flex justify-center items-center text-3xl 
            w-16 h-16 rounded-full text-green-600 group-hover:text-black
             group-hover:bg-white transition bg-green-100 "
            >
              <SiGoogleclassroom />
            </div>
            <div className="flex flex-col  items-start">
              <span className="font-semibold text-2xl text-black font-Kanit group-hover:text-white">
                1,500 <span className="text-sm font-normal">ห้องเรียน</span>
              </span>
              <span className="font-normal text-slate-500 font-Kanit text-base group-hover:text-slate-100">
                ตรวจสอบห้องเรียน
              </span>
            </div>
          </button>
          <button
            className="row-span-1 col-span-2 transition duration-150 hover:bg-pink-400 group bg-white drop-shadow-lg rounded-lg
           flex justify-center gap-10 items-center relative"
          >
            <div
              className="flex justify-center items-center text-3xl 
            w-16 h-16 rounded-full text-pink-600 group-hover:text-black
             group-hover:bg-white transition bg-pink-100 "
            >
              <BsFillPeopleFill />
            </div>
            <div className="flex flex-col  items-start">
              <span className="font-semibold text-2xl text-black font-Kanit group-hover:text-white">
                3,556 <span className="text-sm font-normal">นักเรียน</span>
              </span>
              <span className="font-normal text-slate-500 font-Kanit text-base group-hover:text-slate-100">
                ตรวจสอบนักเรียน
              </span>
            </div>
          </button>
          <button
            className="row-span-1 col-span-2 transition duration-150 hover:bg-orange-400 group bg-white drop-shadow-lg rounded-lg
           flex justify-center gap-10 items-center relative"
          >
            <div
              className="flex justify-center items-center text-3xl 
            w-16 h-16 rounded-full text-orange-600 group-hover:text-black
             group-hover:bg-white transition bg-orange-100 "
            >
              <FaUserCheck />
            </div>
            <div className="flex flex-col  items-start">
              <span className="font-semibold text-lg text-black font-Kanit group-hover:text-white">
                ตรวจสอบการเข้าเรียน
              </span>
              <span className="font-normal text-slate-500 font-Kanit text-base group-hover:text-slate-100">
                ของผู้เรียน
              </span>
            </div>
          </button>
          <div className="bg-white drop-shadow-md row-span-2 rounded-lg col-span-6"></div>
          <div className="bg-white drop-shadow-md row-span-4 p-5 rounded-lg col-span-2 flex flex-col justify-start items-center">
            <h3 className="font-Kanit">ขาดเรียน 10 อันดับแรก </h3>
            <div className="w-full h-full bg-slate-400"></div>
          </div>
          <div className="bg-white drop-shadow-md row-span-2 rounded-lg col-span-4"></div>
          <div className="bg-white drop-shadow-md row-span-2 rounded-lg col-span-2"></div>
        </div>
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
          message: "unauthorized",
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      if (user.role === "TEACHER") {
        return {
          props: {
            error: {
              statusCode: 403,
              message: "schoolUserOnly",
            },
          },
        };
      } else if (user.role === "SCHOOL") {
        const teachersNumber = await GetAllTeachersNumber({
          access_token: accessToken,
        });
        return {
          props: {
            user,
            teachersNumber,
          },
        };
      }
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: "unauthorized",
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
      if (user.role !== "SCHOOL") {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: "schoolUserOnly",
            },
          },
        };
      } else if (user.role === "SCHOOL") {
        const teachersNumber = await GetAllTeachersNumber({
          access_token: accessToken,
        });
        return {
          props: {
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
            message: "unauthorized",
          },
        },
      };
    }
  }
}
