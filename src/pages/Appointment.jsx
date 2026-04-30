import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, api, user } = useContext(AppContext)

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    // ✅ Get doctor info from local context
    const fetchDocInfo = () => {
        const info = doctors.find(doc => String(doc.id) === String(docId))
        setDocInfo(info)
    }

    // ✅ Generate available slots
    const getAvailableSlots = () => {

        setDocSlots([])
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date(today)
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = []

            while (currentDate < endTime) {

                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year

                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                })

                currentDate.setMinutes(currentDate.getMinutes() + 30)
            }

            setDocSlots(prev => [...prev, timeSlots])
        }
    }

    // ✅ Book Appointment (API)
    const bookAppointment = async () => {
        if (!user) {
            toast.warning("Login first")
            return navigate('/login')
        }

        if (!slotTime) {
            return toast.warning("Please select time slot")
        }

        const date = docSlots[slotIndex][0].datetime
        const dateStr = new Date(date).toISOString().split('T')[0]
        const timeStr = `${slotTime}:00`

        try {
            await api.post("/api/appointments", {
                doctorId: docInfo.id,
                date: dateStr,
                time: timeStr
            })
            toast.success("Appointment booked successfully")
            navigate('/my-appointments')
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
        }
    }, [docInfo])

    return docInfo ? (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >

            {/* Doctor Info */}
            <div className='flex flex-col sm:flex-row gap-4'>

                <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <img
                        className='bg-primary w-full sm:max-w-72 rounded-lg shadow object-cover h-72'
                        src={docInfo.imageUrl || assets.profile_pic}
                        alt={docInfo.name}
                    />
                </motion.div>

                <motion.div
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className='flex-1 border border-[#ADADAD] rounded-lg p-8 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'
                >

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>

                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.specialization}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>
                            {docInfo.experience || "—"}
                        </button>
                    </div>

                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>
                            About <img className='w-3' src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                            {docInfo.department?.name ? `Department: ${docInfo.department.name}` : "—"}
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee:
                        <span className='text-gray-800'>
                            {currencySymbol}200
                        </span>
                    </p>

                </motion.div>
            </div>

            {/* Booking Slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>

                <p>Booking slots</p>

                <div className='flex gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.map((item, index) => (
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            key={index}
                            onClick={() => setSlotIndex(index)}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer
                            ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}
                        >
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </motion.div>
                    ))}
                </div>

                <div className='flex gap-3 w-full overflow-x-scroll mt-4'>

                    {docSlots.length &&
                        docSlots[slotIndex].map((item, index) => (

                            <motion.p
                                whileTap={{ scale: 0.95 }}
                                key={index}
                                onClick={() => setSlotTime(item.time)}
                                className={`text-sm font-light flex-shrink-0 
                                px-5 py-2 rounded-full cursor-pointer
                                ${item.time === slotTime
                                        ? 'bg-primary text-white'
                                        : 'text-[#949494] border border-[#B4B4B4]'}`}
                            >
                                {item.time.toLowerCase()}
                            </motion.p>
                        ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={bookAppointment}
                    className='bg-primary text-white px-20 py-3 rounded-full my-6 shadow'
                >
                    Book an appointment
                </motion.button>

            </div>

            {/* Related Doctors */}
            <RelatedDoctors
                speciality={docInfo.speciality}
                docId={docId}
            />

        </motion.div>
    ) : null
}

export default Appointment;