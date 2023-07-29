import React, { useEffect, useState } from 'react';
import { Pagination, Skeleton } from '@mui/material';
import { useQuery } from 'react-query';
import { GetAllAttendanceTeacher } from '../../../../service/school/attendance';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { BsExclamationCircleFill } from 'react-icons/bs';
import Image from 'next/image';
import { AiFillPhone } from 'react-icons/ai';
import { FaSchool } from 'react-icons/fa';
import { GetAllClassroomInTeacher } from '../../../../service/school/classroom';
import { SiGoogleclassroom } from 'react-icons/si';
import { useRouter } from 'next/router';
ChartJS.register(ArcElement, Tooltip, Legend);

function ShowTeacherOverviewInfo({ setTriggerShowTeacherInfo, selectTeacher }) {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [attendacneData, setAttendanceData] = useState();
  const classrooms = useQuery(
    ['classrooms-teacher', page],
    () => GetAllClassroomInTeacher({ page: page, teacherId: selectTeacher.id }),
    { keepPreviousData: true },
  );
  const attendances = useQuery(
    ['attendances-teacher'],
    () => GetAllAttendanceTeacher({ teacherId: selectTeacher.id }),
    {
      enabled: false,
    },
  );
  useEffect(() => {
    classrooms.refetch();
    attendances.refetch();
  }, []);
  useEffect(() => {
    if (attendances.data) {
      setAttendanceData(() => {
        return {
          labels: ['ขาดเรียน', 'มาเรียน', 'สาย', 'ลา', 'ป่วย'],
          datasets: [
            {
              label: 'จำนวน',
              data: [
                attendances.data.absent,
                attendances.data.present,
                attendances.data.late,
                attendances.data.holiday,
                attendances.data.sick,
              ],
              backgroundColor: [
                'rgba(255,0,0,0.8)',
                'rgba(0,128,0,0.5)',
                'rgb(255, 165, 0)',
                'rgb(255,255,0)',
                'rgb(0,0,255)',
              ],
              borderColor: [
                'rgba(255,0,0,0.8)',
                'rgba(0,128,0,0.5)',
                'rgb(255, 165, 0)',
                'rgb(255,255,0)',
                'rgb(0,0,255)',
              ],
              borderWidth: 1,
            },
          ],
        };
      });
    }
  }, [attendances.data]);
  return (
    <div
      className="z-30 
top-0 right-0 left-0 bottom-0 m-auto fixed gap-5 flex justify-center items-center"
    >
      <div
        className="w-7/12  gap-8 max-w-5xl h-max py-5 font-Kanit flex  justify-around bg-white rounded-lg
   drop-shadow-xl p-5 "
      >
        <div className="flex flex-col  justify-center items-center font-Kanit">
          <div
            className="w-20 h-20 bg-blue-300 mb-1 text-white rounded-md 
                            relative flex justify-center items-center overflow-hidden"
          >
            {selectTeacher.picture ? (
              <Image
                src={selectTeacher.picture}
                layout="fill"
                sizes="(max-width: 768px) 100vw"
                className="object-cover"
              />
            ) : (
              <span className="font-bold text-2xl uppercase">
                {selectTeacher.firstName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex gap-2 font-bold text-lg">
            <span>{selectTeacher.firstName}</span>
            <span>{selectTeacher.firstName}</span>
          </div>
          <div className="flex gap-2 text-slate-400">
            <span>{selectTeacher.email}</span>
          </div>
          <div className="flex gap-3 items-center mt-5">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 text-lg bg-blue-200 text-blue-600 rounded-full flex items-center justify-center">
                <AiFillPhone />
              </div>
              {selectTeacher.phone}
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 text-lg bg-blue-200 text-blue-600 rounded-full flex items-center justify-center">
                <FaSchool />
              </div>
              {selectTeacher.school}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold text-xl">สรุปภาพรวมการเข้าเรียน</span>
          <div>
            {attendacneData ? (
              <Pie data={attendacneData} />
            ) : (
              <div>
                <div>
                  <BsExclamationCircleFill />
                </div>
              </div>
            )}
          </div>
          <div className=" gap-2 place-items-center grid grid-cols-3">
            <span className="text-red-500">
              ขาดเรียน {attendances?.data?.absent} ครั้ง
            </span>
            <span className="text-green-500">
              มาเรียน {attendances?.data?.present} ครั้ง
            </span>
            <span className="text-yellow-500">
              ลา {attendances?.data?.holiday} ครั้ง
            </span>
            <span className="text-orange-500">
              สาย {attendances?.data?.late} ครั้ง
            </span>
            <span className="text-blue-500">
              ป่วย {attendances?.data?.sick} ครั้ง
            </span>
          </div>
        </div>
      </div>
      <div className="w-96 h-[30rem] bg-white p-5 flex flex-col justify-between items-center rounded-md">
        <span className="font-semibold font-Kanit text-lg">
          ห้องเรียนทั้งหมด
        </span>
        <div className="grid grid-cols-1 gap-2 p-5 w-full overflow-auto place-items-center">
          {classrooms?.data?.classrooms.map((classroom) => {
            return (
              <div
                style={{
                  border: `2px solid ${classroom.color}`,
                  border: `4px solid ${classroom.color}`,
                  padding: '10px',
                }}
                className="w-full h-max p-5 bg-white rounded-2xl flex flex-col 
                justify-center items-center font-Kanit relative "
                key={classroom.id}
              >
                <span className="font-semibold">{classroom.title}</span>
                <span className="font-normal">{classroom.level}</span>
                <span className="font-normal text-slate-500">
                  {classroom.description}
                </span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => {
                      document.body.style.overflow = 'auto';
                      router.push({
                        pathname: `/school/classrooms/teacher/${selectTeacher.id}/classroom/${classroom.id}`,
                      });
                    }}
                    className="p-3 transition duration-150 hover:bg-green-200 hover:text-green-600 bg-blue-200 text-blue-600 rounded-full flex items-center gap-2 py-2"
                  >
                    <div className="">
                      <SiGoogleclassroom />
                    </div>
                    <span>สำรวจห้องเรียน</span>
                  </button>
                  <div className="w-max h-max text-xs text-white bg-orange-500 rounded-md p-2">
                    {classroom.students.length} คน
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Pagination
          count={classrooms?.data?.totalPages}
          onChange={(e, page) => setPage(page)}
        />
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerShowTeacherInfo(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default ShowTeacherOverviewInfo;
