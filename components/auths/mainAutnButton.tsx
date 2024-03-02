import React, { useState, Fragment, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { BiLogOutCircle, BiUser, BiWrench } from "react-icons/bi";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { BsChevronCompactDown, BsChevronDoubleDown } from "react-icons/bs";
import { setCookie, destroyCookie } from "nookies";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { GetUserService } from "../../services/user";
import Loading from "../loadings/loading";

function AuthButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => GetUserService(),
  });

  //set accestoken to localstore
  useEffect(() => {
    if (router.query.access_token) {
      setCookie(null, "access_token", router.query.access_token as string, {
        maxAge: 2 * 24 * 60 * 60, // Cookie expiration time in seconds (e.g., 30 days)
        path: "/", // Cookie path (can be adjusted based on your needs)
      });
      setTimeout(() => {
        user.refetch();
      }, 2000);
    }
  }, [router.query?.access_token, router.isReady]);

  if (user.isFetching) {
    return <Loading />;
  }

  if (user.isError) {
    return (
      <div>
        <Link
          href="/auth/signIn"
          className="flex gap-x-2 no-underline justify-center items-center focus:outline-none text-base font-Inter appearance-none
           font-normal border-0 w-max h-auto bg-white  text-black hover:ring-2 ring-black  transition duration-150 ease-in-out cursor-pointer px-2 py-4 rounded-md active:bg-[#EDBA02]"
        >
          <span>Login</span>
          <div className="flex items-center justify-center text-[#FFC800]">
            <FaUser size={23} />
          </div>
        </Link>
      </div>
    );
  }

  const signOut = () => {
    destroyCookie(null, "access_token", { path: "/" });
    queryClient.removeQueries();
    user.refetch();
    router.push({
      pathname: "/",
    });
  };

  return (
    <Menu>
      <Menu.Button
        className="flex bg-white w-46 relative z-20    border-0 cursor-pointer 
    rounded-md p-3   ring-orange-400 group
    items-center justify-center gap-x-3 "
      >
        {user.data?.picture ? (
          <div className="relative w-10 h-10 rounded-md  overflow-hidden">
            <Image
              src={user.data?.picture}
              alt={user.data?.firstName}
              className=" object-cover "
              fill
              sizes="(max-width: 768px) 100vw"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
            <span className="uppercase font-sans font-black text-3xl text-white">
              {user?.data?.firstName.charAt(0)}
            </span>
          </div>
        )}
        <span className=" text-sm h-min flex flex-col justify-center items-center gap-y-0  ">
          <span className="first-letter:uppercase  text-orange-400 font-Kanit font-medium text-md ">
            {user?.data?.firstName} {user?.data?.lastName}
          </span>
        </span>
        <div className="group-hover:scale-0 transition duration-100 group-hover:opacity-0 ">
          <BsChevronCompactDown />
        </div>
        <div className="group-hover:scale-110 transition opacity-0 duration-200 group-hover:opacity-100 absolute right-3">
          <BsChevronDoubleDown />
        </div>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="relative z-50">
          <Menu.Item>
            {({ active }) => (
              <ul
                role="button"
                className="list-none flex flex-col gap-y-4 bg-white rounded-md text-center drop-shadow-md p-2 md:absolute ml-10 mt-2 
        md:right-10 md:top-26 w-24 cursor-pointe  relative  "
              >
                <li
                  onClick={() => {
                    if (user?.data?.role === "SCHOOL") {
                      router.push({
                        pathname: `${process.env.NEXT_PUBLIC_URL_SCHOOL}/school/dashboard/setting`,
                      });
                    } else if (user?.data?.role === "TEACHER") {
                      router.push({
                        pathname: "/classroom/setting",
                      });
                    }
                  }}
                  className="flex justify-center items-center text-base font-light 
                  gap-x-2 hover:font-bold cursor-pointer group  "
                >
                  <span>Account</span>
                  <span className="text-center flex items-center justify-center group-hover:scale-110 transition duration-150">
                    <BiUser />
                  </span>
                </li>
                <div className="arrow-left md:arrow-top absolute -left-3 top-auto bottom-auto"></div>
                <li
                  onClick={signOut}
                  className="flex justify-center items-center group text-base font-light gap-x-2 cursor-pointer
                   hover:font-bold
                "
                >
                  <span>Logout</span>
                  <span className="text-center flex items-center justify-center group-hover:scale-110 transition duration-150">
                    <BiLogOutCircle />
                  </span>
                </li>
              </ul>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default AuthButton;
