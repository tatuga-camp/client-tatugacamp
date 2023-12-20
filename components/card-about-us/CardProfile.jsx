import React from 'react';
import DoubleQuote from '../svg/social_logo/doubleQuote';
import Image from 'next/image';
import BlobSmall1 from '../svg/blobs/blob-small1';
import BlobSmall2 from '../svg/blobs/blob-small2';

function CardProfile({ index, name, subTitle, info, image }) {
  const isOdd = index % 2 !== 0;

  return (
    <div
      className={`flex ${
        isOdd ? 'flex-row-reverse' : 'flex-row'
      } gap-5 w-full justify-center items-center  `}
    >
      <div className="w-40 h-40 md:w-60  md:h-60 lg:w-80 lg:h-72 bg-transparent  relative ">
        <Image
          src={image?.asset?.url}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={image?.asset?.metadata?.lqip}
          alt={`picture of ${name}`}
          sizes="(max-width: 350px),33vw"
        />
        <div className='pt-[2rem] md:pt-[3rem] md:pl-[1.5rem]'>
            <BlobSmall2 />
        </div>
        
      </div>
      <div className="flex flex-col  justify-center mx-3 md:mx-10">
        <h2 className="text-main-color text-start font-Poppins text-base md:text-3xl lg:text-4xl font-semibold">
          {name}
        </h2>
        <h1 className="text-black text-start font-Poppins text-xs md:text-xl font-semibold">
          {subTitle}
        </h1>

        <div className="relative mt-2 md:mt-5 max-w-[20rem]">
          <div className="absolute top-0 left-0 max-w-[10px] md:max-w-[20px]">
            <DoubleQuote />
          </div>
          <p className="p-3  md:p-15  text-center text-[0.5rem] md:text-base">
            {info}
          </p>
          <div className="absolute bottom-0 right-0 max-w-[10px]  md:max-w-[20px]">
            <DoubleQuote />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardProfile;
