import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Header = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className='flex flex-col md:flex-row flex-wrap 
            bg-gradient-to-br from-[#0f4c81] via-[#2a7bbd] to-[#5aa9e6]
            rounded-[30px] px-6 md:px-10 lg:px-20 overflow-hidden 
            shadow-[0_20px_60px_rgba(15,76,129,0.35)]'
        >

            {/* --------- Header Left --------- */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className='md:w-1/2 flex flex-col items-start justify-center gap-5 py-10 m-auto md:py-[10vw] md:mb-[-30px]'
            >

                {/* Modern Gradient Heading */}
                <p className='text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white'>
                    Book Appointment <br />
                    <span className='bg-gradient-to-r from-[#ffffff] via-[#dff6ff] to-[#bdefff] bg-clip-text text-transparent drop-shadow-sm'>
                        With Trusted Doctors
                    </span>
                </p>

                {/* Subtitle */}
                <p className='text-white/90 text-sm md:text-base font-light leading-relaxed'>
                    Super Speciality Hospital provides expert care with modern technology.
                    <br className='hidden sm:block' />
                    Choose experienced doctors and book your appointment easily.
                </p>

                {/* Profiles + Text */}
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-28 drop-shadow-md' src={assets.group_profiles} alt="" />
                    <p className='text-white/90'>
                        Trusted by hundreds of patients for safe, fast and reliable treatment.
                    </p>
                </div>

                {/* Modern Button */}
                <motion.a
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    href='#speciality'
                    className='flex items-center gap-2 
                    bg-white text-[#0f4c81] font-semibold 
                    px-8 py-3 rounded-full 
                    shadow-lg hover:shadow-xl 
                    transition-all duration-300 m-auto md:m-0'
                >
                    Book Appointment
                    <img className='w-3 animate-pulse' src={assets.arrow_icon} alt="" />
                </motion.a>

            </motion.div>

            {/* --------- Header Right --------- */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className='md:w-1/2 relative flex items-end justify-center'
            >
                <img
                    className='w-full sm:w-4/5 md:w-full md:absolute bottom-0 h-auto rounded-lg 
                    drop-shadow-[0_15px_40px_rgba(0,0,0,0.25)] 
                    hover:scale-[1.02] transition duration-300 mt-6 md:mt-0'
                    src={assets.header_img}
                    alt=""
                />
            </motion.div>

        </motion.div>
    )
}

export default Header;