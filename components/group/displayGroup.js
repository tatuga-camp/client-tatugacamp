import React, { useState } from "react";
import Loading from "../loading/loading";
import Image from "next/image";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { DeleteGroup, RandomGroup } from "../../service/group";
import Swal from "sweetalert2";
import { Popover, Switch } from "@headlessui/react";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { useRouter } from "next/router";
import UpdateScore from "../form/updateScore";
import { AiOutlineSetting } from "react-icons/ai";
import { FaUserMinus } from "react-icons/fa";

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
  if (group.isLoading) {
    return (
      <div className="mt-5">
        <Loading />
      </div>
    );
  }

  const handleDeleteStudent = ({ studentId, miniGroupId }) => {
    console.log(studentId);
    console.log(miniGroupId);
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
        <div className="flex flex-col hidden justify-center items-center">
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
      <FullScreen
        handle={handle}
        className={`w-full h-full pb-40  flex gap-5 overflow-auto  relative flex-col ${
          handle.active ? "bg-blue-300" : "bg-transparent"
        } `}
      >
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
        <div
          className={`grid  py-5  mt-10 ${
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
                            {miniGroup.students.map((student) => {
                              return (
                                <li
                                  key={student.id}
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
                                  <span className="w-max h-5 bg-orange-400 text-center p-1 px-2 rounded-md text-white">
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
      hover:drop-shadow-md bg-sky-100  hover:ring-orange-400 relative  rounded-lg ring-orange-400"
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
                    {miniGroup.students.map((student) => {
                      return (
                        <li
                          key={student.id}
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
