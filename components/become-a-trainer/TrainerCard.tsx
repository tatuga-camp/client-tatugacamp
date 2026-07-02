import React from "react";
import Image from "next/image";
import DoubleQuote from "../svgs/social_logo/doubleQuote";
import { Trainer } from "../../sanity/sanity-models";

type TrainerCardProps = {
  trainer: Trainer;
};

function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <div className="flex h-full w-full max-w-sm flex-col items-center rounded-2xl bg-white p-6 shadow-md">
      <div className="relative h-40 w-40 overflow-hidden rounded-full">
        <Image
          src={trainer.mainImage?.asset?.url}
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={trainer.mainImage?.asset?.metadata?.lqip}
          alt={`picture of ${trainer.name}`}
          sizes="160px"
        />
      </div>
      <h3 className="mt-4 text-center font-Poppins text-xl font-semibold text-main-color">
        {trainer.name}
      </h3>
      <span className="text-center font-Poppins text-sm font-medium text-gray-700">
        {trainer.title}
      </span>
      <span className="mt-2 rounded-full bg-third-color px-3 py-1 text-xs font-semibold text-white">
        {trainer.nationality}
      </span>
      <p className="mt-3 text-center text-sm text-gray-600">
        {trainer.description}
      </p>
      <div className="relative mt-auto w-full pt-4">
        <div className="absolute left-0 top-2 max-w-[15px]">
          <DoubleQuote />
        </div>
        <p className="p-4 text-center text-sm italic text-gray-800">
          {trainer.feedback}
        </p>
        <div className="absolute bottom-0 right-0 max-w-[15px]">
          <DoubleQuote />
        </div>
      </div>
    </div>
  );
}

export default TrainerCard;
