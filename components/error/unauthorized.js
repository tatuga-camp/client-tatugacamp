import React from "react";
import Head from "next/head";
import AuthButton from "../auth/button";

function Unauthorized({ user }) {
  return (
    <div>
      <Head>
        <title>Login first</title>
      </Head>
      <div className="absolute top-0 right-0 mr-5 mt-5">
        <AuthButton />
      </div>
      <div
        className={`w-screen h-screen flex  items-center justify-center
bg-[url('/blob-scene-haikei.svg')] bg-no-repeat bg-fixed bg-cover `}
      >
        <div className="text-xl md:text-3xl font-Kanit">
          กรุณาเข้าสู่ระบบก่อน
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
