import React from 'react'
import Empertise from '../svg/social_logo/empertise'

function Card({title, subTitle, info}) {
  return (
    <div className='relative'>
      <div className='absolute left-3 top-[-30px]'>
          <Empertise/>
        </div>
     <div className='px-10 flex flex-col'>
        
        <span className="text-4xl md:text-5xl  font-semibold text-[#2C7CD1] leading-tight">
                {title}
        </span>    
        <span className='text-2xl lg:text-4xl font-Kanit font-semibold'>{subTitle}</span>
        <p className='font-Kanit text-sm md:text-base mt-3 md:mt-8'>
                {info}
        </p>
      </div>      
        
    </div>
  )
}

export default Card
