import React from 'react'
import Empertise from '../svg/social_logo/empertise';
import MockImg from './MockImg';
import DoubleQuote from '../svg/social_logo/doubleQuote';

function CardProfile({index,title, subTitle, info}) {
    const isOdd = index % 2 !== 0;
  return (
    <div className='flex justify-center'>

        <div className={`flex ${isOdd ? 'flex-row-reverse' : ''} `}>
            <MockImg/>
            <div className='flex flex-col justify-center mx-3 md:mx-10'>
                <h2 className='text-main-color text-start font-Poppins text-base md:text-3xl lg:text-4xl font-semibold'>{title}</h2>
                <h1 className='text-black text-start font-Poppins text-xs md:text-xl font-semibold'>{subTitle}</h1>

                <div className='relative mt-2 md:mt-5 max-w-[20rem]'>
                    <div className='absolute top-0 left-0 max-w-[10px] md:max-w-[20px]'>
                        <DoubleQuote/>
                    </div>
                    <p className='p-3  md:p-15  text-center text-[0.5rem] md:text-base'>{info}</p>
                    <div className='absolute bottom-0 right-0 max-w-[10px]  md:max-w-[20px]'>
                        <DoubleQuote/>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default CardProfile
