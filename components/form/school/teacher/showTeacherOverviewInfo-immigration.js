import React, { useEffect, useState } from 'react';
import { Pagination, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { GetAllAttendanceTeacher } from '../../../../service/school/attendance';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Doughnut } from 'react-chartjs-2';
import { BsExclamationCircleFill, BsTable } from 'react-icons/bs';
import Image from 'next/image';
import { AiFillPhone } from 'react-icons/ai';
import { FaSchool } from 'react-icons/fa';
import { GetAllClassroomInTeacher } from '../../../../service/school/classroom';
import { SiGoogleclassroom } from 'react-icons/si';
import { useRouter } from 'next/router';
import { GetAllStudentsInTeacherByNationlity } from '../../../../service/school/student';
import { formattedColorCodesArray } from '../../../../data/chart/color';
import Link from 'next/link';
import { loadingCount } from '../../../../data/loadingCount';

ChartJS.register(ArcElement, Tooltip, Legend);
const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};
function ShowTeacherOverviewInfoImmigration({
  setTriggerShowTeacherInfo,
  selectTeacher,
}) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [attendacneData, setAttendanceData] = useState();
  const [dataNationality, setDataNationality] = useState();
  const [triggerTableNationality, setTriggerTableNationality] = useState(false);
  const [dataNationalityTabel, setDataNationalityTabel] = useState();
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
  const students = useQuery(
    ['students-teacher'],
    () => GetAllStudentsInTeacherByNationlity({ teacherId: selectTeacher.id }),
    {
      enabled: false,
    },
  );
  useEffect(() => {
    classrooms.refetch();
    attendances.refetch();
    students.refetch();
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
    if (students.data) {
      setDataNationality(() => {
        let value = [];
        let nationalities = [];
        for (const key in students.data) {
          // Access the property key and value
          const number = students.data[key];
          value.push(number);
          nationalities.push(key);
        }

        return {
          labels: nationalities,
          datasets: [
            {
              label: 'จำนวน',
              data: value,
              backgroundColor: formattedColorCodesArray,
              borderColor: formattedColorCodesArray,
              borderWidth: 1,
            },
          ],
        };
      });
      setDataNationalityTabel(() => {
        let nationalities = [];
        for (const key in students.data) {
          // Access the property key and value
          const number = students.data[key];
          nationalities.push({ nationality: key, number });
        }
        return nationalities;
      });
    }
  }, [attendances.data, students.data]);
  return (
    <div
      className="z-30 
top-0 right-0 left-0 bottom-0 m-auto fixed gap-5 flex justify-center items-center"
    >
      <div className="flex flex-col gap-5 items-end">
        <div
          className="w-10/21 gap-0  xl:gap-8 h-max xl:h-max lg:py-5 xl:py-10 font-Kanit flex  justify-around bg-white rounded-lg
   drop-shadow-xl p-5 "
        >
          <div className="flex flex-col h-60  justify-center items-center font-Kanit">
            <div
              className="w-20 h-20 bg-blue-300 mb-1 text-white rounded-md 
                            relative flex justify-center items-center overflow-hidden"
            >
              {selectTeacher.picture ? (
                <Image
                  src={selectTeacher.picture}
                  fill
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
            <div className="flex gap-3 xl:flex-row lg:flex-col items-center mt-5">
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
          <div className="flex lg:h-60  gap-2">
            <div className="flex flex-col items-center justify-center">
              <span className="font-semibold text-xl">
                สรุปภาพรวมการเข้าเรียน
              </span>
              <div className="lg:w-52 lg:h-52 ">
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
            </div>
          </div>
        </div>
        <div className="flex  flex-col p-3 gap-2 w-10/12  xl:w-full lg:h-60 xl:h-max  bg-white rounded-lg relative items-center justify-center">
          <div className="w-full flex justify-end">
            <button
              onClick={() => setTriggerTableNationality((prev) => !prev)}
              className="w-max text-sm  hover:bg-green-500 hover:text-green-200
               px-5 py-2 rounded-md bg-green-200 text-green-600 font-Kanit font-semibold flex items-center gap-2"
            >
              ตาราง
              <div>
                <BsTable />
              </div>
            </button>
          </div>
          <span className="font-semibold text-lg">สรุปข้อมูลสัญชาติ</span>
          {triggerTableNationality ? (
            <ul className="grid grid-cols-2 overflow-auto h-60 w-full gap-x-10  place-items-start">
              {dataNationalityTabel?.map((nationality, index) => {
                return (
                  <li
                    key={index}
                    className="flex gap-2 items-start justify-between w-full 
                      col-span-1 font-Kanit font-medium text-left text-base p-2"
                  >
                    <div>{nationality.nationality}</div>
                    <div>{nationality.number}</div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="lg:w-32 lg:h-32 xl:w-60 xl:h-60">
              {dataNationality ? (
                <Doughnut data={dataNationality} options={options} />
              ) : (
                <div>
                  <div>
                    <BsExclamationCircleFill />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-96 h-[30rem] bg-white p-5 flex flex-col justify-between items-center rounded-md">
        <span className="font-semibold font-Kanit text-lg">
          ห้องเรียนทั้งหมด
        </span>
        <div className="grid grid-cols-1 gap-2 p-5 w-full overflow-auto place-items-center">
          {classrooms.isFetching
            ? loadingCount.map((list) => {
                return <Skeleton key={list} width="100%" height={200} />;
              })
            : classrooms?.data?.classrooms?.map((classroom) => {
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
                      <Link
                        href={`/school/dashboard/classrooms/teacher/${selectTeacher.id}/classroom/${classroom.id}`}
                        onClick={() => {
                          document.body.style.overflow = 'auto';
                        }}
                        className="p-3 no-underline transition duration-150 hover:bg-green-200 hover:text-green-600 bg-blue-200 text-blue-600 rounded-full flex items-center gap-2 py-2"
                      >
                        <div className="">
                          <SiGoogleclassroom />
                        </div>
                        <span>สำรวจห้องเรียน</span>
                      </Link>
                      <div className="w-max h-max text-xs text-white bg-orange-500 rounded-md p-2">
                        {classroom.student} คน คน
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

export default ShowTeacherOverviewInfoImmigration;
