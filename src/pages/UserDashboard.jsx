import React, { useContext, useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const UserDashboard = () => {

  const { user, api } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    const run = async () => {
      if (!user) return
      try {
        const { data } = await api.get("/api/appointments")
        setAppointments(data?.data || [])
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message)
      }
    }
    run()
  }, [user])

  return (
    <div className="min-h-screen bg-[#f4f8ff] p-6">

      <h1 className="text-2xl font-bold text-[#0f4c81] mb-6">
        Welcome {user?.name}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Profile */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">My Profile</h2>
          <MyProfile />
        </div>

        {/* Appointments */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">My Appointments</h2>

          {appointments.length === 0 ? (
            <p>No appointments yet</p>
          ) : (
            appointments.map((item,i)=>(
              <div key={i}
                className="border p-3 rounded-xl mb-2">
                <p className="font-medium">{item.doctor?.name}</p>
                <p className="text-sm text-gray-500">{item.date} {item.time?.slice(0,5)} — {item.status}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;