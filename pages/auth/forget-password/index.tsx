import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { PostRequestResetPasswordService } from "../../../services/auth";
import HomepageLayout from "../../../layouts/homePageLayout";
import Loading from "../../../components/loadings/loading";
import Head from "next/head";

function Index() {
  const [email, setEmail] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [wait, setWait] = useState(false);
  const [secound, setSecound] = useState(0);

  const handleSummit = async (e: React.FormEvent) => {
    try {
      setIsloading(() => true);
      e.preventDefault();
      await PostRequestResetPasswordService({ email });
      Swal.fire({
        title: "success",
        html: "โปรดเปิด email ของคุณเพื่อดำเนินการต่อไป",
        icon: "success",
        timerProgressBar: true,
      });
      setIsloading(() => false);
      setWait(() => true);
      hanldeTimmingWait();
    } catch (err: any) {
      setIsloading(() => false);
      console.error(err);
      Swal.fire("error", err?.response?.data?.message.toString(), "error");
    }
  };
  const hanldeTimmingWait = () => {
    setSecound(20); // Set the initial value of the countdown timer
    setWait(() => true);
    const timer = setInterval(() => {
      setSecound((prevCount) => prevCount - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      if (secound === 0) {
        setWait(() => false);
      }
      setWait(false);
      // Perform your action here after the wait duration
      // For example, you can set the `wait` state to false to indicate that the wait is over
    }, 20000); // Wait for 10 seconds (1000 milliseconds * 10)

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  };
  return (
    <HomepageLayout>
      <Head>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
        <title>forget password</title>
      </Head>
      <div
        className="font-sans gap-5 h-screen w-full bg-[url('/background-Auth.svg')] bg-no-repeat bg-cover
flex flex-col justify-center items-center"
      >
        <form
          className="w-80 md:w-96 flex flex-col gap-2"
          onSubmit={handleSummit}
        >
          <span className="font-bold text-xl">Enter your email</span>
          <Box width="100%">
            <TextField
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(() => e.target.value)}
              value={email}
              name="email"
              fullWidth
              label="email"
            />
          </Box>
          {isloading ? (
            <Loading />
          ) : wait ? (
            <div
              className="w-max p-1 bg-gray-500 rounded-xl 
         text-white font-semibold text-lg px-6"
            >
              wait {secound}
            </div>
          ) : (
            <button
              className="w-max p-1 bg-blue-500 rounded-xl ring-2 ring-blue-400 hover:bg-blue-700 transition duration-150
          active:ring-blue-500 text-white font-semibold text-lg px-6"
            >
              send
            </button>
          )}
          {wait && <span>โปรดตรวจสอบอีเมลของคุณ</span>}
        </form>
        <section className="font-Kanit bg-white ring-2 ring-black rounded-lg p-5 font-normal  w-80 sm:w-96">
          ระบบลืมรหัสผ่านใช้ได้สำหรับผู้ใช้งานที่ลงทะเบียนผ่าน tatuga class
          เท่านั้น หากคุณเข้าสู่ระบบผ่าน google หรือ facebook โปรดดำเนินการผ่าน
          provider เจ้านั้นๆ
          <hr />
          <span className="font-medium">
            "หากมีความประสงค์อยากย้ายการเข้าสู่ระบบเป็น tatuga class"{" "}
          </span>
          <a href="https://www.facebook.com/TatugaCamp/">
            ติดต่อ - facebook: tatuga camp
          </a>
        </section>
      </div>
    </HomepageLayout>
  );
}

export default Index;
