import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { MdManageAccounts } from 'react-icons/md';
import { blurDataURL } from '../../data/student/blurDataURL';
import Swal from 'sweetalert2';
import {
  resetStudentPasswordService,
  setStudentPasswordService,
} from '../../service/students';
import Settings from '../svg/Setting';
import { IoMdClose } from 'react-icons/io';

function StudentPasswordManagement({
  setTriggerStudentPasswordManagement,
  students,
}) {
  const [studentsCheckbox, setStudentCheckbox] = useState();
  const [checkAll, setCheckAll] = useState(false);
  const handleCheckboxToStudent = () => {
    setStudentCheckbox(() => {
      return students?.data?.data?.map((student) => {
        if (!student.password && student.resetPassword === false) {
          return {
            ...student,
            checkbox: false,
          };
        } else {
          return {
            ...student,
          };
        }
      });
    });
  };

  useEffect(() => {
    handleCheckboxToStudent();
  }, [students.data]);

  const handleChangeCheckbox = ({ studentId }) => {
    setStudentCheckbox((prev) => {
      return prev.map((student) => {
        if (student.id === studentId) {
          // ensure that you handle the checkbox state correctly by using spread operator
          return { ...student, checkbox: !student.checkbox };
        } else {
          return student;
        }
      });
    });
  };

  // function นี้ยังไม่ได้ถูก call
  const handleStudentSummitSetPassword = async () => {
    try {
      Swal.fire({
        title: 'กำลังโหลด...',
        html: 'รอสักครู่นะครับ...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const onlyCheckboxTrue = studentsCheckbox.filter(
        (student) => student.checkbox === true,
      );

      for (const student of onlyCheckboxTrue) {
        await setStudentPasswordService({ studentId: student.id });
      }
      await students.refetch();
      Swal.fire({ icon: 'success', timer: 500 });
    } catch (err) {
      Swal.fire(
        'Error!',
        err?.props?.response?.data?.message?.toString(),
        'error',
      );
    }
  };

  const handleStudentSummitResetPasswrod = async ({ studentId }) => {
    try {
      Swal.fire({
        title: 'กำลังโหลด...',
        html: 'รอสักครู่นะครับ...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await resetStudentPasswordService({ studentId });

      await students.refetch();
      Swal.fire({ icon: 'success', timer: 500 });
    } catch (err) {
      Swal.fire(
        'Error!',
        err?.props?.response?.data?.message?.toString(),
        'error',
      );
    }
  };

  const handleCheckboxAllTrue = () => {
    setCheckAll(() => true);
    setStudentCheckbox((prev) => {
      return prev.map((student) => {
        if (!student.password && student.resetPassword === false) {
          student.checkbox = true;
          return student;
        } else {
          return student;
        }
      });
    });
  };

  const handleCheckboxAllFalse = () => {
    setCheckAll(() => false);
    setStudentCheckbox((prev) => {
      return prev.map((student) => {
        if (!student.password && student.resetPassword === false) {
          student.checkbox = false;
          return student;
        } else {
          return student;
        }
      });
    });
  };

  return (
    <div className="w-screen font-Kanit h-screen fixed z-50 top-0 bottom-0 right-0 left-0 flex items-center justify-center">
      <section className="w-[75%] h-[75%] bg-white flex p-5 rounded-2xl flex-col justify-center items-center z-20">
        <header className="p-3 pb-6  w-[90%]  flex justify-between items-center gap-2">
          <section className="flex justify-center items-center gap-3">
            <h1 className="text-2xl font-medium">จัดการรหัสผ่านนักเรียน</h1>
            <div className="w-7 h-7">
              <Settings />
            </div>
          </section>
          <div className="flex gap-2">
            <button
              onClick={handleStudentSummitSetPassword}
              className="w-max px-10 py-2 rounded-md text-white hover:bg-green-600
              transition duration-100  active:scale-110 hover:drop-shadow-md
            bg-[#7CDB8C] font-Kanit text-lg"
            >
              ยืนยัน
            </button>

            <button
              className="w-max px-6 py-2 border-solid border-[1.5px] rounded-md text-[#989898] hover:bg-[#989898]
              transition duration-100  active:scale-110 hover:drop-shadow-md hover:text-white hover:border-gray-400
             font-Kanit text-lg flex flex-row items-center justify-between gap-3"
              onClick={() => {
                document.body.style.overflow = 'auto';
                setTriggerStudentPasswordManagement(() => false);
              }}
            >
              <IoMdClose />
              ปิด
            </button>
          </div>
        </header>
        <main className="w-full h-full overflow-auto flex justify-center ">
          <table className="w-[90%]">
            <thead className="sticky top-0 z-20 ">
              <tr className="flex text-sm font-normal gap-2 px-5 items-center w-full bg-[#EAF3FF] py-3 text-[#2C7CD1]">
                <td className="w-20 text-center ">เลขที่</td>
                <td className="w-72 text-center">ชื่อ</td>
                <td className="w-40 text-center">คะแนนพิเศษ</td>
                <td
                  onClick={() => {
                    if (checkAll === false) {
                      handleCheckboxAllTrue();
                    } else if (checkAll === true) {
                      handleCheckboxAllFalse();
                    }
                  }}
                  className="w-52 active:font-semibold select-none text-center hover:scale-105 transition duration-100 cursor-pointer"
                >
                  อนุญาตรหัสผ่าน / เลือกทั้งหมด
                </td>
              </tr>
            </thead>
            <tbody>
              {studentsCheckbox?.map((student) => {
                return (
                  <tr
                    className="flex gap-2 my-2 px-5 text-base font-Kanit items-center w-full h-14 text-center "
                    key={student?.id}
                  >
                    <td className="w-20 text-[#989898]">{student?.number}</td>
                    <td className="w-72 pl-5 text-left flex justify-start items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-solid border-2 relative">
                        <Image
                          src={student?.picture}
                          fill
                          alt="student picture"
                          className="object-cover "
                          sizes="(max-width: 768px) 100vw, 33vw"
                          blurDataURL={blurDataURL}
                        />
                      </div>
                      {student.firstName + ' ' + student?.lastName}
                    </td>

                    <td className="w-40 text-center text-[#F55E00]">
                      {student?.score?.totalPoints || 0}
                    </td>
                    <td className="w-52 flex items-center justify-center">
                      {student?.password || student.resetPassword ? (
                        <button
                          onClick={() =>
                            handleStudentSummitResetPasswrod({
                              studentId: student.id,
                            })
                          }
                          className="w-[70%] p-2 text-[#B00000] rounded-md border-[1.5px] border-solid border-[#B00000] bg-[#B00000] bg-opacity-20 
                          hover:bg-red-600 hover:text-white
                          transition duration-100"
                        >
                          ยกเลิก
                        </button>
                      ) : (
                        <input
                          onChange={() =>
                            handleChangeCheckbox({ studentId: student.id })
                          }
                          type="checkbox"
                          checked={student?.checkbox}
                          className="w-5 h-5"
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </main>
      </section>
      {/* Backdrop effect */}
      {/* พี่ลบ backdrop-blur ออกเนื่องจากมันทำให้ perfomance ของตัวbrowser ลดลง */}
      <div
        className="w-[77%] h-[79%] bg-white/30 flex p-5 rounded-3xl flex-col justify-center items-center 
      absolute z-10 drop-shadow-lg"
      ></div>
      <footer
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerStudentPasswordManagement(() => false);
        }}
        className={`w-screen  h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10  bg-black/30 `}
      ></footer>
    </div>
  );
}

export default StudentPasswordManagement;
