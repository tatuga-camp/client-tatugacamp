import React, { useEffect, useState } from "react";
import Loading from "../loading/loading";
import Image from "next/image";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import {
  AddStudentToGroupApi,
  DeleteGroup,
  GetUnGroupStudent,
  RandomGroup,
  RemoveStudent,
} from "../../service/group";
import Swal from "sweetalert2";
import { Popover, Switch } from "@headlessui/react";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { useRouter } from "next/router";
import UpdateScore from "../form/updateScore";
import { AiOutlineSetting } from "react-icons/ai";
import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";

function DisplayGroup({
  user,
  group,
  scores,
  students,
  groups,
  setClassroomGroupActive,
  groupId,
}) {
  const router = useRouter();
  const handle = useFullScreenHandle();
  const [isSetting, setIsSetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAddGroup, setIsAddGroup] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [studentToAdd, setStudentToAdd] = useState({
    id: "",
    firstName: "",
    lastName: "",
    number: "",
    picture: "",
  });
  const [unGroupStudents, setUnGroupStudents] = useState();
  useEffect(() => {
    if (isSetting === true) {
      async function FetchGetUnGroupStudent() {
        const unGroupStudents = await GetUnGroupStudent({
          groupId: group?.data.group.id,
          classroomId: router.query.classroomId,
        });
        setUnGroupStudents(() => unGroupStudents);
      }
      FetchGetUnGroupStudent();
    }
  }, [isSetting]);

  if (group.isLoading) {
    return (
      <div className="mt-5">
        <Loading />
      </div>
    );
  }

  const handleDeleteStudent = async ({ studentId, miniGroupId }) => {
    try {
      setLoadingDelete(() => true);
      const studentRemove = await RemoveStudent({
        groupId: group?.data.group.id,
        studentId,
        miniGroupId,
      });
      await group?.refetch();
      const unGroupStudents = await GetUnGroupStudent({
        groupId: group?.data.group.id,
        classroomId: router.query.classroomId,
      });
      setUnGroupStudents(() => unGroupStudents);
      setLoadingDelete(() => false);
      Swal.fire("Deleted!", "", "success");
    } catch (err) {
      setLoadingDelete(() => false);
      console.log(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message?.toString(),
        "error"
      );
    }
  };

  const handleDeleteGroup = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const deleteGroup = await DeleteGroup({
            groupId: group?.data.group.id,
          });
          groups.refetch();
          setClassroomGroupActive(() => "default");
          groupId.current = "";
          Swal.fire("Deleted!", deleteGroup?.data, "success");
        }
      });
    } catch (err) {
      Swal.fire({
        title: "error",
        icon: "error",
      });
      console.log(err);
    }
  };

  const handleAddStudentToGroup = ({ student }) => {
    setIsAddGroup(() => true);
    setStudentToAdd(() => {
      return {
        firstName: student.firstName,
        lastName: student?.lastName,
        number: student.number,
        picture: student.picture,
        id: student.id,
      };
    });
  };
  const handleConfirmAddStudentToGroup = async ({ miniGroupId }) => {
    try {
      setLoading(() => true);
      await AddStudentToGroupApi({
        studentId: studentToAdd.id,
        groupId: group?.data.group.id,
        miniGroupId: miniGroupId,
      });
      await group.refetch();
      setIsAddGroup(() => false);
      setStudentToAdd(() => null);
      const unGroupStudents = await GetUnGroupStudent({
        groupId: group?.data.group.id,
        classroomId: router.query.classroomId,
      });
      setUnGroupStudents(() => unGroupStudents);
      setLoading(() => false);
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      setIsAddGroup(() => false);
      setStudentToAdd(() => null);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message?.toString(),
        "error"
      );
    }
  };

  const handleCancelAddGroup = () => {
    setIsAddGroup(() => false);
    setStudentToAdd(() => null);
  };

  async function handleRandomGroup() {
    try {
      setLoading(() => true);
      await RandomGroup({
        classroomId: router.query.classroomId,
        groupId: group?.data.group.id,
      });
      await group.refetch();
      setLoading(() => false);
    } catch (err) {
      setLoading(() => false);
      Swal.fire({
        title: "error",
        icon: "error",
      });
      console.log(err);
    }
  }
  return (
    <div className=" mt-10 font-Kanit w-full   ">
      <div className="w-full flex justify-end gap-5  ">
        <button
          onClick={handleDeleteGroup}
          className="flex justify-center items-center hover:text-red-500 text-3xl "
        >
          <MdDelete />
          <span className="text-base">
            {user.language === "Thai"
              ? "ลบกลุ่ม"
              : user.language === "English" && "delete group"}
          </span>
        </button>
        {loading ? (
          <Loading />
        ) : (
          <button
            onClick={handleRandomGroup}
            className="flex justify-center items-center  hover:text-sky-500 text-3xl "
          >
            <GiPerspectiveDiceSixFacesRandom />
            <span className="text-base">
              {user.language === "Thai"
                ? "สุ่มนักเรียนใหม่"
                : user.language === "English" && "shuffle students"}
            </span>
          </button>
        )}
        <div className="flex flex-col  justify-center items-center">
          <Switch
            checked={isSetting}
            onChange={setIsSetting}
            className={`${isSetting ? "bg-blue-400" : "bg-teal-700"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span
              aria-hidden="true"
              className={`${isSetting ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          {isSetting ? (
            <span className="text-base">
              {user.language === "Thai"
                ? "ปิดตั้งค่าจัดกลุ่ม"
                : user.language === "English" && "Close setting"}
            </span>
          ) : (
            <span className="text-base">
              {user.language === "Thai"
                ? "เปิดตั้งค่าจัดกลุ่ม"
                : user.language === "English" && "Open setting"}
            </span>
          )}
        </div>
      </div>
      {unGroupStudents && isSetting && !isAddGroup && (
        <div className="w-full justify-center flex my-5">
          <div className="w-10/12 p-5 ring-2 gap-x-8 gap-y-3 bg-white rounded-md grid md:grid-cols-2 lg:grid-cols-3">
            {unGroupStudents?.map((student) => {
              return (
                <div
                  className="flex hover:bg-blue-100 px-2 justify-between gap-2 just truncate"
                  key={student.id}
                >
                  <div className="flex gap-3">
                    <span>
                      {user.language === "Thai"
                        ? "เลขที่"
                        : user.language === "English" && "number"}
                      {` `}
                      {student.number}
                    </span>
                    <span className="truncate">{student.firstName}</span>
                    <span className="truncate">{student.lastName}</span>
                  </div>
                  <button
                    onClick={() =>
                      handleAddStudentToGroup({ student: student })
                    }
                    className="w-7 h-7 hover:bg-orange-600  transition duration-150 bg-orange-400 text-white
                   rounded-lg flex items-center justify-center p-1"
                  >
                    <FaUserPlus />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isAddGroup && (
        <div className="w-full flex justify-center flex-col items-center">
          <button
            onClick={handleCancelAddGroup}
            className="w-20 h-20 text-4xl flex flex-col justify-center items-center  text-red-400 hover:scale-110 transition duration-150"
          >
            {loading ? <Loading /> : <FcCancel />}

            <span className="text-lg">ยกเลิก</span>
          </button>
          <div className="flex gap-2 bg-blue-200 text-black ring-2 ring-orange-400 rounded-lg p-2">
            <div className="flex gap-1">
              <span>
                {user.language === "Thai"
                  ? "เลขที่"
                  : user.language === "English" && "number"}
              </span>
              <span>{studentToAdd.number}</span>
            </div>
            <div className="flex gap-2">
              <span>{studentToAdd.firstName}</span>
              <span>{studentToAdd?.lastName}</span>
            </div>
          </div>
        </div>
      )}
      <FullScreen
        handle={handle}
        className={`w-full h-full pb-40  flex gap-5 overflow-auto  relative flex-col ${
          handle.active ? "bg-blue-300" : "bg-transparent"
        } `}
      >
        {!isSetting && (
          <div className="w-full  mt-2 flex justify-center items-center">
            {!handle.active && (
              <button
                className="w-max h-max flex group flex-col gap-y-1 items-center justify-center p-0 bg-transparent border-0 
                cursor-pointer text-black"
                onClick={handle.enter}
              >
                <div className="group-hover:scale-125 transition duration-200 ease-in-out ">
                  <BsFullscreen size={20} />
                </div>

                <span className="text-sm">full screen</span>
              </button>
            )}
            {handle.active && (
              <button
                className="w-max h-max flex group flex-col  gap-y-1 items-center justify-center p-0 bg-transparent border-0 cursor-pointer text-white"
                onClick={handle.exit}
              >
                <div className="group-hover:scale-75 transition duration-200 ease-in-out ">
                  <BsFullscreenExit size={25} />
                </div>
                <span>exit full screen</span>
              </button>
            )}
          </div>
        )}
        <div
          className={`grid  py-5  mt-5 ${
            handle.active
              ? group?.data?.miniGroups.length > 2
                ? "md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "grid-cols-2 gap-5"
              : group?.data?.miniGroups.length > 2
              ? "md:grid-cols-2 lg:grid-cols-3 gap-10"
              : "grid-cols-2 gap-5"
          } place-items-center  items-start  `}
        >
          {group?.data?.miniGroups?.map((miniGroup, index) => {
            if (isSetting === false) {
              return (
                <Popover key={index}>
                  {({ open }) => (
                    <>
                      <Popover.Button>
                        <div
                          className={` ${
                            group?.data?.miniGroups.length > 2
                              ? "md:w-80 lg:w-80 "
                              : "w-max max-w-3xl"
                          }   h-max p-2 ring-2 flex justify-start
                 bg-white flex-col  items-center hover:scale-110 transition duration-150
                  hover:drop-shadow-md cursor-pointer hover:ring-orange-400 relative  rounded-lg ring-orange-400"
              `}
                        >
                          <div className="flex gap-2 mb-5">
                            <div className="w-max px-2 rounded-md  text-white text-2xl font-Poppins font-semibold bg-blue-500">
                              {miniGroup.data.points}
                            </div>

                            <div className="font-Kanit text-lg font-semibold text-black">
                              {miniGroup.data.title}
                            </div>
                          </div>

                          <ul
                            className={`w-full pl-0 h-max grid gap-2 ${
                              group?.data?.miniGroups.length > 2
                                ? " grid-cols-1"
                                : "grid-cols-1"
                            }`}
                          >
                            {miniGroup.students.map((student, index) => {
                              return (
                                <li
                                  key={index}
                                  className="flex gap-2 justify-between   font-Kanit text-base"
                                >
                                  <span>
                                    {user.language === "Thai"
                                      ? "เลขที่"
                                      : user.language === "English" &&
                                        "number"}{" "}
                                    {student.number}
                                  </span>
                                  <div className="flex gap-2">
                                    <span>{student.firstName}</span>
                                    <span>{student?.lastName}</span>
                                  </div>
                                  <span className="w-max h-5 flex items-center justify-center bg-orange-400 text-center p-1 px-2 rounded-md text-white">
                                    {student?.score?.totalPoints}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </Popover.Button>
                      <Popover.Panel>
                        {({ close }) => (
                          <UpdateScore
                            close={close}
                            language={user.language}
                            scores={scores.data}
                            groupScore={true}
                            groupId={group?.data.group.id}
                            miniGroupId={miniGroup.data.id}
                            classroomScore={true}
                            group={group}
                            students={students}
                          />
                        )}
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              );
            } else if (isSetting === true) {
              return (
                <div
                  key={index}
                  className={` ${
                    group?.data?.miniGroups.length > 2
                      ? "md:w-80 lg:w-80 "
                      : "w-max max-w-3xl"
                  }   h-max p-2 ring-2 flex justify-start
    flex-col  items-center transition duration-150  
      hover:drop-shadow-md bg-sky-100  hover:ring-orange-400 relative overflow-hidden   rounded-lg ring-orange-400"
  `}
                >
                  {isAddGroup && (
                    <button
                      onClick={() =>
                        handleConfirmAddStudentToGroup({
                          miniGroupId: miniGroup.data.id,
                        })
                      }
                      className="absolute w-full h-full top-0 bg-white/90 "
                    >
                      {loading ? (
                        <Loading />
                      ) : user.language === "Thai" ? (
                        "คลิกเพื่อเลือกกลุ่ม"
                      ) : (
                        user.language === "English" &&
                        "Click here to add student"
                      )}
                    </button>
                  )}
                  <div className="flex gap-2 mb-5">
                    <div className="w-max px-2 rounded-md  text-white text-2xl font-Poppins font-semibold bg-blue-500">
                      {miniGroup.data.points}
                    </div>

                    <div className="font-Kanit text-lg font-semibold text-black">
                      {miniGroup.data.title}
                    </div>
                  </div>

                  <ul
                    className={`w-full pl-0 h-max grid gap-2 ${
                      group?.data?.miniGroups.length > 2
                        ? " grid-cols-1"
                        : "grid-cols-1"
                    }`}
                  >
                    {miniGroup.students.map((student, index) => {
                      return (
                        <li
                          key={index}
                          className="flex gap-2 justify-between   font-Kanit text-base"
                        >
                          <span>
                            {user.language === "Thai"
                              ? "เลขที่"
                              : user.language === "English" && "number"}{" "}
                            {student.number}
                          </span>
                          <div className="flex gap-2">
                            <span>{student.firstName}</span>
                            <span>{student?.lastName}</span>
                          </div>
                          {loadingDelete ? (
                            <Loading />
                          ) : (
                            <button
                              onClick={() =>
                                handleDeleteStudent({
                                  studentId: student.id,
                                  miniGroupId: miniGroup.data.id,
                                })
                              }
                              className="w-max h-max p hover:bg-red-500 cursor-pointer bg-gray-400 text-center p-1 flex items-center justify-center
                             rounded-md text-white"
                            >
                              <FaUserMinus />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }
          })}
        </div>
      </FullScreen>
    </div>
  );
}

export default DisplayGroup;
