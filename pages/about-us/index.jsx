import React from 'react'
import Layout from '../../components/layout';
import Head from 'next/head';
import Card from '../../components/card-aboutus/Card';
import Image from 'next/image';
import Facebook from '../../components/svg/social_logo/Facebook';
import Mail from '../../components/svg/social_logo/Mail';
import Phone from '../../components/svg/social_logo/Phone';
import Google from '../../components/svg/social_logo/Google';
import Tiktok from '../../components/svg/social_logo/Tiktok';
import Instagram from '../../components/svg/social_logo/Instagram';
import CardProfile from '../../components/card-aboutus/CardProfile';
import MockImg from '../../components/card-aboutus/MockImg';
import Blob3 from '../../components/svg/blobs/blob3';
import Blob4 from '../../components/svg/blobs/blob4';
import { Swiper, SwiperSlide } from 'swiper/react';
import { renderToString } from "react-dom/server";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/grid';

import { Pagination, Autoplay, Grid } from 'swiper/modules';

const index = () => {
    const contacts = 
        {
            name: 'Tatuga Camp',
            phone: '061-027-7960',
            email: 'tatugacamp@gmail.com'
        }

    const information = [
        {
            title: 'Who are we?',
            subTitle: 'พวกเราคือใคร',
            info: 'พวกเราคือกลุ่มเพื่อนนักศึกษาครูที่เริ่มต้นจากการจัดกิจกรรมค่าย ภาษาอังกฤษ ในระหว่างเรียนมหาวิทยาลัย ด้วยความเชื่อเดียวกันที่ว่า “การเรียนอย่างมีความสุขคือการเรียนที่ดีที่สุด” พวกเราจึงรวมกลุ่มกัน ภายใต้ชื่อ “Tatuga Camp” เพื่อจัดค่ายภาษาอังกฤษผ่านรูปแบบกิจกรรม และเกมที่สนุกสนานมุ่งเน้นให้ผู้เรียนได้ใช้ทักษะจริง ด้วยความตั้งใจ ที่จะสร้างแรงบันดาลใจและจุดประกายไฟแห่งการเรียนรู้ให้แก่ผู้เรียน',
            button: true,
        },
        {
            title: 'Not just an English Camp',
            subTitle: 'ไม่ใช่แค่ค่ายภาษาอังกฤษ',
            info: 'พวกเราเติบโตขึ้นและเริ่มต้นการเป็น Tatuga Camp ด้วยค่ายภาษาอังกฤษ แต่พวกเรายังคงมีแนวคิดที่จะพัฒนาและมีความต้องการที่จะสร้างนวัตกรรมใหม่ ๆ ให้กับการศึกษา เพื่อตอบสนองความต้องการของ “ครู” และ “นักเรียน” เราจึงเริ่มพัฒนาสื่อการเรียนรู้ เช่น บอร์ดเกม การ์ดเกม “Array Around” และอื่น ๆ อีกมากมาย เพื่อเป็นสื่อการเรียนรู้ทั้งในห้องเรียนและนอกห้องเรียน ตลอดจนการพัฒนาเว็บไซต์เพื่อจัดการชั้นเรียนออนไลน์ “Tatuga Class” และ “Tatuga School” ด้วยความหวังที่จะพัฒนาแพลตฟอร์มการจัดการชั้นเรียน ที่เข้าใจบริบทการเรียนของประเทศไทย เพื่อความสะดวก รวดเร็ว และง่ายดาย ต่อครูผู้สอนและโรงเรียน ในการบริหารจัดการชั้นเรียนและข้อมูลต่าง ๆ อย่างครบครัน',
            button: false,
        },
        {
            title: 'Our goals',
            subTitle: 'เป้าหมายของเรา',
            info: 'พวกเรายังคงมุ่งมั่นที่จะพัฒนาแพลตฟอร์มของเราให้เป็นพื้นที่แห่งการเรียนรู้ และการแบ่งปันสำหรับทุกคน ในขณะเดียวกันเรายังต้องการเป็นหนึ่งในตัวช่วย ที่จะทำให้ครูและโรงเรียนทำงานได้อย่างสะดวกสบาย และง่ายดายขึ้น ผ่านพวกเรา Tatuga Camp และด้วยความตั้งใจที่จะสร้างแรงบันดาลใจ แห่งการเรียนรู้และเติมเต็มการเรียนรู้ของทุกคนให้เต็มไปด้วยความสุข และความสนุกสนาน เปรียบเสมือนดั่งการผจญภัย Tatuga Camp - where learning becomes an adventures',
            button: false,
        },
    ]

    
    const profile = [
        {
            profileName: 'Permlap Phola',
            role:'Founder & CEO and Developer Manager',
            quote:'Creating a positive environment is the must when starting to teach.',
        },{
            profileName: 'Sunitcha Kritsanasuwan',
            role:'Co-founder and Secretary',
            quote:'Accepting what we don\'t know is part of learning.', 
        },{
            profileName: 'Satawat Pichimphli',
            role:'Co-founder & Product manager',
            quote:'Everything is connecting the dots as well as learning.', 
        },{
            profileName: 'Thitiworada Hanthae',
            role:'Co-founder and Design Manager',
            quote:'Learning is an ongoing journey that extends beyond the classroom.', 
        },{
            profileName: 'Thanathip Buates',
            role:'Co-founder & Marketing manager',
            quote:'Education is the bridge that connects us to a deeper understanding of the world and each other.', 
        }
        ,{
            profileName: 'Airiya Chinakan',
            role:'Co-founder & Human resource manager',
            quote:'Don\'t hesitate to admit when you have no idea, as it\'s the starting point for everyone\'s learning.', 
        }
        ,{
            profileName: 'Chanidapa Praneetpolklang',
            role:'Product designer',
            quote:'Learning is a lifelong journey. Embrace curiosity and never stop seeking knowledge.', 
        },{
            profileName: 'Pawarit Tengwattana',
            role:'Marketing',
            quote:'There\'s always earning in learning. When we learn something, we earn something.', 
        },{
            profileName: 'Athiwat Srikhiaotrakool',
            role:'Legal Counsel',
            quote:'Education never ends, It is a series of lessons, with the greatest for the last.', 
        }
            
        
            
    ]

    const contactCSS = 'text-[0.7rem] md:text-[0.8rem] lg:text-xl mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium'

    const svgString = renderToString(Blob3());
    const svgDataURL = `data:image/svg+xml;base64,${btoa(svgString)}`;

    const MaskText =  {
        position: 'absolute',
        right: 0,
        width: '7/12',
        background: `url("${svgDataURL}")`,
        backgroundSize: 'cover',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        
      };
    
    
  return (
    <Layout>
        {/* Banner */}
        <div className='w-full h-[250px] md:h-[400px] my-0 relative bg-cover bg-center z-20' style={{ backgroundImage: 'url("http://www.color-hex.com/palettes/26323.png")' }} > 

                    <h2 className='font-Poppins text-5xl sm:text-7xl md:text-9xl  lg:text-[9rem] leading-none font-semibold
                    absolute left-[10%] bottom-0 top-[83%] md:top-[275px]  z-10' style={MaskText}  >About us</h2>
                    
                
                    <h2 className='font-Poppins text-5xl sm:text-7xl md:text-9xl  lg:text-[9rem] leading-none font-semibold
                    absolute left-[10%] bottom-0 top-[83%] md:top-[275px] text-white'>About us</h2>
                
        </div>
                    

        <div className='flex flex-col items-center justify-center z-10 relative'>
            <Head>
                <title>about us</title>
            </Head>
            <header>

            </header>
            <main className='font-Poppins w-full max-w-7xl h-max flex flex-col justify-start items-center relative md:mt-0 mt-10 px-4 md:px-10 mb-10 '>
                

                {/* Contact */}
                <div className='w-full  flex items-start my-30 mx-20 mt-20'>
                    <section className='flex flex-col relative  md:w-[600px] lg:w-[800px] xl:w-max px-10 md:px-20 '>
                        <span className="text-4xl md:text-5xl lg:text-7xl  font-semibold text-[#2C7CD1] leading-tight ">
                            Contact Us
                        </span>
                        <span className='text-2xl lg:text-4xl xl:text-5xl font-Kanit font-semibold '>ติดต่อเรา</span>
                        <div className='grid grid-cols-2 mt-4 md:mt-5'>
                            {/* left contact */}
                            <ul className='flex flex-col '>
                                <li className = {contactCSS}><Facebook />{contacts.name}</li>
                                <li className = {contactCSS}><Instagram/>{contacts.name}</li>
                                <li className = {contactCSS}><Tiktok/>{contacts.name}</li>
                            </ul>
                                
                            {/* Right contact */}
                            <ul className='flex flex-col'>
                                <li className= {contactCSS}><Phone/>{contacts.phone}</li>
                                <li className= {contactCSS}><Mail/>{contacts.email}</li>
                                <li className={contactCSS}><Instagram/>{contacts.name}</li>
                            </ul>
                                
                        </div>
                    </section>
                </div>
                

                {/* Information */}
                <div className='w-full my-10 mx-20 px-0 md:px-10'>
                {information.map((item, index) => (
                <Card
                    key={index}
                    title={item.title}
                    subTitle={item.subTitle}
                    info={item.info}
                    button={item.button}
                    index={index}
                />
            ))}
                </div>

                {/* Introduction  */}
                <section className='w-[90%] h-full md:mt-10 lg:mt-15 md:gap-3 xl:gap-5 flex justify-center items-center"'>
                    <MockImg/>
                    <div className='flex flex-col justify-center mr-5'>
                        <h2 className='text-main-color font-Poppins md:text-4xl lg:text-5xl xl:text-7xl font-bold ' >
                            Introducing our exceptional team
                        </h2>
                        <span className='mt-2 md:mt-5 text-xs md:text-xl font-semibold'>
                        wholeheartedly devoted to crafting enchanting and inspiring educational journeys.
                        </span>
                        
                    </div>
                </section>
                
                {/* upper 1024px show-all-component */}
                <div className='hidden lg:block lg:w-full lg:my-10 lg:mx-20 lg:px-10'>

                    {profile.map((profile,index) => (
                        <CardProfile
                        key={index}
                        title={profile.profileName}
                        subTitle={profile.role}
                        info={profile.quote}
                        index={index}
                        />
                    ))}
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
                {profile.map((profile,index) => {
                    return (
                        <SwiperSlide>
                            <div className='lg:hidden mt-10'>
                            <CardProfile
                                key={index}
                                title={profile.profileName}
                                subTitle={profile.role}
                                info={profile.quote}
                                index={index}
                        />
                            </div>
                           
                        </SwiperSlide>
                    )
                })}
                    
                </Swiper>
            
                
            </main>
        </div>
                {/* Blob */}
                 <div className="absolute z-0 left-0 top-[60rem] w-8/12">
                        <Blob4/>
                    </div>
                    <div className="absolute z-0 right-0 top-0 w-7/12">
                        <Blob3 />
                    </div>
    </Layout>
    
  )
}

export default index
