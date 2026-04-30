import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import emailjs from '@emailjs/browser'

const ForgotPassword = () => {
    const [step, setStep] = useState(1) // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { api } = useContext(AppContext)
    const navigate = useNavigate()

    // 📩 Step 1: Request OTP from Backend & Send via EmailJS
    const handleSendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await api.post("/api/auth/forgot-password", { email })
            if (data.success) {
                const generatedOtp = data.otp
                
                // EmailJS Logic
                const templateParams = {
                    user_email: email, // Changed for clarity
                    otp: generatedOtp,
                    hospital_name: "Super Speciality Hospital"
                };

                console.log("Sending email with params:", templateParams);

                // You need to replace these with your actual keys from EmailJS dashboard
                const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_id_placeholder";
                const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_id_placeholder";
                const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_key_placeholder";

                await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
                
                toast.success("OTP sent to your email!")
                setStep(2)
            }
        } catch (err) {
            console.error("Forgot Password Error:", err)
            const errorMsg = err?.response?.data?.message || err?.text || err?.message || "Failed to send OTP"
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    // 🔑 Step 2: Verify OTP & Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match")
        }
        setLoading(true)
        try {
            const { data } = await api.post("/api/auth/reset-password", { 
                email, 
                otp, 
                newPassword 
            })
            if (data.success) {
                toast.success("Password reset successfully! Please login.")
                navigate("/login")
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Invalid OTP or error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md'
            >
                <h1 className='text-2xl font-black text-[#0f4c81] mb-2'>
                    {step === 1 ? "Forgot Password?" : "Reset Password"}
                </h1>
                <p className='text-gray-500 text-sm mb-8'>
                    {step === 1 
                        ? "Enter your email to receive a 6-digit verification code." 
                        : "Enter the code sent to your email and create a new password."}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className='space-y-6'>
                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1'>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                                className='w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all'
                            />
                        </div>
                        <button
                            disabled={loading}
                            className='w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all'
                        >
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className='space-y-5'>
                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1'>6-Digit Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="000000"
                                maxLength={6}
                                className='w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all text-center tracking-[1em] font-black'
                            />
                        </div>
                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1'>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Min 6 characters"
                                className='w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all'
                            />
                        </div>
                        <div className='space-y-1'>
                            <label className='text-xs font-bold text-gray-400 uppercase tracking-widest ml-1'>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Repeat password"
                                className='w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all'
                            />
                        </div>
                        <button
                            disabled={loading}
                            className='w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all'
                        >
                            {loading ? "Resetting..." : "Update Password"}
                        </button>
                    </form>
                )}

                <p 
                    onClick={() => navigate('/login')}
                    className='text-center text-sm font-bold text-gray-400 mt-8 cursor-pointer hover:text-primary transition-all'
                >
                    Back to Login
                </p>
            </motion.div>
        </div>
    )
}

export default ForgotPassword
