import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { SiGoogleclassroom } from 'react-icons/si';

function ShowStudentInfo({ setTriggerStudentInfo, currentStudentInfo }) {
  const router = useRouter();
  return (
    <div
      className="z-30 
  top-0 right-0 left-0 bottom-0 m-auto fixed flex justify-center items-center"
    >
      <div
        className=" w-max  gap-8 max-w-5xl h-max font-Kanit flex flex-col justify-start bg-white rounded-lg
       drop-shadow-xl p-5 "
      >
        <div className="flex gap-5">
          <div className="w-32 h-32 rounded-md overflow-hidden bg-slate-100 relative drop-shadow-md">
            <Image
              src={currentStudentInfo.student.picture}
              layout="fill"
              sizes="(max-width: 768px) 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start gap-3 w-96 truncate">
            <span className="font-Kanit text-2xl  font-semibold truncate">
              {currentStudentInfo.student.firstName}{' '}
              {currentStudentInfo.student.firstName}
            </span>
            <div className="flex gap-5">
              <span className="font-Kanit w-max p-2 bg-blue-500 rounded-md  text-base  font-normal text-white truncate">
                เลขที่ {currentStudentInfo.student.number}{' '}
              </span>
              {currentStudentInfo.numberAbsent && (
                <span className="font-Kanit w-max p-2 bg-red-500 rounded-md  text-base  font-normal text-white truncate">
                  ขาดจำนวน {currentStudentInfo.numberAbsent} ครั้ง
                </span>
              )}
              {currentStudentInfo.numberSick && (
                <span className="font-Kanit w-max p-2 bg-blue-500 rounded-md  text-base  font-normal text-white truncate">
                  ป่วย {currentStudentInfo.numberSick} ครั้ง
                </span>
              )}
              {currentStudentInfo.numberHoliday && (
                <span className="font-Kanit w-max p-2 bg-orange-500 rounded-md  text-base  font-normal text-white truncate">
                  ลา {currentStudentInfo.numberHoliday} ครั้ง
                </span>
              )}
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            document.body.style.overflow = 'auto';
            router.push({
              pathname: `/school/classrooms/teacher/${currentStudentInfo.classroom.user.id}/classroom/${currentStudentInfo.classroom.id}`,
            });
          }}
          role="button"
          className="flex gap-3 cursor-pointer group"
        >
          <div
            className="text-3xl w-10 h-10 group-hover:bg-green-600 group-hover:text-green-100 transition duration-100
           bg-green-200 text-green-600 p-3 flex items-center justify-center rounded-xl"
          >
            <SiGoogleclassroom />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">
              ชื่อห้องเรียน {currentStudentInfo.classroom.title}
            </span>
            <span>ระดับ {currentStudentInfo.classroom.level}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <div
            className="text-3xl w-10 h-10 bg-pink-200 text-pink-600 p-3 flex overflow-hidden
           items-center justify-center relative rounded-xl"
          >
            {currentStudentInfo.classroom.user.picture ? (
              <Image
                src={currentStudentInfo.classroom.user.picture}
                layout="fill"
                sizes="(max-width: 768px) 100vw"
                className="object-cover"
              />
            ) : (
              <span className="font-bold text-2xl uppercase">
                {currentStudentInfo.classroom.user.firstName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">
              Teacher: {currentStudentInfo.classroom.user.firstName}
              {'  '}
              {currentStudentInfo.classroom.user?.lastName}
            </span>
            <div className="flex gap-2">
              <span>Email: {currentStudentInfo.classroom.user.email}</span>
            </div>
            <div className="flex gap-2">
              <span>School: {currentStudentInfo.classroom.user.school}</span>
              <span>Phone: {currentStudentInfo.classroom.user.phone}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerStudentInfo(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default ShowStudentInfo;
