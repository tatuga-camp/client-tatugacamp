import React, { useState } from "react";
import AuthButton from "../components/auth/button";
import { Popover, Transition } from "@headlessui/react";
import { FiSidebar } from "react-icons/fi";
import SidebarSchool from "../components/sidebar/sidebarSchool";

function Layout({ children, user, sideMenus, currentTime, currentDate }) {
  const [triggersidebar, setTriggerSidebar] = useState(true);

  return (
    <main className="font-Kanit">
      <nav className="flex flex-row-reverse justify-between py-5  ">
        <div className="mr-5 flex gap-5">
          <div className="flex  items-center justify-center">
            {currentDate} {currentTime}
          </div>
          <AuthButton />
        </div>

        <Popover>
          {({ open }) => (
            <>
              {user && (
                <Popover.Button className="w-max   h-max border-none active:border-none z-30 absolute">
                  <div className="flex p-2 ml-2 flex-col justify-center items-center ">
                    <div
                      aria-label="Show sidebar"
                      role="button"
                      className="text-2xl  z-30 w-10 h-10 
    flex justify-center items-center   text-black drop-shadow cursor-pointer
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

      <section>{children}</section>
    </main>
  );
}

export default Layout;
