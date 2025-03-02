import { UseQueryResult } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { User } from "../../models";
import * as animationData from "../../public/jsons/well-done-output.json";
import { ResponseGetGroupService } from "../../services/group";
import {
  HideScoreService,
  ResponseGetAllScoresClassroomService,
  UpdateScoreOnWholeGroupService,
} from "../../services/scores";
import { ResponseGetAllStudentsService } from "../../services/students";
import AdBannerFixed from "../ads/adBannerFixed";
import CreateScore from "./createScore";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type UpdateScoreProps = {
  user: User;
  scores: UseQueryResult<ResponseGetAllScoresClassroomService, Error>;
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
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
};

function UpdateScoreGroup({
  scores,
  user,
  groupScore,
  miniGroupId,
  groupId,
  group,
  students,
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

  // update student points
  const handleUpdateScore = async ({
    scoreId,
    scoreTitle,
    scoreEmoji,
    score,
    pointsValue,
  }: {
    scoreId: string;
    scoreTitle: string;
    scoreEmoji: string;
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
        close?.();
      }, 1500);
      document.body.style.overflow = "auto";
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
    >
      <div
        className="flex md:flex-row flex-col w-full h-full md:h-max rounded-none md:w-[42rem] lg:w-[45rem]  
        font-Kanit bg-white border-2 border-solid
    md:rounded-lg drop-shadow-xl md:p-5 md:px-0 relative items-center justify-center"
      >
        <div className=" md:hidden absolute top-5 left-5">
          <button
            onClick={() => {
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
                                  scoreTitle: score?.title,
                                  scoreEmoji: score?.picture,
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
          close?.();
        }}
        className="w-full h-full fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/20 "
      ></footer>
    </div>
  );
}

export default UpdateScoreGroup;
