import Image from 'next/image'
import React from 'react'

function MockImg() {
  return (
    <div>
      <div className="max-w-[400px] max-h-[400px] bg-slate-400">
                  <Image
                        src='https://storage.googleapis.com/tatugacamp.com/logo%20/tatugacamp%20facebook.jpg'
                        width={500}
                        height={500}
                        alt='Tatugacamp logo'
                        sizes='(max-width: 350px),33vw'
                    />
      </div>
    </div>
  )
}

export default MockImg
