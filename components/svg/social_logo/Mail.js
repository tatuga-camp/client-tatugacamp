import React from "react";

function Mail() {
  return (
    <div>
      <svg
        className="w-[4.5vw] md:w-10 md:h-10 items-center"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="mask0_1504_1169" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="33" y="33" width="434" height="434">
          <path d="M33.2705 33.2708H466.271V466.271H33.2705V33.2708Z" fill="white"/>
        </mask>
        <g mask="url(#mask0_1504_1169)">
          <path fillRule="evenodd" clipRule="evenodd" d="M249.781 466.292C369.031 466.292 466.291 369.031 466.291 249.781C466.291 130.531 369.031 33.2708 249.781 33.2708C130.531 33.2708 33.2705 130.531 33.2705 249.781C33.2705 369.031 130.531 466.292 249.781 466.292Z" fill="#EF5350"/>
        </g>
        <path d="M136.885 178.188H363.938L252.458 254.193L135.922 178.188H136.885ZM368.182 188.594L255.63 265.333L252.609 267.401L249.547 265.401L131.375 188.333V321.37H368.182V188.594Z" fill="#FFFFFE"/>
      </svg>
    </div>
  );
}

export default Mail;
