import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo404 from '../public/Logo404.png';

function Custom404() {
  return (
    <div className="w-screen h-screen dark:bg-main-color bg-white  flex flex-col items-center justify-center relative font-Poppins ">
      <main className="flex flex-col w-max items-center justify-center gap-5 ">
        {/*Large screen */}
        <div className="md:flex md:items-center md:text-[20rem] md:font-bold md:text-[#2C7CD1] md:dark:text-white md:leading-none hidden">
          <h2>4</h2>
          <div className="relative w-[18.75rem] h-[18.75rem]">
            <Image
              src={Logo404}
              fill
              className="object-contain"
              alt={`picture of tatugacamp-logo`}
            />
          </div>
          <h2>4</h2>
        </div>

        {/*Large screen */}
        <div className="flex flex-col items-center text-[8rem] font-bold text-[#2C7CD1] dark:text-white leading-none md:hidden">
          <div className="relative w-[15rem] h-[15rem]">
            <Image
              src={Logo404}
              fill
              className="object-contain"
              alt={`picture of tatugacamp-logo`}
            />
          </div>
          <h2>404</h2>
        </div>

        <section className="dark:text-white text-[#F55E00] text-sm w-[70%] md:w-[90%] text-center  md:text-2xl">
          <p>Oop! The page you request could not be found</p>
        </section>

        <Link
          className="no-underline hover:scale-110 transition duration-150
           text-white uppercase  dark:bg-[#EDBA02] bg-[#2C7CD1] py-2 px-4 rounded-full"
          href="/"
        >
          back to homepage
        </Link>
      </main>
    </div>
  );
}

export default Custom404;
