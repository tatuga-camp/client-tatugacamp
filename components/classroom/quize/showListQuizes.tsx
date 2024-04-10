import React from "react";
import { User } from "../../../models";
import { IoCreate } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";

type ShowListQuizesProps = {
  user: User;
};
function ShowListQuizes({ user }: ShowListQuizesProps) {
  return (
    <div className="w-full mt-20 flex flex-col font-Kanit justify-start items-center">
      <button className="w-96 font-semibold flex justify-center items-center gap-2 bg-white py-3 drop-shadow-lg ring-1 ring-main-color text-main-color rounded-lg">
        <CiCirclePlus />
        สร้างแบบทดสอบ
      </button>
    </div>
  );
}

export default ShowListQuizes;
