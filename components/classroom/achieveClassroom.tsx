import React, { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Pagination, Skeleton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { TbSchoolOff } from "react-icons/tb";
import Swal from "sweetalert2";
import { Classroom, User } from "../../models";
import {
  GetAllAchievedClassroomsService,
  GetAllClassroomsServiceByPage,
  UnAchieveClassroomService,
} from "../../services/classroom";
import Loading from "../loadings/loading";

function AchieveClassroomComponent({ user }: { user: User }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [classroomState, setClassroomState] = useState<
    (Classroom & { selected?: boolean })[]
  >([]);

  const achievedClassrooms = useQuery({
    queryKey: ["achieved-classrooms", page],
    queryFn: () => GetAllAchievedClassroomsService({ page: page }),
    placeholderData: keepPreviousData,
  });

  const classrooms = useQuery({
    queryKey: ["classrooms", page],
    queryFn: () => GetAllClassroomsServiceByPage({ page: page }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (achievedClassrooms?.data?.classrooms) {
      setClassroomState(
        () => achievedClassrooms?.data?.classrooms as Classroom[],
      );
    }
  }, [achievedClassrooms.isFetching, page]);

  const handleOpenClasssDeleted = (index: number) => {
    const newItems = classroomState.map((item, i) => {
      if (i === index) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });

    setClassroomState(() => newItems);
  };

  //handle make sure to cancel deleting classroom
  const handleCloseClasssDeleted = (index: number) => {
    const newItems = classroomState?.map((item, i) => {
      if (i === index) {
        return { ...item, selected: false };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  //handle achieve classroom
  const handleAchieveClassroom = async ({
    classroomId,
  }: {
    classroomId: string;
  }) => {
    try {
      setLoading(() => true);
      await UnAchieveClassroomService({ classroomId });
      Swal.fire("success", "unachieve classroom successfully", "success");
      achievedClassrooms.refetch();
      await classrooms.refetch();
      setLoading(() => false);
    } catch (err: any) {
      setLoading(() => false);
      console.error(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error",
      );
    }
  };
  return (
    <div className="flex  h-max w-11/12  flex-col items-center justify-start gap-10">
      <main
        className={`mx-10  grid h-max w-full grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-6  2xl:grid-cols-8
            ${classroomState?.[0] ? "flex" : "hidden"} `}
      >
        {achievedClassrooms.isLoading ? (
          <div className="  col-span-8 flex  flex-wrap justify-center gap-10">
            <Skeleton variant="rectangular" width={320} height={210} />
            <Skeleton variant="rectangular" width={320} height={210} />
            <Skeleton variant="rectangular" width={320} height={210} />
            <Skeleton variant="rectangular" width={320} height={210} />
          </div>
        ) : (
          classroomState?.map((classroom, index) => {
            return (
              <div
                style={{
                  border: `5px solid ${classroom.color}`,
                  padding: "10px",
                }}
                key={index}
                className={`    relative col-span-2 h-max min-h-[12rem]
        overflow-hidden rounded-3xl  border-solid bg-white  p-3 `}
              >
                <div className="w-full text-right">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="absolute right-4 top-3 text-3xl">
                      {!classroom.selected && (
                        <div
                          onClick={() => handleOpenClasssDeleted(index)}
                          role="button"
                          className="flex cursor-pointer   text-base 
            text-gray-700 hover:text-red-500"
                        >
                          <BsThreeDotsVertical />
                        </div>
                      )}
                      {classroom.selected && (
                        <div className="flex gap-x-4">
                          <div
                            role="button"
                            onClick={() => {
                              handleCloseClasssDeleted(index);
                            }}
                            className="cursor-pointer  transition duration-150 ease-in-out hover:scale-110 "
                          >
                            <FcCancel />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {classroom.selected && (
                  <div className="flex h-full w-full items-center justify-center gap-3">
                    <button
                      onClick={() =>
                        handleAchieveClassroom({
                          classroomId: classroom.id,
                        })
                      }
                      className="group flex h-20
                w-max flex-col items-center justify-center rounded-lg
                 bg-red-600 px-2 text-4xl text-red-100  transition duration-150
               hover:bg-red-100 hover:text-red-600"
                    >
                      <TbSchoolOff />
                      <span className="text-xs font-normal text-white transition duration-150 group-hover:text-black">
                        {user.language === "Thai"
                          ? "ยกเลิกสำเร็จการศึกษา"
                          : "Undo Achieve classroom"}
                      </span>
                    </button>
                  </div>
                )}
                <div className={`${classroom.selected ? "hidden" : "block"}`}>
                  <div className="flex w-full items-center justify-start gap-2  md:gap-10">
                    <div className="flex w-3/4 flex-col md:w-40 ">
                      <span className="truncate text-sm font-light text-gray-600 md:text-lg">
                        {classroom.level}
                      </span>
                      <span className="truncate text-lg font-bold text-[#EDBA02]  md:text-xl">
                        {classroom.title}
                      </span>
                      <span className="truncate text-sm md:text-base">
                        {classroom.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 pb-3  pt-4 lg:mt-5 ">
                    <div
                      className="text-md d mb-3 flex h-9 w-3/4 items-center justify-center
                         rounded-lg  bg-gray-500 text-center font-sans font-bold text-white
  md:relative md:mb-0"
                    >
                      <span className="text-sm font-light">
                        {user.language === "Thai" &&
                          "ห้องเรียนถูกสำเร็จการศึกษาแล้ว"}
                        {user.language === "English" && "achived classroom"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
      <Pagination
        count={achievedClassrooms?.data?.totalPages}
        onChange={(e, page) => setPage(page)}
      />
    </div>
  );
}

export default AchieveClassroomComponent;
