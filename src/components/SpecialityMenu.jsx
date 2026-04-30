import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const SpecialityMenu = () => {
    return (
        <motion.div
            id='speciality'
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='flex flex-col items-center gap-5 py-20 px-4 text-[#1f2937]'
        >

            {/* Heading */}
            <h1 className='text-3xl md:text-4xl font-extrabold tracking-wide text-center'>
                Find by <span className='text-[#0f4c81]'>Speciality</span>
            </h1>

            {/* Subtitle */}
            <p className='sm:w-1/2 text-center text-sm md:text-base text-gray-600 leading-relaxed'>
                Choose from our wide range of medical specialities and connect with
                experienced doctors for the best healthcare experience.
            </p>

            {/* Speciality Cards */}
            <div className='flex sm:justify-center gap-5 pt-8 w-full overflow-x-auto scrollbar-hide px-4 sm:px-0'>

                {specialityData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            to={`/doctors/${item.speciality}`}
                            onClick={() => scrollTo(0, 0)}
                            className='group flex flex-col items-center 
                            bg-white rounded-2xl px-5 py-4
                            shadow-md hover:shadow-xl
                            border border-gray-100
                            cursor-pointer flex-shrink-0
                            hover:-translate-y-3 hover:scale-105
                            transition-all duration-400'
                        >
                            <img
                                className='w-16 sm:w-20 mb-3 
                                drop-shadow-md group-hover:drop-shadow-xl 
                                transition duration-300'
                                src={item.image}
                                alt=""
                            />

                            <p className='text-sm sm:text-base font-semibold text-gray-700 group-hover:text-[#0f4c81] transition'>
                                {item.speciality}
                            </p>
                        </Link>
                    </motion.div>
                ))}

            </div>
        </motion.div>
    )
}

export default SpecialityMenu