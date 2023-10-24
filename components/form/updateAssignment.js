import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Image from 'next/image';
import Loading from '../loading/loading';
import { MdError, MdOutlineCancel } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { GrRevert, GrScorecard } from 'react-icons/gr';
import { TiUserDelete } from 'react-icons/ti';

import {
  AssignWorkToSTudent,
  UnAssignWorkStudentService,
  UpdateAssignmentApi,
} from '../../service/assignment';
import Swal from 'sweetalert2';
import { Box, TextField } from '@mui/material';

function UpdateAssignment({
  assignment,
  setTriggerUpdateAssignment,
  studentOnAssignments,
  setShowAssignment,
  assignments,
  language,
}) {
  const rounter = useRouter();
  const [assignmentData, setAssignmentData] = useState(assignment?.data?.data);
  const [isChecked, setIsChecked] = useState();
  const [isAssignStudent, setIsAssignmentStdent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActivetab] = useState(0);
  const loadingItems = useRef(new Set());
  const [tabs, setTabs] = useState([
    {
      titleEnglish: 'assignment',
      titleThai: 'งาน',
    },
    {
      titleEnglish: 'students',
      titleThai: 'นักเรียน',
    },
  ]);

  //handdle active tab
  const handleActiveTab = (index) => {
    setActivetab(index);

    if (index === 0) {
      setIsAssignmentStdent(false);
    } else if (index === 1) {
      setIsAssignmentStdent(true);
    }
  };

  // handle chagne of assignment's detail
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  //set isCheck to students
  useEffect(() => {
    setIsChecked(() =>
      studentOnAssignments?.data?.data?.map((student) => {
        return {
          ...student,
          [student.id]: false,
        };
      }),
    );
  }, [studentOnAssignments?.data?.data]);

  // when input checkobx change apply value to isChecked in each student
  const handleChangeCheck = ({ studentId }) => {
    setIsChecked((prevState) => {
      return prevState.map((prevStudent) => {
        if (prevStudent.id === studentId) {
          return {
            ...prevStudent,
            [studentId]: !prevStudent[studentId],
          };
        } else {
          return { ...prevStudent };
        }
      });
    });
  };

  //convert the string date to format that input date required
  const date = new Date(assignmentData.deadline);
  const formattedDate = date.toISOString().split('T')[0];

  //handle click to sclect all student
  const onClickIsCheck = () => {
    setIsChecked((prevState) => {
      return prevState.map((student) => {
        if (student.status === 'no-assign') {
          return {
            ...student,
            [student.id]: !student[student.id],
          };
        } else {
          return {
            ...student,
          };
        }
      });
    });
  };

  //handle click to assign student work
  const onClickAssignWork = async () => {
    try {
      loadingItems.current = new Set();
      setLoading(true);
      const assign = await AssignWorkToSTudent({
        isChecked,
        assignmentCreated: assignmentData,
      });
      setIsChecked(assign);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(() => true);
      const parser = new DOMParser();
      const doc = parser.parseFromString(assignmentData.body, 'text/html');
      const imageElements = doc.getElementsByTagName('img');
      const imageUrls = Array.from(imageElements)
        .map((img) => {
          const src = img.src;
          if (src.startsWith('data:image')) {
            // Check if the src attribute starts with "data:image" (base64 image)
            return src;
          } else {
            return null; // Skip images with actual URLs
          }
        })
        .filter(Boolean); // Filter out null values (i.e., actual URLs)
      await UpdateAssignmentApi({
        assignmentId: assignmentData.id,
        title: assignmentData.title,
        description: assignmentData.body,
        maxScore: assignmentData.maxScore,
        deadline: assignmentData.deadline,
        imagesBase64: imageUrls,
      });
      Swal.fire('success', 'assignment has been updated', 'success');
      setLoading(() => false);
      setTriggerUpdateAssignment(false);
      assignment.refetch();
    } catch (err) {
      setLoading(() => false);
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
    }
  };

  const handleUnDoAssignmentOnStudent = async ({ studentId }) => {
    try {
      loadingItems.current.add(studentId);
      await UnAssignWorkStudentService({
        studentId: studentId,
        assignmentId: assignmentData.id,
      });
      studentOnAssignments.refetch();
      // loadingItems.current.delete(studentId);
    } catch (err) {
      // loadingItems.current.delete(studentId);
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 relative  justify-center items-center bg-white  font-Kanit 
      "
    >
      <button
        onClick={() => setTriggerUpdateAssignment(false)}
        className="absolute gap-0 flex flex-col justify-center items-center z-20 
        top-0 right-5 text-sm hover:scale-110 hover:text-red-400 transition duration-150 cursor-pointer"
      >
        <div className="text-xl">
          <MdOutlineCancel />
        </div>
        ยกเลิก
      </button>
      <div className="w-full flex mt-2 items-center justify-center ">
        <div className="flex w-56  gap-5 h-10 justify-between bg-white  rounded-xl">
          {tabs.map((tab, index) => {
            return (
              <div
                key={index}
                role="button"
                onClick={() => handleActiveTab(index)}
                className={`w-28 px-4 select-none ring-2 ring-black flex items-center justify-center cursor-pointer h-full rounded-xl ${
                  activeTab === index
                    ? 'text-white bg-orange-600'
                    : 'text-black bg-transparent'
                }`}
              >
                {language === 'Thai' && tab.titleThai}
                {language === 'English' && tab.titleEnglish}
              </div>
            );
          })}
        </div>
      </div>
      {isAssignStudent === false ? (
        <div className="w-full h-full flex flex-col justify-start items-center gap-8  ">
          <div className="flex-col flex gap-4 m-5 w-3/4">
            <div className="flex flex-col gap-0">
              <Box width="100%" className="bg-white">
                <TextField
                  name="title"
                  onChange={handleChange}
                  fullWidth
                  label="title"
                  value={assignmentData?.title}
                />
              </Box>
            </div>
            <div className="h-96">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                textareaName="description"
                initialValue={assignmentData?.description}
                init={{
                  selector: 'textarea',
                  link_context_toolbar: true,
                  height: '100%',
                  width: '100%',
                  menubar: true,
                  image_title: true,
                  automatic_uploads: true,
                  file_picker_types: 'image',
                  file_picker_types: 'image',
                  file_picker_callback: (cb, value, meta) => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');

                    input.addEventListener('change', (e) => {
                      const file = e.target.files[0];

                      const reader = new FileReader();
                      reader.addEventListener('load', () => {
                        /*
                          Note: Now we need to register the blob in TinyMCEs image blob
                          registry. In the next release this part hopefully won't be
                          necessary, as we are looking to handle it internally.
                        */
                        const id = 'blobid' + new Date().getTime();
                        const blobCache =
                          tinymce.activeEditor.editorUpload.blobCache;
                        const base64 = reader.result.split(',')[1];
                        const blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);

                        /* call the callback and populate the Title field with the file name */
                        cb(blobInfo.blobUri(), { title: file.name });
                      });
                      reader.readAsDataURL(file);
                    });

                    input.click();
                  },
                  plugins: [
                    'contextmenu',
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount',
                  ],
                  contextmenu:
                    'paste | link image inserttable | cell row column deletetable',
                  toolbar:
                    'undo redo | formatselect | blocks | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help | link | image',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
                onEditorChange={(newText) =>
                  setAssignmentData((prev) => {
                    return {
                      ...prev,
                      body: newText,
                    };
                  })
                }
              />
            </div>
            <div className="flex  items-center justify-start gap-5">
              <div className=" flex flex-col">
                <label>
                  {language === 'Thai' && 'กำหนดส่ง'}
                  {language === 'English' && 'due by'}
                </label>
                <input
                  value={formattedDate}
                  onChange={handleChange}
                  name="deadline"
                  className="w-max appearance-none outline-none border-none ring-2 rounded-md px-5 
            py-2 text-lg ring-gray-200 focus:ring-black "
                  type="date"
                  placeholder="Please select a date"
                  required
                />
              </div>
              <div className="flex flex-col w-max relative  h-max ">
                <label>
                  {language === 'Thai' && 'คะแนนของงาน'}
                  {language === 'English' && 'score'}
                </label>
                <input
                  min="1"
                  value={assignmentData.maxScore}
                  required
                  step="0.01"
                  onChange={handleChange}
                  name="maxScore"
                  className="w-max appearance-none outline-none border-none ring-2 rounded-md px-5 
            py-2 text-lg ring-gray-200 focus:ring-black placeholder:text-sm"
                  type="number"
                />
                <div className="text-lg absolute top-8 right-5">
                  <GrScorecard />
                </div>
              </div>
            </div>
            <div className="w-40">
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="w-40 py-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
          text-md cursor-pointer hover: active:border-2  active:border-gray-300
           active:border-solid  focus:border-2 hover:bg-red-500 transition duration-150
          focus:border-solid"
                >
                  {language === 'Thai' && 'อัปเดต'}
                  {language === 'English' && 'update'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form className="w-full h-full flex items-center justify-center flex-col gap-1">
          <div className="text-2xl font-Kanit font-semibold">
            {language === 'Thai' && 'เลือกผู้เรียนเพื่อมอบหมายงาน'}
            {language === 'English' && 'Choose students to assign work'}
          </div>

          <div
            className="w-11/12 h-full lg:max-h-[25rem] xl:max-h-[28rem] flex relative items-center
           justify-start overflow-auto scrollbar  flex-col "
          >
            {loading ? (
              <div className="absolute w-full  h-full flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              isChecked?.map((student, index) => {
                const oddNumber = index % 2;
                return (
                  <div
                    key={student.id}
                    className={`grid grid-cols-4  w-full relative items-center justify-center ${
                      oddNumber === 0 ? 'bg-white' : 'bg-orange-100'
                    } py-2 
              text-lg font-Kanit `}
                  >
                    {student.status === 201 && (
                      <div className="flex items-center justify-center left-3  absolute text-green-500">
                        <AiOutlineCheckCircle />
                      </div>
                    )}
                    {student.status?.error && (
                      <div className="flex items-center justify-center left-3 absolute text-red-600">
                        <MdError />
                      </div>
                    )}
                    <div className="flex items-center justify-start">
                      {student.number}
                    </div>
                    <div className="flex items-center justify-start">
                      {student.firstName}
                    </div>
                    <div className="flex items-center justify-start">
                      {student?.lastName}
                    </div>
                    {student.status === 'no-assign' ? (
                      <div className="flex items-center gap-5 justify-start ">
                        <div
                          className="w-max px-5 text-sm py-1 bg-gray-500  rounded-lg text-white
                      flex items-center justify-center"
                        >
                          {language === 'Thai' && 'ไม่ได้มอบหมาย'}
                          {language === 'English' && 'Already assigned'}
                        </div>
                        <input
                          checked={student?.[student.id]}
                          onChange={() =>
                            handleChangeCheck({ studentId: student.id })
                          }
                          type="checkbox"
                          className="w-6 h-6 ring-2  text-blue-600 bg-gray-100 border-gray-300 rounded
                   focus:ring-blue-500 dark:focus:ring-blue-600
                   dark:ring-offset-gray-800 focus:ring-2 ring-black dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-start gap-5 items-center">
                        <div
                          className="w-max px-5 text-sm py-1 bg-green-500  rounded-lg text-white
                      flex items-center justify-center"
                        >
                          {language === 'Thai' && 'มอบหมายแล้ว'}
                          {language === 'English' && 'Already assigned'}
                        </div>
                        {loadingItems.current.has(student.id) ? (
                          <Loading />
                        ) : (
                          <button
                            onClick={() =>
                              handleUnDoAssignmentOnStudent({
                                studentId: student.id,
                              })
                            }
                            type="button"
                            className="w-max select-none px-2 hover:bg-red-400 transition duration-100 active:scale-105
                         h-10 gap-2 bg-red-300 rounded-md flex items-center justify-center text-red-600"
                          >
                            <TiUserDelete />
                            <span className="text-xs">ยกเลิก</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex gap-5 mt-4">
            <button
              type="button"
              onClick={onClickIsCheck}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {language === 'Thai' && 'เลือกผู้เรียนทั้งหมด'}
              {language === 'English' && 'Pick all students'}
            </button>
            <button
              type="button"
              onClick={onClickAssignWork}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {language === 'Thai' && 'มอบหมายงาน'}
              {language === 'English' && 'Assign'}
            </button>
          </div>
        </form>
      )}
    </form>
  );
}

export default UpdateAssignment;
