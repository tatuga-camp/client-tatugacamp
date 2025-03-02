import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as animationData from "../../public/jsons/well-done-output.json";
import { useRouter } from "next/router";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Skeleton } from "@mui/material";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { StudentWithScore, User } from "../../models";
import {
  ResponseGetAllScoresClassroomService,
  UpdateScoreOnStudentService,
} from "../../services/scores";
import {
  GetOneStudentService,
  ResponseGetAllStudentsService,
} from "../../services/students";
import { StudentWheel } from "../random/wheelRandomStudent";

type UpdateScoreAfterRandomProps = {
  handleShowSweetAleart: (index: number | undefined) => void;
  user: User;
  student: StudentWheel;
  scores: UseQueryResult<ResponseGetAllScoresClassroomService, Error>;
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
  setTriggerUpdateStudent: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateScoreAfterRandom({
  handleShowSweetAleart,
  setTriggerUpdateStudent,
  student,
  scores,
  students,
  user,
}: UpdateScoreAfterRandomProps) {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<string>();
  const [soundPositive, setSoundPositive] = useState<HTMLAudioElement>(() => {
    const fileSoundPositive = require("../../public/sounds/ging.mp3");
    return new Audio(fileSoundPositive);
  });
  const [soundNagative, setSoundNagative] = useState<HTMLAudioElement>(() => {
    const fileSoundNagative = require("../../public/sounds/wrong.mp3");
    return new Audio(fileSoundNagative);
  });
  const [clickScoreTitle, setClickScoreTitle] = useState<React.ReactNode>();
  const [runScoreTitle, setRunScoreTitle] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [pointsValue, setpointsValue] = useState<number | null>(0);
  const [data, setData] = useState(animationData);
  const [error, setError] = useState();
  const [loadingDeleteStudent, setLoadingDeleteStudent] = useState(false);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [isDeleteStudent, setIsDeleteStudent] = useState(false);
  const [triggerSetting, setTriggerSetting] = useState(false);
  const [triggerCreateNewScore, setTriggerCreateNewScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const studentQuery = useQuery({
    queryKey: ["student"],
    queryFn: () => GetOneStudentService({ studentId: student.id }),
  });

  //prepare sound
  useEffect(() => {
    studentQuery.refetch();
    setClassroomId(() => router.query.classroomId as string);
  }, []);
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
    pointsValue: number;
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

      await UpdateScoreOnStudentService({
        scoreId: scoreId,
        studentId: studentId,
        score: score,
        inputValues: pointsValue,
      });

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
          soundNagative.play();
        } else if (checkNagativePoint === false) {
          soundPositive.play();
        }
      }, 1000);
      await students?.refetch();
      await studentQuery.refetch();
      setTimeout(() => {
        setRunAnimation(false);
        setRunScoreTitle(false);
        setLoadingPoint(false);
        setTriggerUpdateStudent(() => false);
        handleShowSweetAleart(undefined);
      }, 1500);
      document.body.style.overflow = "auto";
    } catch (err) {
      console.error(err);
    }
  };
  const style = {
    height: 300,
  };

  return (
    <div
      className=" md:w-full h-full font-Kanit  z-40 
top-0 right-0 left-0 bottom-0 m-auto fixed flex items-center justify-center"
      key={student?.id}
    >
      <div
        className="flex md:flex-row flex-col w-full h-full md:h-max rounded-none md:w-[42rem] lg:w-[45rem]  font-Kanit bg-white border-2 border-solid
    md:rounded-lg drop-shadow-xl md:p-5 md:px-0 relative items-center justify-center"
      >
        <div className="w-full block md:hidden">
          <button
            onClick={() => {
              setTriggerUpdateStudent(() => false);
              document.body.style.overflow = "auto";
            }}
            className="ml-3 text-2xl flex justify-center items-center"
          >
            <AiOutlineCloseCircle />
          </button>
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
            <div className="w-full  h-full  flex items-center justify-center px-5 flex-col relative">
              <div className="relative">
                <div className="relative w-40 h-40 bg-transparent rounded-full ">
                  <Image
                    src={student?.picture}
                    alt="students avatar"
                    className="object-cover "
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,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"
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
                <div
                  className={`absolute w-14 h-14  rounded-full ${
                    studentQuery.data?.score.totalPoints &&
                    studentQuery.data?.score.totalPoints < 0
                      ? "bg-red-600"
                      : "bg-[#EDBA02] "
                  } ring-2 ring-white
                    flex justify-center items-center font-sans font-bold text-3xl z-10 text-white -left-5 top-2 md:-top-5`}
                >
                  {studentQuery.isFetching ? (
                    <Skeleton width="100%" animation="wave" />
                  ) : (
                    studentQuery?.data?.score?.totalPoints
                  )}
                </div>
              </div>

              <div className="mt-2 text-lg w-max flex justify-center items-center gap-2">
                <span className="mr-2">
                  {studentQuery.isFetching ? (
                    <Skeleton width={100} animation="wave" />
                  ) : (
                    student?.firstName
                  )}
                </span>
                <span>
                  {studentQuery.isFetching ? (
                    <Skeleton width={100} />
                  ) : (
                    student?.lastName
                  )}
                </span>
              </div>
              {studentQuery.isFetching ? (
                <Skeleton width={100} />
              ) : (
                <div className="font-light">
                  {user.language === "Thai" && "เลขที่"}
                  {user.language === "English" && "number"} {student?.number}
                </div>
              )}
            </div>
          </div>
        </div>

        {triggerSetting === false && (
          <div className=" flex-col  w-full md:w-max px-5   ">
            <div className="flex items-center justify-center h-5 mt-2 text-lg w-full mb-2 ">
              <p>คะแนนพิเศษ</p>
            </div>

            <div className="">
              <div
                className={`md:w-96  w-full  h-full grid ${
                  triggerCreateNewScore
                    ? " grid-cols-1"
                    : "grid-cols-2 md:grid-cols-3"
                } gap-5 place-items-center  items-center justify-center`}
              >
                {scores.data?.map((score) => {
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
                                pointsValue: pointsValue as number,
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
                        </div>
                      )}
                    </div>
                  );
                })}
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

      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerUpdateStudent(() => false);
        }}
        className="w-full h-full fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/20 "
      ></div>
    </div>
  );
}

export default UpdateScoreAfterRandom;
