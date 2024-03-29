import React, { useState } from "react";
import { FcBusinessContact, FcLineChart, FcViewDetails } from "react-icons/fc";
import Swal from "sweetalert2";
import { Language } from "../../models";
import { UseQueryResult } from "@tanstack/react-query";
import {
  CreateClassroomService,
  ResponseGetAllClassroomsService,
} from "../../services/classroom";
import Loading from "../loadings/loading";

type CreateClassroomProps = {
  classrooms: UseQueryResult<ResponseGetAllClassroomsService, Error>;
  setTriggerCreateClassroom: React.Dispatch<React.SetStateAction<boolean>>;
  language: Language;
};

function CreateClassroom({
  setTriggerCreateClassroom,
  classrooms,
  language,
}: CreateClassroomProps) {
  const [createClassroomData, setCreateClassroomData] = useState<{
    title: string;
    description: string;
    level: string;
  }>({
    title: "",
    description: "",
    level: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChangecreateClassroomData = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCreateClassroomData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(() => true);
      e.preventDefault();
      await CreateClassroomService({
        title: createClassroomData.title,
        description: createClassroomData.description,
        level: createClassroomData.level,
      });
      await classrooms.refetch();
      document.body.style.overflow = "auto";
      setTriggerCreateClassroom(() => false);
      setIsLoading(() => false);

      Swal.fire("success", "create classroom success", "success");
    } catch (err: any) {
      setIsLoading(() => false);
      console.log("err", err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
    }
  };

  return (
    <div className="fixed z-50 top-0 bottom-0 right-0 left-0 m-auto flex items-center justify-center">
      <div
        className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
        top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <form
          className=" w-80 flex flex-col gap-5 justify-center items-center "
          onSubmit={handleSubmit}
        >
          <span className="text-xl font-semibold text-[#2C7CD1]">
            {language === "Thai" && "สร้างห้องเรียน"}
            {language === "English" && "Create a classroom"}
          </span>
          <span className="mb-5">
            ดูคู่มือการสร้างห้องเรียน{" "}
            <a
              target="_blank"
              href="https://youtu.be/IkLKD-Mk8nw?si=M2SfvBC9lkGkGlKA"
            >
              คลิก
            </a>
          </span>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">
              {language === "Thai" && "รายชื่อวิชา"}
              {language === "English" && "Title"}
            </label>
            <input
              className="w-60 h-7  ring-2 ring-black appearance-none
                rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="title"
              onChange={handleChangecreateClassroomData}
              placeholder={
                language === "Thai" ? "เช่น วิชาภาษาไทย" : "Ex. mathematics"
              }
              maxLength={30}
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
              {language === "Thai" && "ระดับชั้น"}
              {language === "English" && "level"}
            </label>
            <input
              className="w-60 h-7 ring-2 ring-black rounded-md   pl-10 appearance-none
                placeholder:italic placeholder:font-light"
              type="text"
              name="level"
              onChange={handleChangecreateClassroomData}
              placeholder={
                language === "Thai" ? "เช่น ม.6/5" : "Ex. grade 10 / 5"
              }
              maxLength={20}
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
              {language === "Thai" && "คำอธิบาย (optional) "}
              {language === "English" && "description (optional)"}
            </label>
            <input
              className="w-60 h-7  ring-2 ring-black appearance-none
                rounded-md   pl-10 
                placeholder:italic placeholder:font-light"
              type="text"
              name="description"
              onChange={handleChangecreateClassroomData}
              placeholder={language === "Thai" ? "เช่น ท55435" : "Ex. MATH445"}
              maxLength={20}
            />
            <div
              className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
            >
              <FcViewDetails />
            </div>
          </div>

          <button
            disabled={isLoading}
            aria-label="create classroom button"
            className="w-full  h-9 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
          >
            {isLoading ? <Loading /> : language === "Thai" ? "สร้าง" : "create"}
          </button>
        </form>
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerCreateClassroom(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default CreateClassroom;
