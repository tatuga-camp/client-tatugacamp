import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { MdManageAccounts } from 'react-icons/md';
import { blurDataURL } from '../../data/student/blurDataURL';
import Swal from 'sweetalert2';
import {
  resetStudentPasswordService,
  setStudentPasswordService,
} from '../../service/students';

function StudentPasswordManagement({
  setTriggerStudentPasswordManagement,
  students,
}) {
  const [studentsCheckbox, setStudentCheckbox] = useState();
  const [checkAll, setCheckAll] = useState(false);
  console.log(studentsCheckbox);
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
          student.checkbox = !student.checkbox;
          return student;
        } else {
          return student;
        }
      });
    });
  };

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
      Swal.fire('สำเร็จ', '', 'success');
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
      Swal.fire('สำเร็จ', '', 'success');
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
      <section className="w-9/12 h-4/6 bg-white flex p-5 rounded-2xl flex-col justify-start items-start">
        <header className="p-3 border-b-2 border-slate-500 w-full  flex justify-between items-center gap-2">
          <section className="flex justify-center items-center gap-2">
            <h1 className="text-2xl font-medium">จัดการรหัสผ่านนักเรียน</h1>
            <div className="flex text-3xl justify-center item-center">
              <MdManageAccounts />
            </div>
          </section>
          <button
            onClick={handleStudentSummitSetPassword}
            className="w-max px-10 py-1 rounded-full text-white hover:bg-green-600
             transition duration-100  active:scale-110 hover:drop-shadow-md
          bg-green-500 font-Kanit text-lg"
          >
            ยืนยัน
          </button>
        </header>
        <main className="w-full h-full overflow-auto ">
          <table className="w-full">
            <thead className="sticky top-0 z-20 ">
              <tr className="flex text-base font-normal gap-2 px-5 items-center w-full bg-slate-100 py-1 ">
                <td className="w-96 text-left">ชื่อ</td>
                <td className="w-32">เลขที่</td>
                <td className="w-32">คะแนนพิเศษ</td>
                <td
                  onClick={() => {
                    if (checkAll === false) {
                      handleCheckboxAllTrue();
                    } else if (checkAll === true) {
                      handleCheckboxAllFalse();
                    }
                  }}
                  className="w-32 active:font-semibold select-none text-center hover:scale-105 transition duration-100 cursor-pointer"
                >
                  อนุญาตรหัสผ่าน / เลือกทั้งหมด
                </td>
              </tr>
            </thead>
            <tbody>
              {studentsCheckbox?.map((student) => {
                return (
                  <tr
                    className="flex gap-2 my-2 px-5 text-base font-Kanit items-center w-full h-12"
                    key={student?.id}
                  >
                    <td className="w-96 text-left flex justify-start items-center gap-2">
                      <div className="w-10 h-10 rounded-lg ring-2 ring-black relative">
                        <Image
                          src={student?.picture}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          blurDataURL={blurDataURL}
                        />
                      </div>
                      {student.firstName + ' ' + student?.lastName}
                    </td>
                    <td className="w-32">{student?.number}</td>
                    <td className="w-32">{student?.score?.totalPoints || 0}</td>
                    <td className="w-32 flex items-center justify-center">
                      {student?.password || student.resetPassword ? (
                        <button
                          onClick={() =>
                            handleStudentSummitResetPasswrod({
                              studentId: student.id,
                            })
                          }
                          className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600
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
