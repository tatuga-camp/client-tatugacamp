import React from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import {
  FaPlaneDeparture,
  FaLaptop,
  FaChalkboardTeacher,
  FaHotel,
  FaCheckCircle,
} from "react-icons/fa";
import HomepageLayout from "../../layouts/homePageLayout";
import SEOHead from "../../components/seo/SEOHead";
import TrainerCard from "../../components/become-a-trainer/TrainerCard";
import { GetTrainersSanityService } from "../../sanity/services";
import { Trainer } from "../../sanity/sanity-models";
import Facebook from "../../components/svgs/social_logo/Facebook";
import Instagram from "../../components/svgs/social_logo/Instagram";
import Tiktok from "../../components/svgs/social_logo/Tiktok";
import Phone from "../../components/svgs/social_logo/Phone";
import Mail from "../../components/svgs/social_logo/Mail";
import Blob3 from "../../components/svgs/blobs/big-blobs/blob3";
import Blob4 from "../../components/svgs/blobs/big-blobs/blob4";

const lookingFor = [
  {
    icon: <FaPlaneDeparture />,
    title: "Travelers",
    description:
      "Exploring Thailand and want to do something meaningful along the way? Join a camp for a few days and leave a real mark.",
  },
  {
    icon: <FaLaptop />,
    title: "Freelancers",
    description:
      "Between projects or working remotely? Step away from the screen and spend a short time teaching and playing with Thai students.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "First-time teachers",
    description:
      "Curious about teaching English? Our camps are a friendly, supported way to get your first classroom experience.",
  },
];

const Index = ({ trainers }: { trainers: Trainer[] }) => {
  const contacts = {
    name: "Tatuga Camp",
    phone: "+66 061 027 7960",
    email: "permlap@tatugacamp.com",
  };

  const contactCSS =
    "text-[0.7rem] md:text-[0.8rem] lg:text-xl mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium";

  return (
    <HomepageLayout>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <SEOHead />
        <Head>
          <title>Become a Trainer - Teach English at a Thai Camp</title>
          <meta
            name="title"
            content="Become a Trainer - Teach English at a Thai Camp | Tatuga Camp"
          />
          <meta
            name="description"
            content="Native or non-native English speakers welcome! Join Tatuga Camp as a short-term English camp trainer in Thailand. We support travel costs and hotel. Perfect for travelers and freelancers who want real teaching experience with Thai students."
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Become a Trainer - Teach English at a Thai Camp | Tatuga Camp"
          />
          <meta
            property="og:description"
            content="Native or non-native English speakers welcome! Join Tatuga Camp as a short-term English camp trainer in Thailand. We support travel costs and hotel."
          />
          <meta
            property="og:image"
            content="https://storage.googleapis.com/tatugacamp.com/thumnail/WordCloud.app.jpg"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="600" />
          <meta
            name="keywords"
            content="teach English in Thailand, English camp trainer, short term teaching Thailand, volunteer English teacher, Tatuga Camp, teach Thai students, travel and teach"
          />
          <meta
            name="viewport"
            content="width=device-width; initial-scale=1.0;"
          />
          <meta charSet="UTF-8" />
        </Head>

        <main className="relative mb-10 mt-10 flex h-max w-full max-w-7xl flex-col items-center justify-start px-4 font-Poppins md:mt-0 md:px-10">
          {/* Hero */}
          <section className="mt-20 flex w-full flex-col items-center px-4 text-center md:px-20">
            <h1 className="text-4xl font-semibold leading-tight text-main-color md:text-5xl lg:text-7xl">
              Teach English at a Thai Camp
            </h1>
            <p className="mt-4 max-w-3xl text-sm font-medium md:text-xl">
              Native or non-native English speaker — you are welcome. Join
              Tatuga Camp for a short time, teach English to Thai students
              through games and activities, and make memories that last a
              lifetime.
            </p>
            <a href="#contact" className="no-underline">
              <button className="mt-6 cursor-pointer rounded-full border-0 bg-second-color px-8 py-3 font-Poppins text-base font-semibold text-white transition duration-150 hover:bg-main-color md:text-xl">
                Contact Us
              </button>
            </a>
          </section>

          {/* Who we're looking for */}
          <section className="mt-16 w-full md:mt-24">
            <h2 className="text-center text-2xl font-semibold text-main-color md:text-4xl">
              Who we are looking for
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {lookingFor.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-main-color text-2xl text-white">
                    {item.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold md:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 md:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* What we support */}
          <section className="mt-16 w-full rounded-3xl bg-second-color p-8 text-white md:mt-24 md:p-12">
            <h2 className="text-center text-2xl font-semibold md:text-4xl">
              We take care of you
            </h2>
            <ul className="mt-8 grid list-none grid-cols-1 gap-6 pl-0 md:grid-cols-3">
              <li className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl">
                  <FaPlaneDeparture />
                </span>
                <span className="mt-3 text-lg font-semibold">
                  Travel cost support
                </span>
                <span className="mt-1 text-sm md:text-base">
                  We support your travel costs to the camp.
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl">
                  <FaHotel />
                </span>
                <span className="mt-3 text-lg font-semibold">
                  Hotel included
                </span>
                <span className="mt-1 text-sm md:text-base">
                  Need to stay overnight? We arrange and cover your hotel.
                </span>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="text-3xl md:text-4xl">
                  <FaCheckCircle />
                </span>
                <span className="mt-3 text-lg font-semibold">
                  No certificate needed
                </span>
                <span className="mt-1 text-sm md:text-base">
                  No formal teaching certificate required — just energy and a
                  love of working with kids.
                </span>
              </li>
            </ul>
          </section>

          {/* Trainers who joined us */}
          {trainers.length > 0 && (
            <section className="mt-16 w-full md:mt-24">
              <h2 className="text-center text-2xl font-semibold text-main-color md:text-4xl">
                Trainers who joined us
              </h2>
              <p className="mt-2 text-center text-sm font-medium md:text-base">
                Hear it from the travelers and freelancers who already taught
                with us.
              </p>

              {/* upper 1024px: grid */}
              <div className="mt-8 hidden lg:grid lg:grid-cols-3 lg:justify-items-center lg:gap-8">
                {trainers.map((trainer, index) => (
                  <TrainerCard key={index} trainer={trainer} />
                ))}
              </div>

              {/* lower 1024px: carousel */}
              <div className="mt-8 lg:hidden">
                <Swiper
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination, Autoplay]}
                >
                  {trainers.map((trainer, index) => (
                    <SwiperSlide key={index}>
                      <div className="flex justify-center pb-10">
                        <TrainerCard trainer={trainer} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>
          )}

          {/* Contact CTA */}
          <section
            id="contact"
            className="mt-16 flex w-full flex-col items-center md:mt-24"
          >
            <h2 className="text-center text-2xl font-semibold text-main-color md:text-4xl">
              Ready to join us?
            </h2>
            <p className="mt-2 max-w-2xl text-center text-sm font-medium md:text-base">
              Send us a message on any channel below and tell us when you are
              traveling in Thailand — we will find a camp that fits your plans.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-10 md:gap-x-20">
              <ul className="flex list-none flex-col pl-0">
                <li className={contactCSS}>
                  <Facebook />
                  {contacts.name}
                </li>
                <li className={contactCSS}>
                  <Instagram />
                  {contacts.name}
                </li>
                <li className={contactCSS}>
                  <Tiktok />
                  {contacts.name}
                </li>
              </ul>
              <ul className="flex list-none flex-col pl-0">
                <li className={contactCSS}>
                  <Phone />
                  {contacts.phone}
                </li>
                <li className={contactCSS}>
                  <Mail />
                  {contacts.email}
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      {/* Blob */}
      <div className="absolute left-0 top-[60rem] z-0 w-8/12">
        <Blob4 />
      </div>
      <div className="absolute right-0 top-0 z-0 w-7/12">
        <Blob3 />
      </div>
    </HomepageLayout>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const trainers = await GetTrainersSanityService();
  return {
    props: {
      trainers,
    },
  };
};
