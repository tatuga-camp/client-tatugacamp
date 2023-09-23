import React, { useState } from 'react';

function TotalSumScore({ totalScore }) {
  const [activeScore, setActiveScore] = useState();
  return (
    <div className="w-full md:mt-5 flex font-Kanit justify-center">
      <ul className="w-11/12 flex justify-center flex-wrap gap-4 ">
        {totalScore?.data?.assignments?.map((assignment, index) => {
          let score = 0;
          let pureMaxScore = '0';
          if (assignment.studentWorks) {
            if (assignment.studentWorks.pureScore) {
              score = assignment.studentWorks.pureScore;
            } else {
              score = assignment.studentWorks.score;
            }
          }
          if (assignment?.assignment?.percentage) {
            const stringWithoutPercent =
              assignment?.assignment?.percentage.replace(/%/g, '');

            pureMaxScore = stringWithoutPercent;
          } else {
            pureMaxScore = assignment?.assignment?.maxScore;
          }
          return (
            <li
              onClick={() =>
                setActiveScore((prev) => {
                  if (prev === index) {
                    return null;
                  } else {
                    return index;
                  }
                })
              }
              key={assignment.id}
              className={`h-28 select-none w-max min-w-[5rem] max-w-lg group   p-2 text-center
              ${
                activeScore === index
                  ? 'bg-green-700 text-white '
                  : 'bg-green-500 text-black '
              } rounded-lg ring-2 ring-white flex flex-col items-center
               justify-center `}
            >
              {activeScore === index ? (
                <span className="text-base transition duration-150 font-medium  w-max   ">
                  {assignment.assignment.title}
                </span>
              ) : (
                <div className="flex justify-center items-center flex-col">
                  <span className="text-xl font-semibold">{score}</span>
                  <div className="w-10/12 h-[2px] bg-white"></div>
                  <span className="text-xl font-semibold">{pureMaxScore}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TotalSumScore;
