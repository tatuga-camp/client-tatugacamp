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

function Index({ user, error }) {
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();
    const formattedCreateDateTime = date.toLocaleString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return formattedCreateDateTime;
  });
  const [currentTime, setCurrentTime] = useState(() => {
    const date = new Date();
    const formattedCreateDateTime = date.toLocaleString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedCreateDateTime;
  });

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
    <Layout sideMenus={sideMenus} user={user}>
      <Head>
        <title>tatuga school</title>
      </Head>
      <div className="w-full flex flex-col items-center justify-start h-screen bg-gradient-to-t from-blue-200 to-white">
        <main className="w-11/12  h-5/6 mt-20 grid grid-cols-6 grid-rows-5  ">
          <header className="bg-blue-400 row-span-2 col-span-4 rounded-xl flex overflow-hidden">
            <div className=" h-full w-96 flex justify-center items-center">
              <div className="w-40 h-40 overflow-hidden ring-2 ring-white rounded-lg relative">
                <Image
                  src={user.picture}
                  layout="fill"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full flex flex-col font-Kanit justify-center ">
              <span className=" text-white font-light text-lg">
                ยินดีต้อนรับ
              </span>
              <span className=" text-white tracking-wide uppercase text-4xl font-semibold">
                {user?.school}
              </span>
              <div className="flex gap-2">
                <span className=" text-white font-light text-lg">
                  {user.firstName}
                </span>
                <span className=" text-white font-light text-lg">
                  {user?.lastName}
                </span>
              </div>
            </div>
            <div className="w-80 h-full flex items-center justify-center">
              <div className="w-full h-full bg-white flex text-center flex-col gap-2 justify-center items-center">
                <span className="font-semibold text-4xl">{currentDate}</span>
                <span className="font-normal text-base bg-orange-400 text-white p-1 rounded-lg">
                  {currentTime}
                </span>
              </div>
            </div>
          </header>
          <div className=" row-span-6 col-span-2 "></div>
          <div className=" row-span-3 col-span-4 "></div>
        </main>
      </div>
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
      }
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
      if (user.role === "TEACHER") {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: "schoolUserOnly",
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
        props: {
          user,
          error: {
            statusCode: 401,
            message: "unauthorized",
          },
        },
      };
    }
  }
}
