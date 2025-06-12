import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import loginBanner from '../assets/banners/login-banner.png';

// 🔐 Firebase Auth
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
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
        return navigate('/account/profile');
      default:
        return navigate('/');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/login', { email, password });

      if (!data || !data.token) {
        toast.error('Login failed. Invalid response.');
        return;
      }

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success(`✅ Welcome back, ${data.name}`);
      redirectByRole(data.role);
    } catch (err) {
      console.error(err);
      toast.error('❌ Invalid login credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const loginPayload = {
        email: user.email,
        password: user.uid, // match with backend Google UID logic
      };

      const { data } = await axios.post('/api/users/login', loginPayload);

      const enriched = {
        ...data,
        name: user.displayName || data.name,
        photoURL: user.photoURL || '',
      };

      localStorage.setItem('userInfo', JSON.stringify(enriched));
      toast.success(`✅ Logged in as ${enriched.name}`);
      redirectByRole(enriched.role);
    } catch (error) {
      console.error('Google Login Error:', error);
      toast.error('❌ Google login failed.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${loginBanner})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="bg-white bg-opacity-90 max-w-md w-full mx-4 p-8 rounded-xl shadow-xl backdrop-blur-sm animate-fadeIn"
        data-aos="zoom-in"
      >
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-700 mb-6">
          Log in to your Creme Collections account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex items-center border px-3 py-2 rounded-md bg-white shadow-sm">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              required
              placeholder="Email address"
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
            Login
          </button>

          <div className="text-center text-gray-500 mt-2">or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full bg-white text-gray-700 border hover:shadow-md py-2 rounded-md mt-2 transition"
          >
            <FaGoogle className="mr-2 text-red-500" /> Login with Google
          </button>

          <div className="text-center text-sm text-gray-700 mt-3">
            <Link to="/forgot" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="text-center text-sm mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-orange-600 hover:underline">
              Create one
            </Link>
          </div>

          <div className="text-center text-sm mt-2">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Continue Shopping
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
