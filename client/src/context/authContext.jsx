import React, { createContext, useState, useContext, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // ✅ make sure this path is correct

// Create the AuthContext
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
    setIsAuthenticated(true);
  };

  // 🔐 Logout function with Firebase
  const logout = async () => {
    try {
      await signOut(auth); // ✅ Firebase logout
    } catch (err) {
      console.warn('Firebase signOut failed:', err);
    }
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);
