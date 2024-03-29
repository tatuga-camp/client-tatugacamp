import React, { useEffect, useState } from "react";
import { AiFillEdit, AiOutlinePlus, AiOutlineQrcode } from "react-icons/ai";
import Switch from "@mui/material/Switch";
import { useQuery } from "@tanstack/react-query";
import QRCode from "react-qr-code";
import { Alert, Skeleton, Snackbar } from "@mui/material";
import { MdOutlineUpdate } from "react-icons/md";
import { useRouter } from "next/router";
import moment from "moment-timezone";
import { QrCodeAttendance, User } from "../../models";
import {
  CreateQrAttendanceService,
  GetAllAttendanceService,
  GetAllQrAttendancesService,
  UpdateQrCodeAttendanceService,
} from "../../services/attendance";
import Swal from "sweetalert2";
import { loadingCount } from "../../data/loadingCount";
import Loading from "../loadings/loading";

type CheckAttendanceByQrCodeProps = {
  user: User;
  setTriggerAttendanceQrCode: React.Dispatch<React.SetStateAction<boolean>>;
  classroomId: string;
};

function CheckAttendanceByQrCode({
  setTriggerAttendanceQrCode,
  classroomId,
  user,
}: CheckAttendanceByQrCodeProps) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const router = useRouter();
  const [triggerShowQrCode, setTriggerShowQrCode] = useState(false);
  const [triggerUpdate, setTriggerUpdate] = useState(false);
  const [selectUpdate, setSelectUpdate] = useState<{
    data: QrCodeAttendance | null;
    index: number | null;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectQrCodeId, setSelectQrCodeId] = useState<string>();
  const [attendanceQrData, setAttendanceQrData] = useState<{
    date: string | null;
    endDate: string | null;
    isLimitOneBrowser: boolean;
    expireAt: string | null;
  }>({
    date: null,
    endDate: null,
    isLimitOneBrowser: false,
    expireAt: null,
  });
  const allQrCode = useQuery({
    queryKey: ["allQrCode", router.query.classroomId as string],
    queryFn: () => GetAllQrAttendancesService({ classroomId }),
  });

  const attendances = useQuery({
    queryKey: ["attendance", router.query.classroomId as string],
    queryFn: () =>
      GetAllAttendanceService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const handleCreateAttendanceQrCode = async () => {
    try {
      setIsLoading(() => true);
      if (
        !attendanceQrData.date ||
        !attendanceQrData.endDate ||
        !attendanceQrData.expireAt
      ) {
        setIsLoading(() => false);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "กรุณากรอกข้อมูลให้ครบ",
        });
        return null;
      }

      await CreateQrAttendanceService({
        date: new Date(attendanceQrData.date) as Date,
        endDate: new Date(attendanceQrData.endDate) as Date,
        expireAt: new Date(attendanceQrData.expireAt) as Date,
        classroomId,
        isLimitOneBrowser: attendanceQrData.isLimitOneBrowser,
      });

      await attendances.refetch();
      await allQrCode.refetch();
      Swal.fire({
        icon: "success",
        title: "สร้าง QR Code สำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsLoading(() => false);
    } catch (err: any) {
      setIsLoading(() => false);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err?.props?.response?.data?.message?.toString(),
      });
    }
  };

  const handleUpdateQrCode = async () => {
    try {
      setIsLoading(() => true);
      if (!attendanceQrData.expireAt) {
        setIsLoading(() => false);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "กรุณากรอกข้อมูลให้ครบ",
        });
        return null;
      }
      await UpdateQrCodeAttendanceService({
        expireAt: new Date(attendanceQrData.expireAt) as Date,
        qrCodeAttendanceId: selectUpdate?.data?.id as string,
        isLimitOneBrowser: attendanceQrData.isLimitOneBrowser,
      });
      await attendances.refetch();
      await allQrCode.refetch();
      Swal.fire({
        icon: "success",
        title: "อัพเดท QR Code สำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsLoading(() => false);
    } catch (err: any) {
      setIsLoading(() => false);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err?.props?.response?.data?.message?.toString(),
      });
      console.error(err);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 font-Kanit text-black right-0 left-0 m-auto z-50 flex items-center justify-center">
      {triggerShowQrCode ? (
        <div className="w-96 h-96">
          <QRCode
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
            }}
            value={`${process.env.NEXT_PUBLIC_CLIENT_STUDENT_URL}/classroom/student/attendance-qrCode/?classroomId=${classroomId}&attendanceQRCodeId=${selectQrCodeId}`}
            viewBox={`0 0 256 256`}
          />{" "}
        </div>
      ) : (
        <main className="min-w-[50rem] ring-2 ring-blue-400 p-5 w-max max-w-3xl h-max lg:max-h-[32rem] xl:max-h-[40rem] rounded-md bg-white flex flex-col justify-start items-center">
          <header className="w-full p-3 flex justify-between border-b-2 border-green-600">
            <div className="flex flex-col">
              <div className="text-xl flex gap-2 justify-start items-center">
                เช็คชื่อด้วย QR CODE{" "}
                <div>
                  <AiOutlineQrcode />
                </div>
              </div>
              <span className="text-base text-slate-500">
                หากต้องการดูคำแนะนำการใช้งาน{" "}
                <a
                  target="_blank"
                  className="cursor-pointer"
                  href="https://youtu.be/c2qjsUiZwdA?si=IaipkDprmSrF7l_9"
                >
                  คลิก
                </a>
              </span>
            </div>
            {isLoading ? (
              <Loading />
            ) : triggerUpdate ? (
              <button
                onClick={handleUpdateQrCode}
                className="flex justify-center items-center gap-3 px-10 h-10 hover:ring-2 ring-0 
                active:scale-110 hover:text-white transition duration-150  bg-blue-400 ring-blue-700 rounded-full drop-shadow-md"
              >
                <div>
                  <MdOutlineUpdate />
                </div>
                <span>update</span>
              </button>
            ) : (
              <button
                onClick={handleCreateAttendanceQrCode}
                className="flex justify-center items-center gap-3 px-10 h-10 hover:ring-2 ring-0 active:scale-110 hover:text-white transition duration-150  bg-green-400 ring-green-700 rounded-full drop-shadow-md"
              >
                <div>
                  <AiOutlinePlus />
                </div>
                <span>สร้าง</span>
              </button>
            )}
          </header>
          <body>
            <section className="flex justify-center mt-5 flex-col items-start gap-2">
              {!triggerUpdate && (
                <div className="flex items-center gap-5  justify-center">
                  <div className="mt-2 flex flex-col text-black items-start justify-start font-Kanit">
                    <label>
                      {user.language === "Thai" && "เริ่มคลาสเมื่อ"}
                      {user.language === "English" && "begin class at"}
                    </label>
                    <input
                      onChange={(e) =>
                        setAttendanceQrData((prev) => {
                          const value = e.target.value;
                          return {
                            ...prev,
                            date: value,
                          };
                        })
                      }
                      value={attendanceQrData.date as string}
                      className="w-28 md:w-40 lg:w-max  appearance-none outline-none border-none ring-2   rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                      type="datetime-local"
                      placeholder="Please select a date"
                    />
                  </div>
                  <div className="mt-2 flex flex-col text-black items-start font-Kanit">
                    <label>
                      {user.language === "Thai" && "จบคลาสเมื่อ"}
                      {user.language === "English" && "end class at"}
                    </label>
                    <input
                      onChange={(e) =>
                        setAttendanceQrData((prev) => {
                          const value = e.target.value;
                          return {
                            ...prev,
                            endDate: value,
                          };
                        })
                      }
                      value={attendanceQrData.endDate as string}
                      className="w-28 md:w-40 lg:w-max  appearance-none outline-none border-none ring-2  rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                      type="datetime-local"
                      placeholder="Please select a date"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-5  justify-center">
                <div className="mt-2 flex flex-col text-red-600 items-start justify-start font-Kanit">
                  <label>
                    {user.language === "Thai" && "กำหนดเวลาหมดอายุ"}
                    {user.language === "English" && "qrcode expire at"}
                  </label>
                  <input
                    onChange={(e) =>
                      setAttendanceQrData((prev) => {
                        const value = e.target.value;
                        return {
                          ...prev,
                          expireAt: value,
                        };
                      })
                    }
                    value={attendanceQrData.expireAt as string}
                    className="w-28 md:w-40 lg:w-max  appearance-none outline-none border-none ring-2  rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-red-700 "
                    type="datetime-local"
                    placeholder="Please select a date"
                  />
                </div>
                <div className="mt-2 flex flex-col text-black items-start justify-start font-Kanit">
                  <label>
                    {user.language === "Thai" &&
                    attendanceQrData.isLimitOneBrowser ? (
                      <span>
                        ผู้เรียนสามารถแสกนได้{" "}
                        <span className="font-semibold text-red-500">
                          ครั้งเดียว
                        </span>
                      </span>
                    ) : (
                      <span>
                        ผู้เรียนสามารถแสกนได้{" "}
                        <span className="font-semibold text-green-400">
                          หลายครั้ง
                        </span>
                      </span>
                    )}
                    {user.language === "English" &&
                      "students can scan many times as they wish"}
                  </label>
                  <button className="w-max px-5 py-1 rounded-md ring-2 ring-gray-200">
                    <Switch
                      color="warning"
                      checked={attendanceQrData.isLimitOneBrowser}
                      onChange={(e) =>
                        setAttendanceQrData((prev) => {
                          return {
                            ...prev,
                            isLimitOneBrowser: !prev.isLimitOneBrowser,
                          };
                        })
                      }
                    />
                  </button>
                </div>
              </div>
            </section>
          </body>
          <div className="relative w-full lg:h-40  xl:h-60 mt-5 ">
            <div className="absolute w-full lg:h-40  xl:h-60 overflow-y-scroll  rounded-b-lg ">
              <table className="w-full  	">
                <thead className="border-b-8 sticky top-0 z-40 h-10 bg-green-200  border-transparent">
                  <tr>
                    <td>เวลาเริ่มคลาส</td>
                    <td>หมดอายุ</td>
                    <td>ข้อจำกัด</td>
                    <td>QR Code</td>
                    <td>ตัวเลือก</td>
                  </tr>
                </thead>
                <tbody className="border-spacing-2 h-40 overflow-y-auto">
                  {allQrCode.isLoading
                    ? loadingCount.map((list, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <Skeleton variant="rectangular" />
                            </td>
                            <td>
                              <Skeleton variant="rectangular" />
                            </td>
                            <td>
                              <Skeleton variant="rectangular" />
                            </td>
                            <td>
                              <Skeleton variant="rectangular" />
                            </td>
                            <td>
                              <Skeleton variant="rectangular" />
                            </td>
                          </tr>
                        );
                      })
                    : allQrCode?.data?.map((qrCode, index) => {
                        const date = new Date(qrCode.date);
                        const formattedDate = date.toLocaleDateString(
                          `${
                            user.language === "Thai"
                              ? "th-TH"
                              : user.language === "English" && "en-US"
                          }`,
                          {
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

                        const expireAt = new Date(qrCode.exipreAt);

                        const formattedExpireAt = expireAt.toLocaleDateString(
                          `${
                            user.language === "Thai"
                              ? "th-TH"
                              : user.language === "English" && "en-US"
                          }`,
                          {
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
                          <tr
                            key={qrCode.id}
                            className={`border-b-2 border-spacing-2 h-14 border-slate-200 ${
                              selectUpdate?.index === index
                                ? "bg-blue-100"
                                : "bg-white"
                            }`}
                          >
                            <td>{formattedDate}</td>

                            <td>{formattedExpireAt}</td>
                            <td>
                              {qrCode.isLimitOneBrowser ? (
                                <span className="text-red-500 font-medium">
                                  แสกนได้ครั้งเดียว
                                </span>
                              ) : (
                                <span className="text-green-400 font-medium">
                                  แสกนได้หลายครั้ง
                                </span>
                              )}
                            </td>
                            <td className="">
                              <button
                                onClick={() => {
                                  setSelectQrCodeId(() => qrCode.id as string);
                                  setTriggerShowQrCode(() => true);
                                }}
                                className="flex gap-2 justify-center items-center px-4 py-1
                     bg-green-400 text-white rounded-lg hover:bg-green-700 active:scale-110 transition duration-150"
                              >
                                <span>เปิด</span>
                                <AiOutlineQrcode />
                              </button>
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setTriggerUpdate((prev) => {
                                    if (index === selectUpdate?.index) {
                                      setSelectUpdate(() => {
                                        return {
                                          data: null,
                                          index: null,
                                        };
                                      });
                                      return !prev;
                                    } else {
                                      return true;
                                    }
                                  });
                                  setAttendanceQrData((prev) => {
                                    const exipreAt = new Date(qrCode.exipreAt);
                                    const exipreAtFormat = moment(exipreAt)
                                      .tz(userTimeZone)
                                      .format("YYYY-MM-DDTHH:mm");

                                    return {
                                      ...prev,
                                      isLimitOneBrowser:
                                        qrCode.isLimitOneBrowser,
                                      expireAt: exipreAtFormat,
                                    };
                                  });
                                  setSelectUpdate(() => {
                                    return {
                                      data: qrCode,
                                      index: index,
                                    };
                                  });
                                }}
                                className="p-3 rounded-full bg-red-500 active:scale-105 text-red-200 hover:bg-red-700"
                              >
                                <AiFillEdit />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
      <footer
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerAttendanceQrCode(() => false);
        }}
        className={`w-screen backdrop-blur-sm h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10  ${
          triggerShowQrCode ? "bg-white/80" : "bg-white/30"
        } `}
      ></footer>
    </div>
  );
}

export default CheckAttendanceByQrCode;
