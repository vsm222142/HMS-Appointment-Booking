import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='md:mx-10 mt-24'
    >

      <div className='
      bg-gradient-to-br from-[#f8fbff] to-[#eef5ff]
      border border-[#e2ecff]
      rounded-3xl px-6 sm:px-10 md:px-14 py-12
      shadow-[0_10px_40px_rgba(0,0,0,0.06)]'>

        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-12 text-sm'>

          {/* ===== Logo + About ===== */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <img
              className='mb-5 w-40 drop-shadow-sm hover:scale-105 transition duration-300'
              src={assets.logo}
              alt=""
            />

            <p className='w-full md:w-2/3 text-gray-600 leading-7'>
              Super Speciality Hospital is a modern healthcare center providing
              advanced treatment with expert doctors and modern technology.
              We focus on safe, accurate and patient-friendly healthcare services.
            </p>
          </motion.div>

          {/* ===== Company ===== */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className='text-lg font-bold mb-5 text-[#0f4c81]'>
              HOSPITAL
            </p>

            <ul className='flex flex-col gap-3 text-gray-600'>
              {['Home','About Us','Services','Appointment Booking','Privacy Policy'].map((item,i)=>(
                <li
                  key={i}
                  className='hover:text-[#0f4c81] hover:translate-x-1
                  cursor-pointer transition-all duration-300'
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ===== Contact ===== */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className='text-lg font-bold mb-5 text-[#0f4c81]'>
              GET IN TOUCH
            </p>

            <ul className='flex flex-col gap-3 text-gray-600'>
              <li className='hover:text-[#0f4c81] transition duration-300'>
                +91-8318330338
              </li>

              <li className='hover:text-[#0f4c81] transition duration-300 break-all'>
                mauryavishal0080@gmail.com
              </li>
            </ul>
          </motion.div>

        </div>

        {/* ===== Bottom ===== */}
        <div className='mt-10'>
          <hr className='border-[#d6e4ff]' />

          <p className='py-5 text-sm text-center text-gray-500'>
            © 2025 Super Speciality Hospital — All Rights Reserved.
          </p>
        </div>

      </div>

    </motion.div>  
  )
}

export default Footer;   