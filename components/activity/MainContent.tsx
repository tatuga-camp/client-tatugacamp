import React from "react";
import { Activity } from "../../sanity/sanity-models";
import DisclosureComponent from "./disclosure/disclosure";

function MainContent({ activity }: { activity: Activity }) {
  const Newbody = {
    body: activity.body,
    reflectionTipsStrategies: activity.ReflectionTipsStrategies,
    materialDetail: activity.materialDetail,
  };

  return (
    <div className="w-full h-full bg-[#2C7CD1] md:bg-transparent flex justify-center ">
      <div className="w-[90%] lg:w-2/4 lg:p-11 h-full pb-20 lg:pb-36 border-2 md:border-solid   bg-white   rounded-xl drop-shadow-lg ">
        <ul className="list-none pl-0 flex flex-col justify-center items-center">
          <li className="mt-5"></li>
          <li>
            <ul className=" pl-0 lg:mt-0  ">
              {/* main content body */}
              <li className=" text-[#EDBA02] font-bold  font-Kanit text-[1.5rem] md:text-[1.5rem] flex flex-col justify-center items-center">
                <span className="underLineHover">รายละเอียดกิจกรรม</span>
              </li>
              <li className=" pl-0 w-full  flex flex-col items-center font-Kanit text-lg justify-center">
                <DisclosureComponent body={Newbody} />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MainContent;
