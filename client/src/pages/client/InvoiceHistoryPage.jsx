import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilePdf } from 'react-icons/fa';

const InvoiceHistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/invoice-history', config);
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch invoice logs', err);
      }
    };

    fetchLogs();
  }, [userInfo.token]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-orange-600 mb-6">🧾 Invoice Download History</h2>

      {logs.length === 0 ? (
        <p className="text-gray-600">You haven’t downloaded any invoices yet.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white border p-4 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Order ID:</span>{' '}
                  <span className="text-blue-600">{log.order._id}</span>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Total:</span>{' '}
                  Ksh {log.order.totalPrice?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  Downloaded on: {new Date(log.downloadedAt).toLocaleString()}
                </p>
              </div>
              <a
                href={`/api/orders/${log.order._id}/invoice`}
                className="text-orange-600 hover:text-orange-700 flex items-center gap-2 text-sm"
              >
                <FaFilePdf /> Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistoryPage;
