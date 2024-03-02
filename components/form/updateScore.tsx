import Lottie from "lottie-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiPlus, FiPlusSquare, FiSave, FiSettings } from "react-icons/fi";
import * as animationData from "../../public/jsons/well-done-output.json";
import {
  FcBusinessContact,
  FcCancel,
  FcCheckmark,
  FcLineChart,
  FcViewDetails,
} from "react-icons/fc";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import CreateScore from "./createScore";
import { avartars } from "../../data/students";
import { useRouter } from "next/router";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { nationalities } from "../../data/student/nationality";
import AdBannerFixed from "../ads/adBannerFixed";
import { blurDataURL } from "../../data/student/blurDataURL";
import { UseQueryResult } from "@tanstack/react-query";
import {
  HideScoreService,
  ResponseGetAllScoresClassroomService,
  UpdateScoreOnStudentService,
  UpdateScoreOnWholeGroupService,
} from "../../services/scores";
import { Score, Student, StudentWithScore, User } from "../../models";
import {
  DelteStudentService,
  ResponseGetAllStudentsService,
  UpdateStudentService,
} from "../../services/students";
import {
  ResponseGetAllGroupService,
  ResponseGetGroupService,
} from "../../services/group";
import Loading from "../loadings/loading";

type UpdateScoreProps = {
  user: User;
  student: StudentWithScore;
  scores: UseQueryResult<ResponseGetAllScoresClassroomService, Error>;
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
  setTriggerUpdateStudent: React.Dispatch<React.SetStateAction<boolean>>;
  groupScore?: boolean;
  miniGroupId?: string;
  groupId?: string;
  group?: UseQueryResult<ResponseGetGroupService, Error>;
  close?: (
    focusableElement?:
      | HTMLElement
      | React.MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
};

function UpdateScore({
  setTriggerUpdateStudent,
  student,
  scores,
  students,
  user,
  groupScore,
  miniGroupId,
  groupId,
  group,
  close,
}: UpdateScoreProps) {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<string>();
  const [soundPositive, setSoundPositive] = useState<HTMLAudioElement>();
  const [soundNagative, setSoundNagative] = useState<HTMLAudioElement>();
  const [clickScoreTitle, setClickScoreTitle] = useState<React.ReactNode>();
  const [runScoreTitle, setRunScoreTitle] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [pointsValue, setpointsValue] = useState<number | null>(0);
  const [data, setData] = useState<any>(animationData);
  const [error, setError] = useState<string | null>();
  const [loadingDeleteStudent, setLoadingDeleteStudent] = useState(false);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [isDeleteStudent, setIsDeleteStudent] = useState(false);
  const [triggerSetting, setTriggerSetting] = useState(false);
  const [triggerCreateNewScore, setTriggerCreateNewScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [studentData, setStdentData] = useState<
    Student & {
      checkbox?: boolean;
      index?: number;
    }
  >(student);

  //prepare sound
  useEffect(() => {
    if (router.isReady) {
      setClassroomId(() => router.query.classroomId as string);
      const fileSoundPositive = require("../../public/sounds/ging.mp3");
      const fileSoundNagative = require("../../public/sounds/wrong.mp3");
      setSoundNagative(new Audio(fileSoundNagative));
      setSoundPositive(new Audio(fileSoundPositive));
    }
  }, [router.isReady]);

  //handle chnage on input score
  const handleChangeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value > 100) {
      setpointsValue(() => 100);
    } else if (value < -100) {
      setpointsValue(() => -100);
    } else if (value === 0) {
      setpointsValue(() => null);
    } else {
      setpointsValue(() => value);
    }

    // set point value as diffrent value as differnt id
    // setpointsValue((prev) => ({ ...prev, [id]: value }));
  };

  const handleChooseAvatar = ({
    avartar,
    index,
  }: {
    avartar: string;
    index: number;
  }) => {
    setStdentData((prev) => {
      return {
        ...prev,
        picture: avartar as string,
        index: index as number,
      };
    });
  };

  //handle hiden score
  const onClickToHide = async ({ scoreId }: { scoreId: string }) => {
    try {
      await HideScoreService({ scoreId });
      await scores.refetch();
    } catch (err: any) {
      console.error(err);
      Swal.fire("error", err?.response?.data?.message.toString(), "error");
    }
  };

  //handleonChange when update students data
  const handleOnChange = (e: SelectChangeEvent<string | null>) => {
    const { name, value } = e.target;
    setStdentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handle delete student
  const handleDelteStudent = async ({ studentId }: { studentId: string }) => {
    try {
      setLoadingDeleteStudent(() => true);
      const deletedStudent = await DelteStudentService({
        studentId: studentId,
      });
      await students.refetch();
      Swal.fire("success", deletedStudent.message, "success");
      setLoadingDeleteStudent(() => false);
      document.body.style.overflow = "auto";
      setTriggerUpdateStudent(() => false);
    } catch (err: any) {
      setLoadingDeleteStudent(() => false);
      Swal.fire(
        "error",
        err?.props?.response?.data?.message.toString(),
        "error"
      );
      document.body.style.overflow = "auto";
      students.refetch();
    }
  };
  //handle sumit to update student data
  const handleSummitEditStudentData = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(() => true);
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      formData.append("firstName", studentData.firstName);
      if (studentData.lastName) {
        formData.append("lastName", studentData.lastName);
      }
      formData.append("number", studentData.number);
      if (studentData.nationality) {
        formData.append("nationality", studentData.nationality);
      }
      formData.append("picture", studentData.picture);
      await UpdateStudentService({
        formData,
        studentId: student.id,
      });
      await students.refetch();
      setLoading(() => false);
      setTriggerSetting((prev) => (prev = false));
    } catch (err: any) {
      setLoading(() => false);
      setError((prev) => (prev = err?.props?.response?.data?.message));
      setTimeout(() => {
        setError(() => null);
      }, 3000);
    }
  };

  // update student points
  const handleUpdateScore = async ({
    scoreId,
    studentId,
    scoreTitle,
    score,
    pointsValue,
  }: {
    scoreId: string;
    studentId: string;
    scoreTitle: string;
    score: number;
    pointsValue: number | null;
  }) => {
    try {
      setLoadingPoint(true);
      let checkNagativePoint = false;
      setClickScoreTitle(() => {
        let points = 1;

        if (pointsValue === 0) {
          if (!score) {
            points = 1;
          } else {
            if (score < 0) {
              checkNagativePoint = true;
            }
            points = score;
          }
        } else if (pointsValue) {
          if (pointsValue < 0) {
            checkNagativePoint = true;
          }
          points = pointsValue;
        }

        return (
          <div className="flex items-center justify-center flex-col drop-shadow-2xl">
            <span>{scoreTitle}</span>
            <div
              className={`font-bold ${
                checkNagativePoint ? "text-red-500" : "text-yellow-500"
              }  `}
            >
              {checkNagativePoint ? "" : "+"}
              {points}
            </div>
          </div>
        );
      });

      if (groupScore && miniGroupId && groupId) {
        await UpdateScoreOnWholeGroupService({
          pointsValue,
          scoreId: scoreId,
          miniGroupId,
          groupId,
          score: score,
        });
        await group?.refetch();
        async function waitForFalse() {
          while (group?.isFetching) {
            await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 1 second
          }

          // Code here will execute once group.isFetching is false
        }

        waitForFalse();
      } else {
        await UpdateScoreOnStudentService({
          scoreId: scoreId,
          studentId: studentId,
          score: score,
          inputValues: pointsValue as number,
        });
      }

      setData((prev: any) => {
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
                        t: "",
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
          soundNagative?.play();
        } else if (checkNagativePoint === false) {
          soundPositive?.play();
        }
      }, 1000);

      setTimeout(() => {
        setRunAnimation(false);
        setRunScoreTitle(false);
        setLoadingPoint(false);
        setTriggerUpdateStudent(() => false);
        close?.();
      }, 1500);
      document.body.style.overflow = "auto";
      students?.refetch();
    } catch (err) {
      console.error(err);
    }
  };
  const style = {
    height: 300,
  };

  //handle profile update
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]); // Set the first file
    } else {
      setFile(undefined);
    }
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
              setTriggerUpdateStudent(() => false);
              close?.();
              document.body.style.overflow = "auto";
            }}
            className="ml-3 text-2xl gap-2  flex justify-center items-center"
          >
            <AiOutlineCloseCircle />
            <span className="text-sm">
              {user.language === "Thai" && "ออก"}
              {user.language === "English" && "exit"}
            </span>
          </button>
        </div>

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
                {user.language === "Thai" && "ลบนักเรียน"}
                {user.language === "English" && "delete"}
              </span>
            </div>
          )}

          {isDeleteStudent === true &&
            (loadingDeleteStudent === true ? (
              <Loading />
            ) : (
              <div className="flex gap-x-4">
                <div
                  onClick={() => handleDelteStudent({ studentId: student.id })}
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
                        ? "bg-red-600"
                        : "bg-[#EDBA02] "
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
                  {user.language === "Thai" && "เลขที่"}
                  {user.language === "English" && "number"} {student?.number}
                </div>
                <div
                  role="button"
                  onClick={() => setTriggerSetting((prev) => (prev = true))}
                  aria-label="button for setting student's data"
                  className="w-max h-max  bg-slate-500 mt-2  text-lg cursor-pointer hover:text-red-500 hover:bg-white
                  text-white p-1 rounded-md flex gap-2  px-6 transition duration-150 ease-in-out z-20 group hover:ring-2  bottom-0 ring-black"
                >
                  <span>
                    {user.language === "Thai" && "ตั้งค่า"}
                    {user.language === "English" && "setting"}
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
                      {user.language === "Thai" && "แก้ไขชื่อจริง"}
                      {user.language === "English" && "first name"}
                    </label>
                    <input
                      onChange={handleOnChange}
                      className="w-40 h-7 rounded-md ring-2 ring-black  pl-10 
                placeholder:italic placeholder:font-light"
                      type="text"
                      name="firstName"
                      placeholder="แก้ไขชื่อจริง"
                      maxLength={30}
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
                      {user.language === "Thai" && "แก้ไขนาสกุล"}
                      {user.language === "English" && "last name"}
                    </label>
                    <input
                      onChange={handleOnChange}
                      className="w-40 h-7 rounded-md  ring-2 appearance-none ring-black pl-10 
                placeholder:italic placeholder:font-light"
                      type="text"
                      name="lastName"
                      placeholder="แก้ไขนาสกุล"
                      maxLength={30}
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
                      {user.language === "Thai" && "แก้ไขเลขที่"}
                      {user.language === "English" && "number"}
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
                  {user?.schoolUser?.organization === "immigration" && (
                    <div className="flex flex-col  relative mt-2 mb-2">
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            {user.language === "Thai" && "สัญชาติ"}
                            {user.language === "English" && "nationality"}
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
                    <div className=" bottom-12 w-max text-red-600">{error}</div>
                  )}
                  <button
                    onClick={handleSummitEditStudentData}
                    aria-label="button for setting student's data"
                    className="w-max h-max bg-red-500 md:mt-10  mt-2 text-lg cursor-pointer hover:scale-110 right-2 ring-black border-0 border-none
              text-white p-1 rounded-md flex items-center justify-center gap-2 px-6 
              transition duration-150 ease-in-out"
                  >
                    <span>
                      {user.language === "Thai" && "บันทึก"}
                      {user.language === "English" && "save"}
                    </span>
                    <div className="text-white flex items-center justify-center ">
                      {loading ? <Loading /> : <FiSave />}
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center ">
                  <div className="mb-10 text-xl">
                    {user.language === "Thai" && "เลือก Avatar ผู้เรียน"}
                    {user.language === "English" && "choose student an avatar"}
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {avartars.map((avartar, index) => {
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleChooseAvatar({ avartar, index })}
                          className={`bg-white drop-shadow-md  hover:scale-110 ${
                            studentData?.index === index
                              ? "border-black border-2"
                              : "border-black border-none"
                          }
                         border-solid rounded-lg relative w-16 h-16 transition duration-150`}
                        >
                          <Image
                            src={avartar}
                            className="object-contain"
                            fill
                            sizes="(max-width: 768px) 100vw"
                            alt="profile student"
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

        {triggerSetting === false && (
          <div className=" flex-col  w-full md:w-max px-5   ">
            <div className="flex items-center justify-center h-5 mt-2 text-lg w-full mb-2 ">
              {user.language === "Thai" && groupScore && <p>ให้คะแนนกลุ่ม</p>}
              {user.language === "English" && groupScore && (
                <p>give a group score</p>
              )}
              {user.language === "Thai" && <p>คะแนนพิเศษ</p>}
              {user.language === "English" && (
                <p>give student a motivative score</p>
              )}
            </div>

            <div className="">
              <div
                className={`md:w-96  w-full  h-full grid ${
                  triggerCreateNewScore
                    ? " grid-cols-1"
                    : "grid-cols-2 md:grid-cols-3"
                } gap-5 place-items-center  items-center justify-center`}
              >
                {triggerCreateNewScore === false ? (
                  scores?.data?.map((score) => {
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
                      scores={scores}
                      setTriggerCreateNewScore={setTriggerCreateNewScore}
                      classroomId={classroomId as string}
                      user={user}
                      pointsValue={pointsValue as number}
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
                        {user.language === "Thai" && "สร้างคะแนน"}
                        {user.language === "English" && "Create score"}
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
                  value={pointsValue as number}
                  min="-100"
                  max="100"
                  type="number"
                  name="points"
                />
                <div className="w-full md:w-max flex  text-center justify-center h-max text-sm mt-2 text-red-600 text">
                  <div className="w-80 md:w-full">
                    <span>
                      {user.language === "Thai" &&
                        "**หมายเหตุ สามารถลบคะแนนผู้เรียนได้โดยใส่เครื่องหมาย - เช่น -5"}
                      {user.language === "English" &&
                        "Note: you can minus student's score by putting a minus symbol like -5 "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {user.plan === "FREE" && (
        <div className="hidden md:block">
          <AdBannerFixed data_ad_slot="1164204596" />
        </div>
      )}

      <footer
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerUpdateStudent(() => false);
          close?.();
        }}
        className="w-full h-full fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/20 "
      ></footer>
    </div>
  );
}

export default UpdateScore;
