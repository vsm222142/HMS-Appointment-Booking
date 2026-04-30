import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import ForgotPassword from './pages/ForgotPassword'
import Verify from './pages/Verify'

import UserDashboard from './pages/UserDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'

import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'   
import 'react-toastify/dist/ReactToastify.css'
import { useContext } from 'react'
import { AppContext } from './context/AppContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useContext(AppContext)
  if (!token) return <Login />
  
  const userRole = user?.role?.toUpperCase()
  if (allowedRoles && !allowedRoles.map(r => r.toUpperCase()).includes(userRole)) {
    return <div className='py-20 text-center text-red-500'>Access Denied</div>
  }
  return children
}

const App = () => {

  const { user, authLoading } = useContext(AppContext)

  if (authLoading) {
    return (
      <>
        <ToastContainer />
        <Navbar />
        <div className='mx-4 sm:mx-[10%] py-20 text-center text-gray-500'>Loading...</div>
      </>
    )
  }

  return (
    <>
      <ToastContainer />
      <Navbar />

      <div className='mx-4 sm:mx-[5%] md:mx-[8%] lg:mx-[10%]'>

        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          
          <Route path='/appointment/:docId' element={<ProtectedRoute allowedRoles={['PATIENT', 'USER']}><Appointment /></ProtectedRoute>} />
          <Route path='/my-appointments' element={<ProtectedRoute allowedRoles={['PATIENT', 'USER']}><MyAppointments /></ProtectedRoute>} />
          <Route path='/my-profile' element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path='/verify' element={<Verify />} />

          <Route
            path='/dashboard'
            element={
              user?.role?.toUpperCase() === "DOCTOR"
                ? <DoctorDashboard />
                : user?.role?.toUpperCase() === "ADMIN"
                  ? <AdminDashboard />
                  : (user?.role?.toUpperCase() === "PATIENT" || user?.role?.toUpperCase() === "USER")
                    ? <UserDashboard />
                    : <Login />
            }
          />

          <Route path='/admin-dashboard' element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path='/doctor-dashboard' element={<ProtectedRoute allowedRoles={['DOCTOR']}><DoctorDashboard /></ProtectedRoute>} />

        </Routes>

        <Footer />
      </div>
    </>
  )
}

export default App