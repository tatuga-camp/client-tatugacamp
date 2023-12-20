import React from 'react';
import Empertise from '../svg/social_logo/empertise';
import Image from 'next/image';
import Link from 'next/link';
function Card({ title, subTitle, info, button, index, image }) {
  const isOdd = index % 2 !== 0;

  //prevent draging image
  const handlePreventDragHandler = (e) => {
    e.preventDefault();
  };
  return (
    <section className="max-w-[1240px] mx-auto py-10 grid lg:grid-cols-2 ">
      {/* Text */}

      <div className={`${isOdd ? 'lg:order-2' : ''}`}>
        <div className="relative flex flex-col gap-1">
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
            <Link
              href={button}
              className="my-8 ml-10 no-underline bg-[#2C7CD1] w-max
               text-white hover:bg-[#629ede] font-bold py-2 px-8 md:px-12 rounded-xl"
            >
              {'SEE MORE >>'}
            </Link>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="w-40 h-40 md:w-60  md:h-60 lg:w-80 lg:h-72 bg-transparent  relative ">
        <Image
          onDragStart={handlePreventDragHandler}
          src={image?.asset?.url}
          fill
          className="object-contain"
          placeholder="blur"
          blurDataURL={image?.asset?.metadata?.lqip}
          alt={`picture of ${title}`}
          sizes="(max-width: 350px),33vw"
        />
      </div>
    </section>
  );
}

export default Card;
