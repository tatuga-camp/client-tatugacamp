import React, { useEffect, useState } from 'react';
import AuthButton from '../components/auth/button';
import { Popover, Transition } from '@headlessui/react';
import { FiSidebar } from 'react-icons/fi';
import SidebarSchool from '../components/sidebar/sidebarSchool';
import {
  AiFillHome,
  AiOutlineCloudUpload,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import NumberAnimated from '../components/overview/numberAnimated';
import { SiGoogleclassroom } from 'react-icons/si';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaUserCheck } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { IoPeopleCircleOutline } from 'react-icons/io5';
import Image from 'next/image';

function Layout({
  children,
  user,
  sideMenus,
  teachersNumber,
  setTriggerCreateUser,
  setSelectTeacher,
  classroomNumber,
}) {
  const router = useRouter();
  const [triggersidebar, setTriggerSidebar] = useState(true);

  const pathname = router.pathname; // e.g. "/classroom/setting"
  const lastRoute = pathname.split('/').pop();
  const [isClick, setIsClick] = useState();

  return (
    <main className="font-Kanit relative">
      {/* <div className="bg-yellow-400  w-full h-80 relative ">
          <Image
            layout="fill"
            className="object-cover"
            src="https://storage.googleapis.com/tatugacamp_development/image%204.png"
          />
          <div>
            <label htmlFor="dropzone-file" className="w-max">
              <div
                className="w-28 h-10 hover:scale-105 transition duration-150
                    bg-white drop-shadow-xl ring-2 text-black text-3xl flex justify-center items-center rounded-2xl"
              >
                <AiOutlineCloudUpload />
              </div>

              <input
                id="dropzone-file"
                name="files"
                aria-label="upload image"
                type="file"
                multiple="multiple"
                accept="/jpeg,image/png"
                className="text-sm text-grey-500 hidden  ring-2
              file:mr-5 md:file:w-40 file:w-40 w-max file:py-2
              file:rounded-full file:border-0
              file:text-sm file:font-Kanit file:font-normal file:text-white
              bg-white rounded-full
              file:bg-blue-400 file:drop-shadow-lg
              hover:file:cursor-pointer hover:file:bg-amber-50
              hover:file:text-amber-700
            "
              />
            </label>
          </div>
        </div> */}
      <nav className="flex flex-row-reverse absolute top-0 w-full justify-between py-5  ">
        <div className="mr-5 flex gap-5 ">
          <div className="flex  items-center justify-center"></div>
          <AuthButton />
        </div>

        <Popover>
          {({ open }) => (
            <>
              {user && (
                <Popover.Button className="w-max   h-max border-none active:border-none z-30 absolute">
                  <div className="flex p-2 ml-2 flex-col font-Kanit justify-center items-center ">
                    <div
                      aria-label="Show sidebar"
                      className="text-2xl  z-30 w-10 h-10 
        flex justify-center items-center bg-white rounded-2xl   text-black drop-shadow cursor-pointer
        hover:scale-125 transition duration-100 ease-in-out "
                    >
                      <FiSidebar />
                    </div>
                    <span>menu</span>
                  </div>
                </Popover.Button>
              )}
              <Transition>
                <Popover.Panel>
                  {({ close }) => (
                    <SidebarSchool
                      sideMenus={sideMenus}
                      user={user}
                      triggersidebar={triggersidebar}
                      close={close}
                    />
                  )}
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </nav>
      <div
        className={`${
          lastRoute === 'setting' ? 'hidden' : 'flex'
        }  w-full justify-center pt-20 mb-5`}
      >
        <div className="w-11/12 h-28 grid grid-cols-6  gap-5 ">
          <button
            onClick={() => {
              router.push({
                pathname: '/school',
              });
            }}
            className={`ring-2 ring-black row-span-1 col-span-2 transition duration-150
            ${lastRoute === 'school' ? 'bg-pink-400' : 'bg-white'}
            hover:bg-pink-400 group  rounded-lg
           flex justify-center gap-10 items-center relative `}
          >
            <div
              className={`flex justify-center items-center text-3xl 
              ${lastRoute === 'school' ? 'text-black' : 'text-pink-600'}
            w-16 h-16 rounded-full  group-hover:text-black
             group-hover:bg-white transition bg-pink-100 `}
            >
              <AiFillHome />
            </div>
            <div className="flex flex-col  items-start">
              <span
                className={`
               ${lastRoute === 'school' ? 'text-white' : 'text-black'}
              font-semibold text-2xl  font-Kanit group-hover:text-white`}
              >
                หน้าหลัก
              </span>
              <span
                className={`
                ${
                  lastRoute === 'school' ? 'text-slate-100' : 'text-slate-500 k'
                }
              font-normal font-Kanit text-base group-hover:text-slate-100`}
              >
                homepage
              </span>
            </div>
          </button>
          <button
            onClick={() => {
              if (lastRoute === 'manage-account') {
                setTriggerCreateUser(() => false);
                setSelectTeacher(() => null);
              } else {
                router.push({
                  pathname: '/school/manage-account',
                });
              }
            }}
            className={`row-span-1 col-span-2 transition ${
              lastRoute === 'manage-account' ? 'bg-blue-400' : 'bg-white'
            } duration-150 hover:bg-blue-400 group 
             rounded-lg flex justify-center gap-10 items-center relative  ring-2 ring-black`}
          >
            <div
              className={`flex justify-center items-center text-3xl 
            w-16 h-16 rounded-full text-blue-600 group-hover:text-black
            ${lastRoute === 'manage-account' ? 'bg-white' : 'bg-blue-100'}
            group-hover:bg-white transition bg-blue-100 `}
            >
              <AiOutlineUserAdd />
            </div>
            <div className="flex flex-col  items-start">
              <div
                className={`font-semibold flex items-center gap-2 text-2xl text-black font-Kanit group-hover:text-white 
                 ${
                   lastRoute === 'manage-account' ? 'text-white ' : 'text-black'
                 }`}
              >
                <span>บริหารจัดการบัญชี</span>
              </div>
              <span
                className={`font-normal  font-Kanit text-base
              ${
                lastRoute === 'manage-account'
                  ? 'text-slate-100'
                  : 'text-slate-500'
              }
              group-hover:text-slate-100`}
              >
                เพิ่ม/จัดการ บัญชี
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              router.push({
                pathname: '/school/classrooms',
              });
            }}
            className={` ring-2 ring-black row-span-1 col-span-2 
            ${lastRoute === 'classrooms' ? 'bg-green-400' : 'bg-white'}
            transition duration-150 hover:bg-green-400 group  rounded-lg
           flex justify-center gap-10 items-center relative`}
          >
            <div
              className={`flex justify-center items-center text-3xl 
              ${
                lastRoute === 'classrooms'
                  ? 'text-black bg-white'
                  : 'text-green-600'
              }
            w-16 h-16 rounded-full  group-hover:text-black
             group-hover:bg-white transition bg-green-100 `}
            >
              <SiGoogleclassroom />
            </div>
            <div className="flex flex-col  items-start">
              <div
                className={`
                flex items-center gap-2 
               ${lastRoute === 'classrooms' ? 'text-white' : 'text-black'}
              font-semibold text-2xl text-black font-Kanit group-hover:text-white`}
              >
                <NumberAnimated n={classroomNumber} />{' '}
                <span className="text-sm font-normal">ห้องเรียน</span>
              </div>
              <span
                className={`
                ${
                  lastRoute === 'classrooms'
                    ? 'text-slate-100'
                    : 'text-slate-500'
                }
              font-normal  font-Kanit text-base group-hover:text-slate-100`}
              >
                ตรวจสอบห้องเรียน
              </span>
            </div>
          </button>
        </div>
      </div>

      <section>{children}</section>
    </main>
  );
}

export default Layout;
