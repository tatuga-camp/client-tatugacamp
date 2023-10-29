import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdCancel, MdOutlineEdit } from 'react-icons/md';
import Loading from '../../../loading/loading';
import { UpdateStudentInStudentClassService } from '../../../../service/school/student';
import Swal from 'sweetalert2';

function UpdateStudent({
  setTriggerUpdateStudent,
  selectStudent,
  setOpen,
  students,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: selectStudent.number,
    firstName: selectStudent.firstName,
    lastName: selectStudent.lastName,
  });

  useEffect(() => {
    setFormData(() => {
      return {
        number: selectStudent.number,
        firstName: selectStudent.firstName,
        lastName: selectStudent.lastName,
      };
    });
  }, [selectStudent]);

  const handleSumitUpdateStudentForm = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(() => true);
      await UpdateStudentInStudentClassService({
        number: formData.number,
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentId: selectStudent.id,
      });
      setIsLoading(() => false);

      setFormData(() => {
        return {
          firstName: '',
          number: '',
          lastName: '',
        };
      });
      setOpen(true);
      setTriggerUpdateStudent(() => false);
      students.refetch();
    } catch (err) {
      setIsLoading(() => false);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      console.log(err);
    }
  };

  const handleChageOnUpdateStudentForm = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <section className="flex flex-col gap-5 ">
      <div className="flex justify-start  items-end gap-x-2">
        <h1 className="text-3xl ml-5 mt-5 gap-2 flex justify-start items-center">
          แก้ไขข้อมูลผู้เรียน <MdOutlineEdit />
        </h1>
        <button
          onClick={() => setTriggerUpdateStudent(() => false)}
          className="flex hover:bg-red-600 h-10 hover:text-red-200 transition duration-100
justify-center items-center w-max gap-2 rounded-full p-2 bg-red-200 text-red-600"
        >
          ยกเลิกแก้ไข
          <MdCancel />
        </button>
      </div>
      <form onSubmit={handleSumitUpdateStudentForm}>
        <div className="w-full flex justify-start items-end gap-4">
          <label className="w-60">
            เลขที่
            <TextField
              autoFocus
              onChange={handleChageOnUpdateStudentForm}
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
              onChange={handleChageOnUpdateStudentForm}
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
              onChange={handleChageOnUpdateStudentForm}
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
              className="flex hover:bg-blue-600 h-10 hover:text-blue-200 transition duration-100
justify-center items-center w-max px-10 gap-2 rounded-full p-2 bg-blue-200 text-blue-600"
            >
              <MdOutlineEdit />
              ยืนยัน
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default UpdateStudent;
