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
            <div className='flex flex-col justify-center mx-10'>
                <h2 className='text-main-color font-Poppins text-4xl font-semibold'>{title}</h2>
                <h1 className='text-black font-Poppins text-xl font-semibold'>{subTitle}</h1>

                <div className='relative  mt-5 w-[400px]'>
                    <div className='absolute top-5 left-10'>
                        <DoubleQuote/>
                    </div>
                    <p className='px-20 py-14 text-center text-base'>{info}</p>
                    <div className='absolute bottom-5 right-10'>
                        <DoubleQuote/>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default CardProfile
