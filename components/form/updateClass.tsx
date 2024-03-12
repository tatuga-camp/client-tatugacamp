import React, { useState } from "react";

import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import Swal from "sweetalert2";
import { Classroom, User } from "../../models";
import { UseQueryResult } from "@tanstack/react-query";
import { UpdateClassroomService } from "../../services/classroom";
interface ClassroomData {
  classroomId: string;
  title: string;
  level: string;
  description: string;
}
type UpdateClassProps = {
  close: (
    focusableElement?:
      | HTMLElement
      | React.MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
  user: User;
  classroom: UseQueryResult<Classroom, Error>;
};
function UpdateClass({ close, classroom, user }: UpdateClassProps) {
  const [classroomData, setClassroomData] = useState<ClassroomData>({
    classroomId: classroom.data?.id as string,
    title: classroom.data?.title as string,
    level: classroom.data?.level as string,
    description: classroom.data?.description as string,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClassroomData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      await UpdateClassroomService({
        ...classroomData,
      });
      Swal.fire({ title: "แก้ไขห้องเรียนสำเร็จ", icon: "success" });
      document.body.style.overflow = "auto";
      classroom.refetch();
    } catch (err: any) {
      console.log("err", err);
      document.body.style.overflow = "auto";
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  return (
    <div className="relative z-40">
      <div
        className="flex w-max h-max font-Kanit p-5 bg-white border-2 border-solid rounded-lg drop-shadow-xl  z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <form
          className=" w-80 flex flex-col justify-center items-center "
          onSubmit={handleSubmit}
        >
          <span className="text-xl font-semibold text-[#2C7CD1]">
            {user.language === "Thai" && "แก้ไขห้องเรียนของคุณ"}
            {user.language === "English" && "Classroom setting"}
          </span>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "รายชื่อวิชา"}
              {user.language === "English" && "title"}
            </label>
            <input
              onChange={handleChange}
              className="w-60 h-7 rounded-md  ring-2 appearance-none ring-black pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="title"
              placeholder={
                user.language === "Thai"
                  ? "เช่น วิชาภาษาไทย"
                  : "Ex. mathematics"
              }
              maxLength={30}
              value={classroomData.title}
            />
            <div
              className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcBusinessContact />
            </div>
          </div>

          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "ระดับชั้น"}
              {user.language === "English" && "level"}
            </label>
            <input
              className="w-60 h-7 rounded-md ring-2 appearance-none ring-black pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              onChange={handleChange}
              name="level"
              placeholder={
                user.language === "Thai" ? "เช่น ม.6/5" : "grade 6 / 4"
              }
              maxLength={30}
              value={classroomData.level}
            />
            <div
              className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcLineChart />
            </div>
          </div>
          <div className="flex flex-col relative mt-2">
            <label className="font-sans font-normal">
              {user.language === "Thai" && "คำอธิบาย (optional) "}
              {user.language === "English" && "description (optional)"}
            </label>
            <input
              className="w-60 h-7 rounded-md ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
              onChange={handleChange}
              type="text"
              name="description"
              placeholder={
                user.language === "Thai" ? "เช่น ท55435" : "Ex. MATH445"
              }
              maxLength={30}
              value={classroomData.description}
            />
            <div
              className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcViewDetails />
            </div>
          </div>

          <button
            className="w-full  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
          >
            {user.language === "Thai" && "แก้ไข"}
            {user.language === "English" && "enter"}
          </button>
        </form>
      </div>
      <div
        onClick={() => {
          close();
          document.body.style.overflow = "auto";
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-20 bg-black/30 "
      ></div>
    </div>
  );
}

export default UpdateClass;
