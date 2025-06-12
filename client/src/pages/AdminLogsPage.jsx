// ✅ Enhanced Admin Logs Page with Server Pagination
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FaFileCsv, FaFilePdf, FaChartBar } from 'react-icons/fa';

const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 10;

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: logsPerPage,
      };

      if (actionFilter !== 'all') params.action = actionFilter;
      if (searchTerm) params.keyword = searchTerm;

      // Optional: handle dateFilter conversion if needed
      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        params.startDate = today;
        params.endDate = today;
      } else if (dateFilter === '7days') {
        const past = new Date(); past.setDate(past.getDate() - 7);
        params.startDate = past.toISOString();
      } else if (dateFilter === '30days') {
        const past = new Date(); past.setDate(past.getDate() - 30);
        params.startDate = past.toISOString();
      }

      const { data } = await axios.get('http://localhost:5000/api/logs', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        params,
      });

      setLogs(data.logs);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('❌ Error fetching logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Trigger fetch on filter/search/page change
  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionFilter, dateFilter, searchTerm]);

  // 📊 Chart data
  const colors = ['#f97316', '#22c55e', '#2563eb', '#dc2626', '#7c3aed', '#0ea5e9'];
  const getAdminActionCounts = () => {
    const counts = {};
    logs.forEach(log => {
      const admin = log.adminId?.name || 'Unknown';
      counts[admin] = (counts[admin] || 0) + 1;
    });
    return Object.entries(counts).map(([admin, count]) => ({ admin, count }));
  };

  const getActionTypeCounts = () => {
    const counts = {};
    logs.forEach(log => {
      const action = log.action;
      counts[action] = (counts[action] || 0) + 1;
    });
    return Object.entries(counts).map(([action, count]) => ({ action, count }));
  };

  // 📥 Export to CSV
  const exportToCSV = () => {
    const rows = logs.map(log => ({
      Admin: log.adminId?.name || 'N/A',
      Action: log.action,
      Target: log.targetUserId?.name || 'N/A',
      Notes: log.notes,
      IP: log.ipAddress,
      Date: new Date(log.createdAt).toLocaleString(),
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Logs");
    XLSX.writeFile(wb, "admin_logs.csv");
  };

  // 📄 Export to PDF
  const exportToPDF = () => {
    const input = document.getElementById('logs-table');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save('admin_logs.pdf');
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-orange-500 flex items-center gap-2"><FaChartBar /> Admin Activity Logs</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="p-2 border rounded">
          <option value="all">All Actions</option>
          <option value="create-product">Product Created</option>
          <option value="delete-product">Product Deleted</option>
          <option value="reset-password">Reset Password</option>
          <option value="delete">Delete</option>
          <option value="change-role">Change Role</option>
        </select>

        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="p-2 border rounded">
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>

        <input
          type="text"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-64"
        />

        <button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1">
          <FaFileCsv /> Export CSV
        </button>
        <button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1">
          <FaFilePdf /> Export PDF
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getAdminActionCounts()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="admin" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#f97316" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={getActionTypeCounts()} dataKey="count" nameKey="action" cx="50%" cy="50%" outerRadius={100} label>
              {getActionTypeCounts().map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Logs Table */}
      <div className="overflow-auto" id="logs-table">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-orange-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Admin</th>
              <th className="p-2">Action</th>
              <th className="p-2">Target</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Date</th>
              <th className="p-2">IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={log._id} className="border-b text-sm hover:bg-gray-50">
                <td className="p-2">{(currentPage - 1) * logsPerPage + i + 1}</td>
                <td className="p-2">{log.adminId?.name || 'Unknown'}</td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.targetUserId?.name || 'N/A'}</td>
                <td className="p-2">{log.notes || '-'}</td>
                <td className="p-2">{format(new Date(log.createdAt), 'PPpp')}</td>
                <td className="p-2">{log.ipAddress || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-1 bg-gray-200 rounded">Prev</button>
        <span className="font-medium">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => p < totalPages ? p + 1 : p)} disabled={currentPage === totalPages} className="px-4 py-1 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  );
};

export default AdminLogsPage;
