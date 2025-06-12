import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUserEdit,
  FaEnvelope,
  FaKey,
  FaUpload,
  FaBoxOpen,
  FaRegImage,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [ordersCount, setOrdersCount] = useState(0);
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const profileRes = await axios.get('/api/users/profile', config);
        const ordersRes = await axios.get('/api/orders/myorders', config);

        setName(profileRes.data.name || '');
        setEmail(profileRes.data.email || '');
        setProfileImage(profileRes.data.profileImage || '');
        setLastUpdated(profileRes.data.updatedAt || '');
        setOrdersCount(ordersRes.data.length || 0);
      } catch (err) {
        console.error('❌ Fetch error:', err);
        toast.error('Failed to load profile.');
      }
    };

    fetchData();
  }, [userInfo.token]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/upload/profile', formData, config);
      setProfileImage(data.url);
      toast.success('✅ Profile image updated!');
    } catch (err) {
      console.error('❌ Upload error:', err);
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/users/profile',
        { name, email, password, profileImage },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('✅ Profile updated successfully!');
      setPassword('');
      setLastUpdated(data.updatedAt);
    } catch (err) {
      console.error('❌ Profile update error:', err);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 mb-12">
      <h2 className="text-2xl font-bold text-orange-600 mb-6 flex items-center gap-2">
        <FaUserEdit /> Manage My Profile
      </h2>

      {/* Profile Summary */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-gray-50 p-4 rounded-lg border border-orange-100 mb-6">
        <img
          src={profileImage || '/default-avatar.png'}
          alt="Profile"
          className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-orange-200 shadow-sm"
        />
        <div className="flex-1 space-y-1">
          <p className="text-gray-800 flex items-center gap-2">
            <FaEnvelope className="text-gray-400" />
            <span className="font-semibold">{email}</span>
          </p>
          <p className="text-gray-600">Last updated: {new Date(lastUpdated).toLocaleString()}</p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaBoxOpen className="text-gray-400" />
            Orders placed: <strong>{ordersCount}</strong>
          </p>
          <div className="mt-2 flex items-center gap-3">
            <label
              htmlFor="fileUpload"
              className="cursor-pointer text-blue-600 hover:underline text-sm flex items-center gap-1"
            >
              <FaUpload /> Upload New Photo
            </label>
            <input
              type="file"
              id="fileUpload"
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
          </div>
        </div>
      </div>

      {/* Profile Update Form */}
      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
            value={email}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 flex items-center gap-1">
            <FaKey className="text-gray-400" />
            New Password <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="password"
            className="w-full border px-4 py-2 rounded"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded shadow-md transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
