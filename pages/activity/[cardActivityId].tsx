import React, { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Script from "next/script";
import Status from "../../components/activity/Status";
import MainContent from "../../components/activity/MainContent";
import { FacebookShareButton, TwitterShareButton } from "next-share";
import Link from "next/link";
import ReactPlayer from "react-player";
import Skeleton from "@mui/material/Skeleton";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { GetActivitySanityService } from "../../sanity/services";
import FooterActivities from "../../components/footers/footerActivities";
import { Activity } from "../../sanity/sanity-models";
import HomepageLayout from "../../layouts/homePageLayout";
import { FaFacebook, FaHeart, FaTwitterSquare } from "react-icons/fa";

function Index({ activity }: { activity: Activity }) {
  const [likes, setLikes] = useState(activity.likes);
  const [likesHasbeenClicked, setLikeHasBeenClicked] = useState(false);
  const [currentURL, setCurrentURL] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [domLoaded, setDomLoaded] = useState(false);
  const title = `${activity.title} - ${activity.description}`;
  // render the component only after the DOM is loaded.
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // set current url to pass into social media link share
  useEffect(() => {
    setCurrentURL(window.location.href);
  }, []);

  // check whether like button has been clicked or not
  useEffect(() => {
    const readLocalstore = localStorage.getItem(activity.slug.current);
    if (!readLocalstore) {
      setLikeHasBeenClicked(false);
    } else if (readLocalstore === activity._id) {
      setLikeHasBeenClicked(true);
    }
  }, []);

  //set loading video when it is not ready
  function handleVideoReady() {
    setLoading(false);
  }

  return (
    <HomepageLayout>
      <div
        className="w-full md:h-full font-Poppins  bg-[url('/svgs/blob2.svg')] md:bg-[url('/svgs/blob3.svg')]
       bg-no-repeat bg-cover pt-11"
      >
        <Head>
          <meta property="og:url" content={currentURL} />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={`${activity.title} - ${activity.description}`}
          />
          <meta property="og:description" content={activity.LongDescription} />
          <meta property="og:image" content={activity.mainImage.asset.url} />
          <meta
            property="og:image:secure_url"
            content={activity.mainImage.asset.url}
          />
          <meta
            name="twitter:image:src"
            content={activity.mainImage.asset.url}
          />

          <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
          <meta name="google" content="notranslate" key="notranslate" />
          <meta name="description" content={activity?.LongDescription} />
          <meta
            name="keywords"
            content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, ${activity.title}}`}
          />
          <meta
            name="viewport"
            content="width=device-width; initial-scale=1.0;"
          />
          <meta charSet="UTF-8" />
          <title>{title}</title>
        </Head>
        <Script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></Script>
        <Script
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
        ></Script>
        <header>
          <ul
            className="list-none flex flex-col  lg:mt-2  md:flex-row justify-center
          items-center w-full h-full bg-transparent mt-0 md:mt-34 pl-0"
          >
            <ul className="pl-0 list-none">
              <li
                className="bg-transparent w-[20rem] h-[20rem] md:w-60 md:h-60 lg:w-96 lg:h-96
               relative square xyz-in"
              >
                <Image
                  src={activity.mainImage.asset.url}
                  alt={activity.title}
                  className="object-contain"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,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"
                  fill
                  sizes="(max-width: 768px) 100vw"
                />
              </li>
            </ul>
            <li>
              <ul
                className="list-none pl-0 flex flex-col gap-5 square xyz-in justify-center
               text-center pr-0 items-center bg-transparent w-full mt-10  rounded-3xl h-max md:w-[503px] md:h-[376px]"
              >
                <li className=" text-3xl md:text-[2.8rem] text-[#EDBA02]">
                  {activity.title}
                </li>

                <li
                  className=" px-4 py-2 rounded-md bg-[#2C7CD1]  md:drop-shadow-lg md:mb-2
                 text-white flex items-center justify-center gap-x-2 text-[20px] "
                >
                  <div className="flex flex-col justify-center gap-y-0 items-center">
                    <div className="flex justify-center items-center gap-x-4">
                      <div>
                        <FacebookShareButton
                          url={currentURL as string}
                          quote={activity.LongDescription}
                          hashtag={`#${activity.slug}`}
                        >
                          <div className="text-2xl  hover:text-[#F55E00] transition duration-200 ease-in-out">
                            <FaFacebook />
                          </div>
                        </FacebookShareButton>
                      </div>

                      <div>
                        <TwitterShareButton
                          url={currentURL as string}
                          hashtags={[`#${activity.slug}`]}
                        >
                          <div className="text-2xl hover:text-[#F55E00] transition duration-200 ease-in-out">
                            <FaTwitterSquare />
                          </div>
                        </TwitterShareButton>
                      </div>
                    </div>
                  </div>

                  <button
                    className=" 
                md:text-xl gap-x-2 px-2 py-1 md:gap-x-2  rounded-xl
              bg-white mt-0 text-[#F55E00] flex justify-center items-center
                hover:bg-[#F55E00] hover:text-white transition duration-200 ease-in-out
                 "
                  >
                    <span className="mt-1 text-2xl">
                      <FaHeart />
                    </span>
                    <div>{likes}</div>
                  </button>
                </li>
                <li
                  className="sm:text-white text-white md:text-black   text-sm w-3/4 bg-[#2C7CD1]
                 sm:bg-transparent font-Kanit rounded-3xl font-normal "
                >
                  {activity?.LongDescription}
                </li>
                <li>
                  <Status activity={activity} />
                </li>
              </ul>
            </li>
          </ul>

          {/* button for playing game online  */}
          {activity.game && (
            <div className="w-full flex items-center justify-center mt-3">
              <Link href={activity.game}>
                <div
                  className="w-max h-max p-3 bg-[#EDBA02] font-Kanit font-semibold
                   text-white rounded-md ring-2 ring-white
                 hover:scale-110 active:scale-110 transition duration-200 cursor-pointer "
                >
                  <span>กดเพื่อเล่น 🎮</span>
                </div>
              </Link>
            </div>
          )}
        </header>
        <main
          className="w-full h-max flex mt-5 flex-col justify-center items-center
        bg-[#2C7CD1] md:bg-transparent"
        >
          {activity?.video && (
            <div className="w-full flex relative items-center justify-center mb-5">
              {loading && (
                <div className="absolute flex justify-center items-center flex-col">
                  <div className="md:w-[35rem] md:h-[20rem] w-72 h-40">
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <div className="font-Kanit lg:text-lg text-base">
                    📹กำลำโหลด..
                  </div>
                </div>
              )}
              {domLoaded && (
                <div className=" md:w-[35rem] md:h-[20rem] w-72 h-40 rounded-md overflow-hidden ">
                  <ReactPlayer
                    onReady={handleVideoReady}
                    loop={true}
                    playsinline
                    controls
                    width="100%"
                    height="100%"
                    url={activity?.video}
                  />
                </div>
              )}
            </div>
          )}
          <MainContent activity={activity} />
        </main>
        <footer>
          <FooterActivities />
        </footer>
      </div>
    </HomepageLayout>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const cardActivityId = ctx.params?.cardActivityId;
  const activity = await GetActivitySanityService({
    cardActivityId: cardActivityId as string,
  });
  return {
    props: {
      activity: activity[0],
    },
  };
};
