import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillDelete, AiFillEdit, AiOutlineUserAdd } from 'react-icons/ai';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { PiStudentFill } from 'react-icons/pi';
import { MdCancel } from 'react-icons/md';
import { Skeleton, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Loading from '../../../loading/loading';
import {
  CreateStudentInStudentClassService,
  GetAllStudentInStudentClassService,
} from '../../../../service/school/student';
import { useQuery } from '@tanstack/react-query';
import UpdateStudentClass from './updateStudentClass';
import { DeleteStudentClassService } from '../../../../service/school/class-student';

const loadintLists = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
];

function ShowStudentClass({
  selectStudentClass,
  setTriggerShowClassStudent,
  studentClasses,
}) {
  const [studentClassData, setStudentClassData] = useState({
    id: selectStudentClass.id,
    level: selectStudentClass.level,
    term: selectStudentClass.term,
    year: selectStudentClass.year,
    class: selectStudentClass.class,
    createAt: selectStudentClass.createAt,
  });
  const inputRef = useRef();
  const [formData, setFormData] = useState({
    number: '',
    firstName: '',
    lastName: '',
  });
  const [triggerUpdateStudentClass, setTriggetUpdateStudentClass] =
    useState(false);
  const [triggerCreateStudent, setTriggerCreateStudent] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const level = studentClassData.level.replace(/^\d+-/, '');
  const yearDate = new Date(studentClassData.year); // Replace with your date
  const year = yearDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
  });
  const createAtDate = new Date(studentClassData.createAt); // Replace with your date
  const createAt = createAtDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: 'numeric',
  });
  const students = useQuery(['students-in-studentClass'], () =>
    GetAllStudentInStudentClassService({
      studentClassId: selectStudentClass.id,
    }),
  );

  useEffect(() => {
    students.refetch();
  }, []);

  const handleChageOnCreateStudentForm = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleCreateStudent = async (e) => {
    try {
      e.preventDefault();
      setIsloading(() => true);
      await CreateStudentInStudentClassService({
        number: formData.number,
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentClassId: selectStudentClass.id,
      });
      setIsloading(() => false);
      Swal.fire('Success', 'Successfully Created Student', 'success');
      setFormData(() => {
        return {
          firstName: '',
          number: '',
          lastName: '',
        };
      });
      inputRef.current.focus();
      students.refetch();
    } catch (err) {
      setIsloading(() => false);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      console.log(err);
    }
  };

  const handleDeleteStudentClass = async () => {
    let content = document.createElement('div');
    content.innerHTML =
      '<div>กรุณาพิมพ์ข้อความนี้</div> <strong>' +
      'ยืนยัน' +
      '</strong> <div>เพื่อลบข้อมูล</div>';
    const { value } = await Swal.fire({
      title: 'ยืนยันการลบ',
      input: 'text',
      html: content,
      showCancelButton: true,
      inputValidator: (value) => {
        if (value !== 'ยืนยัน') {
          return 'กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง';
        }
      },
    });
    if (value) {
      try {
        setIsloading(() => true);
        await DeleteStudentClassService({
          studentClassId: selectStudentClass.id,
        });
        studentClasses.refetch();
        Swal.fire('Deleted!', 'Successfully Deleted', 'success');
        setIsloading(() => false);
        document.body.style.overflow = 'auto';
        setTriggerShowClassStudent(() => false);
      } catch (err) {
        setIsloading(() => false);
        console.log(err);
        Swal.fire(
          'error!',
          err?.props?.response?.data?.message?.toString(),
          'error',
        );
      }
    }
  };
  return (
    <div className="w-screen h-screen fixed font-Kanit top-0 bottom-0 flex justify-center items-center z-50 right-0 left-0 m-auto">
      {triggerUpdateStudentClass ? (
        <UpdateStudentClass
          studentClasses={studentClasses}
          setStudentClassData={setStudentClassData}
          selectStudentClass={selectStudentClass}
          setTriggetUpdateStudentClass={setTriggetUpdateStudentClass}
        />
      ) : (
        <mian className="w-9/12 h-5/6 relative p-5 gap-5 flex flex-col rounded-md bg-stone-50">
          <section className="absolute gap-5 top-2 flex justify-center right-5 m-auto">
            <button
              onClick={() => setTriggetUpdateStudentClass(() => true)}
              className="flex hover:bg-green-600 hover:text-green-200 transition duration-100
           justify-center items-center w-20 rounded-full p-2 bg-green-200 text-green-600"
            >
              <AiFillEdit />
              แก้ไข
            </button>
            <button
              onClick={handleDeleteStudentClass}
              className="flex hover:bg-red-600 hover:text-red-200 transition duration-100
           justify-center items-center w-20 rounded-full p-2 bg-red-200 text-red-600"
            >
              <AiFillDelete />
              ลบ
            </button>
          </section>

          <section className="flex flex-col gap-5 ">
            <h1 className="text-3xl ml-5 gap-2 mt-5 flex justify-start items-center">
              ข้อมูลทั่วไป <IoInformationCircleOutline />
            </h1>
            <ul className="flex gap-2 w-full">
              <li className="p-5 w-40 flex flex-col border-b-4 border-blue-500 rounded-md drop-shadow-md bg-white">
                ระดับชั้นเรียน{' '}
                <div className="font-semibold text-lg">
                  {level} / {studentClassData.class}
                </div>
              </li>
              <li className="p-5 w-40 flex flex-col border-b-4 border-yellow-500 rounded-md drop-shadow-md bg-white">
                ปีการศึกษา <div className="font-semibold text-lg">{year}</div>
              </li>
              <li className="p-5 w-40 flex flex-col border-b-4 border-red-500 rounded-md drop-shadow-md bg-white">
                เทอมการศึกษา{' '}
                <div className="font-semibold text-lg">
                  {studentClassData.term}
                </div>
              </li>
              <li className="p-5 w-max flex flex-col border-b-4 border-pink-500 rounded-md drop-shadow-md bg-white">
                สร้างเมื่อ{' '}
                <div className="font-semibold text-lg">{createAt}</div>
              </li>
              <li className="p-5 w-max flex flex-col border-b-4 border-sky-500 rounded-md drop-shadow-md bg-white">
                จำนวนนักเรียน <div className="font-semibold text-lg">40 คน</div>
              </li>
            </ul>
          </section>

          {triggerCreateStudent === false ? (
            <section className="flex flex-col gap-5 ">
              <div className="flex justify-start  items-end gap-x-2">
                <h1 className="text-3xl ml-5 mt-5 gap-2 flex justify-start items-center">
                  รายชื่อนักเรียน <PiStudentFill />
                </h1>
                <button
                  onClick={() => setTriggerCreateStudent(() => true)}
                  className="flex hover:bg-blue-600 h-10 hover:text-blue-200 transition duration-100
           justify-center items-center w-max gap-2 rounded-full p-2 bg-blue-200 text-blue-600"
                >
                  <AiOutlineUserAdd />
                  เพิ่มนักเรียน
                </button>
              </div>
            </section>
          ) : (
            <section className="flex flex-col gap-5 ">
              <div className="flex justify-start  items-end gap-x-2">
                <h1 className="text-3xl ml-5 mt-5 gap-2 flex justify-start items-center">
                  สร้างนักเรียน <AiOutlineUserAdd />
                </h1>
                <button
                  onClick={() => setTriggerCreateStudent(() => false)}
                  className="flex hover:bg-red-600 h-10 hover:text-red-200 transition duration-100
       justify-center items-center w-max gap-2 rounded-full p-2 bg-red-200 text-red-600"
                >
                  ยกเลิก
                  <MdCancel />
                </button>
              </div>
              <form onSubmit={handleCreateStudent}>
                <div className="w-full flex justify-start items-end gap-4">
                  <label className="w-60">
                    เลขที่
                    <TextField
                      inputRef={inputRef}
                      autoFocus
                      onChange={handleChageOnCreateStudentForm}
                      name="number"
                      value={formData.number}
                      required
                      id="outlined-select-currency"
                      type="number"
                      placeholder="เช่น 1"
                      fullWidth
                    />
                  </label>
                  <label className="w-60">
                    ชื่อจริง
                    <TextField
                      onChange={handleChageOnCreateStudentForm}
                      name="firstName"
                      required
                      value={formData.firstName}
                      id="outlined-select-currency"
                      type="text"
                      placeholder="ชื่อจริง"
                      fullWidth
                    />
                  </label>
                  <label className="w-60">
                    นามสกุล
                    <TextField
                      onChange={handleChageOnCreateStudentForm}
                      name="lastName"
                      required
                      value={formData.lastName}
                      id="outlined-select-currency"
                      type="text"
                      placeholder="นามสกุล"
                      fullWidth
                    />
                  </label>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <button
                      onClick={() => setTriggerCreateStudent(() => true)}
                      className="flex hover:bg-blue-600 h-10 hover:text-blue-200 transition duration-100
           justify-center items-center w-max px-10 gap-2 rounded-full p-2 bg-blue-200 text-blue-600"
                    >
                      <AiOutlineUserAdd />
                      ยืนยัน
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}
          <ul className="w-full grid grid-cols-3 p-2 gap-2 overflow-auto">
            {students.isFetching
              ? loadintLists.map((list, index) => {
                  return <Skeleton key={index} width={150} height={40} />;
                })
              : students?.data?.map((student) => {
                  return (
                    <li
                      key={student.id}
                      className="w-full h-14 group hover:ring-2 rounded-lg hover:drop-shadow-lg bg-stone-50 border-blue-400 transition duration-100
                     flex justify-start relative items-center p-2 gap-2"
                    >
                      <div
                        className="absolute hidden group-hover:flex justify-center items-center 
                    gap-1 top-0 bottom-0 right-2 m-auto"
                      >
                        <button
                          className="flex hover:bg-green-600 text-xs hover:text-green-200 transition duration-100
           justify-center items-center w-10 rounded-full p-2 bg-green-200 text-green-600"
                        >
                          แก้ไข
                        </button>
                        <button
                          className="flex hover:bg-red-600 hover:text-red-200 transition duration-100
           justify-center items-center w-10 rounded-full p-2 text-xs bg-red-200 text-red-600"
                        >
                          ลบ
                        </button>
                      </div>
                      <div className="bg-white ring-2 ring-black rounded-full relative overflow-hidden w-10 h-10">
                        <Image
                          src={student.picture}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-start items-start">
                        <div className="flex gap-2 font-semibold text-lg leading-[0.5rem]">
                          <span>{student.firstName}</span>
                          <span>{student?.lastName}</span>
                        </div>
                        <span className="text-base text-slate-500 font-normal">
                          เลขที่ {student.number}
                        </span>
                      </div>
                    </li>
                  );
                })}
          </ul>
        </mian>
      )}

      <footer
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerShowClassStudent(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></footer>
    </div>
  );
}

export default ShowStudentClass;
