import { Disclosure } from "@headlessui/react";
import { Skeleton } from "@mui/material";
import { PortableText } from "@portabletext/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useInView } from "react-intersection-observer";
import ReactPlayer from "react-player";
import NumberAnimated from "../../components/animations/numberAnimated";
import { cardData } from "../../data/card-classroom";
import { myPortableTextComponents } from "../../data/portableContent";
import HomepageLayout from "../../layouts/homePageLayout";
import {
  GetAllCommonQuestiontsSanityService,
  ResponseGetAllCommonQuestiontsSanityService,
} from "../../sanity/services";
import { IoIosAlert } from "react-icons/io";
import Facebook from "../../components/svgs/social_logo/Facebook";
import { IoHappy } from "react-icons/io5";
type IndexProps = {
  commonQuestions: ResponseGetAllCommonQuestiontsSanityService;
};

function Index({ commonQuestions }: IndexProps) {
  const router = useRouter();
  const usersNumber = 24.5;
  const studentNumber = 882;
  const [loading, setLoading] = useState(true);
  const footerData = `ห้องเรียนจาก Tatuga class หรือ ทาทูก้าคลาส ที่จะพาคุณครูไปสู่การบริหารห้องเรียนอย่างสะดวกและสนุก กับ tatuga class TaTuga Class Classroom Management for Everyone จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ รวดเร็ว - tatuga class`;
  const [domLoaded, setDomLoaded] = useState(false);
  const [classroomCode, setClassroomCode] = useState<string>();
  const style = {
    height: "100%",
  };
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  function handleVideoReady() {
    setLoading(false);
  }

  return (
    <div className="min-h-screen  bg-gradient-to-b  from-white from-20% to-80%   to-blue-500   bg-cover pb-20">
      <Head>
        <meta
          property="og:title"
          content="Tatuga class - เว็บไซต์จัดการชั้นเรียน"
        />
        <meta
          property="og:description"
          content="จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ รวดเร็ว - tatuga class"
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/Word%20cloud%20-%20tatuga%20class.jpg"
        />
        <meta
          property="og:image:secure_url"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/Word%20cloud%20-%20tatuga%20class.jpg"
        />
        <meta
          name="twitter:image:src"
          content="https://storage.googleapis.com/tatugacamp.com/thumnail/Word%20cloud%20-%20tatuga%20class.jpg"
        />
        <meta
          name="keywords"
          content={`TaTuga camp, tatugacamp, tatuga camp, English, English camp, camp for 
            learning English, card game, activities in classroom, กิจกรรมค่ายภาษาอังกฤษ,
             การ์ดเกมเพื่อการเรียนรู้, การ์ดเกม, `}
        />
        <meta
          name="description"
          content="จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ รวดเร็ว - tatuga class"
        />
        <title>Tatuga class - เว็บไซต์จัดการชั้นเรียน</title>
        <meta
          name="viewport"
          content="width=device-width; initial-scale=1.0;"
        />
        <meta charSet="UTF-8" />
      </Head>
      <HomepageLayout>
        <header className="w-full max-w-9xl pt-10 flex-col xl:flex-row   h-max  flex justify-center items-center gap-12 font-sans">
          <div className="lg:w-max lg:max-w-4xl relative z-20 bg-transparent lg:ml-5 xl:pl-10 p-10 gap-2 flex flex-col items-start justify-center ">
            <div className="md:mt-5 mt-10">
              <span className="font-medium text-gray-400 md:text-lg lg:text-xl ">
                welcome to
              </span>
            </div>
            <div className="flex flex-col w-full gap-0 md:gap-1 lg:gap-1 xl:gap-5 ">
              <span className="font-Poppins font-bold  text-[#2C7CD1] text-3xl md:text-4xl lg:text-6xl xl:text-7xl w-max">
                Tatuga Class
              </span>
              <span className="text-[#2C7CD1] md:text-2xl lg:text-2xl font-bold font-Poppins relative z-10 ">
                Classroom Management for Everyone
              </span>
            </div>
            <div className="mt-1 font-Kanit text-lg w-3/4 leading-tight relative z-10">
              <span className="text-blue-900">
                จัดการชั้นเรียนและบริหารห้องเรียนอย่างมีประสิทธิภาพ สะดวก และ
                รวดเร็ว - tatuga class
              </span>
            </div>
            <div className="md:w-3/4 md:flex hidden   gap-2 items-center justify-center  ">
              <div className="w-96 font-Kanit font-bold text-blue-900">
                <div className="w-max">
                  <span className="text-2xl ">สำหรับนักเรียน</span>
                </div>
              </div>
              <input
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                className="bg-blue-200 ring-2  ring-black appearance-none border-none border-gray-200 rounded w-full py-2 px-4  
              leading-tight focus:outline-none focus:bg-blue-400 focus:border-2 focus:right-4 placeholder:text-md 
              placeholder:text-black text-lg font-Poppins placeholder:text-md placeholder:font-Kanit placeholder:font-medium focus:placeholder:text-white text-black focus:text-white font-semibold "
                type="number"
                name="classroomCode"
                placeholder="รหัสห้องเรียน"
                maxLength={6}
              />
              <button
                onClick={() =>
                  router.push({
                    pathname: `${process.env.NEXT_PUBLIC_CLIENT_STUDENT_URL}/classroom/student`,
                    query: {
                      classroomCode: classroomCode,
                    },
                  })
                }
                className="w-full  h-9   rounded-full bg-[#EDBA02] text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                เข้าร่วม
              </button>
            </div>
            <div className="flex  w-full items-center justify-center md:justify-start  gap-5  mt-2">
              <div className="text-2xl font-Kanit font-bold text-blue-900">
                สำหรับครู
              </div>
              <Link
                href={"/classroom/teacher"}
                className="w-40 no-underline text-center flex items-center justify-center
                  h-9  rounded-full bg-[#2C7CD1] hover:scale-110 transition duration-150 text-white font-sans font-bold
              text-md cursor-pointer hover: active:border-2  active:border-gray-300
               active:border-solid  focus:border-2 
              focus:border-solid"
              >
                จัดการชั้นเรียน
              </Link>
            </div>
          </div>

          {domLoaded && (
            <div className=" flex justify-center items-center flex-col">
              <div className=" md:w-[35rem] md:h-[20rem] w-72 h-40 rounded-md overflow-hidden ">
                <ReactPlayer
                  onReady={handleVideoReady}
                  loop={true}
                  playsinline
                  controls
                  width="100%"
                  height="100%"
                  url="https://player.vimeo.com/video/829310227?h=47849a81e3"
                />
              </div>
            </div>
          )}
        </header>

        <main className="flex font-Kanit items-center pt-5  justify-start mt-5  flex-col gap-10">
          <section className="w-11/12 md:w-9/12 flex flex-col items-center  gap-3">
            <a
              target="_blank"
              href="https://www.facebook.com/share/p/1BMoLTarhf/"
              className="text-xs no-underline md:text-lg flex items-center justify-center gap-2 text-white"
            >
              สามารถติดตามรายละเอียดได้ที่ FACEBOOK <Facebook />
            </a>
            <h1 className="text-5xl md:text-7xl flex flex-col text-center font-semibold text-white">
              ปิดการใช้งาน <span>Tatuga School!</span>
            </h1>
            <a
              target="_blank"
              href="https://www.facebook.com/share/p/1BMoLTarhf/"
              className="w-max text-sm md:text-lg text-red-700  no-underline font-semibold flex items-center justify-center gap-2 bg-white rounded-md px-3"
            >
              <IoIosAlert />
              แจ้งการปิดเว็บไซต์ Tatuga Class
            </a>
            <span className="text-xs  md:text-lg text-white text-center">
              พวกเราชาว tatuga ได้ตัดสินใจยุติให้บริการเว็บไซต์ tatuga class
              โดยจะเริ่มลบข้อมูลทั้งหมดและปิดการให้บริการ ณ วันที่ 1 เมษายน 2568
            </span>
          </section>
          <div className="w-80 h-[2px] bg-white" />
          <section className="w-11/12 flex flex-col items-center gap-3">
            <a
              href="https://tatugaschool.com/"
              className="text-xs md:text-lg no-underline flex items-center justify-center gap-2 text-white"
            >
              สามารถเริ่มทดสอบใช้งานได้ที่{" "}
              <Image
                src="/svgs/tatuga-school.svg"
                width={20}
                height={20}
                alt="logo tatuga school"
              />
            </a>
            <h1 className="text-5xl md:text-7xl text-center flex flex-col font-semibold text-white">
              มาเริ่มใช้ <span>Tatuga School!</span>
            </h1>
            <a
              href="https://tatugaschool.com"
              className="w-max text-sm md:text-lg no-underline text-blue-700 font-semibold flex items-center justify-center gap-2 bg-white rounded-md px-3"
            >
              <IoHappy />
              ใช้งานได้เหมือนเดิม เพิ่มเติมคือเจ๋งกว่า คลิก
            </a>
            <span className="text-xs text-white text-center"></span>
          </section>
        </main>
      </HomepageLayout>
    </div>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async () => {
  const commonQuestions = await GetAllCommonQuestiontsSanityService();
  return {
    props: {
      commonQuestions,
    },
  };
};
