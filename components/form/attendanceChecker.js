import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdEmojiPeople } from "react-icons/md";
import Swal from "sweetalert2";
import { CreateAttendance, GetAllAttendance } from "../../service/attendance";
import Loading from "../loading/loading";
import { useQuery } from "react-query";

function AttendanceChecker({ close, students, language }) {
  const router = useRouter();
  const [isCheckStudent, setIsCheckStudent] = useState();
  const currentDate = new Date().toISOString().slice(0, 10); // get current date in "yyyy-mm-dd" format
  const [attendanceDate, setAttendanceDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);
  const attendances = useQuery(
    ["attendance"],
    () => GetAllAttendance({ classroomId: router.query.classroomId }),
    {
      enabled: false,
    }
  );
  useEffect(() => {
    setIsCheckStudent(() =>
      students?.data?.data?.map((student) => {
        return {
          ...student,
          [student.id]: {
            absent: false,
            present: false,
            holiday: false,
            sick: false,
            late: false,
          },
        };
      })
    );
  }, []);
  const handleIsCheckStudent = ({ studentId, event }) => {
    const { name } = event.target;
    setIsCheckStudent((prevState) => {
      return prevState.map((prevStudent) => {
        if (prevStudent.id === studentId) {
          if (
            (prevStudent[studentId].holiday &&
              prevStudent[studentId].present) ||
            prevStudent[studentId].absent ||
            prevStudent[studentId].sick ||
            prevStudent[studentId].late
          ) {
            return {
              ...prevStudent,
              [studentId]: {
                ...!prevStudent[studentId],
                [name]: !prevStudent[prevStudent.id][name],
              },
            };
          }
          if (
            (prevStudent[studentId].present && prevStudent[studentId].absent) ||
            prevStudent[studentId].holiday ||
            prevStudent[studentId].sick ||
            prevStudent[studentId].late
          ) {
            return {
              ...prevStudent,
              [studentId]: {
                ...!prevStudent[studentId],
                [name]: !prevStudent[prevStudent.id][name],
              },
            };
          }
          if (
            (prevStudent[studentId].holiday && prevStudent[studentId].absent) ||
            prevStudent[studentId].present ||
            prevStudent[studentId].sick ||
            prevStudent[studentId].late
          ) {
            return {
              ...prevStudent,
              [studentId]: {
                ...!prevStudent[studentId],
                [name]: !prevStudent[prevStudent.id][name],
              },
            };
          }
          if (
            (prevStudent[studentId].late && prevStudent[studentId].absent) ||
            prevStudent[studentId].present ||
            prevStudent[studentId].sick ||
            prevStudent[studentId].holiday
          ) {
            return {
              ...prevStudent,
              [studentId]: {
                ...!prevStudent[studentId],
                [name]: !prevStudent[prevStudent.id][name],
              },
            };
          }
          return {
            ...prevStudent,
            [studentId]: {
              ...prevStudent[studentId],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        } else {
          return { ...prevStudent };
        }
      });
    });
  };

  const handleCheckAllstudent = (event) => {
    const name = event.currentTarget.name;
    setIsCheckStudent((prevState) => {
      return prevState.map((prevStudent) => {
        if (
          (prevStudent[prevStudent.id].holiday &&
            prevStudent[prevStudent.id].present) ||
          prevStudent[prevStudent.id].absent ||
          prevStudent[prevStudent.id].sick ||
          prevStudent[prevStudent.id].late
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        if (
          (prevStudent[prevStudent.id].sick &&
            prevStudent[prevStudent.id].present) ||
          prevStudent[prevStudent.id].absent ||
          prevStudent[prevStudent.id].holiday ||
          prevStudent[prevStudent.id].late
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        if (
          (prevStudent[prevStudent.id].present &&
            prevStudent[prevStudent.id].absent) ||
          prevStudent[prevStudent.id].holiday ||
          prevStudent[prevStudent.id].sick ||
          prevStudent[prevStudent.id].late
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        if (
          (prevStudent[prevStudent.id].holiday &&
            prevStudent[prevStudent.id].absent) ||
          prevStudent[prevStudent.id].present ||
          prevStudent[prevStudent.id].sick ||
          prevStudent[prevStudent.id].late
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        if (
          (prevStudent[prevStudent.id].late &&
            prevStudent[prevStudent.id].absent) ||
          prevStudent[prevStudent.id].present ||
          prevStudent[prevStudent.id].sick ||
          prevStudent[prevStudent.id].holiday
        ) {
          return {
            ...prevStudent,
            [prevStudent.id]: {
              ...!prevStudent[prevStudent.id],
              [name]: !prevStudent[prevStudent.id][name],
            },
          };
        }
        return {
          ...prevStudent,
          [prevStudent.id]: {
            ...prevStudent[prevStudent.id],
            [name]: !prevStudent[prevStudent.id][name],
          },
        };
      });
    });
  };

  const handleSummitForm = async () => {
    try {
      setLoading(true);
      const createAttendace = await CreateAttendance({
        isChecks: isCheckStudent,
        attendanceDate: attendanceDate,
        classroomId: router.query.classroomId,
      });
      setLoading(false);
      Swal.fire("success", "check attendacne completed", "success");
      document.body.style.overflow = "auto";
      attendances.refetch();
    } catch (err) {
      setLoading(false);
      console.log(err);
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
        className="w-screen  md:w-11/12 lg:w-3/4 h-5/6 max-h-[35rem]  fixed z-40 top-0 bottom-0 right-0
       left-0 m-auto flex  items-center justify-center gap-5 py-5  bg-white p-0 md:p-5 rounded-none md:rounded-lg  "
      >
        <div className="w-full md:w-full   md:h-full  flex flex-col items-center justify-start gap-5 ">
          {/* headers parts */}
          <div className="w-full flex-col  md:flex-row flex items-center justify-between ">
            <div className="flex">
              <span className="font-Kanit text-xl font-semibold text-black">
                {language === "Thai" && "เช็คชื่อผู้เรียน"}
                {language === "English" && "attendance check"}
              </span>
              <div className="text-3xl text-blue-600">
                <MdEmojiPeople />
              </div>
            </div>
            <div className="flex gap-10 items-end justify-center">
              <div className="mt-2 flex flex-col text-black font-Kanit">
                <label>
                  {language === "Thai" && "เลือกวันที่"}
                  {language === "English" && "pick date"}
                </label>
                <input
                  onChange={(e) =>
                    setAttendanceDate(() => {
                      const value = e.target.value;
                      return value;
                    })
                  }
                  defaultValue={currentDate}
                  name="deadline"
                  className="w-20 md:w-40 appearance-none outline-none border-none ring-2 rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                  type="date"
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
               justify-center h-max px-8 py-2 rounded-lg font-Poppins"
                >
                  summit
                </button>
              )}
            </div>
          </div>
          <table className="">
            <thead className="">
              <tr className=" w-full text-black font-Kanit flex gap-2 md:gap-3 lg:gap-5 ">
                <th className="w-9 text-xs md:text-base md:w-20">
                  {language === "Thai" && "เลขที่"}
                  {language === "English" && "number"}
                </th>
                <th className="w-16 text-xs md:text-base md:w-40 lg:w-60">
                  {language === "Thai" && "รายชื่อ"}
                  {language === "English" && "name"}
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
                      {language === "Thai" && "เข้าเรียน"}
                      {language === "English" && "present"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {language === "Thai" && "เลือกทั้งหมด"}
                      {language === "English" && "pick all"}
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
                      {language === "Thai" && "ลา"}
                      {language === "English" && "take a leave"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {language === "Thai" && "เลือกทั้งหมด"}
                      {language === "English" && "pick all"}
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
                      {language === "Thai" && "ป่วย"}
                      {language === "English" && "sick"}
                    </span>
                    <span className="hidden group-hover:block  text-sm">
                      {language === "Thai" && "เลือกทั้งหมด"}
                      {language === "English" && "pick all"}
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
                      {language === "Thai" && "ขาด"}
                      {language === "English" && "absent"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {language === "Thai" && "เลือกทั้งหมด"}
                      {language === "English" && "pick all"}
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
                      {language === "Thai" && "สาย"}
                      {language === "English" && "late"}
                    </span>
                    <span className="hidden group-hover:block text-sm">
                      {language === "Thai" && "เลือกทั้งหมด"}
                      {language === "English" && "pick all"}
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody
              className="w-full scrollbar-hide  h-full items-center justify-start max-h-96 mt-2 
            overflow-auto lg:scrollbar-hide fade-mask-short flex flex-col "
            >
              {isCheckStudent?.map((student) => {
                return (
                  <tr
                    key={student.id}
                    className="w-full text-black font-Kanit flex gap-2 md:gap-3 lg:gap-5 "
                  >
                    <td className="w-9 text-xs md:text-base md:w-20 text-center">
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
                          checked={student?.[student.id].present}
                          className="h-5 w-5 rounded-full shadow"
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
                          checked={student?.[student.id].holiday}
                          name="holiday"
                          className="h-5 w-5 rounded-full shadow"
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
                          checked={student?.[student.id].sick}
                          name="sick"
                          className="h-5 w-5 rounded-full shadow"
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
                          checked={student?.[student.id].absent}
                          name="absent"
                          className="h-5 w-5 rounded-full shadow"
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
                          checked={student?.[student.id].late}
                          name="late"
                          className="h-5 w-5 rounded-full shadow"
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
          close();
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default AttendanceChecker;
