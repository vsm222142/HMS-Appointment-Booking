import React, { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'

const MyProfile = () => {

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)
  const [userData, setUserData] = useState(null)
  const [password, setPassword] = useState('')
  const { api, user, setUser } = useContext(AppContext)

  const uploadFile = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.info("Uploading image...");
      const res = await api.post("/api/public/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUserData(prev => ({ ...prev, image: res.data.url }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  // ✅ Load profile from API
  const loadProfile = async () => {
    if (!user) return
    try {
      if (user.role === 'PATIENT' || user.role === 'USER') {
        const { data } = await api.get("/api/patient/profile")
        const p = data?.data || {}
        setUserData({
          name: p.user?.name || "",
          email: p.user?.email || "",
          phone: p.phone || "",
          gender: p.gender || "Not Selected",
          dob: "",
          address: { line1: p.address || "", line2: "" },
          image: p.user?.imageUrl || assets.profile_pic,
          age: p.age || ""
        })
      } else if (user.role === 'DOCTOR') {
        const { data } = await api.get("/api/doctor/profile")
        const p = data?.data || {}
        setUserData({
          name: p.user?.name || "",
          email: p.user?.email || "",
          phone: "",
          gender: "Not Selected",
          dob: "",
          address: { line1: "", line2: "" },
          image: p.imageUrl || assets.profile_pic,
          age: "",
          specialization: p.specialization || "",
          experience: p.experience || "",
          departmentId: p.department?.id || ""
        })
      } else {
        // For Admin, just show basic user info
        setUserData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: user.gender || "Not Selected",
          dob: "",
          address: { line1: "", line2: "" },
          image: user.imageUrl || assets.profile_pic,
          age: ""
        })
      }
    } catch (err) {
      toast.error("Error loading profile")
    }
  }

  useEffect(() => { loadProfile() }, [user])

    const updateUserProfileData = async () => {
        try {
            // 1. Update basic info (Name, Image, Gender, Phone, Password) for all roles
            const { data: basicRes } = await api.put("/api/me/profile", {
                name: userData.name,
                imageUrl: userData.image,
                gender: userData.gender,
                phone: userData.phone,
                password: password
            });
            
            // 2. Role-specific updates
            if (user.role === 'PATIENT' || user.role === 'USER') {
                await api.put("/api/patient/profile", {
                    age: userData.age === "" ? null : Number(userData.age),
                    gender: (!userData.gender || userData.gender === "Not Selected") ? null : userData.gender.toUpperCase(),
                    phone: userData.phone || "",
                    address: userData.address?.line1 || ""
                });
            } else if (user.role === 'DOCTOR') {
                await api.put("/api/doctor/update", {
                    specialization: userData.specialization,
                    experience: userData.experience,
                    departmentId: userData.departmentId ? Number(userData.departmentId) : null,
                    imageUrl: userData.image
                });
            }
            
            // Success: Update global user state for Navbar sync
            if (basicRes?.data) {
                setUser(basicRes.data);
            }

            toast.success("Profile updated successfully!");
            setIsEdit(false);
            setPassword('');
            await loadProfile(); // Refresh local state
        } catch (err) {
            console.error("Update Profile Error:", err);
            toast.error(err?.response?.data?.message || "Internal server error during update");
        }
    }

  return userData ? (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-2xl bg-white p-4 sm:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col gap-6 text-sm mt-5'
    >

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Profile Image */}
        <div className="relative group cursor-pointer">
          <div className='w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-50 flex items-center justify-center transition-all group-hover:scale-105'>
            <img
              className='w-full h-full object-cover'
              src={userData.image || assets.profile_pic}
              alt="Profile"
            />
          </div>
          {isEdit && (
            <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <img className='w-10' src={assets.upload_icon} alt="Upload" />
              <input
                type="file"
                id="profile-upload"
                hidden
                accept="image/*"
                onChange={(e) => uploadFile(e.target.files[0])}
              />
            </label>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          {isEdit ? (
            <input
              className='bg-gray-50 text-3xl font-bold text-[#0f4c81] w-full p-2 rounded-xl border border-gray-200'
              type="text"
              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
              value={userData.name}
            />
          ) : (
            <h1 className='font-bold text-3xl text-[#0f4c81]'>
              {userData.name}
            </h1>
          )}
          <p className="text-gray-500 font-medium mt-1 uppercase tracking-wider">{user?.role}</p>
        </div>
      </div>

      <hr className='border-gray-100' />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CONTACT */}
        <div>
          <p className='text-[#0f4c81] font-bold mb-4 flex items-center gap-2'>
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            CONTACT INFORMATION
          </p>

          <div className='flex flex-col gap-3'>
            <div>
              <p className='text-gray-400 text-xs font-bold uppercase'>Email</p>
              <p className='text-gray-700 font-medium'>{userData.email}</p>
            </div>

            {user.role === 'DOCTOR' ? (
              <>
                <div>
                  <p className='text-gray-400 text-xs font-bold uppercase'>Specialization</p>
                  {isEdit ? (
                    <input
                      className='bg-gray-50 p-2 rounded-xl w-full border border-gray-200'
                      value={userData.specialization}
                      onChange={(e) => setUserData(prev => ({ ...prev, specialization: e.target.value }))}
                    />
                  ) : (
                    <p className='text-gray-700 font-medium'>{userData.specialization}</p>
                  )}
                </div>
                <div>
                  <p className='text-gray-400 text-xs font-bold uppercase'>Experience</p>
                  {isEdit ? (
                    <input
                      className='bg-gray-50 p-2 rounded-xl w-full border border-gray-200'
                      value={userData.experience}
                      onChange={(e) => setUserData(prev => ({ ...prev, experience: e.target.value }))}
                    />
                  ) : (
                    <p className='text-gray-700 font-medium'>{userData.experience}</p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <p className='text-gray-400 text-xs font-bold uppercase'>Phone</p>
                {isEdit ? (
                  <input
                    className='bg-gray-50 p-2 rounded-xl w-full border border-gray-200'
                    value={userData.phone}
                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                ) : (
                  <p className='text-gray-700 font-medium'>{userData.phone || 'Not provided'}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BASIC INFO */}
        <div>
          <p className='text-[#0f4c81] font-bold mb-4 flex items-center gap-2'>
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            BASIC INFORMATION
          </p>

          <div className='flex flex-col gap-3'>
            {user.role !== 'DOCTOR' && (
              <div>
                <p className='text-gray-400 text-xs font-bold uppercase'>Gender</p>
                {isEdit ? (
                  <select
                    value={userData.gender}
                    onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                    className='bg-gray-50 rounded-xl w-full p-2 border border-gray-200'
                  >
                    <option>Not Selected</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                ) : (
                  <p className='text-gray-700 font-medium'>{userData.gender}</p>
                )}
              </div>
            )}

            {isEdit && (
              <>
                <div>
                  <p className='text-gray-400 text-xs font-bold uppercase'>Profile Image</p>
                  <input
                    type="file"
                    accept="image/*"
                    className='bg-gray-50 p-2 rounded-xl w-full border border-gray-200 text-xs'
                    onChange={(e) => uploadFile(e.target.files[0])}
                  />
                  {userData.image && (
                    <p className="text-[10px] text-blue-500 font-medium truncate mt-1">
                      Current: {userData.image.split('/').pop()}
                    </p>
                  )}
                </div>
                <div>
                  <p className='text-gray-400 text-xs font-bold uppercase'>Update Password</p>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    className='bg-gray-50 p-2 rounded-xl w-full border border-gray-200'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex justify-center sm:justify-end mt-4'>
        {isEdit ? (
          <div className="flex gap-4">
            <button
              onClick={updateUserProfileData}
              className='bg-primary text-white px-10 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all'
            >
              Save Profile
            </button>
            <button
              onClick={() => { setIsEdit(false); setPassword('') }}
              className='bg-gray-100 text-gray-600 px-10 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all'
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className='border-2 border-primary text-primary px-10 py-3 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm'
          >
            Edit Profile
          </button>
        )}
      </div>

    </motion.div>
  ) : <div className="py-20 text-center text-gray-400">Loading profile...</div>
}

export default MyProfile;