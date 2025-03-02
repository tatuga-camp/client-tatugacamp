import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import * as animationData from "../../public/jsons/well-done-output.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import { UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { StudentWithScore } from "../../models";
import {
  HideScoreService,
  ResponseGetAllScoresClassroomService,
  UpdateScoreOnStudentService,
} from "../../services/scores";
import { ResponseGetAllStudentsService } from "../../services/students";

type UpdateScoreMultipleProps = {
  scores: UseQueryResult<ResponseGetAllScoresClassroomService, Error>;
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
  checkboxStudents: (StudentWithScore & { checkbox: boolean })[] | undefined;
  setTriggerConfirmUpdateScoreMultiple: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

function UpdateScoreMultiple({
  checkboxStudents,
  setTriggerConfirmUpdateScoreMultiple,
  scores,
  students,
}: UpdateScoreMultipleProps) {
  const router = useRouter();
  const [classroomId, setClassroomId] = useState<string>();
  const [soundPositive, setSoundPositive] = useState<HTMLAudioElement>();
  const [soundNagative, setSoundNagative] = useState<HTMLAudioElement>();
  const [clickScoreTitle, setClickScoreTitle] = useState<React.ReactNode>();
  const [runScoreTitle, setRunScoreTitle] = useState(false);
  const [runAnimation, setRunAnimation] = useState(false);
  const [pointsValue, setpointsValue] = useState<number | null>(0);
  const [data, setData] = useState(animationData);
  const [loadingPoint, setLoadingPoint] = useState(false);
  const [triggerCreateNewScore, setTriggerCreateNewScore] = useState(false);

  //prepare sound
  useEffect(() => {
    const fileSoundPositive = require("../../public/sounds/ging.mp3");
    const fileSoundNagative = require("../../public/sounds/wrong.mp3");
    setClassroomId(() => router.query.classroomId as string);
    setSoundNagative(new Audio(fileSoundNagative));
    setSoundPositive(new Audio(fileSoundPositive));
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

  //handle hiden score
  const onClickToHide = async ({ scoreId }: { scoreId: string }) => {
    try {
      await HideScoreService({ scoreId });
      scores.refetch();
    } catch (err: any) {
      Swal.fire("error", err?.response?.data?.message.toString(), "error");
    }
  };

  // update student points
  const handleUpdateScore = async ({
    scoreId,
    scoreTitle,
    score,
    pointsValue,
  }: {
    scoreId: string;
    scoreTitle: string;
    score: number;
    pointsValue: number;
  }) => {
    try {
      const filterCheckStudents = checkboxStudents?.filter(
        (student) => student.checkbox === true
      );

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
      for (const filterCheckStudent of filterCheckStudents ?? []) {
        await UpdateScoreOnStudentService({
          scoreId: scoreId,
          studentId: filterCheckStudent.id,
          score: score,
          inputValues: pointsValue,
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
      await students?.refetch();
      setTimeout(() => {
        setRunAnimation(false);
        setRunScoreTitle(false);
        setLoadingPoint(false);
        setTriggerConfirmUpdateScoreMultiple(() => false);
      }, 1500);
      document.body.style.overflow = "auto";
    } catch (err: any) {
      console.error(err);
      Swal.fire("error", err?.response?.data?.message.toString(), "error");
    }
  };
  const style = {
    height: 300,
  };

  return (
    <div
      className=" md:w-full h-full font-Kanit  z-40 
top-0 right-0 left-0 bottom-0 m-auto fixed flex items-center justify-center"
    >
      <div
        className="flex md:flex-row flex-col w-full h-full md:h-max rounded-none md:w-[42rem] lg:w-[45rem]  font-Kanit bg-white border-2 border-solid
    md:rounded-lg drop-shadow-xl md:p-5 md:px-0 relative items-center justify-center"
      >
        <div className="w-full block md:hidden">
          <button
            onClick={() => {
              setTriggerConfirmUpdateScoreMultiple(() => false);
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

        <div className=" flex-col  w-full md:w-max px-5   ">
          <div className="flex items-center justify-center h-5 mt-2 text-lg w-full mb-2 ">
            <p>ให้คะแนนพิเศษ</p>
          </div>

          <div className="">
            <div
              className={`md:w-96  w-full  h-full grid 
                grid-cols-2 md:grid-cols-3
                gap-5 place-items-center  items-center justify-center`}
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
                    **หมายเหตุ สามารถลบคะแนนผู้เรียนได้โดยใส่เครื่องหมาย - เช่น
                    -5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          setTriggerConfirmUpdateScoreMultiple(() => false);
          document.body.style.overflow = "auto";
        }}
        className="w-full h-full fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/20 "
      ></div>
    </div>
  );
}

export default UpdateScoreMultiple;
