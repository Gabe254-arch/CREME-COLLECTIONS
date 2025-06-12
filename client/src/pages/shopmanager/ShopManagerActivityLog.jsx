import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const ShopManagerActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('http://localhost:5000/api/logs/mine', config);
        setLogs(data || []);
      } catch (err) {
        console.error('❌ Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [userInfo.token]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">📜 My Activity Log</h2>

        {loading ? (
          <p>Loading logs...</p>
        ) : logs.length === 0 ? (
          <p>No actions recorded.</p>
        ) : (
          <ul className="space-y-3 text-sm text-gray-700">
            {logs.map((log, i) => (
              <li key={i} className="bg-white p-4 border rounded shadow-sm">
                <div className="flex justify-between items-center">
                  <span>{log.message}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ShopManagerActivityLog;
