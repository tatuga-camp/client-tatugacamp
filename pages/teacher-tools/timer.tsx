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
  const [initalTime, setInitalTime] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutesInput, setMinutesInput] = useState(0);
  const [secondInput, setSecondInput] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [start, setStart] = useState(false);
  const [counter, setCounter] = useState<number | null>();
  const handle = useFullScreenHandle();
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

  //set miliseconds to seconds and minutes

  // reduce every 1 sec
  useEffect(() => {
    if (counter === null || start === false) {
      return () => {};
    } else {
      const timer: NodeJS.Timeout = setInterval(() => {
        if (start === true) {
          setCounter(() => {
            const timeLeft = calculateRemainingTime();
            return timeLeft * 1000;
          });
          setMinutes(Math.floor(((counter as number) / 1000 / 60) % 60));
          setSeconds(Math.floor(((counter as number) / 1000) % 60));
          if ((counter as number) <= 0 && audio) {
            audio.play();
            setStart(false);
          }
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [counter, start, audio]);

  function calculateRemainingTime(): number {
    return Math.max(
      0,
      Math.floor(((tartgetDateTime as number) - Date.now()) / 1000)
    );
  }

  //handle sumit put time
  function handleSumit(event: React.FormEvent) {
    event.preventDefault();

    const milisecond = secondInput * 1000;
    const miliminute = minutesInput * 60000;
    const sumTime = miliminute + milisecond;
    setCounter(() => sumTime);
    setTargetDateTime(() => Date.now() + sumTime);
    setInitalTime(() => sumTime);
    setStart(() => true);
  }

  const handlePickUpTimer = ({ time }: { time: TimeType }) => {
    setMinutesInput(
      () => ((time.minutes as number) > 0 ? time.minutes : 0) as number
    );

    setTargetDateTime(() => Date.now() + time.miliseconds);

    setSecondInput(
      () => ((time.seconds as number) > 0 ? time.seconds : 0) as number
    );

    setCounter(() => time.miliseconds);
    setInitalTime(() => time.miliseconds);
    setStart(() => true);
  };

  const handlePauseTimmer = () => {
    setStart((prev) => !prev);
    if (counter) {
      setTargetDateTime(() => (Date.now() + counter) as number);
    }
  };

  const handleRestartTimmer = () => {
    const milisecond = secondInput * 1000;
    const miliminute = minutesInput * 60000;
    const sumTime = miliminute + milisecond;
    console.log(sumTime);
    setCounter(() => sumTime);
    setTargetDateTime(() => Date.now() + sumTime);
    setInitalTime(() => sumTime);
    setStart(true);
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

      <div className="flex w-full">
        <div
          onClick={() =>
            router.push({
              pathname: `/classroom/teacher/${classroomId}`,
            })
          }
          className="absolute top-5 left-5 bg-white px-7 py-2 rounded-lg 
        font-Poppins hover:scale-110 transition duration-150 cursor-pointer"
        >
          back
        </div>
        <FullScreen handle={handle} className="w-full">
          <div className=" right-[47%] top-10 absolute ">
            {!handle.active && (
              <button
                className="w-max h-max flex group flex-col gap-y-1 items-center justify-center p-0 bg-transparent border-0 
                cursor-pointer text-white"
                onClick={handle.enter}
              >
                <div className="group-hover:scale-125 transition duration-200 ease-in-out ">
                  <BsFullscreen size={25} />
                </div>

                <span>full screen</span>
              </button>
            )}
            {handle.active && (
              <button
                className="w-max h-max flex group flex-col  gap-y-1 items-center justify-center p-0 bg-transparent border-0 cursor-pointer text-white"
                onClick={handle.exit}
              >
                <div className="group-hover:scale-75 transition duration-200 ease-in-out ">
                  <BsFullscreenExit size={25} />
                </div>
                <span>exit full screen</span>
              </button>
            )}
          </div>

          <div
            className={`w-full h-screen  ${
              seconds < 4 && counter !== null && minutes === 0
                ? `bg-red-700`
                : " bg-blue-400"
            } flex  items-center justify-center font-Inter text-[20rem] font-bold text-white`}
          >
            <div className="flex flex-col justify-center items-center">
              <div className="flex  gap-x-5">
                {minutes > 0 && (
                  <div className="">
                    <div className="flex gap-4">
                      <p id="minute">
                        {minutes < 10 ? "0" + minutes : minutes}
                      </p>
                    </div>
                  </div>
                )}
                {minutes > 0 && <span> : </span>}
                <div className="">
                  <div className="flex gap-4">
                    <p id="second">{seconds < 10 ? "0" + seconds : seconds}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-transparent flex flex-col gap-y-7 justify-center items-center gap-x-8 absolute bottom-40 right-0 left-0 text-center mr-auto ml-auto">
            <div className="flex justify-center items-center gap-x-5">
              <button
                className="w-max p-0 bg flex items-center justify-center bg-transparent rounded-full
                 text-white m-0  border-0 cursor-pointer"
                onClick={handlePauseTimmer}
              >
                {counter && counter > -1000 ? (
                  <div>
                    {start === true ? (
                      <BsStopCircle size={30} />
                    ) : (
                      <BsPlayCircle size={30} />
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </button>
              <button
                className="w-max p-0 bg flex items-center justify-center bg-transparent rounded-full
                 text-white m-0  border-0 cursor-pointer"
                onClick={handleRestartTimmer}
              >
                <VscDebugRestart size={30} />
              </button>
            </div>
          </div>
        </FullScreen>

        <div className="w-full bg-transparent flex flex-col gap-y-7 justify-center items-center gap-x-8 absolute bottom-10 right-0 left-0 text-center mr-auto ml-auto">
          <div className="text-base font-Kanit text-white">
            <form className="flex gap-x-5 " onSubmit={handleSumit}>
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
                  value={minutesInput}
                  onChange={(e) => {
                    const minutes = Number(e.target.value);
                    if (minutes >= 0 && minutes < 60) {
                      setMinutesInput(minutes);
                    } else if (minutes > 59) {
                      setMinutesInput(59);
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
                  value={secondInput}
                  placeholder="second"
                  onChange={(e) => {
                    const seconds = Number(e.target.value);
                    console.log(seconds);
                    if (seconds >= 0 && seconds < 60) {
                      setSecondInput(seconds);
                    } else if (seconds > 59) {
                      setSecondInput(59);
                    }
                  }}
                />
              </label>
              <button className="w-max px-10 py-2 bg-white text-black rounded-md hover:bg-green-400 transition duration-100 active:scale-110">
                ตกลง
              </button>
            </form>
          </div>
          <div className="flex gap-x-5">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Timer;
