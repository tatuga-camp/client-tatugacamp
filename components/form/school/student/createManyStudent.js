import React, { useState } from 'react';
import Loading from '../../../loading/loading';
import { useRouter } from 'next/router';
import { CreateStudentInStudentClassService } from '../../../../service/school/student';
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdCancel, MdError } from 'react-icons/md';

function CreateManyStudent({
  students,
  slectStudentClass,
  setTriggerCreateManyStudent,
}) {
  const router = useRouter();
  const [excelData, setExcelData] = useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleCreateMany = async (e) => {
    const updatedTableData = [];
    setLoading(true);
    for (const student of tableData) {
      try {
        const updatedStudentLoading = {
          ...student,
          Notloading: false,
        };
        updatedTableData.push(updatedStudentLoading);
        await CreateStudentInStudentClassService({
          number: student.number,
          firstName: student.firstName,
          lastName: student.lastName,
          studentClassId: slectStudentClass.id,
        });

        const index = updatedTableData.findIndex((s) => s.id === student.id); // Find the index of the current student in the updatedTableData array
        const updatedStudentSuccess = {
          ...student,
          status: 200,
          Notloading: true,
        };
        updatedTableData.splice(index, 1, updatedStudentSuccess); // Replace

        students.refetch();
      } catch (err) {
        const index = updatedTableData.findIndex((s) => s.id === student.id); // Find the index of the current student in the updatedTableData array
        const updatedStudentSuccess = {
          ...student,
          status: 400,
          Notloading: true,
          error: err.props.response.data.message.toString(),
        };
        updatedTableData.splice(index, 1, updatedStudentSuccess); // Replace the current student with the updatedStudentSuccess object at the same index
      }
    }

    setTableData(() => updatedTableData);
    setLoading(false);
  };

  const generateTable = () => {
    const rows = excelData.split('\n');

    const arrayOfObjects = rows.map((item) => {
      const [number, firstName, lastName] = item.split('\t');
      const uniqueId = uuidv4();
      return { id: uniqueId, number, firstName, lastName };
    });

    setTableData(() => arrayOfObjects);
  };

  const handleExcelDataChange = (e) => {
    setExcelData(e.target.value);
  };
  return (
    <main className="flex justify-center w-max items-center h-5/6 gap-10">
      <section className="w-[29rem] bg-white h-full relative rounded-lg p-5 ">
        <div className="mb-4 relative flex flex-col ">
          <button
            onClick={() => setTriggerCreateManyStudent(() => false)}
            className="flex absolute top-2 right-2 m-auto hover:bg-red-600 h-10 hover:text-red-200 transition duration-100
justify-center items-center w-max gap-2 rounded-full p-2 bg-red-200 text-red-600"
          >
            กลับ/ยกเลิก
            <MdCancel />
          </button>
          <label htmlFor="excel_data" className="block font-bold mb-2">
            คัดลอคข้อมูลจาก Excel ลงที่นี่
          </label>
          <span className="mb-5">
            ดูคู่มือการใช้งาน{' '}
            <a
              target="_blank"
              href="https://youtu.be/dhnpacZxT7E?si=qa3qsWAOsy6nRJMH"
            >
              คลิก
            </a>
          </span>
          <textarea
            placeholder={
              'เมื่อวางข้อมูลแล้ว ไม่ต้องปรับแต่งข้อมูลใดๆทั้งสิ้นเช่นการกด เว้นวรรค การเคาะบรรทัด'
            }
            id="excel_data"
            name="excel_data"
            className="border-black w-full lg:h-72 xl:h-96 border-2 rounded-md"
            value={excelData}
            onChange={handleExcelDataChange}
          />
          {loading && (
            <div className="inset-center w-full h-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
              <Loading />
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={generateTable}
          >
            1 ตรวจสอบความถูกต้อง
          </button>
          <button
            onClick={handleCreateMany}
            className="bg-red-500 hover:bg-red-700 cursor-pointer text-white font-bold py-2 px-4 rounded"
          >
            2 สร้างผู้เรียน
          </button>
        </div>
      </section>
      <section className="w-[28rem] h-full  rounded-lg p-5 bg-white ">
        <div className="h-full overflow-auto">
          <table className="w-full  ">
            <thead>
              <tr className="border-b-2 font-bold text-lg sticky top-0 bg-white h-10 drop-shadow-sm border-black">
                <td>เลขที่</td>
                <td>ชื่อจริง</td>
                <td>นามสกุล</td>
                <td>สถานะ</td>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((student) => {
                return (
                  <tr key={student.id}>
                    <td>{student?.number}</td>
                    <td>{student?.firstName}</td>
                    <td>{student?.lastName}</td>
                    {student.status === 400 && (
                      <td className="flex text-red-500 col-span-2 justify-center  items-center relative group cursor-pointer   bg-white">
                        <div
                          className="w-40 text-xs h-max bg-white rounded-md 
                                absolute top-0 right-0 left-10 bottom-0 m-auto hidden group-hover:flex"
                        >
                          {student.error}
                        </div>
                        <MdError />
                      </td>
                    )}
                    {student.status === 200 && (
                      <td className="flex text-green-500 text-lg justify-center col-span-2  items-center  ">
                        <AiOutlineCheckCircle />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default CreateManyStudent;
