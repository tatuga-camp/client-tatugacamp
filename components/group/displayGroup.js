import React from "react";
import Loading from "../loading/loading";
import Image from "next/image";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { DeleteGroup } from "../../service/group";
import Swal from "sweetalert2";
import { Popover } from "@headlessui/react";
import UpdateScore from "../form/updateScore";

function DisplayGroup({
  user,
  group,
  scores,
  students,
  groups,
  setClassroomGroupActive,
  groupId,
}) {
  const handle = useFullScreenHandle();
  if (group.isLoading || group.isFetching) {
    return (
      <div className="mt-5">
        <Loading />
      </div>
    );
  }

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

  return (
    <div className=" mt-10 font-Kanit w-full   ">
      <div className="w-full flex justify-end ">
        <button
          onClick={handleDeleteGroup}
          className="flex justify-center items-center hover:text-red-500 text-3xl "
        >
          <MdDelete />
        </button>
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
          })}
        </div>
      </FullScreen>
    </div>
  );
}

export default DisplayGroup;
