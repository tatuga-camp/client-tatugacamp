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
import PropTatugaCamp from '../../components/svg/blobs/blob2';
import Blob1 from '../../components/svg/blobs/blob1';
import CardProfile from '../../components/card-aboutus/CardProfile';
import MockImg from '../../components/card-aboutus/MockImg';

const index = () => {
    const contacts = 
        {
            name: 'Tatuga Camp',
            phone: '061-027-7960',
            email: 'tatugacamp@gmail.com'
        }
    
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

    
    
  return (
    <Layout>
        {/* Banner */}
        <div className='w-full h-[300px] bg-slate-200 mt-0'> 
                    Mockup Banner
        </div>

        <div className="absolute z-auto right-left top-[70%] w-8/12 scale-x-[-1]">
            <PropTatugaCamp />
        </div>
        <div className="absolute z-auto right-0 top-[-40%] w-8/12">
            <Blob1 />
        </div>
        <div className='flex flex-col items-center justify-center'>
            <Head>
                <title>about us</title>
            </Head>
            <header>

            </header>
            <main className='font-Poppins w-full max-w-7xl h-max flex flex-col justify-start items-center relative md:mt-0 mt-10 px-4 md:px-10 '>
                

                {/* Contact */}
                <div className='w-full  flex items-start my-10 mx-20 mt-20'>
                    <section className='flex flex-col relative  md:w-[600px] lg:w-[800px] xl:w-max px-10 md:px-20 '>
                        <span className="text-4xl md:text-5xl lg:text-7xl  font-semibold text-[#2C7CD1] leading-tight ">
                            Contact Us
                        </span>
                        <span className='text-2xl lg:text-4xl xl:text-5xl font-Kanit font-semibold '>ติดต่อเรา</span>
                        <div className='grid grid-cols-2 mt-4 md:mt-5'>
                            {/* left contact */}
                            <ul className='flex flex-col '>
                                <li className='text-[3vw] md:text-[2.5vw] lg:text-[1.5vw] mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium'><Facebook />{contacts.name}</li>
                                <li className='text-[3vw] md:text-[2.5vw] lg:text-[1.5vw] mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium'><Instagram/>{contacts.name}</li>
                                <li className='text-[3vw] md:text-[2.5vw] lg:text-[1.5vw] mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium'><Tiktok/>{contacts.name}</li>
                            </ul>
                                
                            {/* Right contact */}
                            <ul className='flex flex-col'>
                                <li className='text-[3vw] md:text-[2.5vw] lg:text-[1.5vw] mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium'><Phone/>{contacts.phone}</li>
                                <li className='text-[3vw] md:text-[2.5vw] lg:text-[1.5vw] mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium'><Mail/>{contacts.email}</li>
                                <li className='text-[3vw] md:text-[2.5vw] lg:text-[1.5vw] mb-2 md:mb-4 flex items-center gap-1 md:gap-3 font-medium'><Instagram/>{contacts.name}</li>
                            </ul>
                                
                        </div>
                    </section>
                </div>
                

                {/* Information */}
                <div className='w-full my-10 mx-20 px-0 md:px-10'>
                    <div className='max-w-[1240px] mx-auto grid lg:grid-cols-2'>
                        <div className='py-10'>
                            <Card 
                            title='Who are we?'
                            subTitle='พวกเราคือใคร'
                            info='พวกเราคือกลุ่มเพื่อนนักศึกษาครูที่เริ่มต้นจากการจัดกิจกรรมค่าย
                            ภาษาอังกฤษ ในระหว่างเรียนมหาวิทยาลัย ด้วยความเชื่อเดียวกันที่ว่า “การเรียนอย่างมีความสุขคือการเรียนที่ดีที่สุด” พวกเราจึงรวมกลุ่มกัน ภายใต้ชื่อ “Tatuga Camp” เพื่อจัดค่ายภาษาอังกฤษผ่านรูปแบบกิจกรรม
                            และเกมที่สนุกสนานมุ่งเน้นให้ผู้เรียนได้ใช้ทักษะจริง ด้วยความตั้งใจ
                            ที่จะสร้างแรงบันดาลใจและจุดประกายไฟแห่งการเรียนรู้ให้แก่ผู้เรียน'/>
                            <button className='my-8 ml-10 bg-[#2C7CD1] text-white hover:bg-[#629ede] font-bold py-2 px-8 md:px-12 rounded-xl'>{'SEE MORE >>'}</button>
                        </div>
                        <div className='flex justify-center items-center'>
                            <MockImg/>
                        </div>
                    </div>
                    
                    <div className='max-w-[1240px] mx-auto lg:grid lg:grid-cols-2 flex flex-col-reverse'>
                         <div className='flex justify-center items-center'>
                         <MockImg/>
                        </div>
                        <div className='py-10'>
                            <Card 
                            title='Not just an English Camp'
                            subTitle='ไม่ใช่แค่ค่ายภาษาอังกฤษ'
                            info='พวกเราเติบโตขึ้นและเริ่มต้นการเป็น Tatuga Camp ด้วยค่ายภาษาอังกฤษ แต่พวกเรายังคงมีแนวคิดที่จะพัฒนาและมีความต้องการที่จะสร้างนวัตกรรมใหม่ ๆ ให้กับการศึกษา เพื่อตอบสนองความต้องการของ “ครู” และ “นักเรียน” เราจึงเริ่มพัฒนาสื่อการเรียนรู้ เช่น บอร์ดเกม การ์ดเกม “Array Around” และอื่น ๆ อีกมากมาย เพื่อเป็นสื่อการเรียนรู้ทั้งในห้องเรียนและนอกห้องเรียน
                            ตลอดจนการพัฒนาเว็บไซต์เพื่อจัดการชั้นเรียนออนไลน์ “Tatuga Class” และ
                            “Tatuga School” ด้วยความหวังที่จะพัฒนาแพลตฟอร์มการจัดการชั้นเรียน
                            ที่เข้าใจบริบทการเรียนของประเทศไทย เพื่อความสะดวก รวดเร็ว และง่ายดาย ต่อครูผู้สอนและโรงเรียน ในการบริหารจัดการชั้นเรียนและข้อมูลต่าง ๆ อย่างครบครัน'/>
                            
                        </div>
                        
                    </div>

                    <div className='max-w-[1240px] mx-auto grid lg:grid-cols-2 mt-10'>
                        <div>
                            <Card 
                            title='Our goals'
                            subTitle='เป้าหมายของเรา'
                            info='พวกเรายังคงมุ่งมั่นที่จะพัฒนาแพลตฟอร์มของเราให้เป็นพื้นที่แห่งการเรียนรู้ และการแบ่งปันสำหรับทุกคน ในขณะเดียวกันเรายังต้องการเป็นหนึ่งในตัวช่วย
                            ที่จะทำให้ครูและโรงเรียนทำงานได้อย่างสะดวกสบาย และง่ายดายขึ้น
                            ผ่านพวกเรา Tatuga Camp และด้วยความตั้งใจที่จะสร้างแรงบันดาลใจ
                            แห่งการเรียนรู้และเติมเต็มการเรียนรู้ของทุกคนให้เต็มไปด้วยความสุข 
                            และความสนุกสนาน เปรียบเสมือนดั่งการผจญภัย 
                            Tatuga Camp - where learning becomes an adventures'/>
                           
                        </div>
                        <div className='flex justify-center items-center'>
                            <MockImg/>
                            
                        </div>
                    </div>
                    
                </div>

                {/* Introduction  */}
                <section className='w-ful h-full mt-20 md:gap-3 xl:gap-5 flex justify-center items-center"'>
                    <Image
                        src='https://storage.googleapis.com/tatugacamp.com/logo%20/tatugacamp%20facebook.jpg'
                        width={500}
                        height={500}
                        alt='Tatugacamp logo'
                        sizes='(max-width: 350px),33vw'
                    />
                    <div className='flex flex-col justify-center mr-5'>
                        <h2 className='text-main-color font-Poppins md:text-4xl lg:text-5xl xl:text-7xl font-bold ' >
                            Introducing our 
                        </h2>
                        <h2 className='text-main-color font-Poppins md:text-4xl lg:text-5xl xl:text-7xl font-bold ' >
                            exceptional team
                        </h2>
                        <span className='w-10/12 mt-2 md:mt-5 text-[2vw] md:text-xl font-semibold'>
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
                
            
                
            </main>
        </div>
        
    </Layout>
    
  )
}

export default index
