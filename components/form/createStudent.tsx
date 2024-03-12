import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  FcBusinessContact,
  FcLineChart,
  FcViewDetails,
  FcUndo,
} from "react-icons/fc";
import { SiMicrosoftexcel } from "react-icons/si";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import * as SuccesfulAnimation from "../animations/jsons/79952-successful.json";
import ExcelTable from "./createManyStudent";
import { MdError } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Student, User } from "../../models";
import {
  CreateStudentService,
  GetAllStudentsService,
} from "../../services/students";
import Loading from "../loadings/loading";

type CreateStudentProps = {
  user: User;
  close: (
    focusableElement?:
      | HTMLElement
      | React.MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
};
function CreateStudent({ close, user }: CreateStudentProps) {
  const router = useRouter();
  const [succesful, setSuccesful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isExcelData, setIsExcelData] = useState(true);
  const [studentData, setStudentData] = useState<{
    firstName: string | null;
    lastName: string | null;
    number: string | null;
  }>({
    firstName: "",
    lastName: "",
    number: "",
  });
  const [error, setError] = useState<string | null>();
  // students' data from excel
  const [tabelData, setTabledata] = useState<
    {
      id: string;
      number: string;
      firstName: string;
      lastName: string;
      status?: number;
      Notloading?: boolean;
      error?: string;
    }[]
  >();
  const students = useQuery({
    queryKey: ["students", router.query.classroomId as string],
    queryFn: () =>
      GetAllStudentsService({
        classroomId: router.query.classroomId as string,
      }),
  });
  const [sortedStudents, setSortedStudents] = useState<Student[]>();

  // sort student by nuber
  useEffect(() => {
    setSortedStudents((prev) => {
      return students?.data?.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
    });
  }, [students.isFetching, sortedStudents]);

  const handleChangeStudentData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setStudentData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const inputObject = Object.fromEntries(formData);
    setError("");
    setLoading(true);
    try {
      const createStudent = await CreateStudentService({
        firstName: studentData?.firstName as string,
        lastName: studentData?.lastName as string,
        number: studentData?.number as string,
        classroomId: router.query.classroomId as string,
      });
      setLoading(false);
      if (createStudent) {
        setSuccesful(true);
      }
      await students.refetch();
      const form = document.getElementById(
        "form-create-students"
      ) as HTMLFormElement;

      // Check if the form exists and then call the reset method
      if (form) {
        form.reset();
      }

      setTimeout(() => {
        setSuccesful(false);
      }, 2000);
    } catch (err: any) {
      setLoading(false);
      setError(err?.props?.response?.data?.message);
    }
  };
  const style = {
    height: 50,
  };
  return (
    <div className="">
      <div className="w-max p-3 h-max fixed right-0 left-0 top-0 bottom-0 m-auto z-40  ">
        <div className="flex items-center justify-center gap-x-5  bg-transparent h-[0.05rem] w-max">
          <div
            className="lg:w-[30rem] xl:w-[40rem] md:w-80 lg:max-w-[45rem] h-[30rem] bg-white border-2 border-solid  flex-col justify-start items-center 
          rounded-xl font-Kanit md:flex hidden"
          >
            <div className=" font-Kanit font-bold text-xl mt-2">
              <span className="text-black">
                {isExcelData &&
                  user.language === "Thai" &&
                  "รายชื่อนักเรียนในห้อง"}
                {!isExcelData &&
                  user.language === "Thai" &&
                  "รายชื่อนักเรียนที่จะถูกสร้าง"}
                {isExcelData &&
                  user.language === "English" &&
                  "list of current students"}
                {!isExcelData &&
                  user.language === "English" &&
                  "list of students whom will be created"}
              </span>
            </div>
            <div className="w-full  flex flex-col items-center justify-start mt-5">
              <ul
                className={`grid ${
                  isExcelData === false ? "grid-cols-6" : "grid-cols-3"
                } pl-0 list-none w-full`}
              >
                <li
                  className={`flex ${
                    isExcelData === false ? "col-span-2 " : "col-span-1"
                  } justify-center items-cente`}
                >
                  {user.language === "Thai" && "เลขที่"}
                  {user.language === "English" && "number"}
                </li>
                <li className="flex justify-center items-cente">
                  {user.language === "Thai" && "ชื่อจริง"}
                  {user.language === "English" && "first name"}
                </li>
                <li className="flex justify-center items-cente">
                  {user.language === "Thai" && "นามสกุล"}
                  {user.language === "English" && "last name"}
                </li>
                {isExcelData === false && (
                  <li className="flex justify-center items-cente col-span-2">
                    {user.language === "Thai" && "สถานะ"}
                    {user.language === "English" && "status"}
                  </li>
                )}
              </ul>
              <ul
                className=" mt-5 list-disc flex flex-col justify-start items-start w-full pl-0
            gap-y-5 h-80  overflow-auto bg-white scrollbar"
              >
                {isExcelData === false
                  ? tabelData?.map((list) => {
                      return (
                        <li key={list.id} className="w-full">
                          <div className={`grid  grid-cols-6 w-full`}>
                            <div className="flex col-span-2  justify-center items-center  ">
                              <span
                                className="w-full flex items-center justify-center 
                          rounded-xl font-bold text-black"
                              >
                                {list.number}
                              </span>
                            </div>
                            <span className="flex text-sm justify-start items-center text-black">
                              {list.firstName}
                            </span>
                            <span className="flex  text-sm justify-start items-center text-black">
                              {list?.lastName}
                            </span>

                            {list.status === 400 && (
                              <div className="flex text-red-500 col-span-2 justify-center  items-center relative group cursor-pointer   bg-white">
                                <div
                                  className="w-40 text-xs h-max bg-white rounded-md 
                                absolute top-0 right-0 left-10 bottom-0 m-auto hidden group-hover:flex"
                                >
                                  {list.error}
                                </div>
                                <MdError />
                              </div>
                            )}
                            {list.status === 200 && (
                              <div className="flex text-green-500 text-lg justify-center col-span-2  items-center  ">
                                <AiOutlineCheckCircle />
                              </div>
                            )}
                            {list.Notloading === false && (
                              <div className="flex justify-center  items-center  ">
                                <Loading />
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })
                  : sortedStudents?.map((list) => {
                      return (
                        <li key={list.id} className="w-full">
                          <div className="grid  grid-cols-3  w-full">
                            <div className="flex col-span-1  justify-center items-center  ">
                              <span
                                className=" flex items-center justify-center 
                           font-bold text-black"
                              >
                                {list.number}
                              </span>
                            </div>
                            <span className="flex  col-span-1   justify-start items-center text-black">
                              {list.firstName}
                            </span>
                            <span className="flex col-span-1    justify-start items-center text-black">
                              {list?.lastName}
                            </span>
                          </div>
                        </li>
                      );
                    })}
              </ul>
            </div>
          </div>
          <div
            className="flex w-max relative h-[30rem] xl:h-max font-Kanit pt-10 p-10 bg-white border-2 border-solid rounded-lg drop-shadow-xl  
        z-20"
          >
            {isExcelData ? (
              <div
                onClick={() => setIsExcelData(false)}
                role="button"
                aria-label="click to import data from excel to create student"
                className="text-green-600 w-max text-2xl flex items-center  absolute top-2 right-1
              justify-center flex-col max-w-[6rem] text-left cursor-pointer hover:text-green-800 transition duration-150"
              >
                <SiMicrosoftexcel />
                <span className="text-xs text-center">
                  {user.language === "Thai" && "นำเข้าข้อมูลจาก Excel"}
                  {user.language === "English" && "import students from Excel"}
                </span>
              </div>
            ) : (
              <div
                onClick={() => setIsExcelData(true)}
                role="button"
                aria-label="click to undo data from excel to create student"
                className=" text-2xl flex items-center  absolute top-2 right-1
              justify-center flex-col w-16 text-left cursor-pointer transition duration-150"
              >
                <FcUndo />
                <span className="text-xs text-center">
                  {user.language === "Thai" && "กลับ"}
                  {user.language === "English" && "return"}
                </span>
              </div>
            )}
            {isExcelData ? (
              <form
                id="form-create-students"
                className=" w-80 flex flex-col justify-center items-center "
                onSubmit={handleSubmit}
              >
                <span className="text-xl font-semibold text-[#2C7CD1]">
                  {user.language === "Thai" && "ลงทะเบียนนักเรียน"}
                  {user.language === "English" && "create student"}
                </span>
                <div className="flex flex-col relative">
                  <label className="font-sans font-normal">
                    {user.language === "Thai" && "ชื่อจริง"}
                    {user.language === "English" && "first name"}
                  </label>
                  <input
                    className="w-60 h-7 rounded-md ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
                    type="text"
                    name="firstName"
                    placeholder="เช่น เพิ่มลาภ"
                    maxLength={30}
                    onChange={handleChangeStudentData}
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
                    {user.language === "Thai" && "นามสกุล (optional)"}
                    {user.language === "English" && "last name (optional)"}
                  </label>
                  <input
                    className="w-60 h-7 rounded-md ring-2 appearance-none ring-black  pl-10 
                placeholder:italic placeholder:font-light"
                    type="text"
                    name="lastName"
                    placeholder="เช่น โพธิ์หล้า"
                    maxLength={30}
                    onChange={handleChangeStudentData}
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
                    {user.language === "Thai" && "เลขที่"}
                    {user.language === "English" && "number"}
                  </label>
                  <input
                    className="w-60 h-7 rounded-md ring-2 appearance-none ring-black   pl-10 
                placeholder:italic placeholder:font-light"
                    type="text"
                    name="number"
                    placeholder="เช่น 02"
                    maxLength={30}
                    onChange={handleChangeStudentData}
                    min="1"
                    required
                  />
                  <div
                    className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                  >
                    <FcViewDetails />
                  </div>
                </div>

                <button
                  className="w-full  h-9 mt-5 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid flex items-center justify-center"
                >
                  {succesful && (
                    <Lottie animationData={SuccesfulAnimation} style={style} />
                  )}
                  {loading && <Loading />}
                  {!loading && !succesful && (
                    <span>
                      {user.language === "Thai" && "สร้าง"}
                      {user.language === "English" && "create"}
                    </span>
                  )}
                </button>
                <div>
                  {error && <span className="text-red-500 ">{error}</span>}
                </div>
              </form>
            ) : (
              <div>
                <ExcelTable
                  setTabledata={setTabledata}
                  user={user}
                  students={students}
                />
              </div>
            )}
          </div>

          <div
            onClick={() => close()}
            className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/50 "
          ></div>
        </div>
      </div>
    </div>
  );
}

export default CreateStudent;
