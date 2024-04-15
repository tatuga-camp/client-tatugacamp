import React, { useState } from "react";
import { User } from "../../../models";
import { IoCreate } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import Link from "next/link";
import { useRouter } from "next/router";
import CreateQuiz from "../../form/createQuiz";

type ShowListQuizesProps = {
  user: User;
};
function ShowListQuizes({ user }: ShowListQuizesProps) {
  const router = useRouter();
  const [triggerCreate, setTriggerCreate] = useState<boolean>(false);
  return (
    <div className="w-full mt-20 flex flex-col font-Kanit justify-start items-center">
      {triggerCreate && <CreateQuiz setTriggerCreateProps={setTriggerCreate} />}
      <button
        onClick={() => setTriggerCreate(() => true)}
        className="w-96 no-underline hover:bg-main-color hover:text-white transition active:scale-105
         font-semibold flex justify-center items-center gap-2 bg-white py-3 
         drop-shadow-lg ring-1 font-Kanit ring-main-color text-main-color rounded-lg"
      >
        <CiCirclePlus />
        สร้างแบบทดสอบ
      </button>
    </div>
  );
}

export default ShowListQuizes;
