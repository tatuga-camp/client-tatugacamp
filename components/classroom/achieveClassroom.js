import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  GetAllAchievedClassrooms,
  GetAllClassrooms,
  UnAchieveClassroom,
} from '../../service/classroom';
import { Pagination, Skeleton } from '@mui/material';
import Loading from '../loading/loading';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FcCancel } from 'react-icons/fc';
import { MdSchool } from 'react-icons/md';
import { TbSchoolOff } from 'react-icons/tb';
import Swal from 'sweetalert2';
import { GetAllActiveClassroomInTeacherService } from '../../service/teacher/classroom';

function AchieveClassroomComponent({ user }) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [classroomState, setClassroomState] = useState([]);

  const achievedClassrooms = useQuery(
    ['achieved-classrooms', page],
    () => GetAllAchievedClassrooms({ page: page }),
    { keepPreviousData: true },
  );
  const classrooms = useQuery(
    ['classrooms', page],
    () =>
      user?.schoolUser?.organization === 'school'
        ? GetAllActiveClassroomInTeacherService({ page: page })
        : GetAllClassrooms({ page: page }),
    { keepPreviousData: true },
  );
  useEffect(() => {
    setClassroomState(() => achievedClassrooms?.data?.classrooms);
  }, [achievedClassrooms.isFetching, page]);

  const handleOpenClasssDeleted = (index) => {
    const newItems = classroomState?.map((item, i) => {
      if (i === index) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
    setClassroomState(newItems);
  };

  //handle make sure to cancel deleting classroom
  const handleCloseClasssDeleted = (index) => {
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
  const handleAchieveClassroom = async ({ classroomId }) => {
    try {
      setLoading(() => true);
      await UnAchieveClassroom({ classroomId });
      Swal.fire('success', 'unachieve classroom successfully', 'success');
      achievedClassrooms.refetch();
      classrooms.refetch();
      setLoading(() => false);
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };
  return (
    <div className="flex  flex-col gap-10 justify-start items-center w-11/12 h-max">
      <main
        className={`w-full  mx-10 h-max grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8  gap-10
            ${classroomState?.[0] ? 'flex' : 'hidden'} `}
      >
        {achievedClassrooms.isLoading ? (
          <div className="  col-span-8 justify-center  flex flex-wrap gap-10">
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
                  border: `2px solid ${classroom.color}`,
                  outline: `4px solid ${classroom.color}`,
                  padding: '10px',
                }}
                key={index}
                className=" border-2   border-solid col-span-2 h-48
        rounded-3xl p-3 overflow-hidden relative ring-4 ring-black bg-white "
              >
                <div className="text-right w-full">
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="text-3xl absolute right-4 top-3">
                      {!classroom.selected && (
                        <div
                          onClick={() => handleOpenClasssDeleted(index)}
                          role="button"
                          className="text-gray-700 text-base   hover:text-red-500 
            cursor-pointer flex"
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
                            className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                          >
                            <FcCancel />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {classroom.selected && (
                  <div className="w-full h-full items-center flex justify-center gap-3">
                    <button
                      onClick={() =>
                        handleAchieveClassroom({
                          classroomId: classroom.id,
                        })
                      }
                      className="w-max px-2 h-20
                hover:bg-red-100 group hover:text-red-600 transition duration-150
                 text-4xl flex flex-col justify-center  items-center text-red-100
               bg-red-600 rounded-lg"
                    >
                      <TbSchoolOff />
                      <span className="text-xs group-hover:text-black transition duration-150 text-white font-normal">
                        {user.language === 'Thai'
                          ? 'ยกเลิกสำเร็จการศึกษา'
                          : 'Undo Achieve classroom'}
                      </span>
                    </button>
                  </div>
                )}
                <div className={`${classroom.selected ? 'hidden' : 'block'}`}>
                  <div className="flex w-full justify-start gap-2 md:gap-10  items-center">
                    <div className="flex flex-col w-3/4 md:w-40 ">
                      <span className="text-sm md:text-lg text-gray-600 font-light truncate">
                        {classroom.level}
                      </span>
                      <span className="font-bold truncate text-lg md:text-xl  text-[#EDBA02]">
                        {classroom.title}
                      </span>
                      <span className="text-sm md:text-base truncate">
                        {classroom.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-2 pt-4 pb-3  w-full lg:mt-5 ">
                    <div
                      className="w-3/4 mb-3 md:mb-0 md:relative text-center flex items-center justify-center
                         h-9  rounded-lg bg-gray-500 text-white font-sans font-bold
  text-md d"
                    >
                      <span className="text-sm font-light">
                        {user.language === 'Thai' &&
                          'ห้องเรียนถูกสำเร็จการศึกษาแล้ว'}
                        {user.language === 'English' && 'achived classroom'}
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
