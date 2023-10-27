import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DeleteAssignment,
  DeleteStudentWork,
  ReviewStudentWork,
  ReviewStudentWorkNoWork,
  ReviewStudentWorksheetApi,
  ViewAllAssignOnStudent,
} from '../../../../../../service/assignment.js';
import { FiSettings } from 'react-icons/fi';
import { Box, Skeleton, TextField } from '@mui/material';
import {
  MdDelete,
  MdOutlineAssignmentReturn,
  MdOutlineEditOff,
  MdOutlineModeEditOutline,
  MdZoomInMap,
  MdZoomOutMap,
} from 'react-icons/md';
import Swal from 'sweetalert2';
import Image from 'next/image';
import 'lightbox.js-react/dist/index.css';
import { SlideshowLightbox, initLightboxJS } from 'lightbox.js-react';
import { GetAssignment } from '../../../../../../service/assignment';
import { useRouter } from 'next/router';
import { GetAllStudents } from '../../../../../../service/students';
import UpdateAssignment from '../../../../../../components/form/updateAssignment.js';
import Unauthorized from '../../../../../../components/error/unauthorized.js';
import { GetUser, GetUserCookie } from '../../../../../../service/user.js';
import { BiRefresh } from 'react-icons/bi';
import Head from 'next/head.js';
import {
  DeleteStudentComment,
  DeleteTeachertComment,
  GetComments,
  PostComment,
} from '../../../../../../service/comment.js';
import SendIcon from '@mui/icons-material/Send';
import { parseCookies } from 'nookies';
import ReactPlayer from 'react-player';
import { Editor } from '@tinymce/tinymce-react';
import AssignMultipleClassroom from '../../../../../../components/form/assignMultipleClassroom.js';
import { AiFillEdit, AiOutlineComment } from 'react-icons/ai';
import { HiOutlineNewspaper, HiPaperClip } from 'react-icons/hi2';
import Link from 'next/link.js';
import Loading from '../../../../../../components/loading/loading.js';

const MAX_DECIMAL_PLACES = 2; // Maximum number of decimal places allowed

const validateScore = (value) => {
  const regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${MAX_DECIMAL_PLACES}})?$`);
  return regex.test(value);
};

function Index({ error, user }) {
  const router = useRouter();
  const [loadingTiny, setLoadingTiny] = useState(true);
  const [loadingReviewStudentWorksheet, setLoadingReviewStudentWorksheet] =
    useState(false);
  const [triggerUpdateAssignment, setTriggerUpdateAssignment] = useState(false);
  const [triggerShowFiles, setTriggerShowFiles] = useState(true);
  const [triggerShowComment, setTriggerShowComment] = useState(false);
  const [triggerShowWorksheet, setTiggerShowWorksheet] = useState(false);
  const [triggerFullScreen, setTriggerFullScreen] = useState(false);
  const [triggerEditBody, setTriggerEditBody] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerAssignMultipleClassroom, setTriggerAssignMultipleClassroom] =
    useState(false);
  const [comment, setComment] = useState();
  const [files, setFiles] = useState([]);
  const [studentSummitDate, setStudentSummitDate] = useState({
    summitDate: '',
    isDue: '',
    deadline: '',
  });
  const [loadingIframe, setLoadingIframe] = useState(false);
  const [comfirmDeleteComment, setComfirmDeleteComment] = useState(false);
  const assignment = useQuery(
    ['assignment'],
    () => GetAssignment({ assignmentId: router.query.assignmentId }),
    {
      enabled: false,
    },
  );
  const students = useQuery(
    ['students'],
    () => {
      GetAllStudents({ classroomId: router.query.classroomId });
    },
    {
      enabled: false,
    },
  );

  const studentOnAssignments = useQuery(
    ['studentOnAssignments'],
    () =>
      ViewAllAssignOnStudent({
        assignmentId: assignment.data.data.id,
        classroomId: router.query.classroomId,
      }),
    {
      enabled: assignment.isSuccess,
    },
  );
  const [activeMenu, setActiveMenu] = useState(0);
  const [teacherReview, setTeacherReview] = useState({
    comment: '',
    score: '',
  });
  const [currentStudentWork, setCurrentStudentWork] = useState();
  const [images, setImages] = useState([]);
  const menus = [
    {
      titleThai: 'งาน',
      titleEnglish: 'assignment',
    },
    {
      titleThai: 'ตรวจงาน',
      titleEnglish: 'check assignment',
    },
  ];

  useEffect(() => {
    initLightboxJS(process.env.NEXT_PUBLIC_LIGHTBOX_KEY, 'individual');
  }, []);

  // refetch studentOnAssinment when  there is new assignment?.data?.data?
  useEffect(() => {
    if (router.isReady) {
      students.refetch();
      studentOnAssignments.refetch();
      assignment.refetch();
    }
  }, [router.isReady]);

  // convert date format
  const date = new Date(assignment?.data?.data?.deadline);
  const formattedDate = date.toLocaleDateString(
    `${
      user?.language === 'Thai'
        ? 'th-TH'
        : user?.language === 'English' && 'en-US'
    }`,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );

  //handle to assign current assignment to another classroom
  const handleClickAssignMultipleClassroom = () => {
    setTriggerAssignMultipleClassroom((prev) => !prev);
  };

  //handle show update assignmnet compponent
  const handleClickUpdateAssignment = () => {
    students.refetch();
    studentOnAssignments.refetch();
    setTriggerAssignMultipleClassroom(() => false);
    setTriggerUpdateAssignment(true);
  };

  const handleDelteStudentWork = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteStudentWork = await DeleteStudentWork({
          assignmentId: assignment?.data?.data?.id,
          studentId: currentStudentWork.id,
        });
        studentOnAssignments.refetch();
        Swal.fire('Deleted!', deleteStudentWork?.data, 'success');
      }
    });
  };

  const handleIframeLoading = () => {
    setLoadingIframe(() => false);
  };

  //handle click to delete assignment
  const handleDeleteAssignment = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(() => true);
          const deleteAssignment = await DeleteAssignment({
            assignmentId: assignment?.data?.data?.id,
          });

          Swal.fire('Deleted!', 'Successfully Deleted Assignment', 'success');
          router.push({
            pathname: `/classroom/teacher/${router.query.classroomId}/assignment`,
          });
          setIsLoading(() => false);
        } catch (err) {
          setIsLoading(() => false);
          console.log(err);
          Swal.fire(
            'Error!',
            err?.props?.response?.data?.message?.toString(),
            'error',
          );
        }
      }
    });
  };

  //handle trigger menu
  const handleMenuTrigger = (index) => {
    if (index === 0) {
      setTriggerAssignMultipleClassroom(() => false);
    }
    if (index === 1) {
      students.refetch();
      studentOnAssignments.refetch();
    }
    setActiveMenu(index);
  };

  // check file type
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  //handle open make sure to delete classroom
  const handleConfirmDelete = (index) => {
    const newItems = comment.map((item, i) => {
      if (i === index) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
    setComment(() => newItems);
  };
  //handle make sure to cancel deleting classroom
  const handleUnConfirmDelete = (index) => {
    const newItems = comment.map((item, i) => {
      if (i === index) {
        return { ...item, selected: false };
      } else {
        return { ...item, selected: false };
      }
    });
    setComment(() => newItems);
  };
  //handle select student's work
  const handleSelectWork = async (student) => {
    try {
      if (student.studentWork) {
        setStudentSummitDate((prev) => {
          setLoadingIframe(() => true);
          const createDate = new Date(student.studentWork.createAt); // Replace with your specific date and time
          const deadlineDate = new Date(assignment?.data?.data?.deadline);
          deadlineDate.setHours(23);
          deadlineDate.setMinutes(59);
          deadlineDate.setSeconds(0);
          let isDue = false;
          // Formatting the date and time
          const formattedCreateDateTime = createDate.toLocaleString('th-TH', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          if (createDate > deadlineDate) {
            isDue = true;
          } else if (createDate < deadlineDate) {
            isDue = false;
          }
          return {
            isDue: isDue,
            summitDate: formattedCreateDateTime,
          };
        });
        setFiles(() => []);
        setImages(() => {
          let pictures = [];
          if (!student?.studentWork?.picture) {
            pictures.push({ src: '', alt: "student's work" });
          } else if (student.studentWork.picture) {
            const arrayPictures = student.studentWork.picture.split(', ');
            for (const arrayPicture of arrayPictures) {
              const fileType = get_url_extension(arrayPicture);
              if (
                fileType === 'jpg' ||
                fileType === 'jpeg' ||
                fileType === 'png' ||
                fileType === 'HEIC' ||
                fileType === 'JPEG' ||
                fileType === 'PNG' ||
                fileType === 'JPG' ||
                fileType === 'heic'
              ) {
                pictures.push({ src: arrayPicture, alt: "student's work" });
              } else {
                setFiles((prev) => {
                  return [
                    ...prev,
                    {
                      fileType: fileType,
                      url: arrayPicture,
                    },
                  ];
                });
              }
            }

            return pictures;
          }
        });
      } else if (!student.studentWork) {
        setStudentSummitDate(() => null);
        setFiles(() => []);
        setImages(null);
      }
      setCurrentStudentWork(student);
      setTeacherReview((prev) => {
        return {
          ...prev,
          comment: !student?.studentWork?.comment
            ? ''
            : student?.studentWork?.comment,
          score: !student?.studentWork?.score
            ? ''
            : student?.studentWork?.score,
        };
      });
      const comment = await GetComments({
        assignmentId: router.query.assignmentId,
        studentId: student.id,
      });
      setComment(() => comment.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleReviewWork = async (e) => {
    try {
      e.preventDefault();
      if (currentStudentWork.status === 'have-work') {
        const reviewWork = await ReviewStudentWork({
          studentId: currentStudentWork.id,
          assignmentId: assignment?.data?.data?.id,
          comment: teacherReview.comment,
          score: teacherReview.score,
        });
        Swal.fire('success', 'ตรวจงานเรียบร้อย', 'success');
        studentOnAssignments.refetch();
        let nextStudentNumber = parseInt(currentStudentWork.number) + 1;
        // Check if the current student is the last student
        if (nextStudentNumber > studentOnAssignments.data.data.length) {
          // Set nextStudentNumber to the first student's number
          nextStudentNumber = 1;
        }
        const nextStudent = studentOnAssignments.data.data.find(
          (student) => parseInt(student.number) === nextStudentNumber,
        );

        handleSelectWork(nextStudent);
      } else if (currentStudentWork.status === 'no-work') {
        const reviewWork = await ReviewStudentWorkNoWork({
          studentId: currentStudentWork.id,
          assignmentId: assignment?.data?.data?.id,
          comment: teacherReview.comment,
          score: teacherReview.score,
        });
        Swal.fire('success', 'ตรวจงานเรียบร้อย', 'success');
        studentOnAssignments.refetch();

        let nextStudentNumber = parseInt(currentStudentWork.number) + 1;
        // Check if the current student is the last student
        if (nextStudentNumber > studentOnAssignments.data.data.length) {
          // Set nextStudentNumber to the first student's number
          nextStudentNumber = 1;
        }
        const nextStudent = studentOnAssignments.data.data.find(
          (student) => parseInt(student.number) === nextStudentNumber,
        );

        handleSelectWork(nextStudent);
      }
    } catch (err) {
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  };
  async function handleDeleteStudentComment({ studentCommentId, studentId }) {
    try {
      const deleteComment = await DeleteStudentComment({
        studentCommentId,
      });
      const comment = await GetComments({
        assignmentId: router.query.assignmentId,
        studentId: studentId,
      });
      setComment(() => comment.data);
      Swal.fire('success', 'ลบคอมเมนต์เรียบร้อย', 'success');
    } catch (err) {
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  }

  async function handleDeleteTeacherComment({ teacherCommentId, studentId }) {
    try {
      const deleteComment = await DeleteTeachertComment({
        teacherCommentId,
      });
      const comment = await GetComments({
        assignmentId: router.query.assignmentId,
        studentId: studentId,
      });
      setComment(() => comment.data);
      Swal.fire('success', 'ลบคอมเมนต์เรียบร้อย', 'success');
    } catch (err) {
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  }

  //handle post comment for user
  const handlePostComment = async (e) => {
    try {
      e.preventDefault();
      setTeacherReview((prev) => {
        return {
          ...prev,
          comment: '',
        };
      });
      await PostComment({
        assignmentId: assignment?.data?.data?.id,
        studentId: currentStudentWork.id,
        body: teacherReview.comment,
      });
      const comment = await GetComments({
        assignmentId: assignment?.data?.data?.id,
        studentId: currentStudentWork.id,
      });
      setComment(() => comment.data);
    } catch (err) {
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  };
  const handleOnChangeReviewWork = (e) => {
    const { name, value } = e.target;

    if (value === '' || (validateScore(value) && name === 'score')) {
      setTeacherReview((prev) => {
        return {
          ...prev,
          score: value,
        };
      });
    }
    if (name === 'comment') {
      setTeacherReview((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleChangeCurrentStudentWork = (content, editor) => {
    setCurrentStudentWork((prev) => {
      return {
        ...prev,
        studentWork: {
          ...prev.studentWork,
          body: content,
        },
      };
    });
  };
  //handle review student work sheet
  const handleReviewStudentWorksheet = async () => {
    try {
      setLoadingReviewStudentWorksheet(() => true);
      await ReviewStudentWorksheetApi({
        body: currentStudentWork.studentWork.body,
        studentWorkId: currentStudentWork.studentWork.id,
      });
      studentOnAssignments.refetch();
      setLoadingReviewStudentWorksheet(() => false);
      Swal.fire('success', 'update successfully', 'success');
    } catch (err) {
      setLoadingReviewStudentWorksheet(() => false);
      console.log(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  };
  if (error?.statusCode === 401) {
    return <Unauthorized />;
  }
  return (
    <div className="bg-white w-full font-Kanit relative">
      <Head>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
        <title>assignment - {assignment?.data?.data?.title}</title>
      </Head>
      {triggerUpdateAssignment ? (
        <UpdateAssignment
          language={user.language}
          students={students}
          assignment={assignment}
          setTriggerUpdateAssignment={setTriggerUpdateAssignment}
          studentOnAssignments={studentOnAssignments}
        />
      ) : (
        <div className="h-full ">
          {/* menu bars */}

          <div
            className={` w-full h-20  drop-shadow-md bg-white z-10 ${
              triggerFullScreen ? 'hidden' : 'flex'
            }  sticky top-0  justify-center gap-9`}
          >
            <Link
              href={`/classroom/teacher/${router.query.classroomId}/assignment/`}
              className="font-Poppins z-20 hover:scale-110 transition 
              duration-150 no-underline absolute top-3 left-2 text-white bg-blue-500 px-5 py-3 rounded-xl "
            >
              {user.language === 'Thai' && 'กลับ'}
              {user.language === 'English' && 'back'}
            </Link>
            {menus.map((menu, index) => {
              return (
                <div
                  onClick={() => handleMenuTrigger(index)}
                  key={index}
                  className=" hover:font-bold w-max hover:cursor-pointer text-xl font-Kanit 
                font-normal flex items-center  group justify-center underLineHover transition duration-150"
                >
                  <span
                    className={`text-[#2C7CD1] ${
                      activeMenu === index ? 'font-bold' : 'font-normal'
                    }`}
                  >
                    {user.language === 'Thai' && menu.titleThai}
                    {user.language === 'English' && menu.titleEnglish}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center w-full h-full ">
            {/* assignment detail */}
            {activeMenu === 0 && (
              <div className="w-full flex flex-col mt-5 items-center justify-start h-full  ">
                {triggerAssignMultipleClassroom ? (
                  <AssignMultipleClassroom
                    user={user}
                    setTriggerAssignMultipleClassroom={
                      setTriggerAssignMultipleClassroom
                    }
                  />
                ) : (
                  <div className="w-11/12   max-h-full">
                    <div className="flex justify-between ">
                      <span className="lg:text-4xl">
                        {assignment.isLoading || assignment.isFetching ? (
                          <Skeleton variant="text" width={200} />
                        ) : (
                          assignment?.data?.data?.title
                        )}
                      </span>
                      <div className="flex items-center justify-center flex-col">
                        <div
                          className="w-max px-2 h-10 rounded-xl flex items-center justify-center
              bg-orange-400 font-Poppins font-bold text-xl text-white"
                        >
                          {assignment.isLoading || assignment.isFetching ? (
                            <Skeleton variant="text" />
                          ) : (
                            assignment?.data?.data?.maxScore.toLocaleString()
                          )}
                        </div>
                        <span>
                          {user.language === 'Thai' && 'คะแนนเต็ม'}
                          {user.language === 'English' && 'score'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-[2px] bg-blue-900 rounded-full"></div>
                    <div
                      className="mt-5 font-Kanit text-xl w-full max-w-screen-2xl 
                  mb-28 max-h-full overflow-y-hidden  overflow-x-auto flex items-center justify-center"
                    >
                      {(assignment.isLoading ||
                        assignment.isFetching ||
                        loadingTiny) && (
                        <div>
                          <Skeleton variant="text" width={300} height={400} />
                        </div>
                      )}
                      <div
                        className={` ${
                          assignment.isLoading ||
                          assignment.isFetching ||
                          loadingTiny
                            ? 'w-0 h-0 opacity-0'
                            : 'w-10/12 h-96 opacity-100'
                        }`}
                      >
                        <Editor
                          disabled={true}
                          apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
                          init={{
                            setup: function (editor) {
                              editor.on('init', function () {
                                setLoadingTiny(() => false);
                              });
                            },
                            height: '100%',
                            width: '100%',
                            menubar: false,
                            toolbar: false,
                            selector: 'textarea', // change this value according to your HTML
                          }}
                          initialValue={assignment?.data?.data?.description}
                          value={assignment?.data?.data?.description}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="w-full  gap-2 mt-8 bg-blue-500 fixed bottom-0 ">
                  <div className="p-6 flex  items-end justify-between text-white">
                    <div>
                      <span>
                        {user.language === 'Thai' && 'กำหนดส่ง'}
                        {user.language === 'English' && 'due by'}
                      </span>
                      <span className="text-xl ml-2 font-semibold text-white hover:text-red-500">
                        {formattedDate}
                      </span>
                    </div>
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <div className="flex gap-6">
                        <button
                          onClick={handleDeleteAssignment}
                          className="text-xl text-white hover:text-red-600 flex items-center justify-center flex-col hover:scale-110 
                  transition duration-150 ease-in-out cursor-pointer"
                        >
                          <MdDelete />
                          <span className="text-sm">
                            {user.language === 'Thai' && 'ลบงาน'}
                            {user.language === 'English' && 'delete assignment'}
                          </span>
                        </button>
                        <div
                          onClick={handleClickUpdateAssignment}
                          className="text-xl flex flex-col items-center justify-center hover:scale-110 transition duration-150 cursor-pointer
            "
                        >
                          <FiSettings />
                          <span className="text-sm">
                            {user.language === 'Thai' && 'แก้ไข'}
                            {user.language === 'English' && 'setting'}
                          </span>
                        </div>
                        <div
                          onClick={handleClickAssignMultipleClassroom}
                          className={`text-xl flex flex-col items-center ${
                            triggerAssignMultipleClassroom
                              ? 'ring-white'
                              : 'ring-transparent'
                          } ring-2  p-2 rounded-md 
                        justify-center active:ring-4 hover:scale-110 transition duration-150 cursor-pointer`}
                        >
                          <MdOutlineAssignmentReturn />
                          <span className="text-sm">
                            {user.language === 'Thai' && 'มอบหมายหลายห้อง'}
                            {user.language === 'English' &&
                              'Assign to another classroom'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* student's assignment */}
            {activeMenu === 1 && (
              <div className="flex items-start md:-2  lg:gap-5 justify-center w-full h-full  mt-5  ">
                <div className="lg:w-max lg:max-w-xl md:w-2/4  top-10 sticky flex flex-col h-full items-center justify-center ">
                  <div className="text-xl font-Kanit font-semibold flex justify-center items-center gap-2">
                    <span>
                      {user.language === 'Thai' && 'สถานะการส่งงานของผู้เรียน'}
                      {user.language === 'English' &&
                        "student's status on assignment"}
                    </span>

                    <button
                      onClick={() => studentOnAssignments.refetch()}
                      className="flex cursor-pointer items-center justify-center hover:scale-110 transition duration-150
                      active:bg-orange-800
                     text-4xl bg-orange-500 w-8 h-8 rounded-full text-white"
                    >
                      <BiRefresh />
                    </button>
                  </div>
                  <table className="">
                    <thead className="mt-4 flex text-base ">
                      <tr className="flex lg:gap-5 md:gap-2 w-full  justify-center">
                        <th className="flex justify-center text-center  w-10">
                          {user.language === 'Thai' && 'เลขที่'}
                          {user.language === 'English' && 'number'}
                        </th>
                        <th className="flex items-center justify-center md:w-28 xl:w-60 lg:w-40">
                          {user.language === 'Thai' && 'ชื่อ'}
                          {user.language === 'English' && "student's name"}
                        </th>
                        <th className="flex items-center justify-center w-10">
                          {user.language === 'Thai' && 'คะแนน'}
                          {user.language === 'English' && 'score'}
                        </th>
                        <th className="flex items-center justify-center w-32 ">
                          {user.language === 'Thai' && 'สถานะ'}
                          {user.language === 'English' && 'status'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentOnAssignments.isLoading ||
                      studentOnAssignments.isFetching ? (
                        <tr className="flex flex-col  items-center justify-start mt-5 gap-5">
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="80%"
                          />
                        </tr>
                      ) : (
                        studentOnAssignments?.data?.data?.map(
                          (student, index) => {
                            let IsDue = false;
                            const currentTime = new Date();
                            const deadlineDate = new Date(
                              assignment?.data?.data?.deadline,
                            );
                            deadlineDate.setHours(23);
                            deadlineDate.setMinutes(59);
                            deadlineDate.setSeconds(0);
                            if (currentTime > deadlineDate) {
                              IsDue = true;
                            } else if (currentTime < deadlineDate) {
                              IsDue = false;
                            }
                            return (
                              <tr
                                key={index}
                                className="flex gap-5 mb-2 justify-center "
                              >
                                <th className="flex justify-end hover:w-max items-center text-right hover:max-w-md max-w-[2.5rem] w-max truncate text-sm font-normal  ">
                                  {student.number}
                                </th>
                                <td className="flex items-center justify-start gap-4 lg:w-40 md:w-28  truncate xl:w-60">
                                  <span>{student.firstName}</span>
                                  <span>{student?.lastName}</span>
                                </td>
                                {student?.studentWork?.score ? (
                                  <td className="flex items-center justify-center font-Kanit font-bold text-gray-700 w-10">
                                    {student.studentWork.score}
                                  </td>
                                ) : (
                                  <td className="flex items-center justify-center font-Kanit font-bold text-gray-700 w-10">
                                    0
                                  </td>
                                )}
                                {student.status === 'no-work' && !IsDue && (
                                  <td
                                    onClick={() => handleSelectWork(student)}
                                    className=" bg-orange-500 py-1 px-2 rounded-lg text-white cursor-pointer 
                                      hover:scale-105 transition duration-150 md:w-20 md:text-sm lg:w-32 text-center"
                                  >
                                    {user.language === 'Thai' && 'ไม่ส่งงาน'}
                                    {user.language === 'English' && 'NO WORK'}
                                  </td>
                                )}
                                {student.status === 'no-work' && IsDue && (
                                  <td
                                    onClick={() => handleSelectWork(student)}
                                    className=" bg-red-500 py-1 px-2 rounded-lg text-white cursor-pointer 
                                      hover:scale-105 transition duration-150 md:w-20 md:text-sm lg:w-32 text-center"
                                  >
                                    {user.language === 'Thai' && 'เลยกำหนดส่ง'}
                                    {user.language === 'English' && 'PASS DUE'}
                                  </td>
                                )}
                                {student.status === 'have-work' &&
                                  student.studentWork.score === 0 &&
                                  student.studentWork.isSummited === false && (
                                    <td
                                      onClick={() => handleSelectWork(student)}
                                      className="md:w-20 md:text-sm lg:w-32 text-center  cursor-pointer hover:scale-105 transition duration-150
                                         bg-yellow-500 py-1 px-2 rounded-lg text-white lg:text-base flex items-center justify-center"
                                    >
                                      {user.language === 'Thai' && 'รอการตรวจ'}
                                      {user.language === 'English' &&
                                        'WAIT CHECK'}
                                    </td>
                                  )}
                                {student.status === 'no-assign' && (
                                  <td className=" md:w-20 md:text-sm lg:w-32  bg-gray-500 py-1 px-2 rounded-lg text-white text-center">
                                    {user.language === 'Thai' &&
                                      'ไม่ได้มอบหมาย'}
                                    {user.language === 'English' &&
                                      'NOT ASSIGN'}
                                  </td>
                                )}
                                {student.status === 'have-work' &&
                                  student.studentWork.isSummited === true && (
                                    <td
                                      onClick={() => handleSelectWork(student)}
                                      className=" md:w-20 md:text-sm lg:w-32  text-center bg-green-500 py-1 px-2 cursor-pointer hover:scale-105 transition duration-150 rounded-lg text-white"
                                    >
                                      {user.language === 'Thai' && 'ตรวจแล้ว'}
                                      {user.language === 'English' &&
                                        'FINISH CHECK'}
                                    </td>
                                  )}
                              </tr>
                            );
                          },
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* review student work section */}
                <div
                  className="flex flex-col    lg:w-2/4 md:w-80 sticky
                 top-20 items-center justify-between h-full "
                >
                  <div className="flex  w-full  lg:justify-between  mt-10">
                    <div className="flex items-center md:w-5/12 lg:w-max justify-center relative ">
                      <div className="lg:text-3xl md:text-xl w-max font-Kanit flex">
                        <span>
                          {user.language === 'Thai' && 'งานของผู้เรียน'}
                          {user.language === 'English' && "student's work"}
                        </span>
                        {currentStudentWork?.status === 'have-work' && (
                          <div
                            onClick={handleDelteStudentWork}
                            className="flex items-center md:ml-1 lg:ml-5 justify-center text-red-500 cursor-pointer
                        hover:text-red-800 transition duration-150"
                          >
                            <MdDelete />
                          </div>
                        )}
                      </div>
                    </div>

                    {currentStudentWork && (
                      <form
                        onSubmit={handleReviewWork}
                        className="lg:w-max md:w-80  flex md:justify-end lg:justify-center gap-5 "
                      >
                        <Box width="40%" className="relative ">
                          <TextField
                            fullWidth
                            label={
                              user.language === 'Thai'
                                ? 'คะแนน'
                                : user.language === 'English' && 'score'
                            }
                            type="text"
                            name="score"
                            value={teacherReview.score}
                            onChange={handleOnChangeReviewWork}
                          />
                          <span className="font-Poppins absolute lg:top-4 md:top-5  md:text-sm lg:text-base md:right-2 lg:right-5">
                            /{assignment?.data?.data?.maxScore}
                          </span>
                        </Box>
                        <button
                          className="w-20  h-9 mt-2 rounded-full bg-[#2C7CD1] hover:bg-red-500 tranti duration-150
                       text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
                        >
                          {user.language === 'Thai' && 'ตรวจ'}
                          {user.language === 'English' && 'review'}
                        </button>
                      </form>
                    )}
                  </div>
                  <div className="flex  flex-col justify-start w-full">
                    <div className="w-full flex justify-start items-center gap-2 ">
                      <span>
                        {user.language === 'Thai' && 'เลขที่'}
                        {user.language === 'English' && 'number'}{' '}
                        {currentStudentWork?.number}
                      </span>
                      <span
                        className="md:text-sm lg:text-base
                    "
                      >
                        {currentStudentWork?.firstName}
                        {currentStudentWork?.lastName}
                      </span>
                      {currentStudentWork?.picture && (
                        <div className="lg:w-10 lg:h-10 md:w-8 md:h-8 bg-orange-500 rounded-full overflow-hidden relative">
                          <Image
                            src={currentStudentWork?.picture}
                            layout="fill"
                            sizes="(max-width: 768px) 100vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {studentSummitDate?.summitDate && (
                      <div className="flex gap-2 my-3">
                        <div
                          className={`flex gap-2 ${
                            studentSummitDate.isDue
                              ? 'bg-red-500'
                              : 'bg-green-400'
                          }  w-max p-2 rounded-lg drop-shadow-md text-white `}
                        >
                          <span>
                            {user.language === 'Thai' && 'ส่งงานเมื่อ'}
                            {user.language === 'English' && 'summited work on'}
                          </span>
                          <span>{studentSummitDate.summitDate}</span>
                        </div>
                        {studentSummitDate.isDue && (
                          <div className="w-max p-2 rounded-lg bg-red-500 text-white">
                            เลยกำหนดส่ง
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className={`${
                      triggerFullScreen
                        ? 'fixed flex justify-center flex-col items-center top-0 right-0 left-0 bottom-0 m-auto w-screen h-screen z-50'
                        : 'w-full'
                    }`}
                  >
                    <div
                      className={`
                    ${
                      triggerFullScreen
                        ? 'relative md:h-4/5 bg-white  lg:h-4/5  scale-100  p-0 m-2 ring-2 ring-black  rounded-md overflow-auto md:w-9/12'
                        : 'relative md:h-96 bg-white  lg:h-80 pb-5  scale-100  p-0 m-2 ring-2 ring-black  rounded-md overflow-auto md:w-full'
                    } transition duration-200
                      `}
                    >
                      <div
                        className="w-full h-max py-2 border-b-2 bg-white
                       border-slate-200 sticky z-40 justify-around flex  items-center gap-5
                     top-0"
                      >
                        <div className="flex w-max gap-2 items-center justify-center">
                          <button
                            onClick={() => {
                              setTriggerShowFiles(() => true);
                              setTriggerShowComment(() => false);
                              setTiggerShowWorksheet(() => false);
                            }}
                            aria-label="button to trigger show student's assignment"
                            className={`text-xl flex gap-2 justify-center items-center p-3 hover:scale-110 transition duration-150 ${
                              triggerShowFiles
                                ? '  text-green-200 bg-green-600'
                                : 'text-green-700 bg-green-200'
                            }
                       hover:text-green-200 hover:bg-green-600 rounded-full  `}
                          >
                            <HiPaperClip />
                            {triggerShowFiles && (
                              <span className="text-xs">ไฟล์งาน</span>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setTriggerShowFiles(() => false);
                              setTriggerShowComment(() => true);
                              setTiggerShowWorksheet(() => false);
                            }}
                            aria-label="button to trigger show student's comment"
                            className={`text-xl flex gap-2 justify-center items-center p-3 hover:scale-110 transition duration-150 ${
                              triggerShowComment
                                ? '  text-green-200 bg-green-600'
                                : 'text-green-700 bg-green-200'
                            }
                       hover:text-green-200 hover:bg-green-600 rounded-full  `}
                          >
                            <AiOutlineComment />
                            {triggerShowComment && (
                              <span className="text-xs">คอมเมนต์</span>
                            )}
                          </button>
                          {currentStudentWork?.studentWork?.body && (
                            <button
                              onClick={() => {
                                setTriggerShowFiles(() => false);
                                setTriggerShowComment(() => false);
                                setTiggerShowWorksheet(() => true);
                              }}
                              aria-label="button to trigger show student's comment"
                              className={`text-xl flex gap-2 justify-center items-center p-3 hover:scale-110 transition duration-150 ${
                                triggerShowWorksheet
                                  ? '  text-green-200 bg-green-600'
                                  : 'text-green-700 bg-green-200'
                              }
                       hover:text-green-200 hover:bg-green-600 rounded-full  `}
                            >
                              <HiOutlineNewspaper />
                              {triggerShowWorksheet && (
                                <span className="text-xs">ใบงาน</span>
                              )}
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setTriggerFullScreen((prev) => {
                              if (prev === false) {
                                document.body.style.overflow = 'hidden';
                              } else {
                                document.body.style.overflow = 'auto';
                              }
                              return !prev;
                            });
                          }}
                          className=" hover:scale-110 transition duration-150
                      flex items-center gap-2"
                        >
                          {triggerFullScreen ? (
                            <MdZoomInMap />
                          ) : (
                            <MdZoomOutMap />
                          )}

                          {triggerFullScreen ? (
                            <span>
                              {user.language === 'Thai' ? 'ออก' : 'out'}
                            </span>
                          ) : (
                            <span>
                              {user.language === 'Thai'
                                ? 'ขยาย'
                                : 'full screen'}
                            </span>
                          )}
                        </button>
                      </div>
                      {triggerShowFiles && (
                        <div className=" flex flex-col w-full gap-10 ">
                          {currentStudentWork && images && images !== null ? (
                            <SlideshowLightbox
                              downloadImages={true}
                              lightboxIdentifier="lightbox1"
                              showThumbnails={true}
                              framework="next"
                              images={images}
                              theme="day"
                              className={`container grid ${
                                images.length === 1
                                  ? 'grid-cols-1'
                                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '
                              } lg:w-full md:w-full mx-auto h-full gap-2  place-items-center
                         `}
                            >
                              {images.map((image, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="lg:w-60 overflow-hidden  lg:h-60 md:w-40 md:h-40 relative bg-blue-200 "
                                  >
                                    <Image
                                      src={image.src}
                                      alt="student's work"
                                      layout="fill"
                                      className="object-cover hover:scale-125 transition duration-150"
                                      data-lightboxjs="lightbox1"
                                      quality={60}
                                      placeholder="blur"
                                      blurDataURL="/logo/TaTuga camp.png"
                                    />
                                  </div>
                                );
                              })}
                            </SlideshowLightbox>
                          ) : (
                            <div
                              className="w-full   h-80 text-center flex items-center justify-center font-Kanit
                      font-bold text-2xl "
                            >
                              {currentStudentWork?.status === 'no-work' &&
                                user.language === 'Thai' &&
                                'ผู้เรียนยังไม่ส่งงาน'}
                              {currentStudentWork?.status === 'have-work' &&
                                !currentStudentWork?.studentWork?.body &&
                                user.language === 'Thai' &&
                                'ตรวจงานโดยผู้เรียนไม่ส่งงาน'}
                              {!currentStudentWork &&
                                user.language === 'Thai' &&
                                'โปรดเลือกงาน'}
                              {currentStudentWork?.status === 'no-work' &&
                                user.language === 'English' &&
                                "NO student's work"}
                              {currentStudentWork?.status === 'have-work' &&
                                user.language === 'English' &&
                                "Finish checking without student's work"}
                              {!currentStudentWork &&
                                user.language === 'English' &&
                                'Please select some student'}
                            </div>
                          )}
                          <div className="flex flex-col gap-5 justify-start items-center">
                            {files.map((file, index) => {
                              if (file.fileType === 'pdf') {
                                return (
                                  <div
                                    key={index}
                                    className="w-full flex justify-center"
                                  >
                                    <embed
                                      src={file.url}
                                      type="application/pdf"
                                      frameBorder="0"
                                      scrolling="auto"
                                      height="500px"
                                      width="80%"
                                    ></embed>
                                  </div>
                                );
                              }
                              if (file.fileType === 'docx') {
                                return (
                                  <div
                                    key={index}
                                    className="w-full flex items-center flex-col  justify-center"
                                  >
                                    {loadingIframe && (
                                      <div className="relative w-full">
                                        <div className=" flex-col w-full gap-2 bg-slate-200 h-96 animate-pulse flex justify-center items-center"></div>
                                        <div
                                          className="absolute flex flex-col
                                         top-0 bottom-0 justify-center items-center right-0 left-0 m-auto "
                                        >
                                          <a
                                            target="_blank"
                                            href={file.url}
                                            className="w-60 cursor-pointer hover:scale-105 transition duration-100
                                             text-center h-8 no-underline font-semibold text-lg
                                         px-5 bg-blue-400 py-1 rounded-full text-white"
                                          >
                                            คลิกเพื่อดาวน์โหลด
                                          </a>
                                          กำลังแสดงไฟล์ DOC ...
                                        </div>
                                      </div>
                                    )}
                                    <iframe
                                      onLoad={handleIframeLoading}
                                      width={loadingIframe ? '0px' : '50%'}
                                      height={loadingIframe ? '0px' : '500px'}
                                      src={`https://docs.google.com/gview?url=${file.url}&embedded=true`}
                                    ></iframe>
                                  </div>
                                );
                              }
                              if (
                                file.fileType === 'mp4' ||
                                file.fileType === 'mov' ||
                                file.fileType === 'MOV'
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className="w-full flex  justify-center"
                                  >
                                    <ReactPlayer
                                      playsinline
                                      controls
                                      url={file.url}
                                    />
                                  </div>
                                );
                              }
                              if (
                                file.fileType === 'mp3' ||
                                file.fileType === 'aac'
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className="w-full flex  justify-center"
                                  >
                                    <audio
                                      src={file.url}
                                      controls={true}
                                      autoPlay={false}
                                    />
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      )}

                      {triggerShowComment &&
                        comment?.map((comment, index) => {
                          if (comment.user) {
                            return (
                              <div
                                key={index}
                                className=" w-full h-max mt-5 flex items-start justify-start relative "
                              >
                                <div className="flex gap-2 md:ml-2 lg:ml-20 w-full ">
                                  {comment.user.picture ? (
                                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                      <Image
                                        src={comment.user.picture}
                                        alt="profile"
                                        layout="fill"
                                        sizes="(max-width: 768px) 100vw"
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                                      <span className="uppercase font-sans font-black text-3xl text-white">
                                        {comment.user.firstName.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="w-max md:max-w-[15rem] lg:max-w-xl  pr-10  bg-green-100 rounded-3xl h-full relative  p-2">
                                    <div className="text-md ml-4 font-bold first-letter:uppercase">
                                      {comment.user.firstName}
                                      {comment.user?.lastName}
                                    </div>
                                    <div
                                      className="pl-4 break-words "
                                      dangerouslySetInnerHTML={{
                                        __html: comment.body,
                                      }}
                                    />
                                    <div className="w-full min-w-[8rem] mt-2 flex justify-end text-red-400">
                                      {!comment.selected && (
                                        <button
                                          onClick={() =>
                                            handleConfirmDelete(index)
                                          }
                                          className="underline"
                                        >
                                          ลบ
                                        </button>
                                      )}
                                      {comment.selected && (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() =>
                                              handleDeleteTeacherComment({
                                                teacherCommentId: comment.id,
                                                studentId:
                                                  currentStudentWork.id,
                                              })
                                            }
                                          >
                                            YES
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleUnConfirmDelete(index)
                                            }
                                          >
                                            NO
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          } else if (comment.student) {
                            return (
                              <div
                                key={index}
                                className=" w-full h-max mt-5 flex items-start justify-start relative "
                              >
                                <div className="flex gap-2 md:ml-2 lg:ml-20">
                                  {comment.student.picture ? (
                                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                      <Image
                                        src={comment.student.picture}
                                        alt="profile"
                                        layout="fill"
                                        sizes="(max-width: 768px) 100vw"
                                        className="object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex justify-center items-center">
                                      <span className="uppercase font-sans font-black text-3xl text-white">
                                        {comment.student.firstName.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="w-max max-w-[10rem] lg:max-w-xl px-5 pr-8  bg-blue-100 rounded-3xl h-full relative  p-2">
                                    <div className="text-md ml-4 font-bold first-letter:uppercase">
                                      {comment.student.firstName}
                                      {comment.student?.lastName}
                                    </div>
                                    <div
                                      className="pl-4 break-words "
                                      dangerouslySetInnerHTML={{
                                        __html: comment.body,
                                      }}
                                    />
                                    <div className="w-full min-w-[8rem] mt-2 flex justify-end text-red-400">
                                      {!comment.selected && (
                                        <button
                                          onClick={() =>
                                            handleConfirmDelete(index)
                                          }
                                          className="underline"
                                        >
                                          ลบ
                                        </button>
                                      )}
                                      {comment.selected && (
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() =>
                                              handleDeleteStudentComment({
                                                studentCommentId: comment.id,
                                                studentId:
                                                  currentStudentWork.id,
                                              })
                                            }
                                          >
                                            YES
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleUnConfirmDelete(index)
                                            }
                                          >
                                            NO
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        })}

                      {triggerShowWorksheet &&
                        currentStudentWork?.studentWork?.body && (
                          <div className="w-full  lg:w-full h-full relative">
                            <button
                              onClick={() => {
                                setTriggerEditBody((prev) => !prev);
                              }}
                              className="flex absolute top-2 right-6 hover:scale-110 transition duration-100
                          hover:ring-2 active:bg-blue-700
                          m-auto z-20  w-10 h-10 items-center justify-center text-xl  rounded-full bg-blue-600 text-blue-100"
                            >
                              {triggerEditBody ? (
                                <MdOutlineEditOff />
                              ) : (
                                <MdOutlineModeEditOutline />
                              )}
                            </button>
                            <Editor
                              disabled={!triggerEditBody}
                              apiKey={
                                process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY
                              }
                              textareaName="body"
                              init={{
                                selector: 'textarea',
                                link_context_toolbar: true,
                                height: '100%',
                                width: '100%',
                                menubar: true,
                                paste_data_images: false,
                                plugins: [
                                  'advlist',
                                  'autolink',
                                  'lists',
                                  'link',
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
                                toolbar:
                                  'undo redo | formatselect | blocks | ' +
                                  'bold italic backcolor | alignleft aligncenter ' +
                                  'alignright alignjustify | bullist numlist outdent indent | ' +
                                  'removeformat | help | link ',
                                content_style:
                                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                              }}
                              value={currentStudentWork.studentWork.body}
                              onEditorChange={handleChangeCurrentStudentWork}
                            />
                          </div>
                        )}
                    </div>
                    {triggerShowWorksheet && triggerEditBody && (
                      <div className="w-full flex items-center justify-center mt-2">
                        {loadingReviewStudentWorksheet ? (
                          <Loading />
                        ) : (
                          <button
                            onClick={handleReviewStudentWorksheet}
                            className="w-max h-max hover:scale-105 transition duration-150 active:ring-2 ring-black
                     p-2 bg-blue-500 text-white rounded-md drop-shadow-md"
                          >
                            UPDATE
                          </button>
                        )}
                      </div>
                    )}
                    {triggerShowComment && (
                      <form
                        onSubmit={handlePostComment}
                        className="w-full flex items-center justify-center mt-2 gap-5 "
                      >
                        <Box width="50%">
                          <TextField
                            name="comment"
                            variant="filled"
                            color="success"
                            onChange={handleOnChangeReviewWork}
                            fullWidth
                            value={teacherReview.comment}
                            label="comment"
                          />
                        </Box>
                        <button
                          className="w-max px-5 py-2 h-max  rounded-full bg-[#2C7CD1] hover:bg-red-500 tranti duration-150
                       text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid flex items-center justify-center  focus:border-2 
              focus:border-solid"
                        >
                          <SendIcon />
                        </button>
                      </form>
                    )}
                    {triggerFullScreen && (
                      <div
                        onClick={() => {
                          document.body.style.overflow = 'auto';
                          setTriggerFullScreen(() => false);
                        }}
                        className="w-screen h-screen fixed right-0 backdrop-blur-sm  left-0 top-0 bottom-0 m-auto -z-10 bg-white/50 "
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const cookies = parseCookies(context);
  const accessToken = cookies.access_token;

  if (!accessToken && !query.access_token) {
    return {
      props: {
        error: {
          statusCode: 401,
          message: 'unauthorized',
        },
      },
    };
  } else if (query.access_token) {
    try {
      const userData = await GetUserCookie({
        access_token: query.access_token,
      });
      const user = userData.data;

      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: 'unauthorized',
          },
        },
      };
    }
  } else if (accessToken) {
    try {
      const userData = await GetUserCookie({
        access_token: accessToken,
      });
      const user = userData.data;
      return {
        props: {
          user,
        },
      };
    } catch (err) {
      return {
        props: {
          error: {
            statusCode: 401,
            message: 'unauthorized',
          },
        },
      };
    }
  }
}
