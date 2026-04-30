import { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import NotificationDropdown from './NotificationDropdown'

const Navbar = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const { user, logout, api, backendUrl } = useContext(AppContext);
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Close menu on route change
  useEffect(() => {
    setShowMenu(false)
  }, [location])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [showMenu])

  const onLogout = async () => {
    await logout()
    setNotifications([])
    setUnreadCount(0)
    navigate('/login')
  }

  // Fetch Notifications & Setup WebSocket
  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/api/notifications')
        if (data.success) {
          setNotifications(data.data)
          setUnreadCount(data.unreadCount)
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err)
      }
    }

    fetchNotifications()

    // WebSocket setup
    const socket = new SockJS(`${backendUrl}/ws`)
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket")
        stompClient.subscribe(`/user/${user.email}/queue/notifications`, (message) => {
          const newNotif = JSON.parse(message.body)
          setNotifications(prev => [newNotif, ...prev])
          setUnreadCount(prev => prev + 1)
        })
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers['message'])
        console.error("Additional details: " + frame.body)
      }
    })

    stompClient.activate()

    return () => {
      stompClient.deactivate()
    }
  }, [user, api, backendUrl])

  const markAsRead = async (id) => {
    try {
      await api.post(`/api/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error(err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.post('/api/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error(err)
    }
  }

  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/doctors', label: 'ALL DOCTORS' },
    { path: '/about', label: 'ABOUT' },
    { path: '/contact', label: 'CONTACT' }
  ]

  return (
    <>
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='w-full sticky top-0 z-[1000] bg-gradient-to-br from-[#0f4c81] via-[#2a7bbd] to-[#5aa9e6] rounded-none sm:rounded-b-2xl shadow-lg backdrop-blur-md'
      >
        <div className='flex items-center justify-between text-sm py-3 sm:py-4 px-4 sm:px-6 md:px-10 lg:px-20'>

          {/* Logo */}
          <img
            onClick={() => navigate('/')}
            className='w-28 sm:w-44 cursor-pointer hover:scale-105 transition duration-300'
            src={assets.logo}
            alt="Logo"
          />

          {/* Desktop Menu */}
          <ul className='hidden md:flex items-center gap-4 lg:gap-8 font-medium'>
            {navLinks.map((item, i) => (
              <NavLink key={i} to={item.path}>
                {({ isActive }) => (
                  <li
                    className={`px-3 py-2 rounded-full transition-all duration-300 font-bold whitespace-nowrap
                    ${isActive
                        ? 'bg-white text-primary shadow-md'
                        : 'text-white hover:bg-white/20'
                      }`}
                  >
                    {item.label}
                  </li>
                )}
              </NavLink>
            ))}
          </ul>

          {/* Right Side */}
          <div className='flex items-center gap-2 sm:gap-4'>
            <div className='hidden lg:flex items-center gap-3'>
              {user && user.role?.toUpperCase() === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  className='bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition shadow-md font-black text-[10px] uppercase tracking-wider'
                >
                  Admin
                </button>
              )}
              {user && user.role?.toUpperCase() === 'DOCTOR' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className='bg-white text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition shadow-sm font-black text-[10px] uppercase tracking-wider'
                >
                  Doctor Panel
                </button>
              )}
            </div>
            {user && (
              <div className='relative'>
                <div 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className='relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer group'
                >
                  <span className='text-xl'>🔔</span>
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary shadow-lg'
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </div>

                <AnimatePresence>
                  {showNotifications && (
                    <NotificationDropdown 
                      notifications={notifications}
                      unreadCount={unreadCount}
                      onClose={() => setShowNotifications(false)}
                      onMarkAsRead={markAsRead}
                      onMarkAllAsRead={markAllAsRead}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

            {user ? (
              <div className='flex items-center gap-2 cursor-pointer group relative'>
                <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100 flex items-center justify-center'>
                  <img className='w-full h-full object-cover' src={user.imageUrl || assets.profile_pic} alt="Profile" />
                </div>
                <img className='w-2 sm:w-2.5 invert brightness-0 opacity-70 group-hover:opacity-100 transition-opacity hidden sm:block' src={assets.dropdown_icon} alt="" />

                <div className='absolute top-full right-0 pt-4 hidden group-hover:block z-50'>
                  <div className='min-w-48 bg-white shadow-2xl rounded-2xl flex flex-col p-2 border border-gray-100'>
                    <p onClick={() => navigate('/my-profile')} className='px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer text-gray-700 font-bold transition'>My Profile</p>
                    {(user.role === 'PATIENT' || user.role === 'USER') && (
                      <p onClick={() => navigate('/my-appointments')} className='px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer text-gray-700 font-bold transition'>Appointments</p>
                    )}
                    <p onClick={() => navigate('/dashboard')} className='px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer text-gray-700 font-bold transition'>Dashboard</p>
                    <hr className='my-2 border-gray-100' />
                    <p onClick={onLogout} className='px-4 py-3 hover:bg-red-50 text-red-500 rounded-xl cursor-pointer font-bold transition'>Logout</p>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className='bg-white text-primary px-4 sm:px-6 py-2 sm:py-2.5 rounded-full hidden md:block hover:scale-105 transition shadow-md font-bold text-xs sm:text-sm'
              >
                Create Account
              </button>
            )}

            <div onClick={() => setShowMenu(true)} className='md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer flex items-center'>
              <img className='w-6 invert brightness-0' src={assets.menu_icon} alt="Menu" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- Mobile Menu Overlay (Outside sticky header container) ---- */}
      <AnimatePresence>
        {showMenu && (
          <div className="fixed inset-0 z-[2000] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className='absolute inset-0 bg-black/70 backdrop-blur-md'
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className='absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col'
            >
              <div className='flex items-center justify-between p-6 border-b bg-gray-50'>
                <img src={assets.logo} className='w-32' alt="Logo" />
                <button onClick={() => setShowMenu(false)} className='p-2 hover:bg-gray-200 rounded-full transition flex items-center justify-center'>
                  <img src={assets.cross_icon} className='w-6 h-6' alt="Close" />
                </button>
              </div>

              <div className='flex-1 overflow-y-auto p-6'>
                <ul className='flex flex-col gap-2'>
                  {navLinks.map((item, i) => (
                    <NavLink key={i} to={item.path} onClick={() => setShowMenu(false)}>
                      <li className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all
                        ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                        {item.label}
                      </li>
                    </NavLink>
                  ))}
                </ul>

                <div className='mt-8 pt-8 border-t space-y-4'>
                  {user ? (
                    <>
                      <div className='flex items-center gap-4 px-4 mb-6'>
                        <div className='w-14 h-14 rounded-full border-2 border-primary p-0.5'>
                          <img src={user.imageUrl || assets.profile_pic} className='w-full h-full object-cover rounded-full' alt="" />
                        </div> 
                        <div>
                          <p className='font-black text-[#0f4c81] text-lg'>{user.name}</p>
                          <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>{user.role}</p>
                        </div>
                      </div>
                      <div className='grid grid-cols-1 gap-3'>
                        <button onClick={() => { navigate('/my-profile'); setShowMenu(false); }} className='w-full py-4 rounded-2xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition'>My Profile</button>
                        <button onClick={() => { navigate('/dashboard'); setShowMenu(false); }} className='w-full py-4 rounded-2xl font-bold text-white bg-primary shadow-lg shadow-primary/20'>Dashboard</button>
                        <button onClick={onLogout} className='w-full py-4 rounded-2xl font-bold text-red-500 bg-red-50 hover:bg-red-100 transition mt-4'>Logout</button>
                      </div>
                    </>
                  ) : (
                    <button onClick={() => { navigate('/login'); setShowMenu(false); }} className='w-full py-5 rounded-2xl font-bold text-white bg-primary shadow-xl shadow-primary/20'>Sign In / Create Account</button>
                  )}
                </div>
              </div>

              <div className='p-8 text-center text-xs text-gray-400 font-medium border-t bg-gray-50 mt-auto'>
                © 2025 Super Speciality Hospital <br /> Healthcare Excellence
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar;