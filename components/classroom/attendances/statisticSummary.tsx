import { Skeleton } from "@mui/material";
import React from "react";
import { User } from "../../../models";
import { UseQueryResult } from "@tanstack/react-query";
import { ResponseGetAllAttendanceService } from "../../../services/attendance";
import { BiMessageAltError } from "react-icons/bi";
import Image from "next/image";

type StatisticSummaryProps = {
  user: User;
  attendances: UseQueryResult<ResponseGetAllAttendanceService, Error>;
};
function StatisticSummary({ user, attendances }: StatisticSummaryProps) {
  return (
    <div>
      {attendances.isLoading ? (
        <div className="flex flex-col gap-5 mt-5">
          <Skeleton variant="rectangular" width={700} height={40} />
          <Skeleton variant="rectangular" width={600} height={40} />
          <Skeleton variant="rectangular" width={800} height={40} />
        </div>
      ) : (
        <div>
          <table
            className=" h-full  max-h-[40rem] flex flex-col items-center justify-center w-80 md:w-[40rem]
    lg:w-[60rem] xl:w-[70rem] bg-white rounded-md font-Kanit overflow-x-auto relative"
          >
            <thead className="w-max sticky top-0  py-2 z-10 bg-white">
              <tr className="flex text-white  bg-white">
                <th className=" sticky left-0 z-10  bg-white ">
                  <div className="m-1 flex h-12  w-10 md:w-[5.4rem]  items-center justify-center text-xs md:text-base  rounded-md bg-[#2C7CD1]">
                    {user.language === "Thai" && "เลขที่"}
                    {user.language === "English" && "number"}
                  </div>
                </th>
                <th className=" sticky z-10 left-12 md:left-[6rem] bg-white  ">
                  <div className="m-1 w-16 h-12 md:w-[16.5rem] flex items-center justify-center text-xs md:text-base bg-[#2C7CD1] rounded-md">
                    <span className="text-center">
                      {user.language === "Thai" && "รายชื่อ"}
                      {user.language === "English" && "student's name"}
                    </span>
                  </div>
                </th>

                <th className="ml-[31rem] md:ml-[26rem] lg:ml-[0rem] text-xs md:text-base bg-green-600 rounded-md m-1 w-24 flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === "Thai" && "มาเรียน"}
                    {user.language === "English" && "Present"}
                  </span>
                </th>
                <th className="bg-orange-500 rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === "Thai" && "มาสาย"}
                    {user.language === "English" && "late"}
                  </span>
                </th>
                <th className="bg-yellow-500 rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === "Thai" && "ลา"}
                    {user.language === "English" && "take a leave"}
                  </span>
                </th>
                <th className="bg-[#2C7CD1] rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === "Thai" && "ป่วย"}
                    {user.language === "English" && "sick"}
                  </span>
                </th>
                <th className="bg-red-600 rounded-md m-1 w-24 text-xs md:text-base flex items-center justify-center ">
                  <span className="text-center">
                    {user.language === "Thai" && "ขาดเรียน"}
                    {user.language === "English" && "absent"}
                  </span>
                </th>
                {user?.schoolUser?.organization === "immigration" && (
                  <th className="bg-purple-600 rounded-md m-1 w-24 flex text-xs md:text-base items-center justify-center ">
                    <span className="text-center">
                      {user.language === "Thai" && "เฝ้าระวัง"}
                      {user.language === "English" && "warn"}
                    </span>
                  </th>
                )}

                <th className="w-36 flex items-center justify-center text-xs md:text-base bg-[#2C7CD1] m-1 text-white rounded-md  ">
                  <span className="text-center">
                    {user.language === "Thai" && "เปอร์เซ็นต์การเข้าเรียนจริง"}
                    {user.language === "English" && "Actual Presence"}
                  </span>
                </th>
                <th className="w-36 flex items-center justify-center text-xs md:text-base bg-[#2C7CD1] m-1 text-white rounded-md  ">
                  <span className="text-center">
                    {user.language === "Thai" &&
                      "เปอร์เซ็นต์การเข้าเรียนทั้งหมด"}
                    {user.language === "English" && "Overall Attendance"}
                  </span>
                </th>
              </tr>
            </thead>
            {/* Body */}
            <tbody className="w-max">
              {attendances?.data?.students.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className="flex ml-[5rem] md:ml-0  hover:ring-2 hover:bg-slate-200 group text-[#2C7CD1] "
                  >
                    <td
                      className={`w-10 md:w-24 flex items-center justify-center sticky left-0 z-10 bg-white group-hover:bg-slate-200`}
                    >
                      <div
                        className={`h-12 w-10 md:w-24 flex items-center justify-center rounded-md m-1 ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        {item.student?.number}
                      </div>
                    </td>
                    <td
                      className={`w-20 text-xs md:text-base md:w-[17rem] text-left flex justify-start items-center sticky left-10 md:left-[6rem] z-10 bg-white group-hover:bg-slate-200`}
                    >
                      <div
                        className={`h-12 w-20 text-xs text-start md:text-base md:w-[16.5rem] flex items-center justify-start rounded-md m-1 ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        <div className="min-w-9 min-h-9 rounded-full bg-white mx-2 ring-1 relative overflow-hidden">
                          <Image
                            src={item.student?.picture}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-left text-xs md:text-base truncate hover:overflow-visible">
                          {item.student?.firstName} {item.student?.lastName}
                        </span>
                      </div>
                    </td>

                    <td className="w-24 m-1 flex items-center justify-center ml-[26rem] lg:ml-[0rem]">
                      <span
                        className={`  text-center rounded-md w-24 h-12 flex items-center justify-center ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        {item.statistics?.number?.present}
                      </span>
                    </td>
                    <td className="w-24 m-1 flex items-center justify-center ">
                      <span
                        className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        {item.statistics?.number?.late}
                      </span>
                    </td>
                    <td className="w-24 m-1 flex items-center justify-center ">
                      <span
                        className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        {item.statistics?.number?.holiday}
                      </span>
                    </td>
                    <td className="w-24 m-1 flex items-center justify-center ">
                      <span
                        className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        {item.statistics?.number?.sick}
                      </span>
                    </td>
                    <td className="w-24 m-1 flex items-center justify-center ">
                      <span
                        className={`text-center rounded-md w-24 h-12 flex items-center justify-center ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        {item.statistics?.number?.absent}
                      </span>
                    </td>

                    {user?.schoolUser?.organization === "immigration" && (
                      <td
                        className={`text-[#2C7CD1] font-semibold w-36 flex items-center justify-center rounded-md py-2 m-1  ${
                          index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                        }`}
                      >
                        <span className="text-center">
                          {item.statistics?.number?.warn}
                        </span>
                      </td>
                    )}
                    <td
                      className={`text-[#2C7CD1] font-semibold w-36 flex items-center justify-center rounded-md py-2 m-1  ${
                        index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                      }`}
                    >
                      <span className="text-center">
                        {item.statistics?.percent?.purePresent.toFixed(2)}%
                      </span>
                    </td>
                    <td
                      className={`text-[#2C7CD1] font-semibold w-36 flex items-center justify-center rounded-md py-2 m-1  ${
                        index % 2 === 0 ? "bg-white" : "bg-[#E8E8E8]"
                      }`}
                    >
                      <span className="text-center">
                        {item.statistics?.percent?.present.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <span className="mt-5 flex items-center justify-center text-center font-Kanit text-xl font-semibold">
            {user.language === "Thai" &&
              `จำนวนครูสอนทั้งหมด ${attendances?.data?.meta?.sum} คาบ`}
            {user.language === "English" &&
              `The teacher has taught this class for ${attendances?.data?.meta?.sum} periods`}
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
      )}
    </div>
  );
}

export default StatisticSummary;
