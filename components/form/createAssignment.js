import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { GrScorecard } from 'react-icons/gr';
import Image from 'next/image';
import {
  AssignWorkToSTudent,
  CreateAssignmentApi,
} from '../../service/assignment';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Loading from '../loading/loading';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { MdError } from 'react-icons/md';
import { Box, TextField } from '@mui/material';
import { FcCancel } from 'react-icons/fc';
import Error from 'next/error';

export default function CreateAssignment({
  close,
  setTriggerAssignment,
  students,
  assignments,
  language,
}) {
  const rounter = useRouter();
  const [assignmentCreated, setAssignmentCreated] = useState();
  const [assignmentData, setAssignmentData] = useState({
    title: '',
    body: '',
    deadline: '',
    maxScore: '',
  });

  const [isChecked, setIsChecked] = useState();
  const [isAssignStudent, setIsAssignmentStdent] = useState(false);
  const [loading, setLoading] = useState(false);
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
      students?.data?.data?.map((student) => {
        return {
          ...student,
          [student.id]: false,
        };
      }),
    );
  }, [students.data]);

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

  //handle click to sclect all student
  const onClickIsCheck = () => {
    setIsChecked((prevState) => {
      return prevState.map((student) => {
        return {
          ...student,
          [student.id]: !student[student.id],
        };
      });
    });
  };

  //handle click to assign student work
  const onClickAssignWork = async () => {
    try {
      setLoading(true);
      const assign = await AssignWorkToSTudent({
        isChecked,
        assignmentCreated: assignmentCreated.data,
      });
      setIsChecked(assign);
      Swal.fire('Success', 'Successfully assigned to students', 'success');
      setLoading(false);
      document.body.style.overflow = 'auto';
      setIsChecked(() =>
        students?.data?.data?.map((student) => {
          return {
            ...student,
            [student.id]: false,
          };
        }),
      );
      setIsAssignmentStdent(false);
      setTriggerAssignment(false);
    } catch (err) {
      Swal.fire('error', 'error', 'success');
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
      const imageUrls = Array.from(imageElements).map((img) => img.src);

      if (assignmentData.body === '') {
        throw new Error(
          language === 'Thai'
            ? 'กรุณาใส่คำอธิบายชิ้นงาน'
            : 'Description is required',
        );
      }
      const createAssignment = await CreateAssignmentApi({
        classroomId: rounter.query.classroomId,
        title: assignmentData.title,
        description: assignmentData.body,
        maxScore: assignmentData.maxScore,
        deadline: assignmentData.deadline,
        imagesBase64: imageUrls,
      });
      assignments?.refetch();
      Swal.fire('success', 'assignment has been createed', 'success');

      setAssignmentCreated(createAssignment);
      setLoading(() => false);
      setIsAssignmentStdent(true);
    } catch (err) {
      setLoading(() => false);
      if (err.props === 'กรุณาใส่คำอธิบายชิ้นงาน') {
        Swal.fire('error', 'กรุณาใส่คำอธิบายชิ้นงาน', 'error');
      } else {
        Swal.fire(
          'error',
          err?.props?.response?.data?.message?.toString(),
          'error',
        );
      }
    }
  };

  const handleEditorChange = (content, editor) => {
    setAssignmentData((prev) => {
      return {
        ...prev,
        body: content,
      };
    });
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="flex md:w-screen  md:h-screen lg:h-screen   lg:rounded-none  
        font-Kanit bg-white border-2 border-solid rounded-lg drop-shadow-xl p-5 z-40 
    top-0 right-0 left-0 bottom-0 m-auto fixed items-start justify-center"
      >
        {isAssignStudent === false ? (
          <div className="w-full h-full   flex-col-reverse lg:flex-row items-end justify-end lg:items-start flex gap-5">
            <div className="flex-col w-full h-full  flex gap-4  ">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    document.body.style.overflow = 'auto';
                    setIsChecked(() =>
                      students?.data?.data?.map((student) => {
                        return {
                          ...student,
                          [student.id]: false,
                        };
                      }),
                    );
                    setIsAssignmentStdent(false);
                    setTriggerAssignment(false);
                  }}
                  className="text-3xl flex gap-1 justify-center items-center"
                >
                  <FcCancel />
                  <span className="text-red-400 text-lg">
                    {language === 'Thai'
                      ? 'ยกเลิก'
                      : language === 'English' && 'Cancel'}
                  </span>
                </button>
              </div>
              <div className="flex flex-col gap-0">
                <Box width="100%">
                  <TextField
                    name="title"
                    onChange={handleChange}
                    fullWidth
                    label="title"
                  />
                </Box>
              </div>

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
                onEditorChange={handleEditorChange}
              />

              {loading ? (
                <div className="flex justify-center">
                  <Loading />
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    className="w-40 py-2 mt-2 rounded-full bg-[#2C7CD1] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 hover:bg-red-500 transition duration-150
              focus:border-solid"
                  >
                    {language === 'Thai' && 'สร้าง'}
                    {language === 'English' && 'CREATE'}
                  </button>
                </div>
              )}
            </div>
            <div
              className="lg:w-60  md:w-full md:h-max  lg:h-full md:border-0  
          flex md:flex-row lg:flex-col items-center md:gap-10 justify-center lg:justify-start gap-5"
            >
              <div className=" flex flex-col mt-0 lg:mt-10">
                <label>
                  {language === 'Thai' && 'กำหนดส่ง'}
                  {language === 'English' && 'Due by'}
                </label>
                <input
                  onChange={handleChange}
                  name="deadline"
                  className="w-60 appearance-none outline-none border-none ring-2  rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black "
                  type="date"
                  placeholder="Please select a date"
                  required
                />
              </div>
              <div className="flex flex-col w-max relative  h-max ">
                <label>
                  {language === 'Thai' && 'คะแนนของงาน'}
                  {language === 'English' && 'socres'}
                </label>
                <input
                  min="1"
                  onChange={handleChange}
                  name="maxScore"
                  className="w-60 appearance-none outline-none border-none ring-2 rounded-md px-5 
                py-2 text-lg ring-gray-200 focus:ring-black placeholder:text-sm"
                  type="number"
                  step="0.01"
                  required
                  placeholder={
                    language === 'Thai'
                      ? 'ใส่คะแนนของงาน'
                      : language === 'English' && 'put scores'
                  }
                />
                <div className="text-lg absolute top-8 right-5">
                  <GrScorecard />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="w-full h-full  flex items-center justify-start flex-col gap-10">
            <div className="text-2xl font-Kanit font-semibold">
              {language === 'Thai' && 'เลือกผู้เรียนเพื่อมอบหมายงาน'}
              {language === 'English' && 'Choose students to assign work to'}
            </div>

            <div className="lg:w-2/4 lg:h-3/4 md:w-10/12 md:h-80  flex relative items-center justify-start overflow-auto scrollbar  flex-col gap-2">
              {loading ? (
                <div className="absolute w-full  h-full flex items-center justify-center">
                  <Loading />
                </div>
              ) : (
                isChecked?.map((student, index) => {
                  const studentId = student.id;
                  const oddNumber = index % 2;
                  return (
                    <div
                      key={student.id}
                      className={`grid grid-cols-4 w-full relative items-center justify-center ${
                        oddNumber === 0 ? 'bg-blue-100' : 'bg-orange-100'
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
                      <div className="flex items-center justify-center">
                        {student.number}
                      </div>
                      <div className="flex items-center justify-center">
                        {student.firstName}
                      </div>
                      <div className="flex items-center justify-center">
                        {student?.lastName}
                      </div>
                      <div className="flex items-center justify-center">
                        <input
                          checked={student?.[student.id]}
                          onChange={() =>
                            handleChangeCheck({ studentId: student.id })
                          }
                          type="checkbox"
                          className="w-6 h-6  ring-2 
                           ring-black  text-blue-600 bg-gray-100 border-gray-300 rounded
                       focus:ring-blue-500 dark:focus:ring-blue-600
                       dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {!loading && (
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={onClickIsCheck}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {language === 'Thai' && 'เลือกผู้เรียนทั้งหมด'}
                  {language === 'English' && 'Choose all students'}
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
            )}
          </form>
        )}
      </form>
      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          setIsChecked(() =>
            students?.data?.data?.map((student) => {
              return {
                ...student,
                [student.id]: false,
              };
            }),
          );
          setIsAssignmentStdent(false);
          setTriggerAssignment(false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}
