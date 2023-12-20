import React from 'react'
import Image from 'next/image'
import bannerPic from '../public/about-us-banner/about-us-banner.png'

function AboutusBanner() {
  return (
    <div>
        <Image
        src={bannerPic}
        alt="Picture of the author"
        width="100%"
        height="100%"
        />
    </div>
  )
}

export default AboutusBanner
