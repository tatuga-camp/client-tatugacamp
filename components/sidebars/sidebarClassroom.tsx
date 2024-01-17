import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MenubarsMain } from "../../data/menubarsMain";
import { User } from "../../models";

type SidebarClassroomProps = {
  user: User;
  sideMenus: MenubarsMain;
  close: (
    focusableElement?:
      | HTMLElement
      | React.MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
};
function SidebarClassroom({ user, sideMenus, close }: SidebarClassroomProps) {
  const router = useRouter();
  const pathname = router.pathname; // e.g. "/classroom/setting"

  const lastRoute = pathname.split("/").pop();
  const [isClick, setIsClick] = useState<number>();
  useEffect(() => {
    if (lastRoute === "setting") {
      setIsClick(2);
    } else if (lastRoute === "subscriptions") {
      setIsClick(1);
    } else if (lastRoute === "classroom") {
      setIsClick(0);
    } else if (lastRoute === "[classroomId]") {
      setIsClick(1);
    } else if (lastRoute === "assignment") {
      setIsClick(2);
    } else if (lastRoute === "timer") {
      setIsClick(2);
    } else if (lastRoute === "attendance") {
      setIsClick(3);
    } else if (lastRoute === "scores") {
      setIsClick(4);
    }
  }, []);

  return (
    <div className="fixed z-20">
      <div
        className={`bg-white w-[280px] h-full rounded-tr-md  
        transition duration-300  rounded-br-md fixed font-Kanit  top-0 left-0 z-20`}
      >
        <ul className="list-none pl-0 flex justify-center items-center flex-col">
          <li className="mt-12">
            <div className="flex flex-col items-center justify-center ">
              <div
                className={`w-20 h-20 ${
                  user?.picture ? "bg-transparent" : "bg-gray-500"
                } rounded-full relative flex justify-center items-center overflow-hidden ring-4 ring-blue-400 `}
              >
                {user?.picture ? (
                  <Image
                    src={user?.picture}
                    className="object-cover"
                    alt={`profile of ${user?.firstName}`}
                    fill
                    sizes="(max-width: 768px) 100vw"
                  />
                ) : (
                  <span className="text-3xl font-Kanit font-semibold text-white">
                    {user?.firstName?.charAt(0)}
                  </span>
                )}
              </div>
              {user.plan === "FREE" && (
                <div
                  className="w-max h-8 px-2 mt-3 rounded-xl text-white
                 bg-slate-500 font-Kanit font-normal  justify-start items-center flex"
                >
                  {user.language === "Thai" && <span>สมาชิกฟรี</span>}
                  {user.language === "English" && <span>Free plan</span>}
                </div>
              )}
              {user.plan === "TATUGA-STARTER" &&
                user.subscriptions === "active" && (
                  <div
                    className="w-max h-8 px-2 mt-3 rounded-xl text-white
                 bg-blue-500 font-Kanit font-normal  justify-start items-center flex"
                  >
                    {user.language === "Thai" && <span>สมาชิกเริ่มต้น</span>}
                    {user.language === "English" && (
                      <span className="uppercase">Tatuga starter</span>
                    )}
                  </div>
                )}
              {user.plan === "TATUGA-PREMIUM" &&
                user.subscriptions === "active" && (
                  <div
                    className="w-max h-8 px-2 mt-3 rounded-xl text-black bg-[#ffd700]
                    font-Kanit font-normal justify-start items-center flex"
                  >
                    {user.language === "Thai" && <span>สมาชิกพรีเมี่ยม</span>}
                    {user.language === "English" && (
                      <span className="uppercase">Tatuga PREMIUM</span>
                    )}
                  </div>
                )}
              <div className="mt-2 flex flex-col items-center justify-center font-Kanit font-semibold text-2xl text-blue-500">
                <span className=" w-60 truncate text-center">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className=" font-light text-gray-500 text-sm">
                  {user?.email}
                </span>
              </div>
            </div>
          </li>
          <li>
            <ul className="list-none pl-5 flex flex-col gap-y-3 mt-10 ">
              {sideMenus.map((list, index, array) => {
                return (
                  <Link className="no-underline" href={list?.url} key={index}>
                    <li
                      className={`${
                        index === array.length - 1 && " bottom-5 absolute"
                      }`}
                    >
                      <button
                        onClick={() => setIsClick(index)}
                        className="bg-transparent rounded-md border-none 
                 flex justify-center items-center gap-x-3 group cursor-pointer"
                      >
                        <div className="text-3xl  flex justify-center items-center text-gray-800  ">
                          {<list.icon />}
                        </div>
                        <span
                          className={`border-2 border-solid border-transparent group-hover:border-black
                   font-Kanit text-lg w-40 py-1 rounded-md font-semibold 
                   active:bg-[#2C7CD1] active:text-white focus:bg-[#EDBA02] ${
                     isClick === index
                       ? "bg-[#EDBA02] text-white"
                       : "bg-white text-black"
                   } `}
                        >
                          {list.title}
                        </span>
                      </button>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </li>
        </ul>
      </div>
      <div
        onClick={() => close()}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-20 bg-black/30 "
      ></div>
    </div>
  );
}

export default SidebarClassroom;
