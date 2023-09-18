import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Loading from '../loading/loading';
const Wheel = dynamic(
  () => import('react-custom-roulette').then((mod) => mod.Wheel),
  { ssr: false },
);

const sound = {
  cards: 'https://storage.googleapis.com/tatugacamp.com/sound/card.mp3',
  sheer: 'https://storage.googleapis.com/tatugacamp.com/sound/sheer.mp3',
  shuffle: 'https://storage.googleapis.com/tatugacamp.com/sound/shuffle.aac',
};

const backgroundColors = ['#ff8f43', '#70bbe0', '#0b3351', '#f9dd50'];
const textColors = ['#0b3351', '#0b3351', '#ffffff', '#0b3351'];
const outerBorderColor = '#eeeeee';
const outerBorderWidth = 10;
const innerBorderColor = '#30261a';
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = '#eeeeee';
const radiusLineWidth = 2;
const fontWeight = 'normal';
const fontSize = 12;
const fontStyle = 'normal';
const textDistance = 50;
const spinDuration = 0.5;

function RouletteRandomStudent({
  students,
  classroomId,
  language,
  setTriggerRouletteRandomStudent,
}) {
  const [firstRender, setFirstRender] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState();
  const [audioSheer, setAudioSheer] = useState(null);
  const { width, height } = useWindowSize();
  const [activeConfetti, setActiveConfetti] = useState(false);
  const [outCard, setOutCard] = useState([]);
  const [studentList, setStudentList] = useState([{ option: 'loading' }]);
  useEffect(() => {
    const shuffledArrayObject = localStorage.getItem(
      `${classroomId}:shuffledArray`,
    );

    if (shuffledArrayObject) {
      const parsedshuffledArrayObject = JSON.parse(shuffledArrayObject);
      setStudentList(() => {
        return parsedshuffledArrayObject?.map((student) => {
          return {
            id: student.id,
            option: `${student.firstName} ${
              student.lastName ? student.lastName : ''
            }`,
            firstName: student.firstName,
            lastName: student.lastName,
            picture: student.picture,
            number: student.number,
          };
        });
      });
    } else {
      setStudentList(() => {
        return students.map((student) => {
          return {
            id: student.id,
            option: `${student.firstName} ${
              student.lastName ? student.lastName : ''
            }`,
            firstName: student.firstName,
            lastName: student.lastName,
            picture: student.picture,
            number: student.number,
          };
        });
      });
    }

    const outCardArrayObject = localStorage.getItem(`${classroomId}:outCard`);
    if (outCardArrayObject) {
      const parsedoutCardArrayObject = JSON.parse(outCardArrayObject);
      setOutCard(() => parsedoutCardArrayObject);
    } else {
      setOutCard(() => []);
    }

    setAudioSheer(() => new Audio(sound.sheer));
    setFirstRender(() => true);
  }, []);

  const [mustSpin, setMustSpin] = useState(false);
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      setLoadingSpin(() => true);
      const newPrizeNumber = Math.floor(Math.random() * studentList?.length);
      setSelectedStudent(() => studentList[newPrizeNumber]);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleRemoveStudent = () => {
    const updatedPeople = studentList.filter(
      (student) => student.id !== selectedStudent.id,
    );
    setStudentList(() => updatedPeople);
  };

  useEffect(() => {
    if (firstRender) {
      localStorage.setItem(`${classroomId}:outCard`, JSON.stringify(outCard));
    }
  }, [outCard]);

  useEffect(() => {
    if (firstRender) {
      localStorage.setItem(
        `${classroomId}:shuffledArray`,
        JSON.stringify(studentList),
      );
    }
  }, [studentList]);

  const handleRestart = () => {
    setOutCard(() => []);
    setStudentList(() => {
      return students.map((student) => {
        return {
          id: student.id,
          option: `${student.firstName} ${
            student.lastName ? student.lastName : ''
          }`,
          firstName: student.firstName,
          lastName: student.lastName,
          picture: student.picture,
          number: student.number,
        };
      });
    });
  };
  return (
    <div className="fixed z-40 w-screen h-screen flex items-center justify-center  top-0 right-0 left-0 bottom-0 m-auto ">
      {activeConfetti && (
        <div>
          <Confetti width={width} height={height} />
        </div>
      )}
      <section className="md:w-screen lg:w-96 h-60 lg:h-screen  absolute md:bottom-0 lg:left-0 lg:right-auto  md:right-0 md:left-0 m-auto bg-white overflow-auto">
        <h2 className="w-full text-center pt-10">
          <span className="text-black">
            {language === 'Thai' && 'รายชื่อที่ถูกเลือก'}
            {language === 'English' && 'Result'}
          </span>
        </h2>
        <ul className="p-10 md:flex md:gap-2 md:flex-wrap md:overflow-auto">
          {outCard?.map((card, index) => {
            return (
              <li
                key={index}
                className="text-black w-52 truncate  text-xs lg:text-sm"
              >
                <span>เลขที่ {card.number} </span>
                <span>{card.firstName} </span>
                <span>{card?.lastName}</span>
              </li>
            );
          })}
        </ul>
      </section>
      <div className="w-max z-20 h-max rounded-2xl bg-white p-5 flex flex-col justify-center items-center gap-5">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={studentList}
          backgroundColors={backgroundColors}
          textColors={textColors}
          fontWeight={fontWeight}
          fontSize={fontSize}
          fontStyle={fontStyle}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          spinDuration={spinDuration}
          startingOptionIndex={2}
          // perpendicularText
          textDistance={textDistance}
          onStopSpinning={() => {
            setActiveConfetti(() => true);
            setLoadingSpin(() => false);
            audioSheer.play();
            setMustSpin(false);
            Swal.fire({
              title: selectedStudent.option,
              text: 'ยินดีด้วยย คุณคือผู้ถูกเลือก',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              width: 'max-content',
              confirmButtonText: 'remove',
            }).then((result) => {
              if (result.isConfirmed) {
                audioSheer.currentTime = 0;
                handleRemoveStudent();
                setOutCard((prev) => {
                  return [
                    ...prev,
                    {
                      id: selectedStudent.id,
                      firstName: selectedStudent.firstName,
                      lastName: selectedStudent?.lastName,
                      number: selectedStudent.number,
                      picture: selectedStudent.picture,
                    },
                  ];
                });
                audioSheer.pause();
                setActiveConfetti(() => false);
              } else if (result.dismiss) {
                audioSheer.currentTime = 0;
                audioSheer.pause();
                setActiveConfetti(() => false);
              }
            });
          }}
        />
        <nav className="w-full flex justify-center gap-5">
          {loadingSpin ? (
            <Loading />
          ) : (
            <button
              className="w-20 h-8 text-center hover:bg-blue-700 transition duration-100 rounded-md bg-blue-500 text-white font-Poppins font-bold"
              onClick={handleSpinClick}
            >
              Start
            </button>
          )}
          <button
            onClick={handleRestart}
            className="w-20 h-8 text-center hover:bg-red-700 transition duration-100  rounded-md bg-red-500 text-white font-Poppins font-bold"
          >
            restart
          </button>
        </nav>
      </div>

      <div
        onClick={() => {
          setTriggerRouletteRandomStudent(() => false);
          document.body.style.overflow = 'auto';
        }}
        className="w-screen h-screen fixed right-0 left-0 top-0 bottom-0 m-auto -z-10 bg-black/30 "
      ></div>
    </div>
  );
}

export default RouletteRandomStudent;
