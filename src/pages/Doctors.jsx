import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const { doctors } = useContext(AppContext)

  const navigate = useNavigate()

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.specialization === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [speciality, doctors])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >

      {/* Heading */}
      <h2 className='text-2xl md:text-3xl font-extrabold text-[#0f4c81]'>
        Find Your Doctor
      </h2>

      <p className='text-gray-600 mt-2'>
        Browse through our trusted specialists and book appointments easily.
      </p>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

        {/* Filter Button (Mobile) */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1.5 px-4 border rounded text-sm transition-all sm:hidden
          ${showFilter ? 'bg-[#0f4c81] text-white border-[#0f4c81]' : ''}`}
        >
          Filters
        </motion.button>

        {/* Filter Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`flex-col gap-4 text-sm text-gray-600
          ${showFilter ? 'flex' : 'hidden sm:flex'}`}
        >

          {[
            'Gen. Physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist'
          ].map((spec, i) => (

            <p
              key={i}
              onClick={() =>
                speciality === spec
                  ? navigate('/doctors')
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border
              border-gray-300 rounded-lg cursor-pointer
              transition-all duration-300
              hover:bg-[#eef5ff] hover:border-[#0f4c81]
              ${speciality === spec ? 'bg-[#eaf3ff] text-[#0f4c81] border-[#0f4c81]' : ''}`}
            >
              {spec}
            </p>

          ))}

        </motion.div>

        {/* Doctors Grid */}
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>

          {filterDoc.map((item, index) => (

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
              className='bg-white border border-[#C9D8FF]
              rounded-xl overflow-hidden cursor-pointer
              hover:-translate-y-3 hover:shadow-xl
              transition-all duration-500 group'
            >

              {/* Image */}
              <div className='w-full h-56 overflow-hidden bg-gray-50'>
                <img 
                  className='w-full h-full object-cover transition-all group-hover:scale-110' 
                  src={item.imageUrl || assets.profile_pic} 
                  alt={item.name} 
                />
              </div>

              <div className='p-4'>

                {/* Availability */}
                <div className={`flex items-center gap-2 text-sm
                ${item.available ? 'text-green-500' : "text-gray-500"}`}>

                  <p className={`w-2 h-2 rounded-full
                  ${item.available ? 'bg-green-500' : "bg-gray-400"}`}>
                  </p>

                  <p>
                    {item.available ? 'Available' : "Not Available"}
                  </p>
                </div>

                {/* Name */}
                <p className='text-[#262626] text-lg font-semibold mt-1 group-hover:text-[#0f4c81] transition'>
                  {item.name}
                </p>

                {/* Speciality */}
                <p className='text-[#5C5C5C] text-sm'>
                  {item.specialization}
                </p>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </motion.div>
  )
}

export default Doctors