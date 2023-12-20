import React, { useEffect } from 'react';
import Layout from '../../components/layout';
import Head from 'next/head';
import Card from '../../components/card-about-us/Card';
import Image from 'next/image';
import Facebook from '../../components/svg/social_logo/Facebook';
import Mail from '../../components/svg/social_logo/Mail';
import Phone from '../../components/svg/social_logo/Phone';
import Tiktok from '../../components/svg/social_logo/Tiktok';
import Instagram from '../../components/svg/social_logo/Instagram';
import CardProfile from '../../components/card-about-us/CardProfile';
import Blob3 from '../../components/svg/blobs/blob3';
import Blob4 from '../../components/svg/blobs/blob4';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import { Pagination, Autoplay, Grid } from 'swiper/modules';
import { sanityClient } from '../../sanity';
import Google from '../../components/svg/social_logo/Google';

const Index = ({ members, information }) => {
  const contacts = {
    name: 'Tatuga Camp',
    phone: '061-027-7960',
    email: 'tatugacamp@gmail.com',
  };

  const contactCSS =
    'text-[0.7rem] md:text-[0.8rem] lg:text-xl mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium';

  return (
    <Layout>
      {/* Banner */}

      <div className="flex flex-col items-center justify-center z-10 relative">
        <Head>
          <title>about us</title>
        </Head>
        <header></header>
        <main className="font-Poppins w-full max-w-7xl h-max flex flex-col justify-start items-center relative md:mt-0 mt-10 px-4 md:px-10 mb-10 ">
          {/* Contact */}
          <div className="w-full  flex items-start my-30 mx-20 mt-20">
            <section className="flex flex-col relative  md:w-[600px] lg:w-[800px] xl:w-max px-10 md:px-20 ">
              <span className="text-4xl md:text-5xl lg:text-7xl  font-semibold text-[#2C7CD1] leading-tight ">
                Contact Us
              </span>
              <span className="text-2xl lg:text-4xl xl:text-5xl font-Kanit font-semibold ">
                ติดต่อเรา
              </span>
              <div className="grid grid-cols-2 mt-4 md:mt-5">
                {/* left contact */}
                <ul className="flex flex-col ">
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

                {/* Right contact */}
                <ul className="flex flex-col">
                  <li className={contactCSS}>
                    <Phone />
                    {contacts.phone}
                  </li>
                  <li className={contactCSS}>
                    <Mail />
                    {contacts.email}
                  </li>
                  <li className={contactCSS}>
                    <Google />
                    {contacts.name}
                  </li>
                </ul>
              </div>
            </section>
          </div>

          {/* Information */}
          <div className="w-full my-10 mx-20 px-0 md:px-10">
            {information.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                subTitle={item.subtitle}
                info={item.description}
                image={item.mainImage}
                button={item.link}
                index={index}
              />
            ))}
          </div>

          {/* Introduction  */}
          <section className='w-[90%] h-full md:mt-10 lg:mt-15 md:gap-3 xl:gap-5 flex justify-center items-center"'>
            <div className="w-[300px] h-[150px] md:w-[500px] md:h-[300px] lg:w-[500px] lg:h-[500px] overflow-hidden relative">
              <Image
                src="https://storage.googleapis.com/tatugacamp.com/logo%20/tatugacamp%20facebook.jpg"
                fill
                className="object-contain"
                alt={`picture of tatugacamp-logo`}
              />
            </div>
            <div className="flex flex-col justify-center mr-5">
              <h2 className="text-main-color font-Poppins md:text-4xl lg:text-5xl xl:text-7xl font-bold ">
                Introducing our exceptional team
              </h2>
              <span className="mt-2 md:mt-5 text-[0.5rem] sm:text-xs md:text-xl font-semibold">
                wholeheartedly devoted to crafting enchanting and inspiring
                educational journeys.
              </span>
            </div>
          </section>

          {/* upper 1024px show-all-component */}
          <div className="hidden lg:block lg:w-full lg:my-10 lg:mx-20 lg:px-10">
            {members.map((profile, index) => {
              return (
                <CardProfile
                  key={index}
                  name={profile.name}
                  subTitle={profile.position}
                  info={profile.quote}
                  index={index}
                  image={profile.mainImage}
                />
              );
            })}
          </div>

          {/* lower 1024px show-only-one */}

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
            {members.map((profile, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="lg:hidden mt-10">
                    <CardProfile
                      name={profile.name}
                      subTitle={profile.position}
                      info={profile.quote}
                      index={index}
                      image={profile.mainImage}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </main>
      </div>
      {/* Blob */}
      <div className="absolute z-0 left-0 top-[60rem] w-8/12">
        <Blob4 />
      </div>
      <div className="absolute z-0 right-0 top-0 w-7/12">
        <Blob3 />
      </div>
    </Layout>
  );
};

export default Index;

export async function getStaticProps(content) {
  const queryMembers = `*[_type == "members"]{
    mainImage{
        asset->{
                url,
                metadata
              }
        },
    secondImage{
        asset->{
                url,
                metadata
              }
        },
    name,
      position,
      quote,
  }`;

  const queryInformation = `*[_type == "about-us-information"]{
    mainImage{
        asset->{
                url,
                metadata
              }
        },
    title,
    subtitle,
    description,
    link,
  }`;

  const members = await sanityClient.fetch(queryMembers);
  const information = await sanityClient.fetch(queryInformation);

  return {
    props: {
      members,
      information,
    },
  };
}
