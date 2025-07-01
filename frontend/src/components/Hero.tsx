import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div>
      <div className='mt-30 mr-30 ml-30'>
      <div className='flex justify-center border-3 border-gray-600 shadow-sm'>
        <div className='w-full grid content-center justify-center'>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
            <h1 className='prata-regular text-2xl font-medium text-gray-600 mb-4'>
                OUR BESTSELLERS
            </h1>
            <h1 className='prata-regular text-5xl font-bold text-gray-600 mb-4'>
                Latest Arrivals
            </h1>
            <h1 className='prata-regular text-2xl font-medium text-gray-600'>
                SHOP NOW
            </h1>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
        </div>
        <img src={assets.hero_img} alt="" className='w-160 h-130' />
      </div>
    </div>
    </div>
  )
}

export default Hero
