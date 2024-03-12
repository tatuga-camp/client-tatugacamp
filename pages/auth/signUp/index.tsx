import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiLockClosed } from "react-icons/hi";
import { BsFacebook } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { Browsers, currentBrowser } from "../../../utils/platforms";
import Head from "next/head";
import ReCAPTCHA from "react-google-recaptcha";
import { SignUpJWTService } from "../../../services/user";
import Loading from "../../../components/loadings/loading";
import HomepageLayout from "../../../layouts/homePageLayout";
import Hands from "../../../components/svgs/Hands";

function Index() {
  const [brower, setBrower] = useState<Browsers>();
  const router = useRouter();
  const [allowByCAPTCHA, setAllowByCAPTCHA] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setBrower(currentBrowser(window));
  }, []);
  const [signUpData, setSignUpdata] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleChangeSignUpdata = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpdata((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "email":
          if (!value) {
            stateObj[name] = "Please enter email.";
          }
          break;

        case "firstName":
          if (!value) {
            stateObj[name] = "required";
          }
          break;

        case "lastName":
          if (!value) {
            stateObj[name] = "required";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (
            signUpData.confirmPassword &&
            value !== signUpData.confirmPassword
          ) {
            stateObj["confirmPassword"] = "Password does not match.";
          } else {
            stateObj["confirmPassword"] = signUpData.confirmPassword
              ? ""
              : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Enter Confirm Password.";
          } else if (signUpData.password && value !== signUpData.password) {
            stateObj[name] = "Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };
  //handle login locally
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(() => true);
      const user = await SignUpJWTService({
        email: signUpData.email,
        password: signUpData.password,
        firstName: signUpData.firstName,
        lastName: signUpData.lastName,
      });

      setLoading(false);
      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ",
      });
      router.push({
        pathname: "/auth/signIn",
      });
    } catch (err: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Login error",
        text: err.message,
      });
    }
  };

  //handle login from thrid party google auth
  const GetAccesTokenGoogle = async () => {
    Swal.fire({
      title: "กำลังเข้าสู่ระบบ...",
      html: "รอสักครู่นะครับ...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    router.push(
      `${process.env.MAIN_SERVER_URL}/auth/google/redirect`,
      undefined,
      {
        shallow: true,
      }
    );
  };

  const GetAccesTokenFacebook = async () => {
    Swal.fire({
      title: "กำลังเข้าสู่ระบบ...",
      html: "รอสักครู่นะครับ...",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    router.push(
      `${process.env.MAIN_SERVER_URL}/auth/facebook/redirect`,
      undefined,
      {
        shallow: true,
      }
    );
  };

  const handleOnChangeCAPTCHA = () => {
    setAllowByCAPTCHA(() => true);
  };

  return (
    <HomepageLayout>
      <Head>
        <meta
          name="description"
          content="Login tatuga camp - เข้าสู่ระบบเว็บ tatuga camp"
        />
        <meta name="keywords" content="login, เข้าวสู่ระบบ" />

        <title>ลงทะเบียน - sign up </title>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
      </Head>
      <div
        className="font-sans h-full min-h-screen md:h-max w-full bg-[url('/svgs/background-Auth.svg')] bg-no-repeat bg-cover
     flex flex-col justify-center items-center"
      >
        <div
          className="w-11/12 p-2 md:p-0 md:w-96 my-20 pb-5  md:h-max md:pb-10 border-2 bg-white border-black flex flex-col justify-start items-center 
        md:border-solid broder-black relative rounded-xl bg-transparent md:bg-white  "
        >
          <div
            className=" w-28 h-16 border-t-0 rounded-br-3xl border-black  rounded-bl-3xl px-5 
           border-y-2 border-x-2 md:border-solid absolute right-0 left-0 mx-auto -top-[2px] "
          >
            <div className="w-full h-2 bg-white  absolute right-0 left-0 mx-auto -top-[2px]"></div>
            <div className="w-28  h-28 flex justify-center items-center absolute -top-14 right-0 left-0">
              <div className="w-20 h-20 animate-spin">
                <Hands />
              </div>
            </div>
          </div>
          <div className="mt-20">
            <span className="font-sans font-bold text-2xl  tracking-widest">
              Create Account
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className=" w-80 flex flex-col justify-center items-center"
          >
            <div className="flex flex-col  relative">
              <label className="font-sans font-normal">Email</label>
              <input
                required
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] focus:bg-[#FFC800] active:bg-[#FFC800]  pl-10 
                placeholder:italic ring-2 appearance-none ring-black placeholder:font-light"
                type="text"
                name="email"
                placeholder="type your email"
                value={signUpData.email}
                onChange={handleChangeSignUpdata}
                onBlur={validateInput}
              />
              {error.email && (
                <span className=" absolute right-0 text-xs top-1 text-red-400 font-light">
                  {error.email}
                </span>
              )}
              <div
                className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <FaUserCircle />
              </div>
            </div>

            <div className="flex flex-col relative">
              <label className="font-sans font-normal">First name</label>
              <input
                required
                className="w-60 h-7 ring-2 ring-black rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="text"
                name="firstName"
                placeholder="type your first"
                value={signUpData.firstName}
                onChange={handleChangeSignUpdata}
                onBlur={validateInput}
              />
              {error.firstName && (
                <span className=" absolute right-0 top-1 text-red-400 font-light text-xs ">
                  {error.firstName}
                </span>
              )}
            </div>

            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">Last name</label>
              <input
                required
                className="w-60 h-7 ring-2 ring-black rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="text"
                name="lastName"
                placeholder="type your last name"
                value={signUpData.lastName}
                onChange={handleChangeSignUpdata}
                onBlur={validateInput}
              />
              {error?.lastName && (
                <span className=" absolute right-0 top-1 text-red-400 font-light text-xs">
                  {error?.lastName}
                </span>
              )}
            </div>

            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">Password</label>
              <input
                required
                className="w-60 h-7 ring-2 ring-black rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="password"
                name="password"
                placeholder="type your password"
                value={signUpData.password}
                onChange={handleChangeSignUpdata}
                onBlur={validateInput}
              />
              {error.password && (
                <span className="absolute right-0 text-xs top-1 text-red-400 font-light">
                  {error.password}
                </span>
              )}
              <div
                className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <HiLockClosed />
              </div>
            </div>
            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">Confirm password</label>
              <input
                required
                className="w-60 h-7 ring-2 ring-black rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={signUpData.confirmPassword}
                onChange={handleChangeSignUpdata}
                onBlur={validateInput}
              />
              {error.confirmPassword && (
                <span className="absolute right-0  text-xs top-1 text-red-400 font-light">
                  {error.confirmPassword}
                </span>
              )}
              <div
                className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <HiLockClosed />
              </div>
            </div>
            <div className="mt-10">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY as string}
                onChange={handleOnChangeCAPTCHA}
              />
            </div>
            <div className="w-full text-right my-3">
              <Link href="/auth/signIn">
                <span
                  className="cursor-pointer text-sm  font-Kanit font-medium text-blue-700 
                 bg-white px-2 rounded-lg border-black broder-2 border-solid md:border-none"
                >
                  มีบัญชีแล้ว🤗
                </span>
              </Link>
            </div>
            {!error.confirmPassword &&
            !error.password &&
            !error.email &&
            allowByCAPTCHA ? (
              <button
                disabled={!allowByCAPTCHA}
                className="w-full border-none h-9 mt-2 font-Kanit rounded-full bg-[#2C7CD1] hover:text-black text-white font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                {loading === true ? <Loading /> : <span>ลงทะเบียน</span>}
              </button>
            ) : (
              <div
                className="w-full border-none h-9 mt-2 font-Kanit rounded-full bg-[#606060] text-white font-bold
            text-md cursor-pointer text-sm  focus:border-2  flex items-center justify-center active:border-none 
            focus:border-solid"
              >
                ลงทะเบียน
              </div>
            )}
          </form>
          <div className="w-80">
            {brower !== "scoial media browser" ? (
              <a
                onClick={GetAccesTokenGoogle}
                className="w-full no-underline  h-9 mt-2 rounded-full bg-white border-black text-black font-sans font-bold
              text-md cursor-pointer border-2 border-solid hover:scale-110 transition duration-200  ease-in-out
                active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid flex items-center justify-center gap-x-2"
              >
                <div className="flex items-center justify-center text-2xl">
                  <FcGoogle />
                </div>
                <span>continue with Google</span>
              </a>
            ) : (
              <a
                className="w-full no-underline  h-9 mt-2 rounded-full bg-gray-200 text-black font-sans font-bold
            text-md cursor-pointer border-2 border-solid hover:scale-110 transition duration-200  ease-in-out
              active:border-2 active:text-black active:border-gray-300
             active:border-solid  focus:border-2 
            focus:border-solid flex items-center justify-center gap-x-2"
              >
                <div className="flex items-center justify-center text-2xl">
                  <FcGoogle />
                </div>
                <span className="font-Kanit font-normal text-center text-sm text-black">
                  โปรดเปิดเบราว์เซอร์เพื่อ login ด้วย google
                </span>
              </a>
            )}

            <button
              onClick={GetAccesTokenFacebook}
              className="w-full  h-9 mt-2 rounded-full bg-white text-black font-sans font-bold cursor-pointer
              text-md cursor-pointer:border-2 border-solid hover:scale-110 transition duration-200  ease-in-out
               active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 border-2 
              focus:border-solid flex items-center justify-center gap-x-2"
            >
              <div className="flex items-center justify-center text-2xl text-[#3b5998] ">
                <BsFacebook />
              </div>
              <span>continue with Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </HomepageLayout>
  );
}

export default Index;
