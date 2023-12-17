import { Box, Skeleton, TextField } from '@mui/material';
import { SlideshowLightbox } from 'lightbox.js-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { BiRefresh } from 'react-icons/bi';
import {
  MdDelete,
  MdOutlineEditOff,
  MdOutlineModeEditOutline,
  MdZoomInMap,
  MdZoomOutMap,
} from 'react-icons/md';
import Loading from '../../loading/loading';
import { HiOutlineNewspaper, HiPaperClip } from 'react-icons/hi2';
import { AiOutlineComment } from 'react-icons/ai';
import Swal from 'sweetalert2';
import SendIcon from '@mui/icons-material/Send';
import {
  DeleteStudentWork,
  ReviewStudentWork,
  ReviewStudentWorkNoWork,
  ReviewStudentWorksheetApi,
} from '../../../service/assignment';
import {
  DeleteStudentComment,
  DeleteTeachertComment,
  GetComments,
  PostComment,
} from '../../../service/comment';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import { Editor } from '@tinymce/tinymce-react';

const MAX_DECIMAL_PLACES = 2; // Maximum number of decimal places allowed

function ReviewAssignment({
  user,
  studentOnAssignments,
  triggerFullScreen,
  assignment,
  setTriggerFullScreen,
}) {
  const router = useRouter();
  const [currentStudentWork, setCurrentStudentWork] = useState();
  const [triggerShowComment, setTriggerShowComment] = useState(false);
  const [triggerShowWorksheet, setTiggerShowWorksheet] = useState(false);
  const [loadingReviewStudentWorksheet, setLoadingReviewStudentWorksheet] =
    useState(false);
  const [triggerSelectAll, setTriggerSelectAll] = useState(false);
  const [loadingIframe, setLoadingIframe] = useState(false);
  const [files, setFiles] = useState([]);
  const [triggerEditBody, setTriggerEditBody] = useState(false);
  const [triggerShowFiles, setTriggerShowFiles] = useState(true);
  const [selectStudentWorks, setSelectStudentWorks] = useState([]);
  const [studentSummitDate, setStudentSummitDate] = useState({
    summitDate: '',
    isDue: '',
    deadline: '',
  });
  const [teacherReview, setTeacherReview] = useState({
    score: '',
  });
  const [comment, setComment] = useState();
  const [images, setImages] = useState([]);

  const validateScore = (value) => {
    const regex = new RegExp(`^[0-9]+(\\.[0-9]{0,${MAX_DECIMAL_PLACES}})?$`);
    return regex.test(value);
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
      console.error(err);
    }
  };
  const handleReviewWork = async (e) => {
    try {
      e.preventDefault();
      if (currentStudentWork.status === 'have-work') {
        await ReviewStudentWork({
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
        await ReviewStudentWorkNoWork({
          studentId: currentStudentWork.id,
          assignmentId: assignment?.data?.data?.id,
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
      console.error(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  };

  const handleMultipleReviewWork = async (e) => {
    try {
      e.preventDefault();
      Swal.fire({
        title: 'กำลังตรวจงาน...',
        html: 'รอสักครู่นะครับ...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      for (const slectStudentWork of selectStudentWorks) {
        if (slectStudentWork.status === 'have-work') {
          await ReviewStudentWork({
            studentId: slectStudentWork.id,
            assignmentId: assignment?.data?.data?.id,
            score: teacherReview.score,
          });
          studentOnAssignments.refetch();
        } else if (slectStudentWork.status === 'no-work') {
          await ReviewStudentWorkNoWork({
            studentId: slectStudentWork.id,
            assignmentId: assignment?.data?.data?.id,
            score: teacherReview.score,
          });
        }
      }
      setTriggerSelectAll(() => false);
      setSelectStudentWorks(() => {
        return [];
      });
      await studentOnAssignments.refetch();
      Swal.fire('success', 'ตรวจงานเรียบร้อย', 'success');
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  }

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
      console.error(err);
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
      console.error(err);
      Swal.fire(
        'error',
        err?.props?.response?.data?.error?.message?.toString(),
        'error',
      );
    }
  };
  return (
    <div className="flex items-start md:-2  lg:gap-5 justify-center w-full h-full  mt-5  ">
      <div className="lg:w-max lg:max-w-xl md:w-2/4  top-10 sticky flex flex-col h-full items-center justify-center ">
        <div className="text-xl font-Kanit font-semibold flex justify-center items-center gap-2">
          <span>
            {user.language === 'Thai' && 'สถานะการส่งงานของผู้เรียน'}
            {user.language === 'English' && "student's status on assignment"}
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
            <tr className="flex  xl:gap-3 sticky top-0 bg-white border-b-2 border-black  lg:gap-2 md:gap-2 w-full items-center  justify-start">
              <th className="flex justify-center text-center    w-10">
                {user.language === 'Thai' && 'เลขที่'}
                {user.language === 'English' && 'number'}
              </th>
              <th className="flex items-center justify-center md:w-28 xl:w-52 lg:w-40">
                {user.language === 'Thai' && 'ชื่อ'}
                {user.language === 'English' && "student's name"}
              </th>
              <th className="flex items-center justify-center  w-10">
                {user.language === 'Thai' && 'คะแนน'}
                {user.language === 'English' && 'score'}
              </th>
              <th className="flex items-center justify-center w-28 ">
                {user.language === 'Thai' && 'สถานะ'}
                {user.language === 'English' && 'status'}
              </th>
              <td className="w-max flex flex-col items-center">
                {triggerSelectAll ? (
                  <button
                    onClick={() => {
                      setTriggerSelectAll(() => false);
                      setSelectStudentWorks(() => {
                        return [];
                      });
                    }}
                    className="text-base hover:scale-110 transition duration-100 hover:text-red-800 font-semibold"
                  >
                    ยกเลิกทั้งหมด
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setTriggerSelectAll(() => true);
                      setSelectStudentWorks(() => {
                        return studentOnAssignments?.data?.data;
                      });
                    }}
                    className="text-base hover:scale-110 transition duration-100 hover:text-blue-800 font-semibold"
                  >
                    เลือกทั้งหมด
                  </button>
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            {studentOnAssignments.isLoading ? (
              <tr className="flex flex-col  items-center justify-start mt-5 gap-5">
                <Skeleton variant="rounded" animation="wave" width="80%" />
                <Skeleton variant="rounded" animation="wave" width="80%" />
                <Skeleton variant="rounded" animation="wave" width="80%" />
                <Skeleton variant="rounded" animation="wave" width="80%" />
                <Skeleton variant="rounded" animation="wave" width="80%" />
                <Skeleton variant="rounded" animation="wave" width="80%" />
                <Skeleton variant="rounded" animation="wave" width="80%" />
              </tr>
            ) : (
              studentOnAssignments?.data?.data?.map((student, index) => {
                let IsDue = false;
                const currentTime = new Date();
                const deadlineDate = new Date(assignment?.data?.data?.deadline);
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
                    className="flex xl:gap-3 mt-4 lg:gap-2 w-full md:gap-2 mb-2 justify-start "
                  >
                    <th
                      className="flex w-10 justify-center   items-center  truncate
                      "
                    >
                      {student.number}
                    </th>
                    <td className="flex items-center justify-start gap-4 lg:w-40 md:w-28  truncate xl:w-52">
                      <span>{student.firstName}</span>
                      <span>{student?.lastName}</span>
                    </td>
                    {studentOnAssignments.isFetching ? (
                      <td className="flex items-center justify-center font-Kanit  font-bold text-gray-700 w-10">
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width="100%"
                        />
                      </td>
                    ) : student?.studentWork?.score ? (
                      <td className="flex items-center justify-center font-Kanit font-bold text-gray-700 w-10">
                        {student.studentWork.score}
                      </td>
                    ) : (
                      <td className="flex items-center justify-center  font-Kanit font-bold text-gray-700 w-10">
                        0
                      </td>
                    )}
                    {studentOnAssignments.isFetching ? (
                      <td
                        onClick={() => handleSelectWork(student)}
                        className=" py-1 px-2 rounded-lg md:w-20 md:text-sm lg:w-28 text-center"
                      >
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width="100%"
                        />
                      </td>
                    ) : (
                      <td>
                        {student.status === 'no-work' && !IsDue && (
                          <div
                            onClick={() => handleSelectWork(student)}
                            className=" bg-orange-500 py-1 px-2 rounded-lg text-white cursor-pointer 
                        hover:scale-105 transition duration-150 md:w-20 md:text-sm lg:w-28 text-center"
                          >
                            {user.language === 'Thai' && 'ไม่ส่งงาน'}
                            {user.language === 'English' && 'NO WORK'}
                          </div>
                        )}
                        {student.status === 'no-work' && IsDue && (
                          <div
                            onClick={() => handleSelectWork(student)}
                            className=" bg-red-500 py-1 px-2 rounded-lg text-white cursor-pointer 
                        hover:scale-105 transition duration-150 md:w-20 md:text-sm lg:w-28 text-center"
                          >
                            {user.language === 'Thai' && 'เลยกำหนดส่ง'}
                            {user.language === 'English' && 'PASS DUE'}
                          </div>
                        )}
                        {student.status === 'have-work' &&
                          student.studentWork.score === 0 &&
                          student.studentWork.isSummited === false && (
                            <div
                              onClick={() => handleSelectWork(student)}
                              className="md:w-20 md:text-sm lg:w-28 text-center  cursor-pointer hover:scale-105 transition duration-150
                           bg-yellow-500 py-1 px-2 rounded-lg text-white lg:text-base flex items-center justify-center"
                            >
                              {user.language === 'Thai' && 'รอการตรวจ'}
                              {user.language === 'English' && 'WAIT CHECK'}
                            </div>
                          )}
                        {student.status === 'no-assign' && (
                          <div className=" md:w-20 md:text-sm lg:w-28  bg-gray-500 py-1 px-2 rounded-lg text-white text-center">
                            {user.language === 'Thai' && 'ไม่ได้มอบหมาย'}
                            {user.language === 'English' && 'NOT ASSIGN'}
                          </div>
                        )}
                        {student.status === 'have-work' &&
                          student.studentWork.isSummited === true && (
                            <div
                              onClick={() => handleSelectWork(student)}
                              className=" md:w-20 md:text-sm lg:w-28  text-center bg-green-500 py-1 px-2 cursor-pointer hover:scale-105 transition duration-150 rounded-lg text-white"
                            >
                              {user.language === 'Thai' && 'ตรวจแล้ว'}
                              {user.language === 'English' && 'FINISH CHECK'}
                            </div>
                          )}
                      </td>
                    )}
                    <td className="w-10 flex justify-center items-center">
                      <input
                        className="w-5 h-5"
                        type="checkbox"
                        checked={
                          selectStudentWorks.find(
                            (list) => list.id === student.id,
                          )
                            ? true
                            : false
                        }
                        onClick={(e) =>
                          setSelectStudentWorks((prev) => {
                            if (e.target.checked === true) {
                              return [...prev, student];
                            } else if (e.target.checked === false) {
                              const filterOut = prev.filter(
                                (list) => list.id !== student.id,
                              );
                              return [...filterOut];
                            }
                          })
                        }
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* review student work section */}
      {selectStudentWorks.length > 0 ? (
        <div
          className="flex  flex-col lg:w-2/4 md:w-80 sticky
   top-20 items-center justify-center h-60 "
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
            onClick={handleMultipleReviewWork}
            className="w-40  h-9 mt-2 rounded-full bg-[#2C7CD1] hover:bg-red-500 tranti duration-150
         text-white font-sans font-bold
text-md cursor-pointer hover: active:border-2  active:border-gray-300
 active:border-solid  focus:border-2 
focus:border-solid"
          >
            {user.language === 'Thai' && 'ตรวจ'}
            {user.language === 'English' && 'review'}
          </button>
        </div>
      ) : (
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
                    fill
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
                    studentSummitDate.isDue ? 'bg-red-500' : 'bg-green-400'
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
          ? 'relative md:h-4/5 bg-white  lg:h-4/5  scale-100  p-0 m-2 ring-2 appearance-none ring-black  rounded-md overflow-auto md:w-9/12'
          : 'relative md:h-96 bg-white  lg:h-80 pb-5  scale-100  p-0 m-2 ring-2 ring-black appearance-none  rounded-md overflow-auto md:w-full'
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
                  {triggerFullScreen ? <MdZoomInMap /> : <MdZoomOutMap />}

                  {triggerFullScreen ? (
                    <span>{user.language === 'Thai' ? 'ออก' : 'out'}</span>
                  ) : (
                    <span>
                      {user.language === 'Thai' ? 'ขยาย' : 'full screen'}
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
                              fill
                              className="object-cover hover:scale-125 transition duration-150"
                              data-lightboxjs="lightbox1"
                              quality={60}
                              placeholder="blur"
                              blurDataURL="data:image/png;base64,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"
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
                            <ReactPlayer playsinline controls url={file.url} />
                          </div>
                        );
                      }
                      if (file.fileType === 'mp3' || file.fileType === 'aac') {
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
                                fill
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
                                  onClick={() => handleConfirmDelete(index)}
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
                                        studentId: currentStudentWork.id,
                                      })
                                    }
                                  >
                                    YES
                                  </button>
                                  <button
                                    onClick={() => handleUnConfirmDelete(index)}
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
                                fill
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
                                  onClick={() => handleConfirmDelete(index)}
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
                                        studentId: currentStudentWork.id,
                                      })
                                    }
                                  >
                                    YES
                                  </button>
                                  <button
                                    onClick={() => handleUnConfirmDelete(index)}
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
                      apiKey={process.env.NEXT_PUBLIC_TINY_TEXTEDITOR_KEY}
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
      )}
    </div>
  );
}

export default ReviewAssignment;
