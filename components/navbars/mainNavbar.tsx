import * as React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import Script from "next/script";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { MdSubscriptions } from "react-icons/md";
import Listmenu from "../svgs/Listmenu";
import { Browsers, currentBrowser } from "../../utils/platforms";
import AuthButton from "../auths/mainAutnButton";
import { FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import MiniLogo from "../svgs/miniLogo";

function MainNavbar() {
  const [brower, setBrower] = useState<Browsers>();
  const router = useRouter();
  const [classroomCode, setClassroomCode] = useState("");
  const [trigger, setTrigger] = useState(false);
  const onClick = () => {
    setTrigger((preTrigger) => !preTrigger);
  };

  const isBrowser = () => typeof window !== "undefined";
  isBrowser();
  useEffect(() => {
    setBrower(() => currentBrowser(window));
    setClassroomCode(router.query.classroomCode as string);
  }, [router.isReady]);
  return (
    <nav
      className={`w-full bg-transparent sticky  h-max top-0 z-50 font-Inter transition duration-200 ease-in-out `}
    >
      <div>
        <Script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></Script>
        <Script
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
        ></Script>

        {/* Phone point of view */}
        <ul className="md:hidden absolute bg-white  flex w-screen h-24 z-50  text-white  justify-between list-none pl-0  content-center items-center">
          <Button onClick={onClick} className="w-[50px] h-[50px] rounded-full">
            <li className="w-[50px] h-[50px] bg-[#EDBA02] active:bg-[#2C7CD1] flex items-center justify-center rounded-full text-white">
              <Listmenu />
            </li>
          </Button>
          <div className="lg:w-[25rem] md:hiden flex   gap-2 items-center justify-center  ">
            <input
              value={classroomCode || ""}
              onChange={(e) => setClassroomCode(e.target.value)}
              className="bg-blue-200 ring-2  ring-black  appearance-none border-none border-gray-200 rounded w-full py-2 px-4  
              leading-tight focus:outline-none focus:bg-blue-400 focus:border-2 focus:right-4 placeholder:text-md placeholder:font-Kanit
              placeholder:text-black placeholder:font-medium focus:placeholder:text-white text-black focus:text-white font-sans font-semibold "
              type="number "
              name="classroomCode"
              placeholder="รหัสห้องเรียน"
              maxLength={6}
            />
            <button
              type="button"
              onClick={() => {
                if (!classroomCode) {
                  return null;
                } else if (classroomCode) {
                  router.push({
                    pathname: `${process.env.NEXT_PUBLIC_CLIENT_STUDENT_URL}/classroom/student`,
                    query: {
                      classroomCode: classroomCode,
                    },
                  });
                }
              }}
              className="w-40 mr-2  h-9  rounded-full bg-[#EDBA02] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
            >
              เข้าร่วม
            </button>
          </div>
        </ul>

        <div
          className={` bg-[#EDBA02] absolute md:hidden  w-full h-screen pt-36 z-10 top-0 duration-200 transition-all  ${
            trigger
              ? `translate-y-0 opacity-100 visible`
              : ` -translate-y-full opacity-50 invisible`
          } `}
        >
          <ul className="list-none font-medium grid grid-cols-1 place-items-center gap-2 ">
            <li>
              <AuthButton />
            </li>
            <Link className="no-underline" href="/">
              <li
                onClick={onClick}
                className="w-60 bg-white text-center text-black rounded-md py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                Home page
              </li>
            </Link>
            <Link className="no-underline" href="/classroom">
              <li
                onClick={onClick}
                className="w-60 bg-white text-center rounded-md text-black  py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                tatuga class
              </li>
            </Link>
            <a
              className="no-underline relative"
              href="https://tatugaschool.com"
            >
              <div
                className=" w-max text-xs px-2 py-1  absolute top-0 left-0 m-auto 
             bg-blue-500 text-white font-Poppins rounded-md"
              >
                พร้อมใช้งาน
              </div>
              <li
                onClick={onClick}
                className="w-60 bg-white text-center rounded-md text-black  py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                tatuga school
              </li>
            </a>
            <Link className="no-underline" href="/about-us">
              <li
                onClick={onClick}
                className="w-60 bg-white text-center rounded-md text-black  py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                about us
              </li>
            </Link>

            <div>
              <li className=" rounded-md bg-[#2C7CD1] px-5 py-1 flex items-center justify-center gap-x-5 text-[30px] ">
                <div className="flex items-center justify-center">
                  <a
                    className="no-underline text-white flex items-center justify-center"
                    href={`${
                      brower === "Safari"
                        ? "fb://page/?id=107002408742438"
                        : "fb://page/107002408742438"
                    }`}
                  >
                    <FaFacebookSquare />
                  </a>
                </div>

                <div>
                  <a
                    className="no-underline text-white flex items-center justify-center"
                    href="http://instagram.com/_u/tatugacamp/"
                  >
                    <FaInstagramSquare />
                  </a>
                </div>
              </li>
            </div>
          </ul>
        </div>

        {/* Full screen */}

        <ul
          className={`hidden md:flex  list-none justify-end pl-0 content-center w-full h-max 
          bg-white border-b-2 border-black b gap-x-2  py-5 font-normal items-center text-black transition-all duration-500 `}
        >
          <li className="mr-auto ml-5">
            <Link className="no-underline" href="/">
              <Button className="flex items-center pt-4 pr-4 ">
                <div className="w-max flex gap-2 justify-center items-center">
                  <div className="w-10 h-10">
                    <MiniLogo />
                  </div>
                  <div className="h-7 w-[2px] bg-black"></div>
                  <span className=" text-2xl font-Poppins font-semibold">
                    TATUGACAMP
                  </span>
                </div>
              </Button>
            </Link>
          </li>

          <li className="">
            <Link className="no-underline" href="/about-us">
              <button className="focus:outline-none md:text-xs lg:text-base text-black font-Inter font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
                <span>about us</span>
              </button>
            </Link>
          </li>
          <li className="relative">
            <div
              className=" w-max text-xs px-2 py-0  absolute top-0 left-0 m-auto 
             bg-blue-500 text-white font-Poppins rounded-md"
            >
              พร้อมใช้งาน
            </div>
            <a className="no-underline" href="https://tatugaschool.com">
              <div
                className="focus:outline-none flex items-center justify-center
               md:text-xs lg:text-base font-Inter gap-2 text-black font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]"
              >
                <span>tatuga school </span>
                <Image
                  src="/svgs/tatuga-school.svg"
                  width={20}
                  height={20}
                  alt="logo tatuga school"
                />
              </div>
            </a>
          </li>
          <li className="">
            <Link className="no-underline" href="/classroom">
              <button className="focus:outline-none md:text-xs lg:text-base font-Inter text-black font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
                <span>tatuga class 👩‍🏫</span>
              </button>
            </Link>
          </li>

          <li className="mr-5">
            <AuthButton />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MainNavbar;
