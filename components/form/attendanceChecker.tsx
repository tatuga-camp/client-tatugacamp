import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdEmojiPeople, MdOutlineEventNote } from "react-icons/md";
import Swal from "sweetalert2";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { Editor } from "@tinymce/tinymce-react";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { FaArrowRight } from "react-icons/fa";
import moment from "moment-timezone";
import { Student, StudentWithScore, User } from "../../models";
import { ResponseGetAllStudentsService } from "../../services/students";
import {
  CreateAttendanceService,
  GetAllAttendanceService,
} from "../../services/attendance";
import { filePickerCallback } from "../../utils/filePickerCallback";
import Loading from "../loadings/loading";

// Define the type for the transformed student data
type TransformedStudent = StudentWithScore & {
  attendance: {
    absent: boolean;
    present: boolean;
    holiday: boolean;
    sick: boolean;
    late: boolean;
  };
};

type AttendanceCheckerProps = {
  user: User;
  setTriggerAttendance: React.Dispatch<React.SetStateAction<boolean>>;
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
};
function AttendanceChecker({
  setTriggerAttendance,
  students,
  user,
}: AttendanceCheckerProps) {
  const router = useRouter();
  const [isCheckStudent, setIsCheckStudent] = useState<
    TransformedStudent[] | null | undefined
  >(() => {
    return students?.data?.map((student) => {
      return {
        ...student,
        attendance: {
          absent: false,
          present: false,
          holiday: false,
          sick: false,
          late: false,
        },
      };
    });
  });

  const [endAttendanceDate, setEndAttendanceDate] = useState<string>();
  const [attendanceDate, setAttendanceDate] = useState<string>();
  const [note, setNote] = useState({
    body: "",
  });

  useEffect(() => {
    const timeZone = "Asia/Bangkok";
    // Get the current date and time in the specified time zone
    const currentTime = moment().tz(timeZone).format("YYYY-MM-DDTHH:mm");
    setEndAttendanceDate(() => currentTime);
    setAttendanceDate(() => currentTime);
  }, []);

  const [loading, setLoading] = useState(false);
  const [triggerAddNote, setTriggerAddNote] = useState(false);
  const attendances = useQuery({
    queryKey: ["attendance", router.query.classroomId as string],
    queryFn: () =>
      GetAllAttendanceService({
        classroomId: router.query.classroomId as string,
      }),
  });

  const handleEditorChange = (content: string) => {
    setNote((prev) => {
      return {
        ...prev,
        body: content,
      };
    });
  };

  const handleIsCheckStudent = ({
    studentId,
    event,
  }: {
    studentId: string;
    event: React.ChangeEvent<HTMLInputElement>;
  }) => {
    const { name } = event.target;
    setIsCheckStudent((prevState) => {
      return prevState?.map((student) => {
        if (student.id !== studentId) return student;
        let convertAttendance = { ...student.attendance };

        for (const key in convertAttendance) {
          if (key === name) {
            convertAttendance[key as keyof typeof convertAttendance] =
              !convertAttendance[key as keyof typeof convertAttendance];
          } else {
            convertAttendance[key as keyof typeof convertAttendance] = false;
          }
        }
        return {
          ...student,
          attendance: {
            ...convertAttendance,
          },
        };
      });
    });
  };

  const handleCheckAllstudent = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const { name } = event.currentTarget;
    setIsCheckStudent((prevState) => {
      return prevState?.map((student) => {
        let convertAttendance = { ...student.attendance };

        for (const key in convertAttendance) {
          if (key === name) {
            convertAttendance[key as keyof typeof convertAttendance] =
              !convertAttendance[key as keyof typeof convertAttendance];
          } else {
            convertAttendance[key as keyof typeof convertAttendance] = false;
          }
        }
        return {
          ...student,
          attendance: {
            ...convertAttendance,
          },
        };
      });
    });
  };

  const handleSummitForm = async () => {
    try {
      setLoading(true);
      const parser = new DOMParser();
      const doc = parser.parseFromString(note.body, "text/html");
      const imageElements = doc.getElementsByTagName("img");
      const imageUrls = Array.from(imageElements).map((img) => img.src);

      await CreateAttendanceService({
        students: isCheckStudent as TransformedStudent[],
        note: note.body,
        imagesBase64: imageUrls,
        attendanceDate: attendanceDate as string,
        classroomId: router.query.classroomId as string,
        endAttendanceDate: endAttendanceDate as string,
      });
      setLoading(false);
      await attendances.refetch();
      Swal.fire("success", "check attendacne completed", "success");
      document.body.style.overflow = "auto";

      setTriggerAttendance(() => false);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      document.body.style.overflow = "auto";
    }
  };
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 m-auto righ z-40">
      <div
        className="w-screen  md:w-11/12 lg:w-11/12  xl:w-3/4 h-5/6 md:max-h-[35rem] overflow-auto  fixed z-40 top-0 bottom-0 right-0
       left-0 m-auto flex  items-center justify-center gap-5 py-5  bg-white p-0 md:p-5 rounded-none md:rounded-lg  "
      >
        <div className="w-full md:w-full relative   md:h-full  flex flex-col items-center justify-start gap-5 ">
          {/* headers parts */}
          <div className="w-full flex-col flex items-center justify-between md:justify-around ">
            <button
              onClick={() => setTriggerAddNote((prev) => !prev)}
              className="flex gap-2 items-center justify-center bg-green-200 px-5 py-2 rounded-lg
              text-green-700 font-semibold font-Kanit transition duration-150 hover:text-green-200 hover:bg-green-600
              active:ring-2 ring-green-800"
            >
              {triggerAddNote ? (
                <div className="flex gap-2 items-center">
                  <IoCaretBackCircleSharp />
                  {user.language === "Thai" && "กลับ"}
                  {user.language === "English" && "back"}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MdOutlineEventNote />
                  {user.language === "Thai" && "เพิ่มโน๊ต"}
                  {user.language === "English" && "add note"}
                </div>
              )}
            </button>
            <div className="flex gap-2  md:gap-10 items-end justify-center">
              <div className="mt-2 flex flex-col text-black items-center font-Kanit">
                <label>
                  {user.language === "Thai" && "เริ่มคลาสเมื่อ"}
                  {user.language === "English" && "begin class at"}
                </label>
                <input
                  onChange={(e) =>
                    setAttendanceDate(() => {
                      const value = e.target.value;
                      return value;
                    })
                  }
                  value={attendanceDate}
                  className="w-28 md:w-40 lg:w-max  appearance-none outline-none border-none ring-2   rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                  type="datetime-local"
                  placeholder="Please select a date"
                />
              </div>
              <div className="">
                <FaArrowRight />
              </div>
              <div className="mt-2 flex flex-col text-black items-center font-Kanit">
                <label>
                  {user.language === "Thai" && "จบคลาสเมื่อ"}
                  {user.language === "English" && "end class at"}
                </label>
                <input
                  onChange={(e) =>
                    setEndAttendanceDate(() => {
                      const value = e.target.value;
                      return value;
                    })
                  }
                  value={endAttendanceDate}
                  className="w-28 md:w-40  lg:w-max appearance-none outline-none border-none ring-2  rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                  type="datetime-local"
                  placeholder="Please select a date"
                />
              </div>
              {loading ? (
                <div
                  className="w-max  text-white flex items-center hover:scale-110 transition duration-150 
                cursor-pointer
               justify-center h-max px-8 py-2 rounded-lg font-Poppins"
                >
                  <Loading />
                </div>
              ) : (
                <button
                  onClick={handleSummitForm}
                  className="w-max bg-blue-500 text-white flex items-center hover:scale-110 transition duration-150 
                cursor-pointer
               justify-center h-max px-8 py-2 font-Kanit rounded-lg drop-shadow-md"
                >
                  {user.language === "Thai" && "ยืนยัน"}
                  {user.language === "English" && "submit"}
                </button>
              )}
            </div>
          </div>

          <div
            className={`${
              triggerAddNote ? "w-full h-full" : "w-0 h-0 opacity-0"
            }`}
          >
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
              textareaName="note"
              value={note.body}
              init={{
                link_context_toolbar: true,
                height: "100%",
                width: "100%",
                menubar: true,
                image_title: true,
                automatic_uploads: true,
                file_picker_types: "image",
                file_picker_callback: filePickerCallback,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | blocks | " +
                  "bold italic backcolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "link | image",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={handleEditorChange}
            />
          </div>

          <table className={`${triggerAddNote ? " w-0 h-0 hidden" : "block"}`}>
            <thead className="">
              <tr className=" w-full border-b-2 border-black pb-2  text-black font-Kanit flex gap-2 md:gap-3 lg:gap-5 ">
                <th className="w-9 text-xs md:text-base md:w-28">
                  {user.language === "Thai" && "เลขที่"}
                  {user.language === "English" && "number"}
                </th>
                <th className="w-16 text-xs md:text-base md:w-40 lg:w-60">
                  {user.language === "Thai" && "รายชื่อ"}
                  {user.language === "English" && "name"}
                </th>
                <th className="w-10 text-xs md:text-base md:w-20">
                  <button
                    onClick={handleCheckAllstudent}
                    name="present"
                    role="button"
                    aria-label="check all"
                    className="w-full bg-green-500 rounded-2xl text-white text-center 
                  hover:scale-110 transition duration-150 truncate cursor-pointer group"
                  >
                    <span className="block group-hover:hidden">
                      {user.language === "Thai" && "เข้าเรียน"}
                      {user.language === "English" && "present"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {user.language === "Thai" && "เลือกทั้งหมด"}
                      {user.language === "English" && "pick all"}
                    </span>
                  </button>
                </th>
                <th className="w-10 text-xs md:text-base md:w-20">
                  <button
                    onClick={handleCheckAllstudent}
                    name="holiday"
                    role="button"
                    aria-label="check all"
                    className="w-full  bg-yellow-500 rounded-2xl text-white text-center 
                  hover:scale-110 transition duration-150 cursor-pointer group"
                  >
                    <span className="block group-hover:hidden text-md">
                      {user.language === "Thai" && "ลา"}
                      {user.language === "English" && "take a leave"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {user.language === "Thai" && "เลือกทั้งหมด"}
                      {user.language === "English" && "pick all"}
                    </span>
                  </button>
                </th>
                <th className="w-10 text-xs md:text-base md:w-20">
                  <button
                    onClick={handleCheckAllstudent}
                    name="sick"
                    role="button"
                    aria-label="check all"
                    className="w-full  bg-blue-500 rounded-2xl text-white text-center 
                  hover:scale-110 transition duration-150 cursor-pointer group"
                  >
                    <span className="block group-hover:hidden">
                      {user.language === "Thai" && "ป่วย"}
                      {user.language === "English" && "sick"}
                    </span>
                    <span className="hidden group-hover:block  text-sm">
                      {user.language === "Thai" && "เลือกทั้งหมด"}
                      {user.language === "English" && "pick all"}
                    </span>
                  </button>
                </th>
                <th className="w-10 text-xs md:text-base md:w-20">
                  <button
                    onClick={handleCheckAllstudent}
                    name="absent"
                    role="button"
                    aria-label="check all"
                    className="w-full bg-red-500 rounded-2xl text-white text-center
                  hover:scale-110 transition duration-150 cursor-pointer group"
                  >
                    <span className="block group-hover:hidden">
                      {user.language === "Thai" && "ขาด"}
                      {user.language === "English" && "absent"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {user.language === "Thai" && "เลือกทั้งหมด"}
                      {user.language === "English" && "pick all"}
                    </span>
                  </button>
                </th>
                <th className="w-10 text-xs md:text-base md:w-20">
                  <button
                    onClick={handleCheckAllstudent}
                    name="late"
                    role="button"
                    aria-label="check all"
                    className="w-full bg-orange-500 rounded-2xl text-white text-center
                  hover:scale-110 transition duration-150 cursor-pointer group"
                  >
                    <span className="block group-hover:hidden">
                      {user.language === "Thai" && "สาย"}
                      {user.language === "English" && "late"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {user.language === "Thai" && "เลือกทั้งหมด"}
                      {user.language === "English" && "pick all"}
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody
              className="w-full   h-80 items-center justify-start  mt-2 
            overflow-auto  fade-mask-short flex flex-col "
            >
              {isCheckStudent?.map((student) => {
                return (
                  <tr
                    key={student.id}
                    className="w-full text-black hover:bg-slate-200 transition duration-150 ease-in-out 
                     font-Kanit flex gap-2 md:gap-3 lg:gap-5 "
                  >
                    <td className="w-9 text-xs  md:text-base md:w-28 text-center">
                      {student.number}
                    </td>
                    <td className="w-16 text-xs md:text-base md:w-40 lg:w-60 truncate hover:overflow-visible hover:relative hover:z-30">
                      {student.firstName} {student?.lastName}
                    </td>
                    <td className="w-10 text-xs md:text-base md:w-20 flex justify-center">
                      <div
                        className=" bg-green-500 rounded text-white w-6 text-center
                       p-1  flex items-center  justify-center"
                      >
                        <input
                          name="present"
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.attendance.present}
                          className="h-5  w-5 rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                    </td>
                    <td className="w-10 text-xs md:text-base md:w-20 flex justify-center">
                      <div
                        className=" bg-yellow-500 rounded-md text-white text-center 
                      p-1  w-6 h-6 flex items-center justify-center"
                      >
                        <input
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.attendance.holiday}
                          name="holiday"
                          className="h-5 w-5  rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                    </td>
                    <td className="w-10 text-xs md:text-base md:w-20 flex justify-center">
                      <div
                        className=" bg-blue-500 rounded-md text-white text-center 
                      p-1  w-6 h-6 flex items-center justify-center"
                      >
                        <input
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.attendance.sick}
                          name="sick"
                          className="h-5 w-5   rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                    </td>
                    <td className="w-10 text-xs md:text-base md:w-20 flex justify-center">
                      <div
                        className=" bg-red-500 rounded-md text-white text-center 
                      p-1  w-6 h-6 flex items-center justify-center"
                      >
                        <input
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.attendance.absent}
                          name="absent"
                          className="h-5 w-5  rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                    </td>
                    <td className="w-10 text-xs md:text-base md:w-20 flex justify-center">
                      <div
                        className=" bg-orange-500 rounded-md text-white text-center 
                      p-1  w-6 h-6 flex items-center justify-center"
                      >
                        <input
                          onChange={(event) =>
                            handleIsCheckStudent({
                              studentId: student.id,
                              event,
                            })
                          }
                          checked={student?.attendance.late}
                          name="late"
                          className="h-5 w-5  rounded-full shadow"
                          type="checkbox"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerAttendance(false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default AttendanceChecker;
