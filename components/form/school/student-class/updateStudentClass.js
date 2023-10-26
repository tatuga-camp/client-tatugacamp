import React, { useState } from 'react';
import { UpdateClassStudentService } from '../../../../service/school/class-student';
import Swal from 'sweetalert2';
import { MenuItem, TextField } from '@mui/material';
import Loading from '../../../loading/loading';
const levels = [
  {
    value: '1-ป.1',
    label: 'ป.1',
  },
  {
    value: '2-ป.2',
    label: 'ป.2',
  },
  {
    value: '3-ป.3',
    label: 'ป.3',
  },
  {
    value: '4-ป.4',
    label: 'ป.4',
  },
  {
    value: '5-ป.5',
    label: 'ป.5',
  },
  {
    value: '6-ป.6',
    label: 'ป.6',
  },
  {
    value: '7-ม.1',
    label: 'ม.1',
  },
  {
    value: '8-ม.2',
    label: 'ม.2',
  },
  {
    value: '9-ม.3',
    label: 'ม.3',
  },
  {
    value: '10-ม.4',
    label: 'ม.4',
  },
  {
    value: '11-ม.5',
    label: 'ม.5',
  },
  {
    value: '12-ม.6',
    label: 'ม.6',
  },
  {
    value: '13-ปวช1.',
    label: 'ปวช1.',
  },
  {
    value: '14-ปวช2.',
    label: 'ปวช2.',
  },
  {
    value: '15-ปวช3.',
    label: 'ปวช3.',
  },
  {
    value: '16-ปวส1.',
    label: 'ปวส1.',
  },
  {
    value: '17-ปวส2.',
    label: 'ปวส2.',
  },
  {
    value: '18-ปวส3.',
    label: 'ปวส3.',
  },
  {
    value: '19-ปี1',
    label: 'ปี1.',
  },
  {
    value: '20-ปี2.',
    label: 'ปี2.',
  },
  {
    value: '21-ปี3.',
    label: 'ปี3.',
  },
  {
    value: '22-ปี4.',
    label: 'ปี4.',
  },
  {
    value: '23-ปี5.',
    label: 'ปี5.',
  },
];
function UpdateStudentClass({
  selectStudentClass,
  studentClasses,
  setTriggetUpdateStudentClass,
  setStudentClassData,
}) {
  const [isLoading, setIsloading] = useState(false);
  const [formData, setFormData] = useState(() => {
    const date = new Date(selectStudentClass.year);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const formattedDate = `${year}-${month}`;
    return {
      level: selectStudentClass.level,
      year: formattedDate,
      term: selectStudentClass.term,
      class: selectStudentClass.class,
    };
  });

  const handleSummit = async (e) => {
    try {
      e.preventDefault();
      setIsloading(() => true);
      const update = await UpdateClassStudentService({
        level: formData.level,
        year: formData.year,
        term: formData.term,
        classroom: formData.class,
        studentClassId: selectStudentClass.id,
      });
      setStudentClassData(() => {
        return {
          level: update.level,
          year: update.year,
          term: update.term,
          class: update.class,
          id: update.id,
          createAt: update.createAt,
        };
      });
      Swal.fire('Success', 'Successfully Created Class', 'success');
      setIsloading(() => false);
      studentClasses.refetch();
      setTriggetUpdateStudentClass(() => false);
      document.body.style.overflow = 'auto';
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
  return (
    <form
      onSubmit={handleSummit}
      className="w-96 gap-2 h-96 flex flex-col justify-between items-center p-10 pb-5 bg-white rounded-md"
    >
      <div className="w-full flex flex-col justify-center items-center gap-2">
        <div className="w-full flex justify-center gap-1">
          <label className="w-full">
            เลือกระดับการศึกษา
            <TextField
              id="outlined-select-currency"
              required
              select
              defaultValue={formData.level}
              fullWidth
            >
              {levels.map((option) => (
                <MenuItem
                  onClick={(e) => {
                    setFormData((prev) => {
                      return {
                        ...prev,
                        level: e.currentTarget.dataset.value,
                      };
                    });
                  }}
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </label>
          <label className="w-full">
            เลือกห้องเรียน
            <TextField
              value={formData.class}
              onChange={(e) =>
                setFormData((prev) => {
                  return {
                    ...prev,
                    class: e.target.value,
                  };
                })
              }
              required
              id="outlined-select-currency"
              type="number"
              placeholder="เช่น 1"
              fullWidth
            />
          </label>
        </div>
        <label className="w-full">
          เลือกปีการศึกษา
          <input
            value={formData.year}
            onChange={(e) =>
              setFormData((prev) => {
                return {
                  ...prev,
                  year: e.target.value,
                };
              })
            }
            required
            className="w-full appearance-none outline-none border-none ring-1  rounded-sm px-5 
            py-2 text-lg ring-gray-200 focus:ring-black "
            type="month"
            placeholder="เลือกปีการศึกษา"
          />
        </label>
        <label className="w-full">
          เลือกเทอม
          <TextField
            value={formData.term}
            onChange={(e) =>
              setFormData((prev) => {
                return {
                  ...prev,
                  term: e.target.value,
                };
              })
            }
            required
            id="outlined-select-currency"
            type="number"
            placeholder="ใส่เฉพาะตัวเลข เช่น 1"
            fullWidth
          />
        </label>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <button
          className="flex gap-3  hover:scale-110 transition duration-100
     drop-shadow-md bg-blue-400 group  justify-center items-center h-12  w-max p-10
     hover:bg-white ring-blue-400 ring-2 rounded-xl py-0"
        >
          <span className="group-hover:text-black text-white">ยืนยัน</span>
        </button>
      )}
    </form>
  );
}

export default UpdateStudentClass;
