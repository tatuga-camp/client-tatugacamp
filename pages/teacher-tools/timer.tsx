import React from "react";
import Head from "next/head";
import { useState, useEffect } from "react";
import {
  BsFullscreen,
  BsFullscreenExit,
  BsStopCircle,
  BsPlayCircle,
} from "react-icons/bs";
import { VscDebugRestart } from "react-icons/vsc";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useRouter } from "next/router";
import Link from "next/link";
import Countdown, { CountdownRenderProps } from "react-countdown";
type TimeType =
  | {
      seconds: number;
      miliseconds: number;
      minutes?: undefined;
    }
  | {
      minutes: number;
      miliseconds: number;
      seconds?: undefined;
    };

const Timer = () => {
  const router = useRouter();
  const [minutesInput, setMinutesInput] = useState<number | null>(1);
  const [secondInput, setSecondInput] = useState<number | null>(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [checkTimeUp, setCheckTimeUp] = useState<number>(0);
  const [classroomId, setClassroomId] = useState<string>();
  const [tartgetDateTime, setTargetDateTime] = useState<number | null>();
  const timeChoices: TimeType[] = [
    {
      seconds: 10,
      miliseconds: 10000,
    },
    {
      seconds: 30,
      miliseconds: 30000,
    },
    {
      minutes: 1,
      miliseconds: 60000,
    },

    {
      minutes: 2,
      miliseconds: 120000,
    },
  ];

  //prepare sound for the last 3 sec
  useEffect(() => {
    const sound = require("../../public/sounds/ringing.mp3");
    setAudio(() => new Audio(sound));
    setClassroomId(() => localStorage.getItem("classroomId") as string);
  }, []);

  const handlePickUpTimer = ({ time }: { time: TimeType }) => {
    setMinutesInput(
      () => ((time.minutes as number) > 0 ? time.minutes : 0) as number
    );

    setTargetDateTime(() => Date.now() + time.miliseconds);

    setSecondInput(
      () => ((time.seconds as number) > 0 ? time.seconds : 0) as number
    );
  };
  const handleFullScreen = () => {
    document.documentElement.requestFullscreen();
    setIsFullScreen(() => true);
  };

  const handleExitFullScreen = () => {
    document.exitFullscreen();
    setIsFullScreen(() => false);
  };

  const renderer = (props: CountdownRenderProps) => {
    if (props.completed) {
      if (audio) {
        audio.play();
      }
    }
    setCheckTimeUp(props.total);
    return (
      <>
        {props.completed ? (
          <div className="text-[10rem]  font-bold font-Poppins text-white">
            Time&apos;s up!
          </div>
        ) : (
          <section
            className={`flex ${
              isFullScreen ? "text-[20rem]" : "text-[14rem]"
            }  text-white font-bold font-Poppins justify-center items-center gap-3`}
            suppressHydrationWarning
          >
            <div>{props.minutes}</div>
            <div>:</div>
            <div>{props.seconds}</div>
          </section>
        )}
        <div className="flex gap-2">
          {((props.api.isStarted() === false &&
            props.api.isPaused() === false) ||
            props.api.isCompleted() === true) && (
            <button
              onClick={() => {
                let second = secondInput ? secondInput : 0;
                let minute = minutesInput ? minutesInput : 0;
                const milisecond = second * 1000;
                const miliminute = minute * 60000;
                const sumTime = miliminute + milisecond;
                setTargetDateTime(() => Date.now() + sumTime);
                props.api.start();
              }}
              className="w-max px-10 py-2 bg-white text-black rounded-md hover:bg-green-400 transition duration-100 active:scale-110"
            >
              start
            </button>
          )}
          {props.api.isPaused() === false && props.api.isStarted() === true && (
            <button
              onClick={() => {
                props.api.pause();
              }}
              className="w-max px-10 py-2 bg-white text-black rounded-md hover:bg-green-400 transition duration-100 active:scale-110"
            >
              stop
            </button>
          )}
          {props.api.isPaused() === true &&
            props.api.isCompleted() === false && (
              <button
                onClick={() => {
                  props.api.start();
                }}
                className="w-max px-10 py-2 bg-white text-black rounded-md hover:bg-green-400 transition duration-100 active:scale-110"
              >
                continuous
              </button>
            )}
          <button
            onClick={() => {
              props.api.stop();
            }}
            className="w-max px-10 py-2 bg-white text-black rounded-md hover:bg-green-400 transition duration-100 active:scale-110"
          >
            restart
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Timer🕛 - เครื่องจับเวลา</title>

        <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
        <meta name="google" content="notranslate" key="notranslate" />
        <meta
          name="description"
          content="เครื่องจับเวลาสนุกๆ ดีไซน์ทันสมัยที่ TaTuga camp"
        />
        <meta
          name="keywords"
          content="TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ, การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main
        className={`w-full gap-5 min-h-screen flex flex-col justify-center items-center max-h-full ${
          checkTimeUp < 4000 ? "bg-red-600" : "bg-blue-400"
        } `}
      >
        <Link
          href={`/classroom/teacher/${classroomId}`}
          className="absolute no-underline text-black top-5 left-5 bg-white px-7 py-2 rounded-lg 
        font-Poppins hover:scale-110 transition duration-150 cursor-pointer"
        >
          back
        </Link>

        <div className=" top-5 absolute right-0 left-0 w-max m-auto ">
          {isFullScreen ? (
            <button
              className="w-max h-max flex group flex-col gap-y-1 items-center justify-center p-0 bg-transparent border-0 
                cursor-pointer text-white"
              onClick={handleExitFullScreen}
            >
              <div className="group-hover:scale-125 transition duration-200 ease-in-out ">
                <BsFullscreenExit size={25} />
              </div>

              <span>exit full screen</span>
            </button>
          ) : (
            <button
              className="w-max h-max flex group flex-col gap-y-1 items-center justify-center p-0 bg-transparent border-0 
                cursor-pointer text-white"
              onClick={handleFullScreen}
            >
              <div className="group-hover:scale-125 transition duration-200 ease-in-out ">
                <BsFullscreen size={25} />
              </div>

              <span>full screen</span>
            </button>
          )}
        </div>
        <Countdown
          date={tartgetDateTime ? tartgetDateTime : Date.now() + 60000}
          intervalDelay={0}
          precision={1}
          autoStart={false}
          controlled={false}
          renderer={renderer}
        />
        {!isFullScreen && (
          <div className="text-base font-Kanit text-white">
            <form className="flex gap-x-5 ">
              <label>
                <span className="mr-2">minute :</span>
                <input
                  className="bg-white   appearance-none border-2 border-gray-200 rounded-md w-32 py-2 px-4
                       text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500
                       text-base font-Kanit font-medium"
                  id="inline-full-name"
                  placeholder="minute"
                  type="number"
                  inputMode="numeric"
                  name="minute"
                  value={minutesInput as number}
                  onChange={(e) => {
                    const minute = Number(e.target.value);
                    if (minute > 0 && minute < 60) {
                      setMinutesInput(minute);
                    } else if (minute > 59) {
                      setMinutesInput(59);
                    } else if (minute === 0) {
                      setMinutesInput(null);
                    }
                  }}
                />
              </label>
              <label>
                <span className="mr-2">second :</span>
                <input
                  className="bg-white appearance-none border-2 border-gray-200 rounded-md w-32 py-2 px-4
                       text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500
                       text-base font-Kanit font-medium"
                  id="inline-full-name"
                  type="number"
                  name="second"
                  inputMode="numeric"
                  value={secondInput as number}
                  placeholder="second"
                  onChange={(e) => {
                    const seconds = Number(e.target.value);
                    if (seconds > 0 && seconds < 60) {
                      setSecondInput(seconds);
                    } else if (seconds > 59) {
                      setSecondInput(59);
                    } else if (seconds === 0) {
                      setSecondInput(null);
                    }
                  }}
                />
              </label>
            </form>
          </div>
        )}
        {!isFullScreen && (
          <section className="flex gap-x-5">
            {timeChoices.map((time, index) => {
              return (
                <button
                  key={index}
                  className="border-0 ring-2  hover:scale-125 transition duration-200 ease-out text-white ring-white font-Inter font-extrabold bg-transparent rounded-md p-2 cursor-pointer"
                  onClick={() => handlePickUpTimer({ time: time })}
                >
                  {time.minutes && (
                    <span>
                      {time.minutes} {time.minutes > 1 ? "minutes" : "minute"}
                    </span>
                  )}
                  {time.seconds && <span> {time.seconds} seconds</span>}
                </button>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
};

export default Timer;
