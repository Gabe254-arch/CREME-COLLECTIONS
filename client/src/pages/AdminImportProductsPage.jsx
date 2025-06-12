import React, { useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const AdminImportProductsPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleUpload = async () => {
    if (!file) return alert('Please select a CSV file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/products/import-csv',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setMessage(data.message);
    } catch (err) {
      setMessage('❌ Upload failed. Check server log.');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, padding: '2rem' }}>
        <h2>📥 Import Products from CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button onClick={handleUpload} style={{ padding: '10px 20px' }}>
          Upload CSV
        </button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default AdminImportProductsPage;
