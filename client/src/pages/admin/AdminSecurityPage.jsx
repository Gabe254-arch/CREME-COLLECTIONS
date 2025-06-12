import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import axios from 'axios';

const AdminSecurityPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get('/api/logs/traffic');
        setLogs(data);
      } catch (err) {
        console.error('❌ Failed to fetch traffic logs', err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">🛡️ Security & Traffic Logs</h2>
        <div className="overflow-auto max-h-[600px] bg-white shadow-md rounded p-4">
          {logs.map((log, idx) => (
            <div key={idx} className="border-b py-2 text-sm">
              <strong>{log.timestamp}</strong> - {log.method} {log.url} <br />
              IP: {log.ip} | Referrer: {log.referrer}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurityPage;
