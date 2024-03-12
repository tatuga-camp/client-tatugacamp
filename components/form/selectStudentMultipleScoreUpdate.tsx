import React, { useState } from "react";
import {
  BsCheckSquareFill,
  BsFillPeopleFill,
  BsFillPersonDashFill,
  BsXCircleFill,
} from "react-icons/bs";
import { StudentWithScore } from "../../models";

type SelectStudentMultipleScoreUpdateProps = {
  setTriggerUpdateTriggerClassroom: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setTriggerConfirmUpdateScoreMultiple: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setCheckboxStudents: React.Dispatch<
    React.SetStateAction<
      | (StudentWithScore & {
          checkbox: boolean;
        })[]
      | undefined
    >
  >;
};

function SelectStudentMultipleScoreUpdate({
  setCheckboxStudents,
  setTriggerConfirmUpdateScoreMultiple,
  setTriggerUpdateTriggerClassroom,
}: SelectStudentMultipleScoreUpdateProps) {
  const [triggerSelectAll, setTriggerSelectAll] = useState(false);
  return (
    <div
      className="fixed bottom-5 gap-5  right-0 left-0 z-50 font-Kanit m-auto flex items-center w-10/12
     bg-blue-500/60 backdrop-blur-sm h-12 rounded-xl ring-white ring-2 justify-center"
    >
      <button
        onClick={() => {
          setTriggerConfirmUpdateScoreMultiple(() => true);
        }}
        className="px-5 flex items-center gap-2 justify-center py-1 bg-green-500 rounded-lg drop-shadow-sm hover:scale-105 transition duration-150
       text-white"
      >
        ยืนยัน
        <BsCheckSquareFill />
      </button>
      {!triggerSelectAll ? (
        <button
          onClick={() => {
            setTriggerSelectAll(() => true);
            setCheckboxStudents((prev) => {
              return prev?.map((student) => {
                return {
                  ...student,
                  checkbox: true,
                };
              });
            });
          }}
          className="px-5 py-1 bg-white gap-2 rounded-lg drop-shadow-sm hover:scale-105 transition duration-150
       text-green-400 flex justify-center items-center"
        >
          เลือกทั้งหมด
          <BsFillPeopleFill />
        </button>
      ) : (
        <button
          onClick={() => {
            setCheckboxStudents((prev) => {
              setTriggerSelectAll(() => false);
              return prev?.map((student) => {
                return {
                  ...student,
                  checkbox: false,
                };
              });
            });
          }}
          className="px-5 py-1 bg-white rounded-lg drop-shadow-sm hover:scale-105 transition duration-150
       text-red-400 flex gap-2 justify-center items-center"
        >
          ยกเลิกทั้งหมด
          <BsFillPersonDashFill />
        </button>
      )}
      <button
        onClick={() => {
          setTriggerConfirmUpdateScoreMultiple(() => false);
          setTriggerUpdateTriggerClassroom(() => false);
        }}
        className="px-5 flex items-center justify-center gap-2 py-1 bg-red-500 rounded-lg drop-shadow-sm hover:scale-105 transition duration-150
       text-white"
      >
        ออก
        <BsXCircleFill />
      </button>
    </div>
  );
}

export default SelectStudentMultipleScoreUpdate;
