import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='w-full'
    >

      {/* ===== Heading ===== */}
      <div className='text-center pt-8 sm:pt-12'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f4c81] px-2'>
          About <span className='text-gray-800'>Super Speciality Hospital</span>
        </h1>
        <p className='text-gray-500 mt-3 text-xs sm:text-sm md:text-base px-4'>
          Advanced healthcare with trusted doctors & modern technology
        </p>
      </div>

      {/* ===== Top Section ===== */}
      <div className='my-10 sm:my-14 flex flex-col md:flex-row gap-8 sm:gap-12 items-center'>

        {/* Image Container */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='w-full md:w-1/2 flex justify-center'
        >
          <img
            className='w-full max-w-[350px] sm:max-w-[420px] rounded-3xl
            shadow-[0_20px_50px_rgba(0,0,0,0.15)]
            hover:scale-[1.02] transition duration-300'
            src={assets.about_image}
            alt="About Us"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='flex flex-col gap-6 w-full md:w-1/2 text-gray-600 leading-relaxed text-sm sm:text-base text-center md:text-left'
        >
          <div className='space-y-4 px-4 sm:px-0'>
            <p>
              Welcome to <b className='text-[#0f4c81]'>Super Speciality Hospital</b>,
              where healthcare meets technology. Our mission is to provide safe,
              reliable and patient-focused treatment with experienced doctors.
            </p>

            <p>
              We combine modern medical technology with compassionate care to ensure
              every patient receives the best treatment experience.
            </p>
          </div>

          <div className='bg-gradient-to-r from-[#eef6ff] to-[#f8fbff]
          border border-[#dceaff] rounded-2xl p-6 mx-4 sm:mx-0 shadow-sm'>
            <b className='text-[#0f4c81] text-lg block mb-2'>Our Vision</b>
            <p className='text-sm text-gray-500'>
              To create a modern healthcare environment where every patient
              gets trusted treatment, fast service and complete care.
            </p>
          </div>
        </motion.div>

      </div>

      {/* ===== WHY CHOOSE US ===== */}
      <div className='text-center mb-10'>
        <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-[#0f4c81]'>
          Why Choose Us
        </h2>
      </div>

      {/* ===== Modern Cards ===== */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20 px-4 sm:px-0'>

        {[
          {
            title: "Efficiency",
            text: "Quick and smooth appointment booking designed for your busy schedule."
          },
          {
            title: "Convenience",
            text: "Access trusted specialists and modern treatment under one platform."
          },
          {
            title: "Personalized Care",
            text: "Patient-focused recommendations and treatment plans for better health."
          }
        ].map((item, i) => (

          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className='bg-white border border-[#e5ecff]
            rounded-2xl p-8 text-gray-600
            hover:shadow-2xl hover:-translate-y-2
            hover:bg-gradient-to-br hover:from-[#0f4c81] hover:to-[#2a7bbd]
            hover:text-white transition-all duration-300 cursor-pointer group shadow-sm'
          >
            <h3 className='text-lg font-bold mb-4 group-hover:text-white'>
              {item.title}
            </h3>
            <p className='text-sm leading-relaxed group-hover:text-white/90'>
              {item.text}
            </p>
          </motion.div>
        ))}

      </div>

    </motion.div>
  )
}

export default About;