import { Popover, Transition } from "@headlessui/react";
import React, { useState } from "react";
import { FiSidebar } from "react-icons/fi";
import SidebarClassroom from "../components/sidebars/sidebarClassroom";
import AuthButton from "../components/auths/mainAutnButton";
import { User } from "../models";
import { MenubarsMain } from "../data/menubarsMain";
import { useQuery } from "@tanstack/react-query";
import { GetUserService } from "../services/user";
import Head from "next/head";
import Script from "next/script";

type TatugaClassLayoutProps = {
  children: React.ReactNode;
  user: User;
  sideMenus: MenubarsMain;
};
function TatugaClassLayout({
  children,
  user,
  sideMenus,
}: TatugaClassLayoutProps) {
  return (
    <main className="">
      {user?.plan === "FREE" && (
        <Script
          id="Adsense-id"
          onError={(e) => {
            console.error("Script failed to load", e);
          }}
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )}
      <div className="absolute top-0 right-0 mr-5 mt-5">
        <AuthButton />
      </div>
      <Popover className="fixed z-40 top-0 left-0 mr-5 mt-5 ">
        {({ open }) => (
          <>
            {user && (
              <Popover.Button className="w-max  h-max border-none active:border-none z-30 absolute">
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
                  <SidebarClassroom
                    sideMenus={sideMenus}
                    user={user}
                    close={close}
                  />
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

      <section>{children}</section>
    </main>
  );
}

export default TatugaClassLayout;
