import { Switch } from '@headlessui/react';
import { Box, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RiLockPasswordLine } from 'react-icons/ri';
import { FaUserSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import {
  DeleteTeacherService,
  ResetPassword,
  UpdateTeacherAccount,
} from '../../../service/school/teacher';
import Loading from '../../loading/loading';
import Image from 'next/image';
import { BiSolidUser } from 'react-icons/bi';

function SettingAccountForm({ selectTeacher, teachers }) {
  const [loading, setLoading] = useState(false);
  const [teacherData, setTeacherData] = useState({
    email: selectTeacher.email,
    firstName: selectTeacher.firstName,
    lastName: selectTeacher?.lastName,
    phone: selectTeacher.phone,
    school: selectTeacher.school,
    isDisabled: selectTeacher.isDisabled,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTeacherData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    if (selectTeacher.isDisabled === true) {
      setTeacherData((prev) => {
        return {
          email: selectTeacher.email,
          firstName: selectTeacher.firstName,
          lastName: selectTeacher?.lastName,
          phone: selectTeacher.phone,
          school: selectTeacher.school,
          isDisabled: true,
        };
      });
    } else if (selectTeacher.isDisabled === false) {
      setTeacherData((prev) => {
        return {
          email: selectTeacher.email,
          firstName: selectTeacher.firstName,
          lastName: selectTeacher?.lastName,
          phone: selectTeacher.phone,
          school: selectTeacher.school,
          isDisabled: false,
        };
      });
    }
  }, [selectTeacher]);
  const handleUpdateTeacher = async () => {
    try {
      setLoading(() => true);
      await UpdateTeacherAccount({
        email: teacherData.email,
        firstName: teacherData.firstName,
        lastName: teacherData.lastName,
        phone: teacherData.phone,
        school: teacherData.school,
        isDisabled: teacherData.isDisabled,
        teacherId: selectTeacher.id,
      });

      setLoading(() => false);
      teachers.refetch();
      Swal.fire('success', 'success', 'success');
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire(
        'Error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };
  const handleResetPassword = async () => {
    const { value: password } = await Swal.fire({
      title: 'Enter your password',
      input: 'text',
      inputLabel: 'Password',
      inputPlaceholder: 'Enter your password',
    });

    if (password) {
      try {
        const res = await ResetPassword({
          password: password,
          teacherId: selectTeacher.id,
        });
        Swal.fire('success', res, 'success');
      } catch (err) {
        console.log(err);
        Swal.fire(
          'Error',
          err?.props?.response?.data?.message.toString(),
          'error',
        );
      }
    }
  };

  const handleDeleteTeacher = async ({ teacherId, email }) => {
    let content = document.createElement('div');
    const replacedText = email.replace(/ /g, '_');
    content.innerHTML =
      '<div>กรุณาพิมพ์ข้อความนี้</div> <strong>' +
      replacedText +
      '</strong> <div>เพื่อลบข้อมูล</div>';
    const { value } = await Swal.fire({
      title: 'ยืนยันการลบบัญชี',
      input: 'text',
      html: content,
      footer: '<strong>คุณจะไม่สามารถกู้คืนข้อมูลได้</strong>',
      showCancelButton: true,
      inputValidator: (value) => {
        if (value !== replacedText) {
          return 'กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง';
        }
      },
    });
    if (value) {
      try {
        Swal.fire({
          title: 'กำลังลบ...',
          html: 'รอสักครู่นะครับ...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await DeleteTeacherService({
          teacherId,
        });
        await teachers.refetch();
        Swal.fire('Deleted!', 'Successfully Deleted', 'success');
      } catch (err) {
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
    <div className="w-96 p-3 h-full flex flex-col items-center justify-start ring-2 ring-black gap-3 rounded-3xl">
      <div className="w-24  h-24 relative  bg-blue-400 flex justify-center items-center text-white mt-2 rounded-md">
        {selectTeacher?.picture ? (
          <Image
            src={selectTeacher.picture}
            className="object-cover"
            fill
            sizes="100vw"
          />
        ) : (
          <span className="font-bold text-5xl uppercase">
            {selectTeacher.firstName.charAt(0)}
          </span>
        )}
      </div>
      {teacherData.isDisabled === false ? (
        <div className="w-20 bg-green-400 text-center p-1 text-white">
          ACTIVE
        </div>
      ) : (
        <div className="w-20 bg-slate-400 text-center p-1 text-white">
          DISABLE
        </div>
      )}
      <Box width="100%">
        <TextField
          type="email"
          name="email"
          onChange={handleChange}
          fullWidth
          value={teacherData.email}
          required
        />
      </Box>
      <div className="flex items-center gap-2">
        <Box width="100%">
          <TextField
            name="firstName"
            onChange={handleChange}
            fullWidth
            value={teacherData.firstName}
            required
          />
        </Box>
        <Box width="100%">
          <TextField
            name="lastName"
            onChange={handleChange}
            fullWidth
            value={teacherData.lastName}
            required
          />
        </Box>
      </div>
      <Box width="100%">
        <TextField
          onChange={handleChange}
          name="phone"
          fullWidth
          value={teacherData.phone}
          required
        />
      </Box>
      <Box width="100%">
        <TextField
          name="school"
          fullWidth
          onChange={handleChange}
          value={teacherData.school}
          required
        />
      </Box>
      <div className="flex justify-center gap-2">
        <div className="flex ring-2  rounded-xl ring-red-400 flex-col gap-1 p-3 items-center">
          <Switch
            name="isDisabled"
            checked={teacherData.isDisabled}
            onChange={() =>
              setTeacherData((prev) => {
                return {
                  ...prev,
                  isDisabled: !prev.isDisabled,
                };
              })
            }
            className={`${
              teacherData.isDisabled ? 'bg-red-500' : 'bg-green-400'
            } relative inline-flex h-6 w-12 items-center rounded-full`}
          >
            <span className="sr-only">
              {teacherData.isDisabled ? 'Disable User' : 'Active User'}
            </span>
            <span
              className={`${
                teacherData.isDisabled ? 'translate-x-7' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          <div className="flex gap-2">
            <div className="flex justify-center items-center">
              {teacherData.isDisabled ? <FaUserSlash /> : <BiSolidUser />}
            </div>
            <span>
              {teacherData.isDisabled ? 'Disable User' : 'Active User'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleResetPassword}
          className="flex gap-1 p-3 transition ring-black duration-100 hover:scale-105 active:ring-2 bg-slate-300 rounded-lg items-center"
        >
          <div className="flex justify-center items-center">
            <RiLockPasswordLine />
          </div>
          <span>รีเซ็ทรหัสผ่าน</span>
        </button>
        <button
          onClick={() =>
            handleDeleteTeacher({
              teacherId: selectTeacher.id,
              email: teacherData.email,
            })
          }
          type="button"
          className="flex gap-1 p-3 transition ring-black duration-100 hover:scale-105 active:ring-2 
          bg-red-500 text-white rounded-lg items-center"
        >
          <span>ลบบัญชี</span>
        </button>
      </div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <button
          onClick={handleUpdateTeacher}
          type="button"
          className="bg-blue-400 p-2 rounded-xl drop-shadow-md text-white px-10 hover:scale-105 ring-black transition duration-150 active:ring-2"
        >
          SAVE
        </button>
      )}
    </div>
  );
}

export default SettingAccountForm;
