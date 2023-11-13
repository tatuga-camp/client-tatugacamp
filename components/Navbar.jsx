import * as React from 'react';
import Link from 'next/link';
import Logo from './svg/Logo';
import { Button } from '@mui/material';
import Listmenu from './svg/Listmenu';
import Script from 'next/script';
import TaTugaLogo from '../public/logo/TaTuga camp.png';
import Image from 'next/image';
import { useState } from 'react';
import { useEffect } from 'react';
import useScrollDirection from '../hooks/useScrollDirection';
import { currentBrowser } from '../utils/platforms';
import AuthButton from './auth/button';
import { useRouter } from 'next/router';
import MiniLogo from './svg/miniLogo';
import { MdSubscriptions } from 'react-icons/md';

function Navbar() {
  const [brower, setBrower] = useState();
  const router = useRouter();
  const scrollDirection = useScrollDirection();
  const [classroomCode, setClassroomCode] = useState('');
  const [trigger, setTrigger] = useState(false);
  const onClick = () => {
    setTrigger((preTrigger) => !preTrigger);
  };

  const isBrowser = () => typeof window !== 'undefined';
  isBrowser();
  useEffect(() => {
    setBrower(currentBrowser(window));
    setClassroomCode(router.query.classroomCode);
  }, [router.isReady]);
  return (
    <nav
      className={`w-full bg-transparent fixed md:sticky  h-max top-0 z-50 font-Inter transition duration-200 ease-in-out `}
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
        <ul className="md:hidden absolute  flex w-screen h-20 z-50  text-white bg-transparent justify-between list-none pl-0  content-center items-center">
          <Button onClick={onClick} className="w-[50px] h-[50px] rounded-full">
            <li className="w-[50px] h-[50px] bg-[#EDBA02] active:bg-[#2C7CD1] flex items-center justify-center rounded-full text-white">
              <Listmenu />
            </li>
          </Button>
          <div className="lg:w-[25rem] md:hiden flex   gap-2 items-center justify-center  ">
            <input
              value={classroomCode || ''}
              onChange={(e) => setClassroomCode(e.target.value)}
              className="bg-blue-200 ring-2  ring-black  appearance-none border-none border-gray-200 rounded w-full py-2 px-4  
              leading-tight focus:outline-none focus:bg-blue-400 focus:border-2 focus:right-4 placeholder:text-md placeholder:font-Kanit
              placeholder:text-black placeholder:font-medium focus:placeholder:text-white text-black focus:text-white font-sans font-semibold "
              type="number "
              name="classroomCode"
              placeholder="รหัสห้องเรียน"
              maxLength="6"
            />
            <button
              type="button"
              onClick={() => {
                if (!classroomCode) {
                  return null;
                } else if (classroomCode) {
                  router.push({
                    pathname: '/classroom/student',
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
                className="w-60 bg-white text-black rounded-md py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                Home page
              </li>
            </Link>
            <Link className="no-underline" href="/classroom">
              <li
                onClick={onClick}
                className="w-60 bg-white rounded-md text-black  py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                tatuga class
              </li>
            </Link>
            <Link className="no-underline relative" href="/school">
              <div
                className="px-1 w-max text-xs animate-bounce absolute top-0 left-0 m-auto 
             bg-main-color text-white font-Poppins rounded-lg"
              >
                update
              </div>
              <li
                onClick={onClick}
                className="w-60 bg-white rounded-md text-black  py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                tatuga school
              </li>
            </Link>
            <Link className="no-underline" href="/about-us">
              <li
                onClick={onClick}
                className="w-60 bg-white rounded-md text-black  py-4 px-10 active:bg-[#2C7CD1] active:text-white"
              >
                about us
              </li>
            </Link>

            <Link className="no-underline" href="/classroom/subscriptions">
              <button
                className="focus:outline-none text-base font-Inter text-black font-semibold 
               border-0 w-60 h-auto bg-white hover:text-white hover:bg-[#2C7CD1]  flex justify-center items-center gap-2
               transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]"
              >
                <span>subscriptions</span>
                🤑
              </button>
            </Link>

            <div>
              <li className=" rounded-md bg-[#2C7CD1] px-5 py-1 flex items-center justify-center gap-x-5 text-[30px] ">
                <div className="flex items-center justify-center">
                  <a
                    className="no-underline text-white flex items-center justify-center"
                    href={`${
                      brower === 'Safari'
                        ? 'fb://page/?id=107002408742438'
                        : 'fb://page/107002408742438'
                    }`}
                  >
                    <ion-icon name="logo-facebook"></ion-icon>
                  </a>
                </div>

                <div>
                  <a
                    className="no-underline text-white flex items-center justify-center"
                    href="http://instagram.com/_u/tatugacamp/"
                  >
                    <ion-icon name="logo-instagram"></ion-icon>
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
              <button className="focus:outline-none text-base text-black font-Inter font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
                <span>about us</span>
              </button>
            </Link>
          </li>
          <li className="relative">
            <Link className="no-underline" href="/school">
              <button className="focus:outline-none text-base font-Inter text-black font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
                <span>tatuga school 🏫</span>
              </button>
            </Link>
          </li>
          <li className="">
            <Link className="no-underline" href="/classroom">
              <button className="focus:outline-none text-base font-Inter text-black font-normal  border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1] transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]">
                <span>tatuga class 👩‍🏫</span>
              </button>
            </Link>
          </li>
          <li className="">
            <Link className="no-underline" href="/classroom/subscriptions">
              <button
                className="focus:outline-none text-base font-Inter text-black font-semibold 
               border-0 w-max h-auto bg-white hover:text-white hover:bg-[#2C7CD1]  flex justify-center items-center gap-2
               transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]"
              >
                <span>subscriptions</span>
                🤑
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

export default Navbar;
