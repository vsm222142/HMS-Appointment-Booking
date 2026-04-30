import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const navigate = useNavigate()
  const { login, register } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (state === "Sign Up") {
        if (password !== confirmPassword) {
          return toast.error("Passwords do not match")
        }
        // Force role to PATIENT for public registration
        await register({ name, email, password, confirmPassword, role: 'PATIENT' })
        toast.success("Account created successfully. Please login.")
        setState('Login')
        return
      } else {
        const data = await login({ email, password })
        toast.success("Login successful")
        
        // Redirect based on role immediately
        const role = data?.data?.user?.role || ''
        if (role === 'ADMIN') {
          navigate("/admin-dashboard")
        } else if (role === 'DOCTOR') {
          navigate("/dashboard")
        } else {
          navigate("/dashboard")
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className='min-h-[90vh] flex items-center justify-center
    bg-gradient-to-br from-[#eef6ff] via-[#f8fbff] to-[#e9f3ff]'>

      <form onSubmit={onSubmitHandler}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex flex-col gap-4 items-start p-6 sm:p-10
          w-[92vw] sm:w-auto sm:min-w-[400px]
          rounded-3xl border border-[#e3ecff]
          bg-white/90 backdrop-blur-lg
          shadow-[0_20px_60px_rgba(15,76,129,0.15)]'
        >

          <p className='text-2xl font-extrabold text-[#0f4c81]'>
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </p>

          <p className='text-gray-500 text-sm'>
            Please {state === 'Sign Up' ? 'sign up' : 'log in'} to continue
          </p>

          {state === 'Sign Up' &&
            <div className='w-full'>
              <p className='text-gray-700 font-medium'>Full Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className='border border-[#dce6ff] rounded-xl w-full p-3 mt-1'
                type="text"
                required
              />
            </div>
          }

          <div className='w-full'>
            <p className='text-gray-700 font-medium'>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='border border-[#dce6ff] rounded-xl w-full p-3 mt-1'
              type="email"
              required
            />
          </div>

          <div className='w-full'>
            <p className='text-gray-700 font-medium'>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='border border-[#dce6ff] rounded-xl w-full p-3 mt-1'
              type="password"
              required
            />
          </div>

          {state === "Sign Up" &&
            <div className='w-full'>
              <p className='text-gray-700 font-medium'>Confirm Password</p>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className='border border-[#dce6ff] rounded-xl w-full p-3 mt-1'
                type="password"
                required
              />
            </div>
          }

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-[#0f4c81] to-[#2a7bbd]
            text-white font-semibold w-full py-3 mt-2 rounded-xl'
          >
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </motion.button>

          {state === 'Sign Up'
            ? <p className='text-sm text-gray-600'>
              Already have an account?
              <span
                onClick={() => setState('Login')}
                className='text-[#0f4c81] font-semibold cursor-pointer ml-1'
              >
                Login here
              </span>
            </p>
            : (
              <div className='flex flex-col gap-2'>
                <p className='text-sm text-gray-600'>
                  Create a new account?
                  <span
                    onClick={() => setState('Sign Up')}
                    className='text-[#0f4c81] font-semibold cursor-pointer ml-1'
                  >
                    Click here
                  </span>
                </p>
                <p 
                  onClick={() => navigate('/forgot-password')}
                  className='text-sm text-[#0f4c81] font-bold cursor-pointer hover:underline'
                >
                  Forgot Password?
                </p>
              </div>
            )
          }

        </motion.div>
      </form>
    </div>
  )
}

export default Login