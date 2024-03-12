import React, { useEffect, useState } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import Image from "next/image";
import Swal from "sweetalert2";
import { MdRestartAlt } from "react-icons/md";
import { RiShuffleLine } from "react-icons/ri";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import UpdateScoreAfterRandom from "../form/updateScoreAfterRandom";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { StudentWithScore, User } from "../../models";
import { ResponseGetAllStudentsService } from "../../services/students";
import { GetAllScoresClassroomService } from "../../services/scores";
import { StudentWheel } from "./wheelRandomStudent";

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 5,
});
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r: number, s: number) =>
  `perspective(1500px) rotateX(30deg) rotateY(${
    r / 10
  }deg) rotateZ(${r}deg) scale(${s})`;

type CardRandomStudentProps = {
  setTriggerRandomStudent: React.Dispatch<React.SetStateAction<boolean>>;
  students: UseQueryResult<ResponseGetAllStudentsService, Error>;
  user: User;
  classroomId: string;
};

const sound = {
  cards: "https://storage.googleapis.com/tatugacamp.com/sound/card.mp3",
  sheer: "https://storage.googleapis.com/tatugacamp.com/sound/sheer.mp3",
  shuffle: "https://storage.googleapis.com/tatugacamp.com/sound/shuffle.aac",
};

function CardRandomStudent({
  setTriggerRandomStudent,
  students,
  user,
  classroomId,
}: CardRandomStudentProps) {
  const router = useRouter();
  const [gone] = useState(() => new Set()); // The set flags all the students that are flicked out
  const newStudents = [...(students?.data as StudentWithScore[])];
  const [firstRender, setFirstRender] = useState(false);
  const [isReadyCards, setIsReadyCard] = useState(false);
  const [outCard, setOutCard] = useState<
    | {
        id: string;
        firstName: string;
        lastName: string;
        picture: string;
        number: string;
      }[]
    | []
  >([]);
  const [activeCard, setActiveCard] = useState<number | null>();
  const [shuffledArray, setShuffledArray] = useState<StudentWithScore[]>([]);
  const { width, height } = useWindowSize();
  const [selectedStudent, setSelectedStudent] = useState<StudentWithScore>();
  const [activeCongrest, setActiveCongrest] = useState(false);
  const [audioSheer, setAudioSheer] = useState<HTMLAudioElement>(
    () => new Audio(sound.sheer)
  );
  const [audioCard, setAudioCard] = useState<HTMLAudioElement>(
    () => new Audio(sound.cards)
  );
  const [audioShuffle, setAudioShuffle] = useState<HTMLAudioElement>(
    () => new Audio(sound.shuffle)
  );
  const [triggerUpdateStudent, setTriggerUpdateStudent] = useState(false);

  const scores = useQuery({
    queryKey: ["scores"],
    queryFn: () =>
      GetAllScoresClassroomService({
        classroomId: router.query.classroomId as string,
      }),
  });

  function shuffleArray(array: StudentWithScore[]) {
    for (let i = array?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  //set random card with the first render only
  useEffect(() => {
    setShuffledArray(() => {
      const shuffledArrayObject = localStorage.getItem(
        `${classroomId}:shuffledArray`
      );
      if (shuffledArrayObject) {
        const parsedArrayObject = JSON.parse(shuffledArrayObject);
        return parsedArrayObject;
      } else {
        return shuffleArray(newStudents);
      }
    });
    setOutCard(() => {
      const outCardArrayObject = localStorage.getItem(`${classroomId}:outCard`);

      if (outCardArrayObject) {
        const parsedArrayObject = JSON.parse(outCardArrayObject);
        return parsedArrayObject;
      } else {
        return [];
      }
    });
    setTimeout(() => {
      setIsReadyCard(() => true);
    }, 300);
    setFirstRender(() => true);
  }, []);

  const [props, api] = useSprings(shuffledArray?.length, (i) => ({
    ...to(i),
    from: from(i),
  })); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
      const trigger = velocity[0] + velocity[1] > 0.2; // If you flick hard enough it should trigger the card to fly out
      const dir = xDir < 0 ? -1 : 1; // Direction should either point left or right
      const x = (0 + window.innerWidth) * dir ? mx : 0;

      if (
        (!down && trigger) ||
        (!down && x > window.innerWidth / 10) ||
        (!down && x < (window.innerWidth / 10) * -1)
      ) {
        setSelectedStudent(() => shuffledArray[index]);

        gone.add(index);
        setActiveCongrest(() => true);
        audioSheer?.play();
        if (audioSheer) {
          audioSheer.volume = 1;
        }
        handleShowSweetAleart(index);
      } // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot =
          mx / 100 + (isGone ? dir * 10 * velocity[0] + velocity[1] : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = down ? 1.1 : 1; // Active shuffledArray lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
        };
      });
    }
  );
  const handleShowSweetAleart = (index: number | undefined) => {
    if (index === undefined) {
      Swal.fire({
        title: `เลขที่ ${selectedStudent?.number} ${selectedStudent?.firstName} ${selectedStudent?.lastName}`,
        text: "ยินดีด้วยย คุณคือผู้ถูกเลือก",
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: "ให้คะแนน",
        cancelButtonText: "ออก",
        confirmButtonText: "ลบชื่อ",
        confirmButtonColor: "#eb4034",
        cancelButtonColor: "#1be4f2",
        denyButtonColor: "#1bf278",
        width: "max-content",
      }).then((result) => {
        if (result.isConfirmed) {
          fadeOut(audioSheer, 2000);
          setActiveCongrest(() => false);
          setOutCard((prev) => {
            return [
              ...prev,
              {
                id: selectedStudent?.id as string,
                firstName: selectedStudent?.firstName as string,
                lastName: selectedStudent?.lastName as string,
                number: selectedStudent?.number as string,
                picture: selectedStudent?.picture as string,
              },
            ];
          });
        } else if (result.dismiss) {
          fadeOut(audioSheer, 2000);
          setActiveCongrest(() => false);
          api.start((i) => {
            if (i !== index) {
              return null;
            }
            gone.clear();
            return to(i);
          });
        } else if (result.isDenied) {
          fadeOut(audioSheer, 2000);
          setActiveCongrest(() => false);
          setTriggerUpdateStudent(() => true);
        }
      });
    } else if (index >= 0) {
      Swal.fire({
        title: `เลขที่ ${shuffledArray[index]?.number} ${shuffledArray[index]?.firstName} ${shuffledArray[index]?.lastName}`,
        text: "ยินดีด้วยย คุณคือผู้ถูกเลือก",
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: "ให้คะแนน",
        cancelButtonText: "ออก",
        confirmButtonText: "ลบชื่อ",
        confirmButtonColor: "#eb4034",
        cancelButtonColor: "#1be4f2",
        denyButtonColor: "#1bf278",
        width: "max-content",
      }).then((result) => {
        if (result.isConfirmed) {
          fadeOut(audioSheer, 2000);
          setActiveCongrest(() => false);
          setOutCard((prev) => {
            return [
              ...prev,
              {
                id: shuffledArray[index].id,
                firstName: shuffledArray[index].firstName,
                lastName: shuffledArray[index]?.lastName,
                number: shuffledArray[index].number,
                picture: shuffledArray[index].picture,
              },
            ];
          });
        } else if (result.dismiss) {
          fadeOut(audioSheer, 2000);
          setActiveCongrest(() => false);
          api.start((i) => {
            if (i !== index) {
              return null;
            }
            gone.clear();
            return to(i);
          });
        } else if (result.isDenied) {
          fadeOut(audioSheer, 2000);
          setActiveCongrest(() => false);
          setTriggerUpdateStudent(() => true);
        }
      });
    }
  };

  function fadeOut(audioElement: HTMLAudioElement, duration: number) {
    const initialVolume = audioElement.volume;
    const volumeStep = initialVolume / (duration / 100); // Adjust the division factor for the desired fade-out duration

    const fadeOutInterval = setInterval(() => {
      if (audioElement.volume > 0) {
        audioElement.volume = Math.max(audioElement.volume - volumeStep, 0);
      } else {
        audioElement.pause();
        audioElement.currentTime = 0;
        clearInterval(fadeOutInterval);
      }
    }, 100); // Adjust the interval for smoother fading
  }
  const restart = () => {
    setTimeout(() => {
      setOutCard(() => []);
      setShuffledArray(() => shuffleArray(newStudents));
      gone.clear();
      api.start((i) => {
        return from(i);
      });
      api.start((i) => {
        return to(i);
      });
    }, 600);
  };
  const shuffle = () => {
    const result = newStudents.filter(
      (objFirst) =>
        !outCard.some((objSecond) => objSecond.number === objFirst.number)
    );
    setShuffledArray(() => shuffleArray(result));
    audioShuffle.play();
    setTimeout(() => {
      audioShuffle.pause();
      audioShuffle.currentTime = 0;
    }, 500);
    api.start((i) => {
      return from(i);
    });
    api.start((i) => {
      return to(i);
    });
  };

  useEffect(() => {
    if (firstRender) {
      const result = newStudents.filter(
        (objFirst) =>
          !outCard.some((objSecond) => objSecond.number === objFirst.number)
      );
      setShuffledArray(() => shuffleArray(result));

      localStorage.setItem(`${classroomId}:outCard`, JSON.stringify(outCard));
    }
  }, [outCard]);

  useEffect(() => {
    if (firstRender) {
      localStorage.setItem(
        `${classroomId}:shuffledArray`,
        JSON.stringify(shuffledArray)
      );
    }
  }, [shuffledArray]);

  return (
    <div
      className="flex  w-screen h-screen font-Kanit bg-transparent  z-40 
    top-0 right-0 left-0 bottom-0 m-auto fixed"
    >
      {triggerUpdateStudent && (
        <UpdateScoreAfterRandom
          handleShowSweetAleart={handleShowSweetAleart}
          user={user}
          student={selectedStudent as StudentWheel}
          scores={scores}
          students={students}
          setTriggerUpdateStudent={setTriggerUpdateStudent}
        />
      )}
      {activeCongrest && (
        <div>
          <Confetti width={width} height={height} />
        </div>
      )}
      <div>
        <div
          className="flex flex-col gap-40 w-max h-max font-Kanit z-20 
        top-60  right-0 left-0 bottom-0 m-auto fixed"
        >
          <div className="flex items-center justify-center ">
            {props.map(({ x, y, rot, scale }, i) => {
              return (
                <animated.button className="deck" key={i} style={{ x, y }}>
                  {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
                  <animated.div
                    {...bind(i)}
                    onMouseDown={() => {
                      if (isReadyCards) {
                        audioCard.play();
                        setActiveCard(i);
                      }
                    }}
                    onMouseUp={() => {
                      if (isReadyCards) {
                        audioCard.pause();
                        audioCard.currentTime = 0;
                        setActiveCard(null);
                      }
                    }}
                    style={{
                      transform: interpolate([rot, scale], trans),
                    }}
                    className={` bg-white
              } flex flex-col justify-center items-center relative`}
                  >
                    {activeCard === i ? (
                      <animated.div
                        style={{
                          transform: interpolate([rot, scale], trans),
                        }}
                        className="w-20 h-20 rounded-full overflow-hidden relative "
                      >
                        <Image
                          src={shuffledArray[i].picture}
                          className="object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          alt="student picture"
                        />
                      </animated.div>
                    ) : (
                      <animated.div
                        style={{
                          transform: interpolate([rot, scale], trans),
                        }}
                        className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-6xl text-white overflow-hidden"
                      >
                        ?
                      </animated.div>
                    )}
                    <animated.ul
                      style={{
                        transform: interpolate([rot, scale], trans),
                      }}
                      className="font-Kanit  text-black 
                 flex flex-col justify-center  text-center pl-0  items-center"
                    >
                      <span>
                        {activeCard === i
                          ? ` เลขที่ ${shuffledArray[i].number}`
                          : "****"}
                      </span>
                      <span>
                        {activeCard === i
                          ? shuffledArray[i].firstName
                          : "******"}
                      </span>
                      <span>
                        {activeCard === i ? shuffledArray[i]?.lastName : "***"}
                      </span>
                    </animated.ul>
                  </animated.div>
                </animated.button>
              );
            })}
          </div>
          <nav>
            <ul className="w-80 h-20 flex gap-20 justify-center items-center bg-white rounded-2xl pl-0 list-none">
              <li
                onClick={restart}
                className="flex flex-col w-max hover:bg-blue-300 cursor-pointer q group rounded-xl p-2 items-center 
               transition duration-100 justify-center"
              >
                <div className="text-black group-hover:text-white text-3xl -mb-2 ">
                  <MdRestartAlt />
                </div>
                <span className="group-hover:text-white transition duration-100">
                  {user.language === "Thai" && "เริ่มใหม่"}
                  {user.language === "English" && "restart"}
                </span>
              </li>
              <li
                onClick={shuffle}
                className="flex flex-col w-max hover:bg-blue-300 cursor-pointer q group rounded-xl p-2 items-center 
               transition duration-100 justify-center"
              >
                <div className="text-black group-hover:text-white text-3xl -mb-2 ">
                  <RiShuffleLine />
                </div>
                <span className="group-hover:text-white transition duration-100">
                  {user.language === "Thai" && "สับการ์ดใหม่"}
                  {user.language === "English" && "shuffle"}
                </span>
              </li>
            </ul>
          </nav>
        </div>

        <section className="w-96 h-screen bg-white overflow-auto">
          <h2 className="w-full text-center pt-10">
            <span className="text-black font-semibold text-lg">
              {user.language === "Thai" && "รายชื่อที่ถูกเลือก"}
              {user.language === "English" && "Result"}
            </span>
          </h2>
          <ul className="p-10">
            {outCard?.map((card, index) => {
              return (
                <li key={index} className="text-black">
                  <span>เลขที่ {card.number} </span>
                  <span>{card.firstName} </span>
                  <span>{card?.lastName}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <div
        onClick={() => {
          document.body.style.overflow = "auto";
          setTriggerRandomStudent(false);
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default CardRandomStudent;
