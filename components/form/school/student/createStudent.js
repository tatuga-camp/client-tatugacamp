import { TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { CreateStudentInStudentClassService } from '../../../../service/school/student';
import Swal from 'sweetalert2';
import Loading from '../../../loading/loading';

function CreateStudent({
  setTriggerCreateStudent,
  students,
  setOpen,
  selectStudentClass,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();
  const [formData, setFormData] = useState({
    number: '',
    firstName: '',
    lastName: '',
  });

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
      setIsLoading(() => true);
      await CreateStudentInStudentClassService({
        number: formData.number,
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentClassId: selectStudentClass.id,
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
      inputRef.current.focus();
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
  return (
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
  );
}

export default CreateStudent;
