import Lottie from 'lottie-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FiPlus, FiPlusSquare, FiSave, FiSettings } from 'react-icons/fi';
import {
  HideScore,
  UpdateScoreOnStudent,
  UpdateScoreOnWholeClass,
  UpdateScoreOnWholeGroup,
} from '../../service/scores';
import * as animationData from '../../public/json/well-done-output.json';
import fileSoundPositive from '../../public/sound/ging.mp3';
import fileSoundNagative from '../../public/sound/wrong.mp3';
import {
  FcBusinessContact,
  FcCancel,
  FcCheckmark,
  FcLineChart,
  FcViewDetails,
} from 'react-icons/fc';
import { DelteStudent, UpdateStudent } from '../../service/students';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import CreateScore from './createScore';
import { avartars } from '../../data/students';
import { useRouter } from 'next/router';
import Loading from '../loading/loading';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { nationalities } from '../../data/student/nationality';
import { UpdateScoreOnWholeClassForTeacherService } from '../../service/teacher/score';
import AdBannerFixed from '../ads/adBannerFixed';
import { blurDataURL } from '../../data/student/blurDataURL';
function UpdateScore({
  setTriggerUpdateStudent,
  close,
  student,
  scores,
  students,
  refetchScores,
  classroomScore,
  language,
  groupScore,
  groupId,
  group,
  user,
  miniGroupId,
}) {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState();
  const [soundPositive, setSoundPositive] = useState(null);
  const [soundNagative, setSoundNagative] = useState(null);
  const [clickScoreTitle, setClickScoreTitle] = useState();
  const [runScoreTitle, setRunScoreTitle] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [pointsValue, setpointsValue] = useState(0);
  const [data, setData] = useState(animationData);
  const [error, setError] = useState();
  const [loadingDeleteStudent, setLoadingDeleteStudent] = useState(false);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [isDeleteStudent, setIsDeleteStudent] = useState(false);
  const [triggerSetting, setTriggerSetting] = useState(false);
  const [triggerCreateNewScore, setTriggerCreateNewScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [studentData, setStdentData] = useState({
    firstName: '',
    lastName: '',
    number: '',
    nationality: '',
  });
  //prepare sound
  useEffect(() => {
    setStdentData((prev) => ({
      ...prev,
      firstName: student?.firstName,
      lastName: student?.lastName,
      number: student?.number,
      picture: student?.picture,
      nationality: student?.nationality,
    }));
    setClassroomId(() => router.query.classroomId);
    setSoundNagative(new Audio(fileSoundNagative));
    setSoundPositive(new Audio(fileSoundPositive));
  }, []);
  //handle chnage on input score
  const handleChangeScore = (e) => {
    const { id, value } = e.target;
    if (value > 100) {
      setpointsValue(() => 100);
    } else if (value < -100) {
      setpointsValue(() => -100);
    } else {
      setpointsValue(() => value);
    }

    // set point value as diffrent value as differnt id
    // setpointsValue((prev) => ({ ...prev, [id]: value }));
  };

  const handleChooseAvatar = ({ avartar, index }) => {
    setStdentData((prev) => {
      return {
        ...prev,
        picture: avartar,
        index: index,
      };
    });
  };

  //handle hiden score
  const onClickToHide = async ({ scoreId }) => {
    try {
      await HideScore({ scoreId });
      await refetchScores();
    } catch (err) {
      console.error(err);
      Swal.fire('error', err?.response?.data?.message.toString(), 'error');
    }
  };

  //handleonChange when update students data
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setStdentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handle delete student
  const handleDelteStudent = async (data) => {
    try {
      setLoadingDeleteStudent(() => true);
      const deletedStudent = await DelteStudent({ studentId: data.studentId });
      students.refetch();
      Swal.fire('success', deletedStudent.data.message, 'success');
      setLoadingDeleteStudent(() => false);
      document.body.style.overflow = 'auto';
      if (classroomScore === true) {
        close();
      } else {
        setTriggerUpdateStudent(() => false);
      }
    } catch (err) {
      setLoadingDeleteStudent(() => false);
      Swal.fire(
        'error',
        err?.props?.response?.data?.message.toString(),
        'error',
      );
      document.body.style.overflow = 'auto';
      students.refetch();
    }
  };
  //handle sumit to update student data
  const handleSummitEditStudentData = async (e) => {
    try {
      e.preventDefault();
      setLoading(() => true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('firstName', studentData.firstName);
      if (studentData.lastName) {
        formData.append('lastName', studentData.lastName);
      }
      formData.append('number', studentData.number);
      if (studentData.nationality) {
        formData.append('nationality', studentData.nationality);
      }
      formData.append('picture', studentData.picture);
      await UpdateStudent({
        formData,
        studentId: student.id,
      });
      students.refetch();
      setLoading(() => false);
      setTriggerSetting((prev) => (prev = false));
    } catch (err) {
      setLoading(() => false);
      setError((prev) => (prev = err?.props?.response?.data?.message));
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // update student points
  const handleUpdateScore = async (data) => {
    try {
      setLoadingPoint(true);
      let checkNagativePoint = false;
      setClickScoreTitle(() => {
        let points = 1;

        if (pointsValue === 0) {
          if (!data.score) {
            points = 1;
          } else {
            if (data.score < 0) {
              checkNagativePoint = true;
            }
            points = data.score;
          }
        } else if (pointsValue) {
          if (pointsValue < 0) {
            checkNagativePoint = true;
          }
          points = pointsValue;
        }

        return (
          <div className="flex items-center justify-center flex-col drop-shadow-2xl">
            <span>{data.scoreTitle}</span>
            <div
              className={`font-bold ${
                checkNagativePoint ? 'text-red-500' : 'text-yellow-500'
              }  `}
            >
              {checkNagativePoint ? '' : '+'}
              {points}
            </div>
          </div>
        );
      });
      if (
        classroomScore === true &&
        !groupScore &&
        user?.schoolUser?.organization === 'school'
      ) {
        await UpdateScoreOnWholeClassForTeacherService({
          score: data.score,
          scoreId: data.scoreId,
          pointsValue,
          classroomId,
        });
      } else if (
        classroomScore === true &&
        !groupScore &&
        user?.schoolUser?.organization !== 'school'
      ) {
        await UpdateScoreOnWholeClass(data, pointsValue, classroomId);
      }

      if (classroomScore === true && groupScore) {
        await UpdateScoreOnWholeGroup({
          pointsValue,
          scoreId: data.scoreId,
          miniGroupId,
          groupId,
          score: data.score,
        });
        await group.refetch();
        async function waitForFalse() {
          while (group.isFetching) {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 1 second
          }

          // Code here will execute once group.isFetching is false
        }

        waitForFalse();
      } else if (classroomScore !== true) {
        await UpdateScoreOnStudent({
          scoreId: data.scoreId,
          studentId: data.studentId,
          score: data.score,
          inputValues: pointsValue,
        });
      }

      setData((prev) => {
        return {
          ...prev,
          layers: [
            ...prev.layers.slice(0, 8),
            {
              ...prev.layers[8],
              t: {
                ...prev.layers[8].t,
                d: {
                  ...prev.layers[8].t.d,
                  k: [
                    {
                      ...prev.layers[8].t.d.k[0],
                      s: {
                        ...prev.layers[8].t.d.k[0].s,
                        t: '',
                      },
                    },
                    ...prev.layers[8].t.d.k.slice(1),
                  ],
                },
              },
            },
            ...prev.layers.slice(9),
          ],
        };
      });

      setRunAnimation(true);
      setTimeout(() => {
        setRunScoreTitle(true);
      }, 700);
      setTimeout(() => {
        if (checkNagativePoint === true) {
          soundNagative.play();
        } else if (checkNagativePoint === false) {
          soundPositive.play();
        }
      }, 1000);

      setTimeout(() => {
        setRunAnimation(false);
        setRunScoreTitle(false);
        setLoadingPoint(false);
        if (classroomScore === true) {
          close();
        } else {
          setTriggerUpdateStudent(() => false);
        }
      }, 1500);
      document.body.style.overflow = 'auto';
      students?.refetch();
    } catch (err) {
      console.error(err);
    }
  };
  const style = {
    height: 300,
  };

  //handle profile update
  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };
  return (
    <div
      className="w-screen h-screen font-Kanit  z-40 
top-0 right-0 left-0 bottom-0 m-auto fixed flex items-center justify-center flex-col"
      key={student?.id}
    >
      <div
        className="flex md:flex-row flex-col w-full h-full md:h-max rounded-none md:w-[42rem] lg:w-[45rem]  
        font-Kanit bg-white border-2 border-solid
    md:rounded-lg drop-shadow-xl md:p-5 md:px-0 relative items-center justify-center"
      >
        <div className=" md:hidden absolute top-5 left-5">
          <button
            onClick={() => {
              if (classroomScore === true) {
                close();
              } else {
                setTriggerUpdateStudent(() => false);
              }
              document.body.style.overflow = 'auto';
            }}
            className="ml-3 text-2xl gap-2  flex justify-center items-center"
          >
            <AiOutlineCloseCircle />
            <span className="text-sm">
              {language === 'Thai' && 'ออก'}
              {language === 'English' && 'exit'}
            </span>
          </button>
        </div>
        {classroomScore !== true && (
          <div
            className="absolute z-20 right-5 top-5 gap-1 flex items-center 
        justify-center text-red-500 hover:text-red-800 transition duration-150 cursor-pointer "
          >
            {isDeleteStudent === false && (
              <div
                className="flex items-center justify-center"
                onClick={() => setIsDeleteStudent(true)}
              >
                <MdDelete size={25} />
                <span className="text-sm">
                  {language === 'Thai' && 'ลบนักเรียน'}
                  {language === 'English' && 'delete'}
                </span>
              </div>
            )}

            {isDeleteStudent === true &&
              (loadingDeleteStudent === true ? (
                <Loading />
              ) : (
                <div className="flex gap-x-4">
                  <div
                    onClick={() =>
                      handleDelteStudent({ studentId: student.id })
                    }
                    role="button"
                    className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                  >
                    <FcCheckmark size={25} />
                  </div>
                  <div
                    role="button"
                    onClick={() => setIsDeleteStudent(false)}
                    className="hover:scale-110  transition duration-150 ease-in-out cursor-pointer "
                  >
                    <FcCancel size={25} />
                  </div>
                </div>
              ))}
          </div>
        )}
        {runAnimation && (
          <div className="absolute z-40  top-10 right-0 left-0 bottom-0 m-auto flex items-center justify-center flex-col">
            <Lottie animationData={data} style={style} />
            {runScoreTitle && (
              <div className="text-black absolute flex items-center justify-center font-bold font-Kanit text-5xl popup">
                {clickScoreTitle}
              </div>
            )}
          </div>
        )}

        {/* avatar here  */}
        {classroomScore !== true && (
          <div className=" md:w-[40rem] w-full flex flex-col justify-center items-center  ">
            <div className="w-full h-max flex items-center justify-center   ">
              {triggerSetting === false ? (
                <div className="w-full  h-full  flex items-center justify-center px-5 flex-col relative">
                  <div className="relative">
                    <div className="relative w-40 h-40 bg-transparent rounded-full ">
                      <Image
                        src={student?.picture}
                        alt="students avatar"
                        className="object-cover "
                        placeholder="blur"
                        blurDataURL={blurDataURL}
                        fill
                        sizes="(max-width: 768px) 100vw, 700px"
                      />
                    </div>
                    <div
                      className={`absolute w-14 h-14  rounded-full ${
                        student?.score?.totalPoints < 0
                          ? 'bg-red-600'
                          : 'bg-[#EDBA02] '
                      } ring-2 ring-white
                    flex justify-center items-center font-sans font-bold text-3xl z-10 text-white -left-5 top-2 md:-top-5`}
                    >
                      {student?.score?.totalPoints}
                    </div>
                  </div>

                  <div className="mt-2 text-lg w-max">
                    <span className="mr-2">{student?.firstName}</span>
                    <span>{student?.lastName}</span>
                  </div>
                  <div className="font-light">
                    {language === 'Thai' && 'เลขที่'}
                    {language === 'English' && 'number'} {student?.number}
                  </div>
                  <div
                    role="button"
                    onClick={() => setTriggerSetting((prev) => (prev = true))}
                    aria-label="button for setting student's data"
                    className="w-max h-max  bg-slate-500 mt-2  text-lg cursor-pointer hover:text-red-500 hover:bg-white
                  text-white p-1 rounded-md flex gap-2  px-6 transition duration-150 ease-in-out z-20 group hover:ring-2  bottom-0 ring-black"
                  >
                    <span>
                      {language === 'Thai' && 'ตั้งค่า'}
                      {language === 'English' && 'setting'}
                    </span>
                    <div className="text-white group-hover:text-red-500 flex items-center justify-center ">
                      <FiSettings />
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  className="md:w-full w-full  h-full gap-10  flex items-center mt-10 md:mt-0
                 md:items-start flex-col md:flex-row justify-start md:justify-between px-5  relative"
                >
                  <div className="flex items-center justify-center flex-col">
                    <div className="flex flex-col relative">
                      <label className="font-sans font-normal">
                        {language === 'Thai' && 'แก้ไขชื่อจริง'}
                        {language === 'English' && 'first name'}
                      </label>
                      <input
                        onChange={handleOnChange}
                        className="w-40 h-7 rounded-md ring-2 ring-black  pl-10 
                placeholder:italic placeholder:font-light"
                        type="text"
                        name="firstName"
                        placeholder="แก้ไขชื่อจริง"
                        maxLength="30"
                        value={studentData.firstName}
                      />
                      <div
                        className="absolute bottom-1 left-2 bg-white text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                      >
                        <FcBusinessContact />
                      </div>
                    </div>

                    <div className="flex flex-col relative mt-2">
                      <label className="font-sans font-normal">
                        {language === 'Thai' && 'แก้ไขนาสกุล'}
                        {language === 'English' && 'last name'}
                      </label>
                      <input
                        onChange={handleOnChange}
                        className="w-40 h-7 rounded-md  ring-2 appearance-none ring-black pl-10 
                placeholder:italic placeholder:font-light"
                        type="text"
                        name="lastName"
                        placeholder="แก้ไขนาสกุล"
                        maxLength="30"
                        value={studentData?.lastName}
                      />
                      <div
                        className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                      >
                        <FcLineChart />
                      </div>
                    </div>
                    <div className="flex flex-col relative mt-2 mb-2">
                      <label className="font-sans font-normal">
                        {language === 'Thai' && 'แก้ไขเลขที่'}
                        {language === 'English' && 'number'}
                      </label>
                      <input
                        onChange={handleOnChange}
                        className="w-40 h-7 rounded-md ring-2 appearance-none ring-black   pl-10 
                placeholder:italic placeholder:font-light"
                        type="text"
                        name="number"
                        placeholder="แก้ไขเลขที่"
                        min="1"
                        value={studentData.number}
                      />
                      <div
                        className="absolute bottom-1 left-2  text-[#2C7CD1] w-5 h-5 text-xl 
               rounded-full flex items-center justify-center "
                      >
                        <FcViewDetails />
                      </div>
                    </div>
                    {user?.schoolUser?.organization === 'immigration' && (
                      <div className="flex flex-col  relative mt-2 mb-2">
                        <Box sx={{ minWidth: 120 }}>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              {language === 'Thai' && 'สัญชาติ'}
                              {language === 'English' && 'nationality'}
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              name="nationality"
                              value={studentData.nationality}
                              label="nationality"
                              onChange={handleOnChange}
                            >
                              {nationalities.map((nationality, index) => {
                                return (
                                  <MenuItem key={index} value={nationality}>
                                    {nationality}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                    )}
                    {error && (
                      <div className=" bottom-12 w-max text-red-600">
                        {error}
                      </div>
                    )}
                    <button
                      onClick={handleSummitEditStudentData}
                      aria-label="button for setting student's data"
                      className="w-max h-max bg-red-500 md:mt-10  mt-2 text-lg cursor-pointer hover:scale-110 right-2 ring-black border-0 border-none
              text-white p-1 rounded-md flex items-center justify-center gap-2 px-6 
              transition duration-150 ease-in-out"
                    >
                      <span>
                        {language === 'Thai' && 'บันทึก'}
                        {language === 'English' && 'save'}
                      </span>
                      <div className="text-white flex items-center justify-center ">
                        {loading ? <Loading /> : <FiSave />}
                      </div>
                    </button>
                  </div>
                  <div className="flex flex-col items-center justify-center ">
                    <div className="mb-10 text-xl">
                      {language === 'Thai' && 'เลือก Avatar ผู้เรียน'}
                      {language === 'English' && 'choose student an avatar'}
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {avartars.map((avartar, index) => {
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() =>
                              handleChooseAvatar({ avartar, index })
                            }
                            className={`bg-white drop-shadow-md  hover:scale-110 ${
                              studentData?.index === index
                                ? 'border-black border-2'
                                : 'border-black border-none'
                            }
                         border-solid rounded-lg relative w-16 h-16 transition duration-150`}
                          >
                            <Image
                              src={avartar}
                              className="object-contain"
                              fill
                              sizes="(max-width: 768px) 100vw"
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className=" flex flex-col gap-1 mt-5 w-full justify-center ">
                      <span>อัพโหลดรูปภาพ</span>
                      <input
                        aria-label="upload profile picture"
                        onChange={handleFileInputChange}
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        className="text-sm text-grey-500
            file:mr-5 md:file:w-40 file:w-40 w-full file:py-2
            file:rounded-full file:border-0 file:h-full 
            file:text-sm file:font-medium 
            file:bg-blue-50 file:text-blue-700
            hover:file:cursor-pointer hover:file:bg-amber-50
            hover:file:text-amber-700
          "
                      />
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {triggerSetting === false && (
          <div className=" flex-col  w-full md:w-max px-5   ">
            <div className="flex items-center justify-center h-5 mt-2 text-lg w-full mb-2 ">
              {classroomScore === true && language === 'Thai' && groupScore && (
                <p>ให้คะแนนกลุ่ม</p>
              )}
              {classroomScore === true &&
                language === 'English' &&
                groupScore && <p>give a group score</p>}
              {classroomScore === true &&
                language === 'Thai' &&
                !groupScore && <p>ให้คะแนนทั้งห้องเรียน</p>}
              {classroomScore === true &&
                language === 'English' &&
                !groupScore && <p>give a class score</p>}
              {language === 'Thai' && !classroomScore && <p>คะแนนพิเศษ</p>}
              {language === 'English' && !classroomScore && (
                <p>give student a motivative score</p>
              )}
            </div>

            <div className="">
              <div
                className={`md:w-96  w-full  h-full grid ${
                  triggerCreateNewScore
                    ? ' grid-cols-1'
                    : 'grid-cols-2 md:grid-cols-3'
                } gap-5 place-items-center  items-center justify-center`}
              >
                {triggerCreateNewScore === false ? (
                  scores?.data.map((score) => {
                    if (score.display === false) return null;
                    return (
                      <div
                        key={score.id}
                        className="md:w-full w-10/12 h-full flex items-center relative justify-center flex-col gap-2"
                      >
                        {score.score > 0 && (
                          <div
                            className="w-max h-max px-2 bg-blue-500 rounded-full absolute
                          z-40 ring-2 ring-black text-xs font-medium left-2  top-2 "
                          >
                            {score.score}
                          </div>
                        )}
                        {score.score <= 0 && score.score !== null && (
                          <div
                            className="w-max h-max px-2 bg-red-500 rounded-full absolute
                          z-40 ring-2 text-xs font-medium left-2  top-2 ring-red-200"
                          >
                            {score.score}
                          </div>
                        )}
                        {loadingPoint ? (
                          <div
                            className="w-full h-full px-0  md:px-2 bg-gray-300 flex flex-col font-Kanit
                             text-lg items-center justify-center rounded-lg cursor-pointer
               border-2 border-solid hover:scale-110 border-black
             hover:bg-yellow-200 transition duration-150 ease-in-out"
                          >
                            <div className="mt-2">{score.picture}</div>
                            <div>{score.title}</div>
                          </div>
                        ) : (
                          <div
                            key={score.id}
                            className="group relative w-full h-full"
                          >
                            <button
                              onClick={() =>
                                handleUpdateScore({
                                  scoreId: score?.id,
                                  studentId: student?.id,
                                  scoreTitle: score?.title,
                                  scoreEmoji: score?.picture,
                                  score: score.score,
                                  pointsValue,
                                })
                              }
                              aria-label={`buuton ${score.title} `}
                              role="button"
                              className="w-full h-full px-2 bg-white flex flex-col font-Kanit text-lg items-center justify-center rounded-lg cursor-pointer
           border-2 border-solid hover:scale-110  group
         hover:bg-yellow-200 transition duration-150 ease-in-out"
                            >
                              <div className="mt-2">{score.picture}</div>
                              <div>{score.title}</div>
                            </button>
                            {!groupScore && (
                              <div
                                onClick={() =>
                                  onClickToHide({ scoreId: score.id })
                                }
                                className="absolute  top-1 right-1 hidden group-hover:block  hover:text-red-600"
                              >
                                <MdDelete />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full  flex items-center justify-center">
                    <CreateScore
                      refetchScores={refetchScores}
                      setTriggerCreateNewScore={setTriggerCreateNewScore}
                      classroomId={classroomId}
                      language={language}
                      score={pointsValue}
                    />
                  </div>
                )}
                {!triggerCreateNewScore && !groupId && (
                  <div
                    onClick={() => setTriggerCreateNewScore(true)}
                    className="flex items-center justify-center "
                  >
                    <div
                      className="w-max h-full px-2 bg-white py-1 flex flex-col font-Kanit text-lg
                         items-center justify-center rounded-lg cursor-pointer
             border-2 border-solid hover:scale-110
           hover:bg-yellow-200 transition duration-150 ease-in-out"
                    >
                      <FiPlus />
                      <span className="text-sm">
                        {language === 'Thai' && 'สร้างคะแนน'}
                        {language === 'English' && 'Create score'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full flex items-center justify-center flex-col mt-5 ">
                <input
                  placeholder=""
                  onChange={handleChangeScore}
                  className="w-20 text-lg  font-sans font-semibold rounded-md  ring-blue-500 ring-4 text-center placeholder:text-black"
                  value={pointsValue}
                  min="-100"
                  max="100"
                  type="number"
                  name="points"
                />
                <div className="w-full md:w-max flex  text-center justify-center h-max text-sm mt-2 text-red-600 text">
                  <div className="w-80 md:w-full">
                    <span>
                      {language === 'Thai' &&
                        '**หมายเหตุ สามารถลบคะแนนผู้เรียนได้โดยใส่เครื่องหมาย - เช่น -5'}
                      {language === 'English' &&
                        "Note: you can minus student's score by putting a minus symbol like -5 "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {user.plan === 'FREE' && (
        <div className="hidden md:block">
          <AdBannerFixed data-ad-slot="1164204596" />
        </div>
      )}

      <div
        onClick={() => {
          document.body.style.overflow = 'auto';
          if (classroomScore === true) {
            close();
          } else {
            setTriggerUpdateStudent(() => false);
          }
        }}
        className="w-full h-full fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/20 "
      ></div>
    </div>
  );
}

export default UpdateScore;
