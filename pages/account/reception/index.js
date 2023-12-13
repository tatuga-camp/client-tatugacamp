import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import { parseCookies } from 'nookies';
import { GetUserCookie, UpdateUserData } from '../../../service/user';
import Image from 'next/image';
import { HiLanguage } from 'react-icons/hi2';
import { Autocomplete, TextField } from '@mui/material';
import { FiSave } from 'react-icons/fi';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import Unauthorized from '../../../components/error/unauthorized';

const options = ['Thai', 'English'];

function Index({ user, error }) {
  const [languageValue, setLanguageValue] = useState(options[0]);
  const router = useRouter();
  const [inputLanguageValue, setInputLanguageValue] = useState('');
  const [activeRole, setActiveRole] = useState(0);
  const [userData, setUserData] = useState({
    firstName: user.firstName,
    lastName: user?.lastName,
    language: options[0],
  });

  const handleSaveUser = async () => {
    try {
      const userUpdate = await UpdateUserData(userData);
      if (userUpdate.status === 200) {
        Swal.fire('success', 'Successfully Updated Your Profile', 'success');
      }
      if (userUpdate.data.role === 'TEACHER') {
        router.push({
          pathname: '/classroom/teacher',
        });
      } else if (userUpdate.data.role === 'SCHOOL') {
        router.push({
          pathname: '/school',
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };

  return (
    <div className="h-screen  bg-gradient-to-t from-blue-100 to-white">
      <Navbar />
      <div className="w-full flex justify-start items-center flex-col  font-Kanit">
        <header className="bg-white w-max h-max mt-40 md:mt-10 max-w-xs md:max-w-5xl drop-shadow-md p-3 px-10 ring-black rounded-lg ring-2">
          <h1 className="font-medium text-center flex flex-col md:flex-row justify-center gap-5 items-center ">
            {userData.language === 'Thai'
              ? 'ยินดีต้อนรับ '
              : userData.language === 'English' && 'welcome'}{' '}
            <div className="flex flex-col justify-center items-center">
              <section className="flex gap-2 uppercase text-blue-600">
                <span>{user.firstName}</span>
                <span>{user?.lastName}</span>
              </section>
              <span className="text-base text-orange-500">{user.email}</span>
            </div>
            {user.picture ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden relative">
                <Image
                  src={user?.picture}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              </div>
            ) : (
              <div
                className="w-16 h-16 rounded-xl font-semibold text-3xl flex 
              justify-center items-center overflow-hidden uppercase text-white bg-blue-500 relative"
              >
                {user?.firstName.charAt(0)}
              </div>
            )}
          </h1>
        </header>
        <main className="flex flex-col justify-start gap-5 mt-10 items-center">
          <div className="w-full h-[1px] bg-black mt-10"></div>
          <div className="mt-5 w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center md:items-center  pb-10">
              <div className="flex h-max  items-center justify-start gap-2">
                <span className="md:text-xl text-md font-semibold">
                  Language setting
                </span>
                <div className="flex text-xl items-center justify-center text-center h-5 w-5 bg-[#EDBA02] p-1 rounded-full text-white">
                  <HiLanguage />
                </div>
              </div>
              <Autocomplete
                className="mt-10  "
                value={languageValue}
                onChange={(event, newValue) => {
                  setUserData((prev) => {
                    return {
                      ...prev,
                      language: newValue,
                    };
                  });
                  setLanguageValue(newValue);
                }}
                inputValue={inputLanguageValue}
                onInputChange={(event, newInputValue) => {
                  setInputLanguageValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={options}
                sx={{ width: 250 }}
                renderInput={(params) => (
                  <TextField {...params} label="language" />
                )}
              />
            </div>
          </div>
          <button
            onClick={handleSaveUser}
            className="w-max p-2 hover:scale-110 transition duration-150 flex items-center gap-1 text-lg bg-green-400 uppercase text-white ring-black rounded-lg ring-2"
          >
            SAVE
            <div className="flex justify-center items-center">
              <FiSave />
            </div>
          </button>
        </main>
      </div>
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/signIn',
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
        redirect: {
          permanent: false,
          destination: '/auth/signIn',
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
        redirect: {
          permanent: false,
          destination: '/auth/signIn',
        },
      };
    }
  }
}
