import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../../components/layout';
import Hands from '../../../components/svg/Hands';
import { FaUserCircle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { HiLockClosed } from 'react-icons/hi';
import { BsFacebook } from 'react-icons/bs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { currentBrowser } from '../../../utils/platforms';
import Loading from '../../../components/loading/loading';
import Head from 'next/head';
import { ConfirmResetPassword, NewPassword } from '../../../service/auth';
import { parseCookies } from 'nookies';
import { GetUserCookie } from '../../../service/user';
import Unauthorized from '../../../components/error/unauthorized';

function Index({ user, error }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errorPassword, setErrorPassword] = useState({
    password: '',
    confirmPassword: '',
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setErrorPassword((prev) => {
      const stateObj = { ...prev, [name]: '' };

      switch (name) {
        case 'password':
          if (!value) {
            stateObj[name] = 'Please enter Password.';
          } else if (input.confirmPassword && value !== input.confirmPassword) {
            stateObj['confirmPassword'] = 'Password does not match.';
          } else {
            stateObj['confirmPassword'] = input.confirmPassword
              ? ''
              : errorPassword.confirmPassword;
          }
          break;

        case 'confirmPassword':
          if (!value) {
            stateObj[name] = 'Enter Confirm Password.';
          } else if (input.password && value !== input.password) {
            stateObj[name] = 'Password does not match.';
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  };
  //handle login locally
  const handleSubmit = async (e) => {
    try {
      setLoading(() => true);
      e.preventDefault();
      const res = await NewPassword({ password: input.password });
      Swal.fire('Password has change', res.data, 'success');
      setLoading(() => false);
      router.push({
        pathname: '/classroom/teacher',
      });
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message?.toString(),
        'error',
      );
    }
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <Layout>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Login tatuga camp - เข้าสู่ระบบเว็บ tatuga camp"
        />
        <meta name="keywords" content="login, เข้าวสู่ระบบ" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ตั้งค่ารหัสผ่านใหม่ - Reset password </title>
      </Head>
      <div
        className="font-sans h-screen w-full bg-[url('/background-Auth.svg')] bg-no-repeat bg-cover
     flex flex-col justify-center items-center"
      >
        <div
          className="w-11/12 py-5 md:w-96  md:h-max md:pb-20 border-2 border-black flex flex-col justify-start items-center 
        md:border-solid broder-black relative rounded-xl bg-transparent bg-white md:bg-white  "
        >
          <div
            className=" w-28 h-16 border-t-0 rounded-br-3xl border-black  rounded-bl-3xl px-5 
           border-y-2 border-x-2 md:border-solid absolute right-0 left-0 mx-auto -top-[2px] "
          >
            <div className="w-full h-2 bg-white  absolute right-0 left-0 mx-auto -top-[2px]"></div>
            <div className="w-28  h-28 absolute -top-16 right-0 left-0">
              <Hands />
            </div>
          </div>
          <div className="mt-20 w-10/12 text-center">
            <span className="font-sans font-bold text-xl ">
              {user.language === 'Thai'
                ? 'ยินดีต้อนรับ กรุณาตั้งรหัสผ่านใหม่'
                : user.language === 'English' && 'Welcome and reset password'}
            </span>
          </div>
          <div className="font-Kanit font-semibold text-blue-500">
            {user.email}
          </div>
          <div>
            {user.firstName} {user?.lastName}
          </div>
          <form
            onSubmit={handleSubmit}
            className=" w-80 flex flex-col justify-around gap-3 items-center"
          >
            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">New Password</label>
              <input
                required
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="password"
                name="password"
                placeholder="type your password"
                value={input.password}
                onChange={onInputChange}
                onBlur={validateInput}
              />
              {errorPassword.password && (
                <span className="absolute right-0 text-xs top-1 text-red-400 font-light">
                  {errorPassword.password}
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
                className="w-60 h-7 rounded-md border-none bg-[#FFC800] pl-10 
                placeholder:italic placeholder:font-light"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={input.confirmPassword}
                onChange={onInputChange}
                onBlur={validateInput}
              />
              {errorPassword.confirmPassword && (
                <span className="absolute right-0  text-xs top-1 text-red-400 font-light">
                  {errorPassword.confirmPassword}
                </span>
              )}
              <div
                className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
              >
                <HiLockClosed />
              </div>
            </div>

            {!errorPassword.confirmPassword &&
            !errorPassword.password &&
            !errorPassword.email ? (
              <button
                className="w-full border-none h-9 mt-2 font-Kanit rounded-full bg-[#2C7CD1] hover:text-black text-white font-bold
              text-md cursor-pointer hover:bg-[#FFC800] active:border-2 active:text-black active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                {loading === true ? <Loading /> : <span>enter</span>}
              </button>
            ) : (
              <div
                className="w-full border-none h-9 mt-2 font-Kanit rounded-full bg-[#606060] text-white font-bold
            text-md cursor-pointer text-sm  focus:border-2  flex items-center justify-center active:border-none 
            focus:border-solid"
              >
                enter
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Index;
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: 'unauthorized',
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: 'unauthorized',
          },
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: 'unauthorized',
          },
        },
      };
    }
  }
}
