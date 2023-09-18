import React, { useEffect, useState } from 'react';
import { MdOutlineAssignmentReturn } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { GetAllClassrooms } from '../../service/classroom';
import { Pagination } from '@mui/material';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Loading from '../loading/loading';
import { CreateAssignmentToAnotherClassroom } from '../../service/assignment';

function AssignMultipleClassroom({ user, setTriggerAssignMultipleClassroom }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [classroomState, setClassroomState] = useState();
  const classrooms = useQuery(['classrooms'], () =>
    GetAllClassrooms({ page: page, getAll: true }),
  );

  useEffect(() => {
    if (router.isReady) {
      const filteredArray = classrooms?.data?.filter(
        (classroom) => classroom.id !== router.query.classroomId,
      );
      setClassroomState(() =>
        filteredArray?.map((classroom) => {
          return {
            ...classroom,
            isSelect: false,
          };
        }),
      );
    }
  }, [classrooms.isFetching, router.isReady]);

  const handleChangeCheckbox = ({ classroomId }) => {
    setClassroomState((prev) =>
      prev.map((classroom) => {
        if (classroomId === classroom.id) {
          return {
            ...classroom,
            isSelect: !classroom.isSelect,
          };
        } else {
          return {
            ...classroom,
          };
        }
      }),
    );
  };
  const handleClickToAssign = async () => {
    try {
      setLoading(() => true);
      const classroomOnlySelectd = classroomState.filter(
        (classroom) => classroom.isSelect === true,
      );
      const classrooms = classroomOnlySelectd.map((classroom) => {
        return { classroomId: classroom.id };
      });
      await CreateAssignmentToAnotherClassroom({
        classrooms,
        assignmentId: router.query.assignmentId,
      });

      Swal.fire(
        'success',
        'assign to another classroom successfully',
        'success',
      );
      setLoading(() => false);
      setTriggerAssignMultipleClassroom(() => false);
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire('error', err?.response?.data?.message.toString(), 'error');
    }
  };

  return (
    <div className="font-Kanit flex flex-col justify-start items-center">
      <header className="w-full flex flex-col gap-2 justify-center items-center">
        <div className="flex justify-center items-center p-3 bg-blue-600 text-white lg:text-lg xl:text-3xl rounded-full">
          <MdOutlineAssignmentReturn />
        </div>
        <h3 className="text-blue-600 font-semibold lg:text-xl xl:text-3xl">
          {user.language === 'Thai'
            ? 'มอบหมายงานหลายห้อง'
            : 'assign to another classroom'}
        </h3>
        <span className="w-7/12 xl:text-base lg:text-sm text-center">
          {user.language === 'Thai'
            ? 'เมื่อคุณครูกดสร้างชื้นงานให้ห้องอื่นๆ แล้ว จำเป็นต้องเข้าไปในห้องเรียนนั้นๆ เพื่อทำการเลือกว่างานชัิ้นนี้ จะมอบหมายให้แก่นักเรียนคนไหนบ้าง โดยกดเข้าไปที่ปุ่มตั้งค่า ด้านขวาล่างของหน้าชิ้นงาน'
            : 'after summiting assign work to another classroom, you must assign this work to the students in each classroom as well by clicking the setting button on the bottom right of the assignment screen '}
        </span>
      </header>
      <main className="pb-40 w-full lg:w-10/12 flex-col items-center gap-3 flex justify-center">
        <table className="md:w-10/12 lg:w-full">
          <thead className=" bg-orange-600 sticky top-0 drop-shadow-md text-white font-semibold ">
            <tr className="">
              <td className="w-60 py-4 pl-4">ชื่อห้อง</td>
              <td className="w-40">ระดับ</td>
              <td className="w-60">คำอธิบาย</td>
              <td className="w-40">เลือก</td>
            </tr>
          </thead>
          <tbody className="">
            {classroomState?.map((classroom) => {
              return (
                <tr key={classroom?.id} className="border-b border-black">
                  <td className="w-60 py-4 pl-4">{classroom?.title}</td>
                  <td className="w-40">{classroom?.level}</td>
                  <td className="w-60">{classroom?.description}</td>
                  <td className="w-40">
                    <input
                      checked={classroom?.isSelect}
                      onChange={() =>
                        handleChangeCheckbox({ classroomId: classroom?.id })
                      }
                      type="checkbox"
                      className="w-6 h-6 ring-2  text-blue-600 bg-gray-100 border-gray-300 rounded
                     focus:ring-blue-500 dark:focus:ring-blue-600
                     dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <footer className="flex flex-col justify-center items-center gap-2">
          {loading ? (
            <Loading />
          ) : (
            <button
              onClick={handleClickToAssign}
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:scale-110 transition duration-100 
        drop-shadow-md hover:bg-blue-700 active:ring-2 ring-blue-200"
            >
              {user.language === 'Thai' ? 'มอบหมาย' : 'assign'}
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}

export default AssignMultipleClassroom;
