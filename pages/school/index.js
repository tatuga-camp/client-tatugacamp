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
import { BiImport } from "react-icons/bi";
import { Disclosure } from "@headlessui/react";
import { IoChevronUpCircleOutline } from "react-icons/io5";

function Index({ user, error }) {
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === "Thai") {
      return sideMenusThai;
    } else if (user?.language === "English") {
      return sideMenusEnglish;
    }
  });
  console.log(user);

  const [currentDate, setCurrentDate] = useState();
  const [currentTime, setCurrentTime] = useState();

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
      <div className="w-full flex flex-col items-center justify-start h-screen pb-20 bg-gradient-to-t from-blue-200 to-blue-100">
        <main className="w-11/12  h-5/6 mt-28 grid grid-cols-6 grid-rows-5 gap-5  ">
          <header className=" row-span-2 col-span-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-300  flex overflow-hidden">
            <div className=" h-full w-96 flex justify-center items-center">
              <div className="w-40 h-40 overflow-hidden ring-2 bg-white ring-white rounded-lg relative">
                {user.picture && (
                  <Image
                    src={user.picture}
                    layout="fill"
                    className="object-contain"
                  />
                )}
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
              <button
                className="bg-white w-max text-black ring-black ring-2 mt-10 hover:scale-110 transition duration-150
               flex justify-center items-center gap-2 px-4 py-2 rounded-xl active:ring-blue-600"
              >
                นำเข้าห้องเรียน
                <div>
                  <BiImport />
                </div>
              </button>
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
          <div className=" row-span-6 col-span-2 ">
            <div className="w-10/12 h-full flex-col flex justify-start  items-center bg-white rounded-2xl drop-shadow-lg">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-10/12 mt-5 justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                      <span>What is your refund policy?</span>
                      <IoChevronUpCircleOutline
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                      If you're unhappy with your purchase for any reason, email
                      us within 90 days and we'll refund you in full, no
                      questions asked.
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-10/12 mt-5 justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                      <span>What is your refund policy?</span>
                      <IoChevronUpCircleOutline
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                      If you're unhappy with your purchase for any reason, email
                      us within 90 days and we'll refund you in full, no
                      questions asked.
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-10/12 mt-5 justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                      <span>What is your refund policy?</span>
                      <IoChevronUpCircleOutline
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                      If you're unhappy with your purchase for any reason, email
                      us within 90 days and we'll refund you in full, no
                      questions asked.
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-10/12 mt-5 justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                      <span>What is your refund policy?</span>
                      <IoChevronUpCircleOutline
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-purple-500`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                      If you're unhappy with your purchase for any reason, email
                      us within 90 days and we'll refund you in full, no
                      questions asked.
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
          <div className=" row-span-3 col-span-4 flex flex-warp">
            <div className="w-60 h-40 bg-white rounded-xl">
              <div></div>
            </div>
          </div>
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
        return {
          props: {
            user,
          },
        };
      }
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
