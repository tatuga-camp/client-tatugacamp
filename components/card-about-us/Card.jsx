import React from 'react';
import Empertise from '../svg/social_logo/empertise';

function Card({ title, subTitle, info, button, index }) {
  const isOdd = index % 2 !== 0;
  return (
    <div className="max-w-[1240px] mx-auto py-10 grid lg:grid-cols-2 ">
      {/* Text */}
      <div className={`${isOdd ? 'lg:order-2' : ''}`}>
        <div className="relative">
          <div className="absolute left-3 top-[-30px]">
            <Empertise />
          </div>
          <div className="px-10 flex flex-col">
            <span className="text-4xl md:text-5xl  font-semibold text-[#2C7CD1] leading-tight">
              {title}
            </span>
            <span className="text-2xl lg:text-4xl font-Kanit font-semibold">
              {subTitle}
            </span>
            <p className="font-Kanit text-sm md:text-base mt-3 md:mt-8">
              {info}
            </p>
          </div>

          {button && (
            <button className="my-8 ml-10 bg-[#2C7CD1] text-white hover:bg-[#629ede] font-bold py-2 px-8 md:px-12 rounded-xl">
              {'SEE MORE >>'}
            </button>
          )}
        </div>
      </div>

      {/* Image */}
      <div
        className={`my-6 flex justify-center items-center ${
          isOdd ? 'lg:order-1' : ''
        } `}
      ></div>
    </div>
  );
}

export default Card;
