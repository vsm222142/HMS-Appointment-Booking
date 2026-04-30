import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {

  const [appointments, setAppointments] = useState([]);
  const { api, user } = useContext(AppContext)

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " +
      months[Number(dateArray[1]) - 1] + " " +
      dateArray[2]
    );
  };

  const loadAppointments = async () => {
    if (!user) return
    try {
      const { data } = await api.get("/api/appointments")
      setAppointments(data?.data || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  // ✅ Load appointments from API
  useEffect(() => { loadAppointments() }, [user]);

  // ✅ Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      await api.delete(`/api/appointments/${appointmentId}`)
      toast.success("Appointment cancelled")
      loadAppointments()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  };

  // ✅ Pay appointment (Razorpay Simulation)
  const payAppointment = async (item) => {
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use the real key from .env
        amount: (item.amount || 200) * 100, // Razorpay works in paisa
        currency: "INR",
        name: "Super Speciality Hospital",
        description: `Payment for Appointment with ${item.doctor?.name}`,
        handler: async function (response) {
          // On successful simulated payment
          try {
            await api.post(`/api/appointments/${item.id}/pay`)
            toast.success("Payment successful via Razorpay!")
            loadAppointments()
          } catch (err) {
            toast.error("Payment sync failed: " + err.message)
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#0f4c81",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Razorpay error: " + err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff] p-2 sm:p-6">
      <h1 className="text-2xl font-bold text-[#0f4c81] mb-6">My Appointments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.length === 0 && (
          <p className="text-center py-20 text-gray-400 col-span-2">No appointments booked yet.</p>
        )}

        {appointments.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all group"
          >
            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl group-hover:scale-110 transition">
                  {item.doctor?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[#0f4c81]">
                    {item.doctor?.name}
                  </p>
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">
                    {item.doctor?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Appointment Date</span>
                  <span className="font-bold">{item.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase">Timing Slot</span>
                  <span className="font-bold">{item.time?.slice(0, 5)}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase">Bill Amount</p>
                  <p className="text-xl font-black text-primary">₹{item.amount || 200}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Payment Status</p>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                    ${item.paymentStatus === 'PAID' ? 'bg-green-500 text-white' : 
                      item.paymentStatus === 'REFUNDED' ? 'bg-orange-500 text-white' : 
                      'bg-red-500 text-white'}`}>
                    {item.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center sm:min-w-48">

              {/* Pay Button - ONLY if Approved and Payment Pending */}
              {item.status === "APPROVED" && item.paymentStatus === "PENDING" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => payAppointment(item)}
                  className="bg-primary text-white py-3 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
                  Pay with Razorpay
                </motion.button>
              )}

              {/* Status Display */}
              {item.status === "PENDING" && (
                <div className="flex flex-col gap-2">
                  <div className="py-3 px-4 bg-yellow-50 border border-yellow-100 rounded-2xl text-center">
                    <p className="text-yellow-600 font-black text-[10px] uppercase tracking-widest">Waiting for Approval</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => cancelAppointment(item.id)}
                    className="bg-gray-100 text-gray-600 py-3 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all text-sm"
                  >
                    Cancel Booking
                  </motion.button>
                </div>
              )}

              {item.status === "CANCELLED" && (
                <div className="py-4 px-4 bg-red-50 border border-red-100 rounded-2xl text-center">
                  <p className="text-red-500 font-black text-xs uppercase tracking-widest">Cancelled</p>
                  {item.paymentStatus === 'REFUNDED' && <p className="text-[10px] text-orange-600 font-bold mt-1 italic">Payment Refunded</p>}
                </div>
              )}

              {item.status === "APPROVED" && item.paymentStatus === "PAID" && (
                <div className="py-4 px-4 bg-green-50 border border-green-100 rounded-2xl text-center">
                  <p className="text-green-600 font-black text-xs uppercase tracking-widest">Confirmed & Paid</p>
                  <p className="text-[10px] text-green-500 font-bold mt-1">Visit on {item.date}</p>
                </div>
              )}

              {item.status === "APPROVED" && item.paymentStatus === "PENDING" && (
                <div className="py-2 px-4 bg-green-50 border border-green-100 rounded-2xl text-center">
                  <p className="text-green-600 font-black text-[10px] uppercase tracking-widest">Approved</p>
                </div>
              )}

              {item.status === "REJECTED" && (
                <div className="py-4 px-4 bg-gray-100 border border-gray-200 rounded-2xl text-center">
                  <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Rejected</p>
                  {item.paymentStatus === 'REFUNDED' && <p className="text-[10px] text-orange-600 font-bold mt-1 italic">Payment Refunded</p>}
                </div>
              )}

              {item.status === "COMPLETED" && (
                <div className="py-4 px-4 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                  <p className="text-blue-600 font-black text-xs uppercase tracking-widest">Completed</p>
                  <p className="text-[10px] text-blue-500 font-bold mt-1">Thank you for visiting</p>
                </div>
              )}

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;