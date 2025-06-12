import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <AdminSidebar />
      <div style={{
        flex: 1,
        backgroundColor: '#F9F9F9FF',
        padding: '2rem',
        overflowY: 'auto'
      }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
