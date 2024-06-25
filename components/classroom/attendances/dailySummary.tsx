import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import { ResponseGetAllAttendanceService } from "../../../services/attendance";
import { User } from "../../../models";
import { BiMessageAltError } from "react-icons/bi";

type DailySummaryProps = {
  user: User;
  attendances: UseQueryResult<ResponseGetAllAttendanceService, Error>;
};
function DailySummary({ attendances, user }: DailySummaryProps) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div>
      {attendances.isLoading ? (
        <div className="flex flex-col gap-5 mt-5"></div>
      ) : (
        <div>
          <table
            className=" h-full  max-h-[40rem] flex flex-col w-80 md:w-[40rem]
    lg:w-[60rem] xl:w-[70rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
          >
            <thead className="w-max sticky top-0  py-2 z-10 bg-white">
              <tr className="flex text-white  bg-white">
                <th className=" sticky left-0 z-10  bg-white ">
                  <div
                    className="m-1 flex h-12 font-normal text-base  w-10 md:w-[5.4rem]  items-center
                    md:text-base justify-center rounded-md bg-[#2C7CD1]"
                  >
                    สถานะ
                  </div>
                </th>
                {attendances?.data?.meta.headAttendances.map(
                  (status, index) => {
                    const date = new Date(status.date);
                    const formattedDate = date.toLocaleDateString(
                      `${
                        user.language === "Thai"
                          ? "th-TH"
                          : user.language === "English" && "en-US"
                      }`,
                      {
                        timeZone: userTimeZone,
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12:
                          user.language === "Thai"
                            ? false
                            : user.language === "English" && true, // Use 24-hour format
                      }
                    );
                    return (
                      <th
                        key={status.groupId}
                        className="w-28  flex items-center justify-around bg-white text-white rounded-md 
                 relative  h-12 font-normal text-base   cursor-pointer  "
                      >
                        <span className="block  bg-[#2C7CD1] mx-1 mt-[0.6rem] rounded-md">
                          {formattedDate}
                        </span>
                      </th>
                    );
                  }
                )}
              </tr>
            </thead>
            {/* Body */}
            <tbody className="w-max">
              <tr className="flex  hover:ring-2 hover:bg-slate-200 group text-lg font-semibold text-[#2C7CD1] ">
                <td
                  className={`w-10 md:w-24 flex items-center justify-center 
                    sticky left-0 z-10`}
                >
                  <div
                    className={`h-12 font-normal text-base  w-10 md:w-24 flex items-center justify-center rounded-md m-1 text-white bg-green-600 `}
                  >
                    มาเรียน
                  </div>
                </td>
                {attendances?.data?.meta.headAttendances.map(
                  (status, index) => {
                    let attendanceCount = 0;
                    attendances.data.students.forEach((student) => {
                      const groupAttendances = student.data.filter(
                        (data) => data.groupId === status.groupId
                      );
                      groupAttendances.forEach((groupAttendance) => {
                        if (groupAttendance.present) {
                          attendanceCount++;
                        }
                      });
                    });
                    return (
                      <td
                        key={index}
                        className="w-28 flex items-center justify-center"
                      >
                        {attendanceCount}
                      </td>
                    );
                  }
                )}
              </tr>
              <tr className="flex  hover:ring-2 hover:bg-slate-200 group text-lg font-semibold text-[#2C7CD1] ">
                <td
                  className={`w-10 md:w-24 flex items-center justify-center 
                    sticky left-0 z-10`}
                >
                  <div
                    className={`h-12 font-normal text-base w-10 md:w-24 flex items-center justify-center rounded-md m-1 text-white bg-red-600 `}
                  >
                    ขาดเรียน
                  </div>
                </td>
                {attendances?.data?.meta.headAttendances.map(
                  (status, index) => {
                    let attendanceCount = 0;
                    attendances.data.students.forEach((student) => {
                      const groupAttendances = student.data.filter(
                        (data) => data.groupId === status.groupId
                      );
                      groupAttendances.forEach((groupAttendance) => {
                        if (groupAttendance.absent) {
                          attendanceCount++;
                        }
                      });
                    });
                    return (
                      <td
                        key={index}
                        className="w-28 flex items-center justify-center"
                      >
                        {attendanceCount}
                      </td>
                    );
                  }
                )}
              </tr>
              <tr className="flex  hover:ring-2 hover:bg-slate-200 group text-lg font-semibold text-[#2C7CD1] ">
                <td
                  className={`w-10 md:w-24 flex items-center justify-center 
                    sticky left-0 z-10`}
                >
                  <div
                    className={`h-12 font-normal text-base w-10 md:w-24 flex items-center justify-center rounded-md m-1 text-white bg-yellow-500 `}
                  >
                    ลา
                  </div>
                </td>
                {attendances?.data?.meta.headAttendances.map(
                  (status, index) => {
                    let attendanceCount = 0;
                    attendances.data.students.forEach((student) => {
                      const groupAttendances = student.data.filter(
                        (data) => data.groupId === status.groupId
                      );
                      groupAttendances.forEach((groupAttendance) => {
                        if (groupAttendance.holiday) {
                          attendanceCount++;
                        }
                      });
                    });
                    return (
                      <td
                        key={index}
                        className="w-28 flex items-center justify-center"
                      >
                        {attendanceCount}
                      </td>
                    );
                  }
                )}
              </tr>
              <tr className="flex  hover:ring-2 hover:bg-slate-200 group text-lg font-semibold text-[#2C7CD1] ">
                <td
                  className={`w-10 md:w-24 flex items-center justify-center 
                    sticky left-0 z-10`}
                >
                  <div
                    className={`h-12 font-normal text-base w-10 md:w-24 flex items-center justify-center rounded-md m-1 text-white bg-blue-500 `}
                  >
                    ป่วย
                  </div>
                </td>
                {attendances?.data?.meta.headAttendances.map(
                  (status, index) => {
                    let attendanceCount = 0;
                    attendances.data.students.forEach((student) => {
                      const groupAttendances = student.data.filter(
                        (data) => data.groupId === status.groupId
                      );
                      groupAttendances.forEach((groupAttendance) => {
                        if (groupAttendance.sick) {
                          attendanceCount++;
                        }
                      });
                    });
                    return (
                      <td
                        key={index}
                        className="w-28 flex items-center justify-center"
                      >
                        {attendanceCount}
                      </td>
                    );
                  }
                )}
              </tr>
              <tr className="flex  hover:ring-2 hover:bg-slate-200 group text-lg font-semibold text-[#2C7CD1] ">
                <td
                  className={`w-10 md:w-24 flex items-center justify-center 
                    sticky left-0 z-10`}
                >
                  <div
                    className={`h-12 font-normal text-base w-10 md:w-24 flex items-center justify-center rounded-md m-1 text-white bg-orange-500 `}
                  >
                    สาย
                  </div>
                </td>
                {attendances?.data?.meta.headAttendances.map(
                  (status, index) => {
                    let attendanceCount = 0;
                    attendances.data.students.forEach((student) => {
                      const groupAttendances = student.data.filter(
                        (data) => data.groupId === status.groupId
                      );
                      groupAttendances.forEach((groupAttendance) => {
                        if (groupAttendance.late) {
                          attendanceCount++;
                        }
                      });
                    });
                    return (
                      <td
                        key={index}
                        className="w-28 flex items-center justify-center"
                      >
                        {attendanceCount}
                      </td>
                    );
                  }
                )}
              </tr>
              <tr className="flex  hover:ring-2 hover:bg-slate-200 group text-lg font-semibold text-[#2C7CD1] ">
                <td
                  className={`w-10 md:w-24 flex items-center justify-center 
                    sticky left-0 z-10`}
                >
                  <div
                    className={`h-12 font-normal text-base w-10 md:w-24 flex items-center justify-center rounded-md m-1 text-white bg-gray-600`}
                  >
                    ไม่มีข้อมูล
                  </div>
                </td>
                {attendances?.data?.meta.headAttendances.map(
                  (status, index) => {
                    let attendanceCount = 0;
                    attendances.data.students.forEach((student) => {
                      const groupAttendances = student.data.filter(
                        (data) => data.groupId === status.groupId
                      );
                      groupAttendances.forEach((groupAttendance) => {
                        if (
                          !groupAttendance.present &&
                          !groupAttendance.absent &&
                          !groupAttendance.holiday &&
                          !groupAttendance.sick &&
                          !groupAttendance.late
                        ) {
                          attendanceCount++;
                        }
                      });
                    });
                    return (
                      <td
                        key={index}
                        className="w-28 flex items-center justify-center"
                      >
                        {attendanceCount}
                      </td>
                    );
                  }
                )}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <span className="mt-5 flex items-center justify-center text-center font-Kanit text-xl font-semibold ">
        {user.language === "Thai" &&
          `จำนวนครูสอนทั้งหมด ${attendances?.data?.meta.sum} คาบ`}
        {user.language === "English" &&
          `The teacher has taught this class for ${attendances?.data?.meta.sum} periods`}
      </span>
      {attendances?.data?.meta.headAttendances.length === 0 && (
        <div className="w-full flex items-center justify-center h-96 text-8xl">
          <span>ไม่มีข้อมูล</span>
          <div className="text-red-400">
            <BiMessageAltError />
          </div>
        </div>
      )}
    </div>
  );
}

export default DailySummary;
