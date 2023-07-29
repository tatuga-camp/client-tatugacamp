import Image from 'next/image';
import React from 'react';

function ShowStudentAttendanceInfo({
  student,
  attendanceData,
  setTriggerAttendanceInfo,
  user,
}) {
  const date = new Date(attendanceData.date);
  const formattedDate = date.toLocaleDateString(
    `${
      user.language === 'Thai'
        ? 'th-TH'
        : user.language === 'English' && 'en-US'
    }`,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
  return (
    <div
      className="z-30 
      top-0 right-0 w-screen h-screen gap-5 left-0 bottom-0 m-auto fixed flex justify-center items-center"
    >
      <div
        className=" w-max  gap-8 max-w-5xl h-max font-Kanit flex flex-col justify-start bg-white rounded-lg
           drop-shadow-xl p-5 "
      >
        <div className="flex gap-5">
          <div className="w-32 h-32 rounded-md overflow-hidden bg-slate-100 relative drop-shadow-md">
            <Image
              src={student.picture}
              layout="fill"
              sizes="(max-width: 768px) 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col  items-start gap-3 w-80 break-words ">
            <span className="font-Kanit text-2xl  font-semibold ">
              {student.firstName} {student.firstName}
            </span>
            <div className="flex items-center gap-5">
              <span className="font-Kanit w-max p-2 bg-blue-500 rounded-md  text-base  font-normal text-white truncate">
                เลขที่ {student.number}{' '}
              </span>
              {attendanceData.absent && (
                <span className="font-Kanit w-max p-2 bg-red-500 rounded-md  text-base  font-normal text-white truncate">
                  ขาด
                </span>
              )}
              {attendanceData.holiday && (
                <span className="font-Kanit w-max p-2 bg-yellow-500 rounded-md  text-base  font-normal text-white truncate">
                  ลา
                </span>
              )}
              {attendanceData.sick && (
                <span className="font-Kanit w-max p-2 bg-blue-500 rounded-md  text-base  font-normal text-white truncate">
                  ป่วย
                </span>
              )}
              {attendanceData.late && (
                <span className="font-Kanit w-max p-2 bg-orange-500 rounded-md  text-base  font-normal text-white truncate">
                  สาย
                </span>
              )}
              {attendanceData.present && (
                <span className="font-Kanit w-max p-2 bg-green-500 rounded-md  text-base  font-normal text-white truncate">
                  มาเรียน
                </span>
              )}
              <span>{formattedDate}</span>
            </div>
            <span className="font-Kanit w-max p-2 bg-pink-500 rounded-md  text-base  font-normal text-white truncate">
              {student.nationality ? student.nationality : 'ยังไม่เลือกสัญชาติ'}
            </span>
          </div>
        </div>
      </div>
      {attendanceData?.note && (
        <div className="bg-white p-5 rounded-xl flex justify-center items-center">
          <div
            className="h-96 w-96  overflow-auto ml-2"
            dangerouslySetInnerHTML={{
              __html: attendanceData?.note,
            }}
          />
        </div>
      )}
      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerAttendanceInfo(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default ShowStudentAttendanceInfo;
