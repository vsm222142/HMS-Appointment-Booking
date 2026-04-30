import React from 'react'
import { assets } from '../assets/assets'
import { motion, AnimatePresence } from 'framer-motion'

const NotificationDropdown = ({ notifications, onClose, onMarkAsRead, onMarkAllAsRead, unreadCount }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
    >
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          Notifications 
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          )}
        </h3>
        <button 
          onClick={onMarkAllAsRead}
          className="text-xs text-primary hover:underline font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <img src={assets.info_icon} className="w-6 opacity-20" alt="" />
            </div>
            <p className="text-gray-400 text-sm">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => !notif.isRead && onMarkAsRead(notif.id)}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${!notif.isRead ? 'bg-primary/5' : ''}`}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type.includes('BOOKED') ? 'bg-blue-100 text-blue-600' :
                    notif.type.includes('APPROVED') ? 'bg-green-100 text-green-600' :
                    notif.type.includes('REJECTED') ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-lg">
                      {notif.type.includes('BOOKED') ? '📅' :
                       notif.type.includes('APPROVED') ? '✅' :
                       notif.type.includes('REJECTED') ? '❌' :
                       notif.type.includes('LOGIN') ? '🔑' : '🔔'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm leading-snug ${!notif.isRead ? 'text-gray-900 font-semibold' : 'text-gray-600 font-medium'}`}>
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0 shadow-lg shadow-primary/40"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
        <button 
          onClick={onClose}
          className="text-xs text-gray-500 font-bold hover:text-gray-700 uppercase tracking-widest"
        >
          Close
        </button>
      </div>
    </motion.div>
  )
}

export default NotificationDropdown
