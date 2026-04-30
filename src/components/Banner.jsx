import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='flex 
            bg-gradient-to-br from-[#0f4c81] via-[#2a7bbd] to-[#5aa9e6]
            rounded-[30px] px-6 sm:px-10 md:px-14 lg:px-12 
            my-20 md:mx-10 overflow-hidden
            shadow-[0_20px_60px_rgba(15,76,129,0.35)]'
        >

            {/* ------- Left Side ------- */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'
            >

                {/* Heading */}
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold text-white leading-tight'>
                    <p>Book Appointment</p>
                    <p className='mt-4 bg-gradient-to-r from-white via-[#dff6ff] to-[#bdefff] bg-clip-text text-transparent'>
                        With 100+ Trusted Doctors
                    </p>
                </div>

                {/* Subtitle */}
                <p className='text-white/90 mt-4 text-sm sm:text-base leading-relaxed max-w-md'>
                    Super Speciality Hospital offers expert care, advanced treatment,
                    and trusted specialists for your health and wellness.
                </p>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                    className='bg-white text-[#0f4c81] font-semibold
                    text-sm sm:text-base px-8 py-3 rounded-full mt-6
                    shadow-lg hover:shadow-xl transition-all duration-300'
                >
                    Create Account
                </motion.button>

            </motion.div>

            {/* ------- Right Side ------- */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className='hidden md:block md:w-1/2 lg:w-[370px] relative'
            >

                <img
                    className='w-full absolute bottom-0 right-0 max-w-md
                    drop-shadow-[0_15px_40px_rgba(0,0,0,0.25)]
                    hover:scale-[1.02] transition duration-300'
                    src={assets.appointment_img}
                    alt=""
                />

            </motion.div>

        </motion.div>
    )
}

export default Banner
