import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle
} from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import registerBanner from '../assets/banners/register-banner.png';

// 🔐 Firebase
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const redirectByRole = (role) => {
    switch (role) {
      case 'admin':
      case 'superadmin':
      case 'shopmanager':
        return navigate('/admin');
      case 'customer':
      default:
        return navigate('/account/profile');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });

      if (!data || !data.token) {
        toast.error('Registration failed. Invalid response.');
        return;
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`🎉 Welcome ${data.name}!`);
      redirectByRole(data.role);
    } catch (err) {
      toast.error('❌ Email already exists or server error');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const payload = {
        name: user.displayName,
        email: user.email,
        password: user.uid,
        photoURL: user.photoURL,
      };

      const { data } = await axios.post('/api/users/register', payload);

      const enriched = {
        ...data,
        name: user.displayName || data.name,
        photoURL: user.photoURL || '',
      };

      localStorage.setItem('userInfo', JSON.stringify(enriched));
      toast.success(`✅ Registered as ${enriched.name}`);
      redirectByRole(enriched.role);
    } catch (err) {
      console.error('Google Sign-Up Error:', err);
      toast.error('❌ Google Sign-Up failed.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${registerBanner})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="bg-white bg-opacity-90 max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl backdrop-blur-sm animate-fadeIn"
        data-aos="zoom-in"
      >
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Join Creme Collections – enjoy exclusive perks
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex items-center border px-3 py-2 rounded-md bg-white shadow-sm">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full outline-none bg-transparent"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex items-center border px-3 py-2 rounded-md bg-white shadow-sm">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full outline-none bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center border px-3 py-2 rounded-md bg-white shadow-sm">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full outline-none bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded font-semibold transition"
          >
            Register
          </button>

          <div className="text-center text-gray-500 mt-2">or</div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center w-full bg-white text-gray-700 border hover:shadow-md py-2 rounded-md mt-2 transition"
          >
            <FaGoogle className="mr-2 text-red-500" /> Register with Google
          </button>

          <div className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-600 hover:underline">
              Login here
            </Link>
          </div>

          <div className="text-center text-sm mt-2">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
