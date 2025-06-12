import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaFilePdf, FaFilter, FaChartBar, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminSummaryPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('7days');
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (!userInfo?.token || !['admin', 'superadmin'].includes(userInfo.role)) {
      alert('Access denied: Admins only');
      navigate('/login');
    }
  }, [navigate, userInfo]);

 useEffect(() => {
  const fetchLogs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/logs', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        console.warn('Logs response is not an array:', data);
        setLogs([]);
      }
    } catch (err) {
      console.error('Error fetching logs:', err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }


    
  };

  fetchLogs();
}, [userInfo.token]);




  const filterLogs = () => {
    const now = new Date();
    return logs.filter((log) => {
      const created = new Date(log.createdAt);
      if (dateFilter === '7days') {
        const past = new Date(now);
        past.setDate(now.getDate() - 7);
        return created >= past;
      } else if (dateFilter === '30days') {
        const past = new Date(now);
        past.setDate(now.getDate() - 30);
        return created >= past;
      }
      return true;
    });
  };

  const filteredLogs = filterLogs();

  const chartData = () => {
    const counts = {};
    filteredLogs.forEach((log) => {
      const admin = log.adminId?.name || 'Unknown';
      counts[admin] = (counts[admin] || 0) + 1;
    });
    return Object.entries(counts).map(([admin, count]) => ({ admin, count }));
  };

  const getSummaryText = (logs) => {
    if (!logs.length) return 'No log activity in this period.';
    const report = {};
    logs.forEach((log) => {
      const admin = log.adminId?.name || 'Unknown';
      const action = log.action;
      if (!report[admin]) report[admin] = {};
      report[admin][action] = (report[admin][action] || 0) + 1;
    });

    let summary = '';
    for (const admin in report) {
      summary += `🔹 ${admin}:\n`;
      for (const action in report[admin]) {
        summary += `   • ${action} — ${report[admin][action]} times\n`;
      }
    }
    return summary;
  };

  const exportToPDF = () => {
    const input = document.getElementById('summary-container');
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
      pdf.save('AdminLogsSummary.pdf');
    });
  };

  return (
    <div style={{ display: 'flex' }}>
     

      <main style={{ flex: 1, padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
        <div id="summary-container">
          <h2 style={{ marginBottom: '1rem', color: '#333', display: 'flex', alignItems: 'center' }}>
            <FaChartBar style={{ marginRight: '10px' }} /> Admin Activity Summary
          </h2>

          {/* Top Filters */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <FaFilter style={{ marginRight: '6px' }} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </label>

            <button
              onClick={exportToPDF}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaFilePdf style={{ marginRight: '6px' }} />
              Export PDF
            </button>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="admin" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary Box */}
          <div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h4 style={{ color: '#333', display: 'flex', alignItems: 'center' }}>
              <FaUserShield style={{ marginRight: '8px' }} /> Admin Breakdown
            </h4>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '10px', fontSize: '14px' }}>
              {loading ? '⏳ Loading logs...' : getSummaryText(filteredLogs)}
            </pre>
          </div>

          {/* Error Fallback */}
          {!loading && filteredLogs.length === 0 && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#fff3cd',
                border: '1px solid #ffeeba',
                borderRadius: '6px',
                color: '#856404',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaExclamationTriangle style={{ marginRight: '8px' }} />
              No log data found in this period.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminSummaryPage;
