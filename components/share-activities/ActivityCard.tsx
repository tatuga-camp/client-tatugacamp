import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { BsCameraVideoFill } from "react-icons/bs";
import { FaGamepad, FaShoppingCart } from "react-icons/fa";
import Heart from "../svgs/Heart";
import { urlForImage } from "../../sanity/lib/image";
import { Image as ImageSanity } from "sanity";
import { blurDataURL } from "../../data/student/blurDataURL";

type ActivityCardProps = {
  price: number;
  setLoader: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  slug: string;
  likes: number;
  video: string;
  game: string;
  description: string;
  title: string;
  image: ImageSanity;
};
function ActivityCard({
  price,
  setLoader,
  id,
  slug,
  likes,
  video,
  game,
  description,
  title,
  image,
}: ActivityCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const emojis = ["😀", "😄", "🤣", "😍", "🤗", "😜", "😚", "💖", "👍"];
  function handleIdPush() {
    router.push("/" + id);
    setIsLoading(true);
  }

  const emojiIndex = Math.floor(Math.random() * 9);
  return (
    <Link className="no-underline text-black" href={`activity/${slug}`}>
      <div
        onClick={() => setLoader(() => true)}
        key={id}
        className=" w-[14.188rem] h-[18.16rem] flex flex-col justify-center items-center
        md:w-[20.563rem] lg:w-[22.563rem] md:h-max shadow-md pb-3 lg:pb-3
        transition hover:cursor-pointer overflow-hidden bg-white group  rounded-3xl  duration-300 ease-in-out relative "
      >
        <div
          content-hover={`Let's learn ${emojis[emojiIndex]}`}
          className="w-full overflow-hidden bg-[#EDBA02] h-3/4 md:h-52 relative 
        before:content-[attr(content-hover)] before:w-max before:h-max before:px-6 before:py-3 before:rounded-lg  before:backdrop-blur-sm before:bg-white/80 before:absolute before:z-20
        before:group-hover:opacity-100 before:opacity-0  before:text-[#EDBA02] before:text-center
        before:text-lg before:font-bold before:font-sans
        before:top-1 before:bottom-0 before:right-0 before:left-0 before:m-auto
        before:whitespace-pre before:flex before:justify-center before:items-center "
        >
          <Image
            src={urlForImage(image).url()}
            alt={title}
            className=" w-full h-full object-contain z-10 group-hover:scale-125  ease-in-out transition duration-300"
            placeholder="blur"
            quality={40}
            blurDataURL={blurDataURL}
            fill
            sizes="(max-width: 768px) 100vw"
          />
        </div>
        <div className="w-full h-max ">
          <div className="font-Inter font-bold text-lg mt-0 md:text-2xl md:mt-2 ">
            <span>{title}</span>
          </div>
          <div className="font-light w-3/4 mr-auto ml-auto mt-0 font-Kanit md:mt-2 text-sm md:text-md">
            <span>{description}</span>
          </div>
          <div className="w-full font-black font-Inter text-md md:text-xl gap-x-2 md:gap-x-4 mt-2 text-[#F55E00] flex justify-center items-center ">
            {price && <FaShoppingCart />}
            {video && <BsCameraVideoFill />}
            {game && <FaGamepad />}
            <Heart />
            <div>{`${likes ? likes : 0}`}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ActivityCard;
