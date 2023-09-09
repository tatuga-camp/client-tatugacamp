import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MdCardTravel,
  MdOutlineMoodBad,
  MdOutlineSick,
  MdWork,
} from 'react-icons/md';
import { IoHome } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { GetAllAssignment } from '../../../../service/student/assignment';
import { Skeleton } from '@mui/material';
import { GetAttendances } from '../../../../service/student/attendance';
import { HiOutlineHandRaised } from 'react-icons/hi2';
import { BiErrorCircle, BiHappyBeaming, BiRun } from 'react-icons/bi';
import Head from 'next/head';
import { BsImage, BsImageFill } from 'react-icons/bs';
import { GetStudent, UpdateStudent } from '../../../../service/student/student';
import Swal from 'sweetalert2';
import Link from 'next/link';

function Index() {
  const [classroomCode, setClassroomCode] = useState();
  const [activeMenu, setActiveMenu] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [classroom, setClassroom] = useState();

  const menus = [
    {
      title: 'ชิ้นงาน',
      icon: <MdWork />,
      color: 'bg-yellow-400',
    },
    {
      title: 'ข้อมูลการเข้าเรียน',
      icon: <HiOutlineHandRaised />,
      color: 'bg-gray-400',
    },
  ];
  const router = useRouter();
  const student = useQuery(
    ['student'],
    () => GetStudent({ studentId: router.query.studentId }),
    {
      enabled: false,
    },
  );

  const assignments = useQuery(
    ['assignments-student'],
    () =>
      GetAllAssignment({
        studentId: router.query.studentId,
        classroomId: router.query.classroomId,
      }),
    {
      enabled: false,
    },
  );
  const attendances = useQuery(
    ['attendances'],
    () =>
      GetAttendances({
        studentId: router.query.studentId,
        classroomId: router.query.classroomId,
      }),
    {
      enabled: false,
    },
  );

  useEffect(() => {
    setClassroomCode(() => {
      const rawClassroomCode = localStorage.getItem('classroomCode');
      const classroomCode = JSON.parse(rawClassroomCode);
      return classroomCode;
    });
    setClassroom(() => {
      const classroom = localStorage.getItem('classroom-student');
      const classroomConverted = JSON.parse(classroom);
      return classroomConverted;
    });
  }, []);

  useEffect(() => {
    if (router.isReady) {
      student.refetch();
      assignments.refetch();
      attendances.refetch();
    }
  }, [router.isReady]);

  //handle sumit to update student data
  const handleSummitEditStudentData = async (e) => {
    e.preventDefault();
    if (!file) {
      return Swal.fire(
        'No file chosen❗',
        'please select one image to be your avatar',
        'error',
      );
    }
    try {
      setLoading(() => true);
      const formData = new FormData();
      formData.append('file', file);
      await UpdateStudent({
        formData,
        studentId: student?.data?.data?.id,
      });
      student.refetch();
      Swal.fire('success', 'เปลี่ยนรูปโปรไฟล์สำเร็จ', 'success');
      document.body.style.overflow = 'auto';
      setSelectedImage(() => null);
    } catch (err) {
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      document.body.style.overflow = 'auto';
      setSelectedImage(() => null);
    }
  };

  //handle profile update
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFile(() => event.target.files[0]);
    const reader = new FileReader();

    reader.onload = function (e) {
      document.body.style.overflow = 'hidden';
      setSelectedImage(() => e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div
      className={` w-full bg-slate-100  ${
        assignments?.data?.data.length > 2 ? 'h-full' : 'h-screen'
      }  md:h-full md:pb-40 lg:pb-96 lg:h-full`}
    >
      <Head>
        <title>student - homepage</title>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
      </Head>
      <div
        className=" bg-cover h-60 w-full absolute top-0  bg-center bg-no-repeat 
         bg-[url('https://storage.googleapis.com/tatugacamp.com/backgroud/sea%20backgroud.png')] "
      ></div>
      <nav className="fixed z-20 top-3  flex justify-between md:top-10 items-center w-full ">
        <div
          role="button"
          aria-label="button go back to classroom"
          onClick={() =>
            router.push({
              pathname: `/classroom/student`,
              query: {
                classroomCode: classroomCode,
              },
            })
          }
          className="w-10 ml-5 h-10 md:w-12 md:h-12 bg-orange-500 border-2 border-solid border-white cursor-pointer rounded-lg 
        flex items-center justify-center active:bg-orange-500 hover:scale-110 transition duration-150"
        >
          <div className="text-2xl text-white flex items-center justify-center ">
            <IoHome />
          </div>
        </div>
        <div
          className="w-40 md:w-60 bg-white h-14 md:h-20 border-b-2 border-t-2 border-r-0
         border-blue-500 rounded-l-2xl flex flex-col py-2 pl-2 md:pl-10 gap-0 truncate font-Kanit  border-l-2 border-solid"
        >
          <span className="font-semibold text-blue-500 md:text-2xl truncate">
            {classroom?.title}
          </span>
          <span className="text-xs md:text-sm truncate">
            {classroom?.level}
          </span>
          <span className="text-xs md:text-sm  truncate">
            {classroom?.description}
          </span>
        </div>
      </nav>
      <main className="w-full h-max flex md:flex-row md:items-start md:justify-around lg:justify-center  items-center justify-start flex-col  mt-40 gap-3 relative">
        <header className="flex flex-col justify-center items-center gap-5 md:w-96">
          <div className=" flex items-center justify-center relative">
            {student?.data?.data?.picture && (
              <div
                className="w-40 h-40 md:w-52 md:h-52 relative rounded-full
               overflow-hidden ring-4 ring-white bg-[#EDBA02]"
              >
                {student.isFetching ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                ) : (
                  <Image
                    sizes="(max-width: 768px) 100vw"
                    priority={true}
                    src={student?.data?.data?.picture}
                    layout="fill"
                    className="object-cover  "
                  />
                )}
              </div>
            )}
            <label
              htmlFor="dropzone-file"
              className="absolute w-8 h-8 bg-white text-xl flex items-center justify-center rounded-md bottom-0 right-0"
            >
              <BsImageFill />
              <input
                id="dropzone-file"
                onChange={handleFileInputChange}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                className="hidden"
              />
            </label>
          </div>
          {selectedImage && (
            <div className="">
              <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-40 flex flex-col justify-center items-center gap-5">
                <div className="w-28 h-28 relative">
                  <Image
                    layout="fill"
                    sizes="(max-width: 768px) 100vw"
                    src={selectedImage}
                    alt="Selected Image"
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-5">
                  <button
                    onClick={handleSummitEditStudentData}
                    className="w-40 bg-green-500  font-Kanit py-2 rounded-lg hover:scale-105 transition
                  active:ring-2 text-white"
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => {
                      document.body.style.overflow = 'auto';
                      setSelectedImage(() => null);
                    }}
                    className="w-40 bg-red-700  font-Kanit py-2 rounded-lg hover:scale-105 transition
                  active:ring-2 text-white"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>

              <div
                onClick={() => {
                  setSelectedImage(() => null);
                  document.body.style.overflow = 'auto';
                }}
                className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto z-10 bg-black/80 "
              ></div>
            </div>
          )}

          <div className="w-full justify-center flex flex-col items-center  text-center">
            <div className=" font-Kanit font-normal flex gap-2">
              {student.isFetching ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <span className="text-black">
                  เลขที่ {student?.data?.data?.number}
                </span>
              )}
            </div>
            <div className="text-white font-Kanit font-normal flex gap-2">
              {student.isFetching ? (
                <Skeleton variant="text" width={200} />
              ) : (
                <div className="flex gap-4 text-2xl font-semibold text-blue-500">
                  <span>{student?.data?.data?.firstName}</span>
                  <span>{student?.data?.data?.lastName}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-5  md:hidden">
            {menus.map((menu, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setActiveMenu(() => index)}
                  className={`w-max px-2 h-10 rounded-md ${menu.color} ${
                    activeMenu === index ? 'ring-2 ring-white' : 'ring-0'
                  }  items-center flex justify-center hover:scale-110 
                 gap-2 transition duration-150 hover:ring-1 active:ring-2`}
                >
                  <div
                    className="w-8 h-8  bg-white/50 backdrop-blur-md rounded-md flex 
                items-center justify-center text-black"
                  >
                    {menu.icon}
                  </div>
                  <span className="text-md text-black  font-Poppins font-normal">
                    {menu.title}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {!student && (
          <div className="text-xl text-white font-Kanit">
            ไม่พบผู้เรียนโปรดกลับสู่หน้าหลัก
          </div>
        )}

        <div className="grid grid-cols-1 pb-2 md:mt-10  gap-4 place-items-center w-full mt-8 max-w-xl md:max-w-lg	">
          <div className="hidden gap-5  md:flex">
            {menus.map((menu, index) => {
              return (
                <button
                  key={index}
                  onClick={() => setActiveMenu(() => index)}
                  className={`w-max px-2 h-10 md:h-12 md:px-5 rounded-md ${
                    menu.color
                  } ${
                    activeMenu === index
                      ? 'ring-2 md:ring-4  ring-white'
                      : 'ring-0'
                  }  items-center flex justify-center hover:scale-110 md:justify-between
                 gap-2 md:gap-10 transition duration-150 hover:ring-1 active:ring-2 `}
                >
                  <div
                    className="w-8 h-8  bg-white/50 backdrop-blur-md rounded-md flex 
                items-center justify-center t  text-black"
                  >
                    {menu.icon}
                  </div>
                  <span className="text-md text-black  md:text-lg md:font-medium font-Kanit font-normal">
                    {menu.title}
                  </span>
                </button>
              );
            })}
          </div>
          {activeMenu === 1 && (
            <section className="w-full h-full flex  justify-center">
              <ul className="grid pl-0 grid-cols-1 gap-5 w-full h-full py-10 max-w-3xl md:w-10/12 rounded-t-3xl lg:rounded-3xl bg-white place-items-center">
                <div className="w-full flex justify-start flex-col items-center font-Kanit ">
                  <h2 className="mb-2">สถิติ</h2>
                  <div className="grid grid-cols-2 gap-4 w-max md:w-full md:place-items-center place-items-start">
                    <span className="col-span-2">
                      เปอเซ็นต์การเข้าเรียน{' '}
                      {attendances?.data?.data?.statistics?.percent?.present?.toFixed(
                        2,
                      )}
                      %
                    </span>
                    <span>
                      จำนวนมาเรียน{' '}
                      <span className="font-semibold text-green-500">
                        {attendances?.data?.data?.statistics?.number?.present}{' '}
                        ครั้ง
                      </span>
                    </span>
                    <span>
                      จำนวนมาสาย{' '}
                      <span className="font-semibold text-orange-500">
                        {attendances?.data?.data?.statistics?.number?.late}{' '}
                        ครั้ง
                      </span>
                    </span>
                    <span>
                      จำนวนลา{' '}
                      <span className="font-semibold text-yellow-500">
                        {attendances?.data?.data?.statistics?.number?.holiday}{' '}
                        ครั้ง
                      </span>
                    </span>
                    <span>
                      จำนวนป่วย{' '}
                      <span className="font-semibold text-blue-500">
                        {attendances?.data?.data?.statistics?.number?.sick}{' '}
                        ครั้ง
                      </span>
                    </span>
                    <span>
                      จำนวนขาดเรียน{' '}
                      <span className="font-semibold text-red-500">
                        {attendances?.data?.data?.statistics?.number?.absent}{' '}
                        ครั้ง
                      </span>
                    </span>

                    <span className="col-span-2">
                      จำนวนคาบเรียนทั้งหมด{' '}
                      {attendances?.data?.data?.statistics?.sum} ครั้ง
                    </span>
                  </div>
                </div>

                {attendances?.data?.data?.students?.map((attendance) => {
                  const date = new Date(attendance.date);
                  const formattedDate = date.toLocaleDateString('th-TH', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  });
                  if (attendance.present) {
                    return (
                      <li
                        key={attendance.id}
                        className="flex  items-center justify-between font-Kanit w-full md:w-full rounded-md"
                      >
                        <div className="flex justify-start items-center ml-5 gap-2">
                          <div className="w-10 h-10  rounded-full bg-green-100 flex items-center justify-center">
                            <div className="flex items-center justify-center text-green-800 text-3xl">
                              <BiHappyBeaming />
                            </div>
                          </div>
                          <span className=" font-semibold text-lg">
                            {formattedDate}
                          </span>
                        </div>
                        <div className="w-max rounded-sm p-2 mr-5 bg-green-500 text-white">
                          <span>มาเรียน</span>
                        </div>
                      </li>
                    );
                  } else if (attendance.holiday) {
                    return (
                      <li
                        key={attendance.id}
                        className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
                      >
                        <div className="flex justify-start items-center ml-5 gap-2">
                          <div className="w-10 h-10  rounded-full bg-yellow-100 flex items-center justify-center">
                            <div className="flex items-center justify-center text-yellow-400 text-3xl">
                              <MdCardTravel />
                            </div>
                          </div>
                          <span className=" font-semibold text-lg">
                            {formattedDate}
                          </span>
                        </div>
                        <div className="w-14 text-center rounded-sm p-2 mr-5 bg-yellow-500 text-white">
                          <span>ลา</span>
                        </div>
                      </li>
                    );
                  } else if (attendance.sick) {
                    return (
                      <li
                        key={attendance.id}
                        className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
                      >
                        <div className="flex justify-start items-center ml-5 gap-2">
                          <div className="w-10 h-10  rounded-full bg-blue-100 flex items-center justify-center">
                            <div className="flex items-center justify-center text-blue-400 text-3xl">
                              <MdOutlineSick />
                            </div>
                          </div>
                          <span className=" font-semibold text-lg">
                            {formattedDate}
                          </span>
                        </div>
                        <div className="w-14 text-center rounded-sm p-2 mr-5 bg-blue-500 text-white">
                          <span>ป่วย</span>
                        </div>
                      </li>
                    );
                  } else if (attendance.absent) {
                    return (
                      <li
                        key={attendance.id}
                        className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
                      >
                        <div className="flex justify-start items-center ml-5 gap-2">
                          <div className="w-10 h-10  rounded-full bg-red-100 flex items-center justify-center">
                            <div className="flex items-center justify-center text-red-400 text-3xl">
                              <MdOutlineMoodBad />
                            </div>
                          </div>
                          <span className=" font-semibold text-lg">
                            {formattedDate}
                          </span>
                        </div>
                        <div className="w-14 text-center rounded-sm p-2 mr-5 bg-red-500   text-white">
                          <span>ขาด</span>
                        </div>
                      </li>
                    );
                  } else if (attendance.late) {
                    return (
                      <li
                        key={attendance.id}
                        className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
                      >
                        <div className="flex justify-start items-center ml-5 gap-2">
                          <div className="w-10 h-10  rounded-full bg-orange-100 flex items-center justify-center">
                            <div className="flex items-center justify-center text-orange-400 text-3xl">
                              <BiRun />
                            </div>
                          </div>
                          <span className=" font-semibold text-lg">
                            {formattedDate}
                          </span>
                        </div>
                        <div className="w-14 text-center rounded-sm p-2 mr-5 bg-orange-500   text-white">
                          <span>สาย</span>
                        </div>
                      </li>
                    );
                  } else {
                    return (
                      <li
                        key={attendance.id}
                        className="flex  items-center justify-between font-Kanit w-full md:w-full  rounded-md"
                      >
                        <div className="flex justify-start items-center ml-5 gap-2">
                          <div className="w-10 h-10  rounded-full bg-gray-100 flex items-center justify-center">
                            <div className="flex items-center justify-center text-gray-400 text-3xl">
                              <BiErrorCircle />
                            </div>
                          </div>
                          <span className=" font-semibold text-lg">
                            {formattedDate}
                          </span>
                        </div>
                        <div className="w-max text-center rounded-sm p-2 mr-5 text-sm bg-gray-500 text-white">
                          <span>ไม่มีข้อมูล</span>
                        </div>
                      </li>
                    );
                  }
                })}
              </ul>
            </section>
          )}
          {assignments.isLoading && (
            <div className="flex flex-col justify-center items-center gap-5">
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
              <Skeleton variant="rectangular" width={300} height={100} />
            </div>
          )}
          {activeMenu === 0 &&
            assignments?.data?.data?.map((assignment) => {
              const createDate = new Date(assignment.assignment?.createAt);
              const formattedCreateDate = createDate.toLocaleDateString(
                'th-TH',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                },
              );
              let IsDue = false;
              const currentTime = new Date();
              let deadlineDate = new Date(assignment.assignment?.deadline);
              deadlineDate.setHours(23);
              deadlineDate.setMinutes(59);
              deadlineDate.setSeconds(0);
              if (currentTime > deadlineDate) {
                IsDue = true;
              } else if (currentTime < deadlineDate) {
                IsDue = false;
              }
              const formatteDeadlineDate = deadlineDate.toLocaleDateString(
                'th-TH',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                },
              );
              return (
                <Link
                  href={`/classroom/student/${student?.data?.data?.id}/assignment/${assignment?.assignment?.id}?classroomId=${router?.query?.classroomId}`}
                  key={assignment.assignment?.id}
                  className="w-11/12 md:w-10/12 no-underline hover:scale-110 transition duration-100 flex gap-5  justify-between bg-white ring-2 overflow-auto ring-blue-600 rounded-2xl p-3"
                >
                  <div className="w-full h-28 flex flex-col justify-center  text-left   ">
                    <div className="w-48 md:w-72 text-left truncate scrollbar-hide">
                      <span className="font-Kanit font-semibold md:text-xl text-blue-500">
                        {assignment.assignment?.title}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-Kanit text-xs md:text-base font-normal text-black">
                        มอบหมายเมื่อ {formattedCreateDate}
                      </span>
                      <span className="font-Kanit text-xs md:text-base font-normal text-black">
                        กำหนดส่ง {formatteDeadlineDate}
                      </span>
                    </div>
                  </div>
                  <div className="w-20  h-full flex items-center justify-center">
                    <div className=" font-Kanit flex-col font-semibold flex justify-center items-center">
                      {assignment?.student.status === 'no-work' && IsDue && (
                        <div
                          className="w-20 h-20 bg-red-600 rounded-2xl p-2 text-center text-sm text-white font-Kanit font-semibold
                         flex justify-center items-center"
                        >
                          <span className="">เลยกำหนดส่ง</span>
                        </div>
                      )}
                      {assignment?.student.status === 'no-work' && !IsDue && (
                        <div
                          className="w-20 h-20 bg-orange-500 rounded-2xl text-base text-white font-Kanit font-semibold
                         flex justify-center items-center"
                        >
                          <span className="w-10/12">ไม่ส่งงาน</span>
                        </div>
                      )}
                      {assignment?.student?.status === 'have-work' &&
                        assignment?.student?.isSummited === false && (
                          <div className="w-20 h-20 bg-yellow-400 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                            <span>ส่งแล้ว</span>
                          </div>
                        )}
                      {assignment?.student?.status === 'have-work' &&
                        assignment?.student?.isSummited === true && (
                          <div className="w-20 h-20 bg-green-600 rounded-2xl text-white font-Kanit font-semibold flex justify-center items-center">
                            <span>ตรวจแล้ว</span>
                          </div>
                        )}
                      สถานะ
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}

export default Index;
