import React from "react";
import { Activity } from "../../sanity/sanity-models";
import { IoIosTime } from "react-icons/io";
import { IoAccessibilitySharp, IoPeople } from "react-icons/io5";
import { FaNewspaper } from "react-icons/fa";

function Status({ activity }: { activity: Activity }) {
  return (
    <ul className="list-none mt-3 text-[#EDBA02]  flex justify-center items-center gap-x-4 font-Inter  font-normal  bg-white w-[21rem] h-max py-1 px-3 md:px-3 rounded-xl">
      <li>
        <div className="text-2xl md:text-[2rem]">
          <IoIosTime />
        </div>
        <div className="text-black text-[0.7rem] ">{activity.time}</div>
      </li>

      <li>
        <div className="text-2xl md:text-[2rem]">
          <IoPeople />
        </div>

        <div className="text-black text-[0.7rem]">{activity.people}</div>
      </li>
      <li>
        <div className="text-2xl md:text-[2rem]">
          <FaNewspaper />
        </div>

        <div className="text-black text-[0.7rem]">{activity.material}</div>
      </li>
      <li>
        <div className="text-2xl md:text-[2rem]">
          <IoAccessibilitySharp />
        </div>
        <div className="text-black text-[0.7rem]">{activity.age}</div>
      </li>
    </ul>
  );
}

export default Status;
