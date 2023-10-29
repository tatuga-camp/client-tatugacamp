import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FcBusinessContact, FcLineChart, FcViewDetails } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { GetAllStudentClassService } from '../../../service/teacher/student-class';
import { MenuItem, Skeleton, TextField } from '@mui/material';
import { CreateClassroomForTeacherService } from '../../../service/teacher/classroom';

function CreateClassroomTeacher({
  refetch,
  language,
  setTriggerCreateClassroom,
}) {
  const [classroomForm, setClassroomForm] = useState({
    title: '',
    level: '',
    description: '',
    studentClassId: '',
  });
  const studentClasses = useQuery(['student-class'], () =>
    GetAllStudentClassService(),
  );
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await CreateClassroomForTeacherService({
        title: classroomForm.title,
        level: classroomForm.level,
        description: classroomForm.description,
        studentClassId: classroomForm.studentClassId,
      });
      setTriggerCreateClassroom(() => false);
      document.body.style.overflow = 'auto';
      refetch();
      Swal.fire('success', 'create classroom success', 'success');
    } catch (err) {
      console.log('err', err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setClassroomForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div className="fixed z-50 top-0 bottom-0 right-0 left-0 m-auto flex items-center justify-center">
      <div
        className="flex w-max h-max font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-20 
    top-0 right-0 left-0 bottom-0 m-auto fixed"
      >
        <form
          className=" w-80 flex flex-col justify-center gap-3 items-center "
          onSubmit={handleSubmit}
        >
          <span className="text-xl font-semibold text-[#2C7CD1]">
            {language === 'Thai' && 'สร้างห้องเรียน'}
            {language === 'English' && 'Create a classroom'}
          </span>
          <span className="mb-5">
            ดูคู่มือการสร้างห้องเรียน{' '}
            <a
              target="_blank"
              href="https://youtu.be/IkLKD-Mk8nw?si=M2SfvBC9lkGkGlKA"
            >
              คลิก
            </a>
          </span>
          <div className="flex flex-col relative">
            <label className="font-sans font-normal">
              {language === 'Thai' && 'รายชื่อวิชา'}
              {language === 'English' && 'Title'}
            </label>
            <input
              onChange={handleChangeForm}
              className="w-60 h-12  ring-1 ring-black  rounded-sm   pl-10 
            placeholder:italic placeholder:font-light"
              type="text"
              name="title"
              placeholder={
                language === 'Thai'
                  ? 'เช่น วิชาภาษาไทย'
                  : language === 'English' && 'Ex. mathematics'
              }
              maxLength="30"
            />
          </div>
          {studentClasses.isLoading ? (
            <div className="w-60">
              <Skeleton width="100%" height={80} />
            </div>
          ) : (
            <label className="w-60">
              {language === 'Thai' && 'เลือกชั้นเรียน'}
              {language === 'English' && 'pick classroom'}
              <TextField
                id="outlined-select-currency"
                required
                select
                fullWidth
              >
                {studentClasses?.data?.map((option) => {
                  const level = option.level.replace(/^\d+-/, '');
                  return (
                    <MenuItem
                      onClick={(e) => {
                        setClassroomForm((prev) => {
                          return {
                            ...prev,
                            level: `${level}/${option.class}`,
                            studentClassId: option.id,
                          };
                        });
                      }}
                      key={option.id}
                      value={option.id}
                    >
                      {level} / {option.class}
                    </MenuItem>
                  );
                })}
              </TextField>
            </label>
          )}
          <div className="flex flex-col  justify-center  ">
            <label className="font-sans font-normal">
              {language === 'Thai' && 'คำอธิบาย (optional) '}
              {language === 'English' && 'description (optional)'}
            </label>
            <input
              onChange={handleChangeForm}
              className="w-60 h-12  ring-1 ring-black flex  rounded-sm   pl-10 
            placeholder:italic placeholder:font-light relative"
              type="text"
              name="description"
              placeholder={
                language === 'Thai'
                  ? 'เช่น ท55435'
                  : language === 'English' && 'Ex. MATH445'
              }
              maxLength="20"
            />
          </div>

          <button
            aria-label="create classroom button"
            className="w-full  h-9  rounded-full bg-[#2C7CD1] text-white font-sans font-bold
          text-md cursor-pointer hover: active:border-2  active:border-gray-300
           active:border-solid  focus:border-2 
          focus:border-solid"
          >
            {language === 'Thai' && 'สร้าง'}
            {language === 'English' && 'create'}
          </button>
        </form>
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          setTriggerCreateClassroom(() => false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default CreateClassroomTeacher;
