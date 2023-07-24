import React, { useState } from "react";
import { FiXCircle } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Box, Pagination, Skeleton, TextField } from "@mui/material";
import CreateAccountForm from "./createAccountForm";
import SettingAccountForm from "./settingAccountForm";
import { GetAllTeachers } from "../../../service/school/teacher";
import { useQuery } from "react-query";
import Image from "next/image";

const loadingElements = [1, 2, 3, 4, 5];
function CreateAccount({ close, setTriggerAccountManagement, user }) {
  const [page, setPage] = useState(1);
  const [triggerCreateUser, setTriggerCreateUser] = useState(false);
  const [selectTeacher, setSelectTeacher] = useState();
  const teachers = useQuery(
    ["teachers", page],
    () => GetAllTeachers({ page: page }),
    { keepPreviousData: true }
  );

  return (
    <div
      className="z-30 
    top-0 right-0 left-0 bottom-0 m-auto fixed flex justify-center items-center"
    >
      <div
        className="flex w-screen h-screen flex-col justify-start items-center relative font-Kanit
       bg-white border-2 rounded-lg drop-shadow-xl p-5 "
      >
        <button
          onClick={() => {
            setTriggerAccountManagement(() => false);
            document.body.style.overflow = "auto";
          }}
          className="flex flex-col hover:text-red-400 transition duration-150
         text-black hover:scale-110 justify-center text-2xl items-center absolute top-10 right-8"
        >
          <FiXCircle />
          <span className="text-xs">ปิดหน้าต่าง</span>
        </button>
        <div className="flex flex-col w-11/12 gap-5 mt-2  h-5/6">
          <header className="flex justify-center">
            <button
              onClick={() => {
                setTriggerCreateUser(() => true);
              }}
              className="flex gap-3 hover:scale-110 transition duration-100 drop-shadow-md hover:bg-blue-400 group  w-max p-5 bg-white ring-blue-400 ring-2 rounded-xl py-3"
            >
              <div className="flex justify-center items-center text-lg group-hover:text-white">
                <AiOutlineUserAdd />
              </div>
              <span className="group-hover:text-white">สร้างบัญชี</span>
            </button>
          </header>
          <main className="flex w-full h-full justify-center gap-10">
            <div className="w-8/12  flex flex-col gap-2">
              <table
                className="w-full h-[33rem]  flex flex-col 
            justify-start items-center gap-5 overflow-y-auto  relative "
              >
                <thead className="w-full sticky top-0 z-20">
                  <tr
                    className="flex self-start	
                   justify-center px-5 py-10   gap-5 items-center w-full 
                    bg-white  drop-shadow-md     "
                  >
                    <td className="w-20 flex justify-center">รูป</td>
                    <td className="w-40 flex justify-center">อีเมล</td>
                    <td className="w-40 flex justify-center">ชื่อ - นามสกุล</td>
                    <td className="w-32 flex justify-center">โรงเรียน</td>

                    <td className="w-32 flex justify-center">สถานนะ</td>
                  </tr>
                </thead>
                <tbody className="flex w-full flex-col gap-5 ">
                  {teachers.isLoading ? (
                    <div className="flex flex-col gap-5 ">
                      {loadingElements.map((list, index) => {
                        return (
                          <div
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
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    teachers?.data?.users?.map((teacher) => {
                      const date = new Date(teacher.createAt);
                      const formattedDate = date.toLocaleDateString(
                        `${
                          user.language === "Thai"
                            ? "th-TH"
                            : user.language === "English" && "en-US"
                        }`,
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      );
                      return (
                        <tr
                          key={teacher.id}
                          onClick={() => {
                            setSelectTeacher(() => teacher);
                            setTriggerCreateUser(() => false);
                          }}
                          className="flex justify-center px-5 py-5 cursor-pointer  gap-5 i w-full rounded-md   hover:bg-slate-100 items-center"
                        >
                          <td className="w-20 flex justify-center">
                            <div className="w-16 h-16 bg-blue-300 text-white rounded-md relative flex justify-center items-center">
                              {teacher.picture ? (
                                <Image
                                  src={teacher.picture}
                                  layout="fill"
                                  className="object-cover"
                                />
                              ) : (
                                <span className="font-bold text-5xl uppercase">
                                  {teacher.firstName.charAt(0)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="w-40 flex justify-center">
                            {teacher.email}
                          </td>
                          <td className="w-40 flex justify-center">
                            {teacher.firstName} {teacher?.lastName}
                          </td>
                          <td className="w-32 flex justify-center">
                            {teacher?.school}
                          </td>

                          <td className="w-32 flex justify-center">
                            {teacher.isDisabled ? (
                              <div className="w-full bg-gray-400 text-white text-center p-2">
                                disable
                              </div>
                            ) : (
                              <div className="w-full bg-green-400 text-white text-center p-2">
                                active
                              </div>
                            )}
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
      <div
        onClick={() => {
          setTriggerAccountManagement(() => false);
          document.body.style.overflow = "auto";
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}
export default CreateAccount;
