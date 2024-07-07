import React, { useState } from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { User } from "../../models";
import { DownloadExcelAttendanceService } from "../../services/dowloadFile";

type DowloadExcelAttendacneProps = {
  close: (
    focusableElement?:
      | HTMLElement
      | React.MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
  teacherId?: string;
  user: User;
};

function DowloadExcelAttendacne({
  close,
  teacherId,
  user,
}: DowloadExcelAttendacneProps) {
  const router = useRouter();
  const [excelData, setExcelData] = useState({
    holiday:
      user.language === "Thai"
        ? "ลา"
        : user.language === "English" && "take a leave",
    sick:
      user.language === "Thai" ? "ป่วย" : user.language === "English" && "sick",
    absent:
      user.language === "Thai"
        ? "ขาด"
        : user.language === "English" && "absent",
    present:
      user.language === "Thai"
        ? "มาเรียน"
        : user.language === "English" && "present",
    late:
      user.language === "Thai" ? "สาย" : user.language === "English" && "late",
    warn:
      user.language === "Thai"
        ? "เฝ้าระวัง"
        : user.language === "English" && "warn",
  });
  const handleChangeExcelData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExcelData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleDownloadFile = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await DownloadExcelAttendanceService({
        classroomId: router.query.classroomId as string,
        absent: excelData.absent as string,
        holiday: excelData.holiday as string,
        present: excelData.present as string,
        sick: excelData.sick as string,
        late: excelData.late as string,
        warn: excelData.warn as string,
        teacherId: teacherId as string,
      });
      Swal.fire(
        "ดาวโหลดสำเร็จ",
        "ดาวโหลดไฟล์รายงานผลเข้าเรียนเรียบร้อย",
        "success"
      );
    } catch (err: any) {
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      console.error(err);
    }
  };
  return (
    <div
      className="z-40 
    top-0 right-0 left-0 bottom-0 m-auto fixed flex justify-center items-center"
    >
      <div className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 ">
        <form
          onSubmit={handleDownloadFile}
          className=" w-80 flex flex-col justify-center items-center "
        >
          <span className="text-xl font-semibold text-[#2C7CD1]">
            {user.language === "Thai" && "โหลดไฟล์ Excel"}
            {user.language === "English" && "Dowload file excel"}
          </span>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "สถานะมาเรียน"}
              {user.language === "English" && "present"}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="present"
              value={excelData.present as string}
              placeholder={
                user.language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะมาเรียน"
                  : "Put any text when student's present"
              }
              maxLength={10}
              required
            />
          </div>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "สถานะป่วย"}
              {user.language === "English" && "sick"}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="sick"
              value={excelData.sick as string}
              placeholder={
                user.language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะป่วย"
                  : "Put any text when student's sick"
              }
              maxLength={10}
              required
            />
          </div>

          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "สถานะขาดเรียน"}
              {user.language === "English" && "absent"}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md  ring-2 appearance-none ring-black pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="absent"
              value={excelData.absent as string}
              placeholder={
                user.language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะขาดเรียน"
                  : "Put any text when student's absent"
              }
              maxLength={10}
              required
            />
          </div>
          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "สถานะลา"}
              {user.language === "English" && "take a leave  "}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md  ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="holiday"
              value={excelData.holiday as string}
              placeholder={
                user.language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะลา"
                  : "Put any text when student's on holiday"
              }
              maxLength={10}
              required
            />
          </div>
          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "สถานะสาย"}
              {user.language === "English" && "late "}
            </label>
            <input
              onChange={handleChangeExcelData}
              className="w-60 h-7 rounded-md ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="late"
              value={excelData.late as string}
              placeholder={
                user.language === "Thai"
                  ? "กรอกอักษร เมื่อนักเรียนมีสถานะสาย"
                  : "Put any text when student's late"
              }
              maxLength={10}
              required
            />
          </div>
          {user?.schoolUser?.organization === "immigration" && (
            <div className="flex flex-col relative mt-2">
              <label className="font-sans font-normal">
                {user.language === "Thai" && "เฝ้าระวัง"}
                {user.language === "English" && "warn "}
              </label>
              <input
                onChange={handleChangeExcelData}
                className="w-60 h-7 rounded-md ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
                type="text"
                name="warn"
                value={excelData.warn as string}
                placeholder={
                  user.language === "Thai"
                    ? "กรอกอักษร เมื่อนักเรียนมีสถานะเฝ้าระวัง"
                    : "Put any text when student's warn"
                }
                maxLength={10}
                required
              />
            </div>
          )}

          <button
            aria-label="create classroom button"
            className="w-full  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
          >
            {user.language === "Thai" && "ดาวน์โหลด"}
            {user.language === "English" && "dowload"}
          </button>
        </form>
      </div>
      <div
        onClick={() => close()}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default DowloadExcelAttendacne;
