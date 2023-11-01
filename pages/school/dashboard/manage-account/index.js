import React, { useState } from 'react';
import { FiXCircle } from 'react-icons/fi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Box, Pagination, Skeleton, TextField } from '@mui/material';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { GetUserCookie } from '../../../../service/user';
import { parseCookies } from 'nookies';
import {
  GetAllTeachers,
  GetAllTeachersNumber,
} from '../../../../service/school/teacher';
import CreateAccountForm from '../../../../components/form/school/createAccountForm';
import SettingAccountForm from '../../../../components/form/school/settingAccountForm';
import { useRouter } from 'next/router';
import Layout from '../../../../layouts/tatugaSchoolLayOut';
import {
  sideMenusEnglish,
  sideMenusThai,
} from '../../../../data/school/menubarsHomepage';
import Unauthorized from '../../../../components/error/unauthorized';
import SchoolOnly from '../../../../components/error/schoolOnly';
import { GetAllClassroomNumber } from '../../../../service/school/classroom';
import { BsPersonFillCheck, BsPersonFillX } from 'react-icons/bs';
import Head from 'next/head';

const loadingElements = [1, 2, 3, 4, 5];
function CreateAccount({ user, error }) {
  const [sideMenus, setSideMenus] = useState(() => {
    if (user?.language === 'Thai') {
      return sideMenusThai;
    } else if (user?.language === 'English') {
      return sideMenusEnglish;
    }
  });
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [triggerCreateUser, setTriggerCreateUser] = useState(false);
  const [selectTeacher, setSelectTeacher] = useState();
  const teachers = useQuery(
    ['teachers', page],
    () => GetAllTeachers({ page: page }),
    { keepPreviousData: true },
  );

  if (error?.statusCode === 401) {
    return <Unauthorized />;
  } else if (error?.statusCode === 403) {
    return <SchoolOnly user={user} />;
  }

  return (
    <Layout
      setTriggerCreateUser={setTriggerCreateUser}
      setSelectTeacher={setSelectTeacher}
      sideMenus={sideMenus}
      user={user}
      router={router}
    >
      <Head>
        <title>
          {user.school ? user.school : user.firstName} - จัดการบัญชี
        </title>
      </Head>
      <div
        className="flex  w-full h-screen flex-col justify-start items-center relative font-Kanit
        bg-stone-50
         "
      >
        <div className="flex flex-col w-11/12 gap-5 mt-2  h-5/6">
          <header className="flex justify-center">
            <button
              onClick={() => {
                setTriggerCreateUser(() => true);
              }}
              className="flex gap-3 hover:scale-110 transition duration-100
               drop-shadow-md hover:bg-blue-400 group  w-max p-10 bg-white ring-blue-400 ring-2 rounded-xl py-3"
            >
              <div className="flex justify-center items-center text-lg group-hover:text-white">
                <AiOutlineUserAdd />
              </div>
              <span className="group-hover:text-white">สร้างบัญชี</span>
            </button>
          </header>
          <main className="flex w-full h-full justify-center gap-10">
            <div
              className={`${
                triggerCreateUser || selectTeacher ? 'w-8/12' : 'w-11/12'
              } flex flex-col gap-2`}
            >
              <table
                className="w-full h-[33rem]  flex flex-col 
            justify-start items-center  overflow-y-auto overflow-x-auto  relative "
              >
                <thead className="w-full sticky top-0 z-20">
                  <tr
                    className="flex self-start	
                   justify-start px-5 py-5   gap-5 items-center w-full 
                    bg-white  drop-shadow-md"
                  >
                    <th className="w-20 flex justify-center">รูป</th>
                    <th className="w-60 flex justify-start">อีเมล</th>
                    <th className="w-60 flex justify-start">ชื่อ - นามสกุล</th>
                    <th className="w-60 flex justify-start">โรงเรียน</th>
                    <th className="w-32 flex justify-center">สถานนะ</th>
                    <th className="w-32 flex justify-center">สร้างเมื่อ</th>
                  </tr>
                </thead>
                <tbody className="flex w-full flex-col gap-5 bg-white ">
                  {teachers.isLoading ? (
                    <tr className="flex flex-col gap-5 ">
                      {loadingElements.map((list, index) => {
                        return (
                          <th
                            key={index}
                            className="flex justify-around gap-10 w-full"
                          >
                            <Skeleton
                              variant="rectangular"
                              width={150}
                              height={30}
                            />
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={30}
                            />
                            <Skeleton
                              variant="rectangular"
                              width={300}
                              height={30}
                            />
                          </th>
                        );
                      })}
                    </tr>
                  ) : (
                    teachers?.data?.users?.map((teacher) => {
                      const date = new Date(teacher.createAt);
                      const formattedDate = date.toLocaleDateString(
                        `${
                          user.language === 'Thai'
                            ? 'th-TH'
                            : user.language === 'English' && 'en-US'
                        }`,
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        },
                      );
                      return (
                        <tr
                          key={teacher.id}
                          onClick={() => {
                            setSelectTeacher(() => teacher);
                            setTriggerCreateUser(() => false);
                          }}
                          className="flex justify-start px-5 py-2 cursor-pointer 
                            gap-5 i w-full rounded-md  hover:bg-slate-100 items-center"
                        >
                          <td className="w-20 flex justify-center">
                            <div
                              className="w-12 h-12 bg-blue-300 text-white rounded-md 
                            relative flex justify-center items-center"
                            >
                              {teacher.picture ? (
                                <Image
                                  src={teacher.picture}
                                  className="object-cover"
                                  fill
                                  sizes="(max-width: 768px) 100vw"
                                />
                              ) : (
                                <span className="font-bold text-2xl uppercase">
                                  {teacher.firstName.charAt(0)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="w-60 flex justify-start truncate">
                            {teachers.isFetching ? (
                              <Skeleton
                                variant="rectangular"
                                width={300}
                                height={30}
                              />
                            ) : (
                              teacher.email
                            )}
                          </td>
                          <td className="w-60 text-sm  flex justify-start truncate">
                            {teachers.isFetching ? (
                              <Skeleton
                                variant="rectangular"
                                width={300}
                                height={30}
                              />
                            ) : (
                              <div className="truncate">
                                {teacher.firstName} {teacher?.lastName}
                              </div>
                            )}
                          </td>
                          <td className="w-60 flex justify-start truncate">
                            <div className="truncate">{teacher?.school}</div>
                          </td>

                          <td className="w-32 flex justify-center">
                            {teacher.isDisabled ? (
                              <div
                                className="w-full flex justify-center items-center rounded-3xl
                        bg-slate-200 text-slate-700 gap-2 text-center p-2"
                              >
                                <div className="flex justify-center items-center">
                                  <BsPersonFillX />
                                </div>
                                disable
                              </div>
                            ) : (
                              <div
                                className="w-full flex justify-center items-center rounded-3xl
                           bg-green-200 text-green-700 gap-2 text-center p-2"
                              >
                                <div className="flex justify-center items-center">
                                  <BsPersonFillCheck />
                                </div>
                                active
                              </div>
                            )}
                          </td>
                          <td className="w-32 flex justify-center">
                            {formattedDate}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
              <footer className="w-full mb-2 flex items-center justify-center">
                <Pagination
                  count={teachers?.data?.totalPages}
                  onChange={(e, page) => setPage(page)}
                />
              </footer>
            </div>

            {triggerCreateUser ? (
              <CreateAccountForm teachers={teachers} />
            ) : (
              selectTeacher && (
                <SettingAccountForm
                  teachers={teachers}
                  selectTeacher={selectTeacher}
                />
              )
            )}
          </main>
        </div>
        <form className=" w-80 flex flex-col justify-center items-center "></form>
      </div>
    </Layout>
  );
}
export default CreateAccount;
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

      if (user.role === 'TEACHER') {
        return {
          props: {
            error: {
              statusCode: 403,
              message: 'schoolUserOnly',
            },
          },
        };
      } else if (user.role === 'SCHOOL') {
        return {
          props: {
            user,
          },
        };
      }
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
      if (user.role !== 'SCHOOL') {
        return {
          props: {
            user,
            error: {
              statusCode: 403,
              message: 'schoolUserOnly',
            },
          },
        };
      } else if (user.role === 'SCHOOL') {
        return {
          props: {
            user,
          },
        };
      }
    } catch (err) {
      console.log(err);
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
