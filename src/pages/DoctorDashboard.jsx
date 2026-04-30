import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const DoctorDashboard = () => {

  const [appointments, setAppointments] = useState([]);
  const { api, user } = useContext(AppContext)

  // 📅 Format date
  const formatDate = (slotDate) => {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const dateArray = slotDate.split("_");

    return (
      dateArray[0] + " " +
      months[Number(dateArray[1]) - 1] + " " +
      dateArray[2]
    );
  };

  // ✅ Load doctor-specific appointments
  useEffect(() => {
    const run = async () => {
      if (!user) return
      try {
        const { data } = await api.get("/api/doctor/appointments")
        setAppointments(data?.data || [])
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message)
      }
    }
    run()
  }, [user]);

  // ✅ Update status
  const updateStatus = async (appointmentId, value) => {
    try {
      if (value === "APPROVED") {
        await api.put(`/api/doctor/appointments/${appointmentId}/approve`)
        toast.success("Appointment approved")
      } else if (value === "REJECTED") {
        const reason = prompt("Please provide a reason for rejection (optional):")
        await api.put(`/api/doctor/appointments/${appointmentId}/reject`, { reason })
        toast.success("Appointment rejected & Refund triggered")
      }
      const { data } = await api.get("/api/doctor/appointments")
      setAppointments(data?.data || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff] p-2 sm:p-6">

      <h1 className="text-2xl font-bold text-[#0f4c81] mb-6">
        Doctor Dashboard
      </h1>

      <div className="bg-white rounded-2xl shadow p-2 sm:p-5">

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="pb-4 font-bold uppercase text-xs tracking-widest">Patient</th>
                <th className="pb-4 font-bold uppercase text-xs tracking-widest">Date</th>
                <th className="pb-4 font-bold uppercase text-xs tracking-widest">Time</th>
                <th className="pb-4 font-bold uppercase text-xs tracking-widest">Payment</th>
                <th className="pb-4 font-bold uppercase text-xs tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">
                    No appointments found
                  </td>
                </tr>
              )}
              {appointments.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="py-4 font-bold text-[#0f4c81]">{a.patient?.name}</td>
                  <td className="py-4 text-gray-600">{a.date}</td>
                  <td className="py-4 text-gray-600 font-medium">{a.time?.slice(0, 5)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                      ${a.paymentStatus === 'PAID' ? 'bg-green-600 text-white' :
                        a.paymentStatus === 'REFUNDED' ? 'bg-orange-500 text-white' :
                          'bg-red-500 text-white'}`}>
                      {a.paymentStatus === 'PAID' ? 'Paid' : a.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4">
                    {a.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(a.id, 'APPROVED')}
                          className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition shadow-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(a.id, 'REJECTED')}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition shadow-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`font-black text-xs uppercase tracking-widest ${a.status === 'APPROVED' ? 'text-green-600' : a.status === 'COMPLETED' ? 'text-blue-600' : 'text-red-600'}`}>
                        {a.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-4">
          {appointments.length === 0 && (
            <p className="text-center py-10 text-gray-400">No appointments found</p>
          )}
          {appointments.map((a) => (
            <div key={a.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</p>
                  <p className="font-bold text-[#0f4c81] text-lg">{a.patient?.name}</p>
                </div>
                <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest
                  ${a.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' :
                    a.paymentStatus === 'REFUNDED' ? 'bg-orange-100 text-orange-600' :
                      'bg-red-100 text-red-500'}`}>
                  {a.paymentStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 bg-white p-3 rounded-xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                  <p className="text-sm font-bold text-gray-700">{a.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</p>
                  <p className="text-sm font-bold text-gray-700">{a.time?.slice(0, 5)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                {a.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => updateStatus(a.id, 'APPROVED')}
                      className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-600 transition shadow-md shadow-green-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(a.id, 'REJECTED')}
                      className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-red-600 transition shadow-md shadow-red-200"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <div className={`w-full py-2 rounded-xl text-center font-black text-xs uppercase tracking-widest
                    ${a.status === 'APPROVED' ? 'bg-green-50 text-green-600' : 
                      a.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>
                    {a.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;