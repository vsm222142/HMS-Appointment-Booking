import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const TopDoctors = () => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='flex flex-col items-center gap-5 my-20 text-[#1f2937] md:mx-10 px-4'
        >

            {/* Heading */}
            <h1 className='text-3xl md:text-4xl font-extrabold text-center'>
                Top <span className='text-[#0f4c81]'>Doctors</span> to Book
            </h1>

            {/* Subtitle */}
            <p className='sm:w-1/2 text-center text-sm md:text-base text-gray-600 leading-relaxed'>
                Connect with experienced and trusted specialists for quality healthcare and easy appointment booking.
            </p>

            {/* Doctors Grid */}
            <div className='w-full grid grid-cols-auto gap-5 pt-6 gap-y-7'>

                {doctors.slice(0, 12).map((item, index) => (

                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                            navigate(`/appointment/${item.id}`)
                            scrollTo(0, 0)
                        }}
                        className='bg-white border border-[#e5ecff] rounded-2xl 
                        overflow-hidden cursor-pointer 
                        hover:-translate-y-3 hover:shadow-2xl 
                        transition-all duration-500 group'
                    >

                        {/* Doctor Image */}
                        <div className='w-full h-56 overflow-hidden bg-gray-50'>
                            <img 
                                className='w-full h-full object-cover transition-all group-hover:scale-110' 
                                src={item.imageUrl || assets.profile_pic} 
                                alt={item.name} 
                            />
                        </div>

                        <div className='p-4'>

                            {/* Availability */}
                            <div className={`flex items-center gap-2 text-sm font-medium
                            ${item.available ? 'text-green-600' : "text-gray-500"}`}>

                                <p className={`w-2 h-2 rounded-full 
                                ${item.available ? 'bg-green-500' : "bg-gray-400"}`}>
                                </p>

                                <p>
                                    {item.available ? 'Available Now' : "Not Available"}
                                </p>
                            </div>

                            {/* Name */}
                            <p className='text-[#111827] text-lg font-bold mt-2 group-hover:text-[#0f4c81] transition'>
                                {item.name}
                            </p>

                            {/* Speciality */}
                            <p className='text-gray-600 text-sm mt-1'>
                                {item.specialization}
                            </p>

                        </div>

                    </motion.div>
                ))}

            </div>

            {/* Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    navigate('/doctors')
                    scrollTo(0, 0)
                }}
                className='bg-gradient-to-r from-[#0f4c81] to-[#2a7bbd]
                text-white font-semibold
                px-12 py-3 rounded-full mt-10
                shadow-lg hover:shadow-xl transition-all duration-300'
            >
                View All Doctors
            </motion.button>

        </motion.div>
    )
}

export default TopDoctors;