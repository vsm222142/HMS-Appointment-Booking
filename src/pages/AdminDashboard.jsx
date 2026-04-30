import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const AdminDashboard = () => {

  const { api, user: currentUser } = useContext(AppContext)
  const [doctors, setDoctors] = useState([])
  const [admins, setAdmins] = useState([])
  const [departments, setDepartments] = useState([])

  const [editId, setEditId] = useState(null)
  const [activeTab, setActiveTab] = useState('doctors') // 'doctors' or 'admins'

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [experience, setExperience] = useState("")
  const [available, setAvailable] = useState(true)
  const [departmentId, setDepartmentId] = useState("")
  const [image, setImage] = useState("")

  const load = async () => {
    try {
      const d = await api.get("/api/public/doctors")
      setDoctors(d.data?.data || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
    try {
      const dep = await api.get("/api/admin/departments")
      setDepartments(dep.data?.data || [])
    } catch { }
    try {
      const u = await api.get("/api/admin/users")
      const allUsers = u.data?.data || []
      setAdmins(allUsers.filter(u => u.role === 'ADMIN'))
    } catch { }
  }

  const uploadFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.info("Uploading image...");
      const res = await api.post("/api/public/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(res.data.url);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  useEffect(() => { load() }, [])

  const handleAction = async () => {
    // Basic validation
    if (!name || !email) return toast.error("Name and Email are required")
    if (!editId && !password) return toast.error("Password is required for new registration")
    if (activeTab === 'doctors' && !image) return toast.error("Doctor photo URL is required")

    try {
      const payload = {
        name, email, password, specialization, experience, available,
        departmentId: departmentId ? Number(departmentId) : null,
        imageUrl: image
      }

      if (activeTab === 'admins') {
        await api.post("/api/admin/create-admin", payload)
        toast.success("New Admin created successfully")
      } else if (editId) {
        await api.put(`/api/admin/doctors/${editId}`, payload)
        toast.success("Doctor profile updated")
      } else {
        await api.post("/api/admin/doctors", payload)
        toast.success("New Doctor registered")
      }

      // Reset form
      setName(""); setEmail(""); setPassword(""); setSpecialization(""); setExperience(""); setDepartmentId(""); setImage("");
      setEditId(null);
      await load()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const deleteDoctor = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this doctor?")) return
    try {
      await api.delete(`/api/admin/doctors/${userId}`)
      toast.success("Doctor removed")
      await load()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const deleteAdmin = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this admin account?")) return
    try {
      await api.delete(`/api/admin/users/${userId}`)
      toast.success("Admin account removed")
      await load()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message)
    }
  }

  const startEdit = (doc) => {
    setEditId(doc.userId)
    setName(doc.name)
    setEmail(doc.email)
    setSpecialization(doc.specialization)
    setExperience(doc.experience)
    setAvailable(doc.available)
    setDepartmentId(doc.department?.id || "")
    setImage(doc.imageUrl || "")
    setActiveTab('doctors')
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-[#f8faff] p-2 sm:p-4 md:p-10">

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0f4c81] tracking-tight">
              Control Center
            </h1>
            <p className="text-gray-500 font-medium">Manage your hospital staff and administrators</p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'doctors' ? 'bg-[#0f4c81] text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Doctors
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'admins' ? 'bg-[#0f4c81] text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Admins
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl mb-12 border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <h2 className="text-xl font-bold text-[#0f4c81] mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            {activeTab === 'admins' ? 'Register New Administrator' : editId ? 'Update Doctor Profile' : 'Register New Medical Staff'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. John Doe"
                className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@hospital.com"
                disabled={!!editId}
                className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
              <input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder={editId ? "••••••••" : "Min 6 characters"}
                className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
              />
            </div>

            {activeTab === 'doctors' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                  <input
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Neurology"
                    className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Experience</label>
                  <input
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="8+ Years"
                    className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                  />
                </div>

                <div className="lg:col-span-1 space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profile Photo</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadFile(e.target.files[0])}
                      className="w-full bg-gray-50 border-none p-3 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700 text-sm"
                    />
                    {image && (
                      <p className="text-[10px] text-blue-500 font-medium truncate ml-1">
                        Selected: {image.split('/').pop()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 self-end h-[56px]">
                  <input
                    type="checkbox"
                    id="avail"
                    className="w-5 h-5 accent-blue-600"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                  />
                  <label htmlFor="avail" className="text-sm font-bold text-gray-600 cursor-pointer">Available</label>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-4 mt-10">
            <button
              onClick={handleAction}
              className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex-1 md:flex-none"
            >
              {editId ? 'Save Changes' : activeTab === 'admins' ? 'Create Admin Account' : 'Confirm Registration'}
            </button>
            {editId && (
              <button
                onClick={() => {
                  setEditId(null);
                  setName(""); setEmail(""); setPassword(""); setSpecialization(""); setExperience(""); setDepartmentId(""); setImage("");
                }}
                className="bg-gray-100 text-gray-500 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Discard
              </button>
            )}
          </div>
        </motion.div>

        {/* Listings */}
        <div className="grid grid-cols-1 gap-10">

          {activeTab === 'doctors' ? (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f4c81] flex items-center gap-2">
                Medical Staff List <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{doctors.length}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((d) => (
                  <motion.div
                    layout
                    key={d.id}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    <div className="flex gap-5 items-center mb-6">
                      <img
                        src={d.imageUrl || assets.profile_pic}
                        className="w-20 h-20 rounded-[1.5rem] object-cover shadow-inner bg-gray-100 border-2 border-white"
                        alt={d.name}
                      />
                      <div>
                        <p className="font-black text-[#0f4c81] text-xl leading-tight mb-1">{d.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{d.specialization}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Exp.</p>
                        <p className="text-sm font-black text-gray-700">{d.experience || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Status</p>
                        <p className={`text-sm font-black ${d.available ? 'text-green-600' : 'text-red-500'}`}>{d.available ? 'Active' : 'Offline'}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(d)}
                        className="flex-1 bg-indigo-50 text-indigo-600 py-3 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all text-sm"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => deleteDoctor(d.userId)}
                        className="flex-1 bg-red-50 text-red-500 py-3 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f4c81] flex items-center gap-2">
                Administrator Accounts <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{admins.length}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {admins.map((adm) => (
                    <div key={adm.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group relative overflow-hidden">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black group-hover:scale-110 transition-transform">
                          {adm.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 flex items-center gap-2">
                            {adm.name}
                            {adm.email === currentUser?.email && (
                              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black">YOU</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">{adm.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {adm.email === currentUser?.email ? (
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">System Owner</p>
                        ) : (
                          <button
                            onClick={() => deleteAdmin(adm.id)}
                            className="opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            title="Remove Administrator"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;