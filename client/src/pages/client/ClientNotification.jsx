import React, { useEffect, useState } from 'react';
import { FaBell, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ClientNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
    setUser(userInfo);

    if (userInfo?.token) {
      const fetchNotifications = async () => {
        try {
          const { data } = await axios.get(
            'http://localhost:5000/api/notifications/client',
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          setNotifications(data);
        } catch (error) {
          console.error('🔔 Failed to fetch notifications', error);
        }
      };

      fetchNotifications();
    }
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && notifications.length > 0 && (
        <motion.div
          className="fixed bottom-4 right-4 w-80 bg-white shadow-lg border border-orange-400 rounded-xl z-50 overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaBell className="text-lg animate-pulse" />
              <h3 className="text-sm font-bold">Notifications</h3>
            </div>
            <button onClick={handleClose}>
              <FaTimesCircle className="text-white hover:text-gray-200 text-lg" />
            </button>
          </div>

          <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto text-sm">
            {notifications.map((note) => (
              <li key={note._id} className="p-4 hover:bg-gray-50">
                <p className="font-semibold text-gray-800">{note.title}</p>
                <p className="text-gray-600 text-xs mt-1">{note.message}</p>
                <p className="text-gray-400 text-xs mt-1 text-right italic">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientNotification;
