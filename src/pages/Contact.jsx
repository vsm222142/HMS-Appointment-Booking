import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='px-4 md:px-10'
    >

      {/* ===== Heading ===== */}
      <div className="text-center pt-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#0f4c81]">
          Contact <span className="text-gray-800">Us</span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          We are here to help you with your healthcare needs
        </p>
      </div>

      {/* ===== Content ===== */}
      <div className="my-14 flex flex-col md:flex-row items-center gap-12 mb-24">

        {/* Image */}
        <motion.img
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full md:max-w-[420px] rounded-3xl
          shadow-[0_20px_50px_rgba(0,0,0,0.15)]
          hover:scale-[1.02] transition duration-300"
          src={assets.contact_image}
          alt=""
        />

        {/* Text Section */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center items-start gap-6 md:w-2/4"
        >

          {/* Office Box */}
          <div className="bg-white border border-[#e5ecff]
          rounded-2xl p-6 w-full shadow-sm">

            <p className="font-bold text-lg text-[#0f4c81] mb-3">
              OUR OFFICE
            </p>

            <p className="text-gray-600 leading-relaxed text-sm">
              Heritage Hospitals Ltd. Lanka,<br />
              Varanasi - 221005, (U.P) INDIA
            </p>

            <p className="text-gray-600 mt-3 text-sm">
              Tel: 8318330338 <br />
              Email: mauryavishal0080@gmail.com
            </p>
          </div>

          {/* Career Box */}
          <div className="bg-gradient-to-r from-[#eef6ff] to-[#f8fbff]
          border border-[#dceaff] rounded-2xl p-6 w-full">

            <p className="font-bold text-lg text-[#0f4c81] mb-2">
              CAREERS AT SUPER SPECIALITY
            </p>

            <p className="text-gray-600 text-sm mb-4">
              Join our healthcare team and build your career with a modern and
              patient-focused hospital environment.
            </p>

            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-[#0f4c81] to-[#2a7bbd]
              text-white font-semibold px-8 py-3 rounded-full
              shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Jobs
            </motion.button>

          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}

export default Contact