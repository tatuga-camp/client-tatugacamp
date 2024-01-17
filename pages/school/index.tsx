import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ReactPlayer from "react-player";
import { BsFillPlayCircleFill } from "react-icons/bs";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { myPortableTextComponents } from "../../data/portableContent";
import { TypeAnimation } from "react-type-animation";
import HomepageLayout from "../../layouts/homePageLayout";
import BlobSmall1 from "../../components/svgs/blobs/small-blobs/blob-small1";
import MainFooter from "../../components/footers/mainFooter";
import {
  GetAllTatugaSchoolPostsSanityService,
  ResponseGetAllTatugaSchoolPostsSanityService,
} from "../../sanity/services/tatugaSchoolPosts.service";
import { GetStaticProps } from "next";

const tags = [
  { title: "#ติดตามสถิติการมาเรียน" },
  { title: "#ติดตามความคืบหน้าในชั้นเรียน" },
  { title: "#สร้างบัญชี Tatuga Class premium" },
  { title: "#ใช้งานได้ทั้งในโรงเรียนและองค์กร" },
];
type IndexProps = {
  tatugaSchoolPosts: ResponseGetAllTatugaSchoolPostsSanityService;
};
function Index({ tatugaSchoolPosts }: IndexProps) {
  const [domLoad, setDomLoad] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  useEffect(() => {
    setDomLoad(() => true);
  });

  function handleVideoReady() {
    setIsVideoLoading(false);
  }

  const preventDragHandler = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gradient-to-b font-Kanit  from-white from-80% to-main-color">
      <Head>
        <title>
          tatuga school - เว็บแอพพลิเคชั่นสำหรับบริหารจัดการ tatuga class
        </title>
        <meta
          property="og:image"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/school-oage.png"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content=" tatuga school - เว็บแอพพลิเคชั่นสำหรับบริหารจัดการ tatuga class"
        />
        <meta
          property="og:description"
          content="#เว็บไซต์จัดการชั้นเรียน #ค่ายภาษาอังกฤษ #ทำเว็บไซต์โรงเรียนแบบทันสมัย #การ์ดเกมเพื่อการเรียนรู้ จบที่นี้ - tatuga camp! "
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="600" />
        <meta
          property="og:image:secure_url"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/school-oage.png"
        />
        <meta
          name="twitter:image:src"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/school-oage.png"
        />
        <meta name="google" content="nositelinkssearchbox" key="sitelinks" />
        <meta name="google" content="notranslate" key="notranslate" />
        <meta
          name="description"
          content=" tatuga school - เว็บแอพพลิเคชั่นสำหรับบริหารจัดการ tatuga class เหมาสำหรับโรงเรียนหรือองค์กรที่ต้องการมองหาการควบคุมห้องเรียนในระดับ โรงเรียน"
        />
        <meta
          name="keywords"
          content="TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ, การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม"
        />

        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
      </Head>
      <HomepageLayout>
        <header className="w-full flex-col md:flex-row mt-28 flex md:mt-10 md:gap-5 xl:gap-20 justify-center items-center">
          <section className="text-center  md:w-96  lg:w-max flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl lg:text-4xl  xl:text-6xl text-main-color font-Poppins font-semibold">
              Tatuga School 🏫
            </h1>
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Effortless classroom monitoring",
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                "Beyond School & Classroom",
                1000,
                "Attendance Monitoring",
                1000,
                "Tatuga Class premium",
                1000,
              ]}
              wrapper="h2"
              speed={50}
              style={{
                fontSize: "1.5em",
                display: "inline-block",
                color: "#F85C00",
              }}
              repeat={Infinity}
            />

            <Link
              href={`${process.env.NEXT_PUBLIC_URL_SCHOOL}/school/dashboard`}
              className="font-Kanit uppercase no-underline text-black hover:ring-2 ring-black active:scale-110 transition duration-100
               w-max text-lg font-semibold bg-third-color px-5 py-2 rounded-md"
            >
              เข้าสู่ tatuga school
            </Link>
            <ul className="flex flex-wrap  justify-center w-full md:w-full md:max-w-lg gap-2">
              {tags.map((tag, index) => {
                return (
                  <li key={index}>
                    <Link
                      href={`/school${tag.title}`}
                      className="bg-main-color no-underline p-1 cursor-pointer select-none 
                     hover:bg-third-color text-sm md:tex-base  transition duration-150 active:scale-110 text-white rounded-lg "
                    >
                      {tag.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
          <section className="relative w-full md:w-max md:min-w-[20rem] lg:min-w-[25rem] xl:min-w-[30rem] z-10   max-w-xl  h-96 ">
            {domLoad && (
              <div
                className={`w-80 xl:min-w-[30rem] md:w-max md:min-w-[15rem] lg:min-w-[25rem]  max-w-xl h-60 rounded-3xl  ring-2 ring-black 
            ${
              isVideoLoading ? " bg-transparent" : "bg-white"
            } overflow-hidden absolute top-0 bottom-0 right-0 left-0 m-auto z-20 `}
              >
                <ReactPlayer
                  onReady={handleVideoReady}
                  loop={true}
                  playing={true}
                  playsinline={true}
                  volume={0.5}
                  muted={true}
                  controls
                  width="100%"
                  height="100%"
                  url="https://player.vimeo.com/video/873669665"
                />
                {isVideoLoading && (
                  <div className="absolute   w-full h-full top-0 bottom-0 right-0 left-0 m-auto">
                    <div
                      className=" text-6xl w-max h-max text-green-600 absolute 
                     top-0 bottom-0 right-0 left-0 m-auto z-40  "
                    >
                      <BsFillPlayCircleFill />
                    </div>
                    <div className="w-full h-full animate-pulse bg-slate-200"></div>
                  </div>
                )}
              </div>
            )}
            <div className="w-[25rem] lg:w-[30rem]  h-96 top-0 bottom-0 right-0 m-auto absolute z-10">
              <div className="top-20 bottom-0 right-0 m-auto absolute z-10 ">
                <svg
                  width="41"
                  height="33"
                  viewBox="0 0 41 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.760215 10.7039C0.955498 13.1816 2.17101 15.5789 4.16647 17.3281L18.4453 29.7925C24.0533 34.5811 32.4581 33.9186 37.2952 28.3068C42.0838 22.6988 41.4214 14.2941 35.8096 9.45689L29.2581 3.86274L26.1702 7.47912L32.1041 12.682L32.7702 13.0694C36.3865 16.1574 36.8154 21.5986 33.7274 25.215C30.6842 28.779 25.3325 29.103 21.7276 26.1608L7.30302 13.7079C5.25898 11.9625 5.01009 8.80469 6.75163 6.71206C8.49701 4.66802 11.5168 4.52778 13.6017 6.17217L26.5588 17.3719C27.0829 17.8195 27.148 18.6454 26.7043 19.2181C26.2568 19.7422 25.4309 19.8073 24.8582 19.3636L24.6895 19.0836L19.7743 15.0225L16.6863 18.6389L21.7702 22.98C24.286 25.1281 28.124 24.8256 30.2721 22.3099C32.4203 19.7941 32.1663 15.9523 29.602 13.808L16.7907 2.59671C12.7026 -0.894038 6.58125 -0.411576 3.13908 3.67267C1.39371 5.71672 0.613516 8.22241 0.812627 10.7487L0.760215 10.7039Z"
                    fill="#EDBA02"
                  />
                </svg>
              </div>
              <div className="top-40 bottom-0 left-0 m-auto absolute z-10 ">
                <svg
                  width="20"
                  height="25"
                  viewBox="0 0 36 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.9943 1.66646C23.9035 -0.411243 18.0384 2.054 15.9607 7.14478L20.5887 9.0336C21.6464 6.44193 24.5138 5.2367 27.1055 6.29444C29.6971 7.35218 30.9024 10.2196 29.8446 12.8112L26.067 22.0672L7.55507 14.5119L-0.000203292 33.0239L27.7677 44.3568L35.323 25.8448L30.695 23.956L34.4726 14.7001C36.5503 9.60928 34.0851 3.74416 28.9943 1.66646Z"
                    fill="#97CC04"
                  />
                </svg>
              </div>
              <div className=" right-20 m-auto bottom-10 absolute z-10 ">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.0745 0.634127C15.5926 0.584508 15.1076 0.694004 14.6938 0.945891C14.2799 1.19778 13.9599 1.57821 13.7825 2.02908L0.921433 30.3039C0.677792 30.8396 0.656912 31.45 0.863388 32.0011C1.06986 32.5521 1.48678 32.9986 2.02241 33.2422L30.2973 46.1033C30.8329 46.3469 31.4434 46.3678 31.9944 46.1613C32.5455 45.9549 32.9919 45.5379 33.2355 45.0023L46.0966 16.7275C46.3403 16.1918 46.3611 15.5813 46.1547 15.0303C45.9482 14.4793 45.5313 14.0328 44.9956 13.7892L16.7208 0.928094C16.6048 0.862159 16.4832 0.806816 16.3573 0.762738C16.2788 0.721173 16.1978 0.684361 16.1149 0.6525L16.0745 0.634127ZM18.9228 6.80466C20.0538 7.3191 20.5382 8.61194 20.0237 9.74294C19.5093 10.8739 18.2165 11.3584 17.0855 10.8439C15.9545 10.3295 15.47 9.03663 15.9845 7.90564C16.4989 6.77464 17.7918 6.29021 18.9228 6.80466ZM27.0013 10.4793L39.1191 15.9911C40.2501 16.5056 40.7345 17.7984 40.2201 18.9294C39.7056 20.0604 38.4128 20.5449 37.2818 20.0304L25.164 14.5185C24.033 14.0041 23.5486 12.7112 24.063 11.5802C24.5775 10.4492 25.8703 9.96481 27.0013 10.4793ZM13.2285 13.9645L37.4641 24.9883L30.1149 41.1454L5.87935 30.1216L13.2285 13.9645Z"
                    fill="#2C7CD1"
                  />
                </svg>
              </div>
              <div className="top-5 bottom-0 left-5 m-auto absolute z-10 ">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.42075 21.6839C5.82148 22.8982 5.69869 24.2398 6.09406 25.4056C6.48944 26.5715 7.40297 27.5616 8.61727 28.1609C9.83157 28.7602 11.0842 28.4076 12.339 28.4876C12.6634 28.4859 13.0971 28.6999 13.6175 28.9568L8.67355 38.9747L34.6942 51.8162L39.6382 41.7983C39.1178 41.5414 38.6627 41.3708 38.3597 41.3291C37.1048 41.2491 35.8522 41.6017 34.6379 41.0024C33.4236 40.4031 32.5101 39.413 32.1147 38.2471C31.7193 37.0813 31.8421 35.7397 32.4414 34.5254C33.0407 33.3111 34.0308 32.3975 35.1967 32.0022C36.3625 31.6068 37.7041 31.7296 38.9184 32.3289C40.1327 32.9281 40.6148 34.1368 41.4416 35.0841C41.6376 35.3426 42.0713 35.5567 42.5917 35.8135L47.5357 25.7955L37.5177 20.8516C37.7746 20.3312 38.032 19.9189 38.2471 19.7015C39.1945 18.8747 40.4031 18.3926 41.0024 17.1783C41.6017 15.964 41.7244 14.6224 41.3291 13.4565C40.9337 12.2907 40.0202 11.3005 38.8059 10.7013C37.5916 10.102 36.25 9.9792 35.0841 10.3746C33.9183 10.77 32.9281 11.6835 32.3288 12.8978C31.7296 14.1121 32.0821 15.3647 32.0022 16.6195C32.0038 16.9439 31.7898 17.3776 31.533 17.898L21.515 12.9541L16.5711 22.972C16.0507 22.7152 15.6384 22.4578 15.421 22.2426C14.5942 21.2953 14.1121 20.0866 12.8978 19.4874C11.6835 18.8881 10.3419 18.7653 9.17602 19.1607C8.01016 19.5561 7.02001 20.4696 6.42075 21.6839Z"
                    fill="#EDB901"
                  />
                </svg>
              </div>
              <div className="top-7 bottom-0 left-20 m-auto absolute z-10 ">
                <svg
                  width="40"
                  height="39"
                  viewBox="0 0 40 39"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.2936 0C13.9395 0 12.6821 0.483614 11.8116 1.35412C10.9411 2.22463 10.4574 3.48202 10.4574 4.83614C10.4574 6.19026 11.3279 7.15749 11.8116 8.31817C11.9566 8.60834 11.9566 9.09195 11.9566 9.67229H0.785156V38.6891H11.9566C11.9566 38.1088 11.9083 37.6252 11.8116 37.335C11.3279 36.1744 10.4574 35.2071 10.4574 33.853C10.4574 32.4989 10.9411 31.2415 11.8116 30.371C12.6821 29.5005 13.9395 29.0169 15.2936 29.0169C16.6477 29.0169 17.9051 29.5005 18.7756 30.371C19.6461 31.2415 20.1297 32.4989 20.1297 33.853C20.1297 35.2071 19.2592 36.1744 18.7756 37.335C18.6305 37.6252 18.6305 38.1088 18.6305 38.6891H29.802V27.5177C30.3824 27.5177 30.866 27.566 31.1561 27.6627C32.3168 28.1464 33.284 29.0169 34.6382 29.0169C35.9923 29.0169 37.2497 28.5332 38.1202 27.6627C38.9907 26.7922 39.4743 25.5348 39.4743 24.1807C39.4743 22.8266 38.9907 21.5692 38.1202 20.6987C37.2497 19.8282 35.9923 19.3446 34.6382 19.3446C33.284 19.3446 32.3168 20.2151 31.1561 20.6987C30.866 20.8438 30.3824 20.8438 29.802 20.8438V9.67229H18.6305C18.6305 9.09195 18.6789 8.60834 18.7756 8.31817C19.2592 7.15749 20.1297 6.19026 20.1297 4.83614C20.1297 3.48202 19.6461 2.22463 18.7756 1.35412C17.9051 0.483614 16.6477 0 15.2936 0Z"
                    fill="#F55E00"
                  />
                </svg>
              </div>
              <div className="w-96 h-96 -z-40 relative">
                <BlobSmall1 />
              </div>
            </div>
          </section>
        </header>
        <main>
          <section className="flex my-10 flex-col items-center lg:mt-0 md:mt-20 justify-center w-full  font-Poppins">
            <h2 className="text-2xl text-black font-semibold">welcome to</h2>
            <h2 className="text-4xl text-main-color font-semibold">
              Tatuga School
            </h2>
          </section>

          <section
            className="w-ful h-full gap-10 mt-20 md:gap-10
           lg:gap-40 xl:gap-20 flex flex-col items-center"
          >
            <div className="w-max max-w-sm md:max-w-2xl text-center items-center  flex flex-col gap-2">
              <h1 className="text-main-color font-Poppins md:text-2xl lg:text-3xl xl:text-5xl font-bold ">
                What is Tutaga School?
              </h1>
              <h2 className="text-black mt-2  lg:mt-5 font-Kanit md:text-lg lg:text-2xl font-semibold ">
                Tatuga School คืออะไร?
              </h2>
              <span className="w-8/12 text-base md:text-lg">
                Tatuga School คือแพลตฟอร์มการจัดการข้อมูล และติดตามชั้นเรียน
                โดยโรงเรียนหรือองค์กร สามารถออกแบบการบริหารจัดการได้ด้วยตนเอง
                พร้อมกับการสรุปผลที่แม่นยำ ง่ายดาย และมีประสิทธิภาพ
              </span>
              <a
                target="_blank"
                href="https://www.facebook.com/TatugaCamp"
                className="px-2 md:px-10 w-max cursor-pointer select-none py-2 hover:ring-2 ring-black transition duration-150
                 hover:text-black active:scale-105 font-Kanit text-lg font-semibold
                  text-black hover:drop-shadow-md rounded-md no-underline
               bg-third-color"
              >
                ติดต่อทดลองใช้ Tatuga School Demo
              </a>
            </div>
          </section>

          {tatugaSchoolPosts.map((item, index) => {
            const odds = index % 2 === 0;

            return (
              <section
                id={item.tag}
                key={index}
                className="w-ful h-full gap-10 my-10 md:gap-10 lg:gap-40 xl:gap-20 flex flex-col items-center"
              >
                <div
                  className={`mt-10 items-center md:w-11/12 lg:w-10/12 flex justify-around h-full ${
                    !odds
                      ? "md:flex-row-reverse flex-col"
                      : "md:flex-row flex-col"
                  } `}
                >
                  <div className="xl:w-[25rem] xl:h-[25rem] md:w-[15rem] md:h-[15rem] w-80 h-80 group  relative">
                    <Image
                      src={item.mainImage.asset.url}
                      fill
                      onDragStart={preventDragHandler}
                      alt="tatuga camp"
                      className="object-contain select-none group-hover:scale-125 transition duration-150"
                      sizes="(max-width: 768px) 100vw, 700px"
                      placeholder="blur"
                      blurDataURL={item.mainImage.asset.metadata.lqip}
                    />
                  </div>
                  <div
                    className="w-72 text-start md:w-96 lg:w-max lg:min-w-[20rem] lg:max-w-md xl:max-w-xl
               h-max font-Kanit font-bold text-black text-4xl"
                  >
                    <div className="relative ">
                      <svg
                        className="absolute -top-7 -left-8 m-auto"
                        width="36"
                        height="37"
                        viewBox="0 0 36 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.9839 26.619L2.5 7.13507"
                          stroke="#F55E00"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M27.0923 22.4175L23.4023 2"
                          stroke="#F55E00"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                        <path
                          d="M17.84 30.2373L4.44824 28.6696"
                          stroke="#F55E00"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>

                      <h1 className="text-main-color font-Poppins md:text-2xl lg:text-3xl xl:text-5xl font-bold ">
                        {item.title}
                      </h1>
                      <h2 className="text-black mt-2 lg:mt-5 font-Kanit md:text-lg lg:text-2xl font-semibold ">
                        {item.subTitle}
                      </h2>
                    </div>
                    <div className=" font-normal text-base md:text-lg mt-0 md:mt-2">
                      <PortableText
                        value={item?.description}
                        components={myPortableTextComponents}
                      />
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </main>
        <footer>
          <MainFooter />
        </footer>
      </HomepageLayout>
    </div>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const tatugaSchoolPosts = await GetAllTatugaSchoolPostsSanityService();
  return {
    props: {
      tatugaSchoolPosts,
    },
  };
};
