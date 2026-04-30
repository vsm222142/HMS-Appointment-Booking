import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const RelatedDoctors = ({ speciality, docId }) => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter(
                (doc) => doc.specialization === speciality && String(doc.id) !== String(docId)
            )
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='flex flex-col items-center gap-4 my-16 text-[#262626]'
        >

            <h1 className='text-3xl font-medium'>
                Related Doctors
            </h1>

            <p className='sm:w-1/3 text-center text-sm text-gray-600'>
                Simply browse through our extensive list of trusted doctors.
            </p>

            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>

                {relDoc.map((item, index) => (
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
                        className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-3 hover:shadow-xl transition-all duration-500'
                    >

                        <div className='w-full h-44 overflow-hidden bg-gray-50'>
                            <img 
                                className='w-full h-full object-cover transition-all group-hover:scale-110' 
                                src={item.imageUrl || assets.profile_pic} 
                                alt={item.name} 
                            />
                        </div>

                        <div className='p-4'>

                            <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                                <p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>

                            <p className='text-[#262626] text-lg font-medium mt-1'>
                                {item.name}
                            </p>

                            <p className='text-[#5C5C5C] text-sm'>
                                {item.specialization}
                            </p>

                        </div>

                    </motion.div>
                ))}

            </div>

        </motion.div>
    )
}

export default RelatedDoctors
