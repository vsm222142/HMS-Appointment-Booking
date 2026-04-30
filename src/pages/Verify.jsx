import React, { useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const Verify = () => {

    const [searchParams] = useSearchParams()

    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")

    const navigate = useNavigate()
    const { api } = useContext(AppContext)

    useEffect(() => {
        const verify = async () => {
            if (appointmentId && success) {
                try {
                    await api.post("/api/user/verifyStripe", {
                        success: success === 'true',
                        appointmentId: Number(appointmentId)
                    })
                    toast.success("Payment verified successfully")
                } catch (err) {
                    toast.error("Payment verification failed")
                } finally {
                    navigate("/my-appointments")
                }
            }
        }
        verify()
    }, [appointmentId, success])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='min-h-[60vh] flex items-center justify-center'
        >

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-20 h-20 border-4 
                border-gray-300 border-t-4 
                border-t-primary rounded-full"
            />

        </motion.div>
    )
}

export default Verify
