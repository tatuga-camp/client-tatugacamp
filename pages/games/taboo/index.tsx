import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Head from "next/head";
import { Skeleton } from "@mui/material";
import { CategoryTaboo, Taboo } from "../../../sanity/sanity-models";
import { useQuery } from "@tanstack/react-query";
import { GetAllTabooByCategorySanityService } from "../../../sanity/services";
import HomepageLayout from "../../../layouts/homePageLayout";
function Index() {
  const [random, setRandom] = useState<number[]>([1, 2, 3, 4, 5]);
  const [nextCard, setNextCard] = useState<number>(() => {
    return Math.floor(Math.random() * 15);
  });
  const [indexRandom, setIndexRandom] = useState<number>(0);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [scores, setScores] = useState<number | "win">(0);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryTaboo>("animal");
  const [length, setLength] = useState<number>(0);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const taboo = useQuery({
    queryKey: ["taboo", category],
    queryFn: () =>
      GetAllTabooByCategorySanityService({ category }).then((res) => {
        setLength(() => res.length);
        return res;
      }),
  });

  //set new category to taboo api
  function handleTabooCatergory({
    newCategory,
  }: {
    newCategory: CategoryTaboo;
  }) {
    setCategory(() => newCategory);
    setNextCard((prev) => {
      prev = Math.floor(Math.random() * 15);
      return prev;
    });
    setScores(0);
    setIndexRandom(0);
    setRandom(() => GenerateRandom({ length }));
    taboo.refetch();
  }

  // handle skip
  const handleSkip = async () => {
    if (length > 0) {
      setLoadingImage(() => true);
      //check if index of random is less than the length
      if (indexRandom < length - 1) {
        // set index of random to increase 1 each click
        setIndexRandom((prev) => prev + 1);
        setNextCard(() => random[indexRandom]);
      } else if (indexRandom >= length - 1) {
        setRandom(GenerateRandom({ length }));
        setIndexRandom(0);
        setNextCard(() => random[indexRandom]);
      }
      setTimeout(() => {
        setLoadingImage(() => false);
      }, 1000); // 1000 milliseconds = 1 second
    }
  };

  //show confirmation
  const NextTaboo = () => {
    if (scores === "win") {
      setScores(0);
    } else {
      setShowConfirm(true);
    }
  };

  //generate uniqe array of random number
  function GenerateRandom({ length }: { length: number }): number[] {
    const nums: Set<number> = new Set();
    while (nums.size !== length) {
      nums.add(Math.floor(Math.random() * length));
    }

    return [...nums];
  }
  //call set random to generate unqie random number
  useEffect(() => {
    setRandom(() => GenerateRandom({ length }));
  }, [length]);

  useEffect(() => {
    if (scores === "win") {
      setRandom(() => GenerateRandom({ length }));
    }
  }, [scores, length]);

  // handle yes confirm
  const YesConfirm = () => {
    setLoadingImage(() => true);
    setConfirm(true);
    if (indexRandom < length - 1) {
      setIndexRandom((prev) => prev + 1);
      setNextCard((current) => {
        return (current = random[indexRandom]);
      });
    } else if (indexRandom >= length - 1) {
      setRandom(() => GenerateRandom({ length }));

      setIndexRandom(0);
      setNextCard((current) => {
        return (current = random[indexRandom]);
      });
    }
    setShowConfirm(false);

    // set score
    setScores((current) => {
      if (typeof current === "number") {
        return current === length ? "win" : current + 1;
      } else {
        return current;
      }
    });
    setTimeout(() => {
      setLoadingImage(() => false);
    }, 1000); // 1000 milliseconds = 1 second
  };

  // handle no confirm
  const NoConfirm = () => {
    setConfirm(false);
    setShowConfirm(false);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="oneline taboo game for students who wants to play them online เกมส์ทาบู ทายคำศัพท์ จาก TaTuga camp"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Taboo game</title>
      </Head>
      <HomepageLayout>
        <div className=" pt-10 bg-slate-100 min-h-screen max-h-full font-Poppins">
          {scores === "win" && <Confetti width={width} height={height} />}
          <header className="w-full h-max  flex justify-center flex-col items-center pt-10">
            {taboo.isFetching ? (
              <h1>กำลังโหลด...</h1>
            ) : (
              <h1 className=" md:text-3xl font-semibold text-3xl text-[#2C7CD1]">
                <span>Taboo</span>
                <span> - {taboo.data?.[0].category.title}</span>
              </h1>
            )}
            {taboo.isError && <h1>มีข้อผิดพลาดเกิดขึ้น</h1>}
          </header>
          <main className="flex  h-max pt-3 items-center justify-center relative    ">
            <ul
              className="list-none p-10 w-10/12 h-max flex flex-col items-center justify-center
           bg-white drop-shadow-lg rounded-md  md:w-96 md:flex lg:w-96 relative "
            >
              <div className="absolute z-20 flex flex-col items-center justify-center gap-y-1 -top-5 right-0">
                <div className="flex flex-col justify-center items-center w-8 md:w-10 bg-slate-700 px-2 py-1 rounded-lg text-white font-medium">
                  <span className="md:text-lg">{scores}</span>
                  <span className="w-full h-[2px] bg-white"></span>
                  <span className="md:text-lg">{length}</span>
                </div>
              </div>

              {showConfirm === true && (
                <div className="w-full h-max py-10 absolute bg-red-300 z-30 flex flex-col items-center justify-center">
                  <div>คุณแน่ใจจะไปต่อใช่ไหม? 🤨</div>
                  <div className="flex gap-12 mt-5">
                    <button
                      onClick={YesConfirm}
                      className="border-0 font-Kanit font-bold px-2 bg-white rounded-sm drop-shadow-sm hover:bg-red-700 hover:text-white cursor-pointer ring-2 ring-black"
                    >
                      Yes
                    </button>
                    <button
                      onClick={NoConfirm}
                      className="border-0 px-2 font-Kanit font-bold bg-white rounded-sm drop-shadow-sm hover:bg-red-700 hover:text-white cursor-pointer ring-2 ring-black"
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {scores === "win" ? (
                <li className="text-2xl font-bold mb-3 md:w-96 text-center">
                  🏆 You are the winner! 🏆
                </li>
              ) : (
                <li className="text-2xl font-bold mb-3 md:w-96 text-center w-full flex items-center justify-center ">
                  {!taboo.isFetching ? (
                    taboo.data?.[nextCard]?.vocabulary
                  ) : (
                    <Skeleton width={120} />
                  )}
                </li>
              )}
              {taboo.isFetching || loadingImage ? (
                <div className="w-32 h-28 md:w-40 md:h-40 lg:w-56 lg:h-56 ">
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                </div>
              ) : (
                <li className="relative w-32 h-28 flex justify-center  items-center rounded-lg overflow-hidden bg-white drop-shadow-lg md:w-40 md:h-40 lg:w-56 lg:h-56">
                  {taboo.data &&
                    scores !== "win" &&
                    taboo.data?.[nextCard]?.mainImage.asset.metadata && (
                      <Image
                        src={
                          taboo.data?.[nextCard]?.mainImage.asset.url as string
                        }
                        className="object-cover"
                        quality={15}
                        alt={`taboo of ${taboo.data?.[nextCard]?.vocabulary}`}
                        fill
                        placeholder="blur"
                        blurDataURL={
                          taboo.data?.[nextCard]?.mainImage.asset.metadata
                            .lqip as string
                        }
                        sizes="(max-width: 768px) 100vw"
                      />
                    )}
                  {scores === "win" && (
                    <Image
                      src="/images/taboo/you-win-sign-pop-art-style_175838-498.webp"
                      className="object-cover"
                      quality={15}
                      alt={`taboo of ${taboo.data?.[nextCard]?.vocabulary}`}
                      fill
                      sizes="(max-width: 768px) 100vw"
                    />
                  )}
                </li>
              )}
              {scores === "win" ? (
                <div></div>
              ) : (
                <div className="text-center flex items-center justify-center flex-col">
                  <li className="mt-5">
                    {!taboo.isFetching ? (
                      taboo.data?.[nextCard]?.firstTaboo
                    ) : (
                      <Skeleton width={100} />
                    )}
                  </li>
                  <li>
                    {!taboo.isFetching ? (
                      taboo.data?.[nextCard]?.secondTaboo
                    ) : (
                      <Skeleton width={80} />
                    )}
                  </li>
                  <li>
                    {!taboo.isFetching ? (
                      taboo.data?.[nextCard]?.thirdTaboo
                    ) : (
                      <Skeleton width={130} />
                    )}
                  </li>
                </div>
              )}
              <li className="mt-5 w-full flex gap-x-5">
                <button
                  data-emoji1="😨"
                  data-emoji2="😢"
                  className={`w-full ${
                    scores === "win" && "hidden"
                  } h-10 after:content-[attr(data-emoji1)] after:ml-2 py-2 after:hover:content-[attr(data-emoji2)] 
                  active:ring-4 active:ring-black hover:text-white text-center font-sans border-0 flex 
                  items-center justify-center  bg-gray-300 rounded-md font-semibold cursor-pointer hover:bg-black`}
                  onClick={handleSkip}
                >
                  ข้าม
                </button>

                <button
                  data-emoji1="😎"
                  data-emoji2="👉"
                  className="w-full after:content-[attr(data-emoji1)]
                   text-white after:ml-2 py-2 after:hover:content-[attr(data-emoji2)] 
                   active:ring-4 active:ring-black hover:text-white text-center font-sans 
                   border-0 flex items-center justify-center  bg-red-800 rounded-md font-semibold 
                   cursor-pointer hover:bg-orange-500"
                  onClick={NextTaboo}
                >
                  {scores === "win" ? "Start again" : "Move on"}
                </button>
              </li>
            </ul>
          </main>
          <footer>
            <div className="w-full flex items-center justify-center  pt-5">
              <ul className="w-max relative p-5 flex items-center justify-center gap-3 list-none flex-wrap ">
                <li>
                  <button
                    className="w-full text-white py-2 px-3 after:hover:content-[attr(emoji2)] active:ring-4 active:ring-black
                   hover:text-white text-center font-sans border-0 flex items-center justify-center  bg-blue-800 rounded-md font-semibold cursor-pointer hover:bg-orange-500"
                    onClick={() =>
                      handleTabooCatergory({ newCategory: "animal" })
                    }
                  >
                    หมวดสัตว์
                  </button>
                </li>
                <li>
                  <button
                    className="w-full text-white py-2 px-3 after:hover:content-[attr(emoji2)] active:ring-4 active:ring-black
                   hover:text-white text-center font-sans border-0 flex items-center justify-center  bg-blue-800 rounded-md font-semibold cursor-pointer hover:bg-orange-500"
                    onClick={() => handleTabooCatergory({ newCategory: "job" })}
                  >
                    หมวดอาชีพ
                  </button>
                </li>
                <li>
                  <button
                    className="w-full relative text-white py-2 px-3 after:hover:content-[attr(emoji2)] active:ring-4 active:ring-black
                   hover:text-white text-center font-sans border-0 flex items-center justify-center  bg-blue-800 rounded-md font-semibold cursor-pointer hover:bg-orange-500"
                    onClick={() =>
                      handleTabooCatergory({ newCategory: "country" })
                    }
                  >
                    <span>หมวดประเทศ</span>
                  </button>
                </li>
                <li>
                  <button
                    className="w-full relative text-white py-2 px-3 after:hover:content-[attr(emoji2)] active:ring-4 active:ring-black
                   hover:text-white text-center font-sans border-0 flex items-center justify-center  bg-blue-800 rounded-md font-semibold cursor-pointer hover:bg-orange-500"
                    onClick={() =>
                      handleTabooCatergory({ newCategory: "sport" })
                    }
                  >
                    <span>หมวดกีฬา</span>
                  </button>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </HomepageLayout>
    </>
  );
}

export default Index;
