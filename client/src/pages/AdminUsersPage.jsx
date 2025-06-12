import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';



const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalUser, setModalUser] = useState(null); // ✅ Modal state
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const itemsPerPage = 5;

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setUsers(data || []);
    } catch (err) {
      toast.error('❌ Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [userInfo.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const changeRole = async (id, role) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('✅ Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('❌ Role update failed');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success('🗑️ User deleted');
      fetchUsers();
    } catch (err) {
      toast.error('❌ Delete failed');
    }
  };

  const suspendOrActivate = async (id, isSuspended) => {
    const route = isSuspended ? 'activate' : 'suspend';
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/${route}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success(isSuspended ? '✅ User activated' : '🚫 User suspended');
      fetchUsers();
    } catch (err) {
      toast.error('❌ Action failed');
    }
  };

  const resetPassword = async (id, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      toast.warning('⚠️ Password must be at least 6 characters');
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('🔁 Password reset');
      setEditForm({ ...editForm, password: '' });
    } catch (err) {
      toast.error('❌ Reset failed');
    }
  };

  const updateUserInfo = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${id}/edit`,
        { name: editForm.name, email: editForm.email },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success('📝 Info updated');
      setModalUser(null);
      fetchUsers();
    } catch (err) {
      toast.error('❌ Update failed');
    }
  };

  const filteredUsers = users
  .filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter(u => (filterRole === 'all' ? true : u.role === filterRole))
  .filter(u => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'suspended') return u.isSuspended;
    if (filterStatus === 'active') return !u.isSuspended;
  });


  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

const exportToCSV = () => {
  if (!users || users.length === 0) {
    toast.warning("⚠️ No user data to export");
    return;
  }

  const formatted = users.map(u => ({
    Name: u.name,
    Email: u.email,
    Role: u.role,
    Suspended: u.isSuspended ? "Yes" : "No",
    Created: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  XLSX.writeFile(workbook, "creme_users.csv");
};


  return (
    <>
      <h2 style={{ marginBottom: '1rem' }}>👥 Manage Users</h2>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
  <button
    onClick={exportToCSV}
    style={{
      padding: '0.5rem 1rem',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    📥 Export CSV
  </button>
</div>

<div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
  <select
    value={filterRole}
    onChange={(e) => setFilterRole(e.target.value)}
    style={{ padding: '0.5rem', borderRadius: '4px' }}
  >
    <option value="all">All Roles</option>
    <option value="customer">Customer</option>
    <option value="shopmanager">Shop Manager</option>
    <option value="admin">Admin</option>
    <option value="superadmin">Super Admin</option>
  </select>

  <select
    value={filterStatus}
    onChange={(e) => setFilterStatus(e.target.value)}
    style={{ padding: '0.5rem', borderRadius: '4px' }}
  >
    <option value="all">All Status</option>
    <option value="active">Active</option>
    <option value="suspended">Suspended</option>
  </select>
</div>


      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search by name or email..."
        style={{
          padding: '0.5rem',
          width: '100%',
          maxWidth: '300px',
          marginBottom: '1.5rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />

      {loading ? (
        <p>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p style={{ color: '#888' }}>No matching users found.</p>
      ) : (


        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {paginatedUsers.map((user) => (
            <li
              key={user._id}
              style={{
                backgroundColor: '#fff',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {user.name || 'Unnamed User'}{' '}
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  ({user.email || 'No Email'})
                </span>
              </div>

              <div style={{ marginTop: '0.3rem', fontSize: '0.85rem', color: '#555' }}>
                <strong>Joined:</strong>{' '}
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </div>

              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                <strong>Role:</strong>{' '}
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  style={{
                    padding: '0.3rem',
                    borderRadius: '4px',
                    minWidth: '130px',
                    marginRight: '0.5rem',
                  }}
                >
                  <option value="customer">Customer</option>
                  <option value="shopmanager">Shop Manager</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <span style={badgeFor(user.role)}>{user.role}</span>
                {user.isSuspended && <span style={badgeFor('suspended')}>Suspended</span>}
              </div>

              {user._id !== userInfo._id && (
                <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => {
                    setModalUser(user);
                    setEditForm({ name: user.name, email: user.email, password: '' });
                  }}
                    style={buttonStyle('#ffc107')}
                  >📝 Edit</button>

                  <button onClick={() => suspendOrActivate(user._id, user.isSuspended)}
                    style={buttonStyle(user.isSuspended ? '#28a745' : '#dc3545')}
                  >
                    {user.isSuspended ? '✅ Activate' : '🚫 Suspend'}
                  </button>

                  <button onClick={() => deleteUser(user._id)} style={buttonStyle('#6c757d')}>🗑️ Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: index + 1 === currentPage ? '#007bff' : '#fff',
                color: index + 1 === currentPage ? '#fff' : '#000',
                cursor: 'pointer',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {modalUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px'
          }}>
            <h3>Edit {modalUser.name}</h3>
            <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Name" style={inputStyle} />
            <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              placeholder="Email" style={inputStyle} />
            <input value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })}
              placeholder="New Password" style={inputStyle} type="password" />

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button onClick={() => updateUserInfo(modalUser._id)} style={buttonStyle('#007bff')}>💾 Save</button>
              <button onClick={() => resetPassword(modalUser._id, editForm.password)} style={buttonStyle('#ffc107')}>🔁 Reset Password</button>
              <button onClick={() => setModalUser(null)} style={buttonStyle('#6c757d')}>❌ Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ✅ Role badge colors
const badgeFor = (role) => {
  const base = {
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    marginLeft: '0.5rem',
    color: '#fff',
  };

  switch (role) {
    case 'superadmin': return { ...base, backgroundColor: '#6f42c1' };
    case 'admin': return { ...base, backgroundColor: '#007bff' };
    case 'shopmanager': return { ...base, backgroundColor: '#17a2b8' };
    case 'suspended': return { ...base, backgroundColor: '#dc3545' };
    default: return { ...base, backgroundColor: '#6c757d' };
  }
};

const buttonStyle = (color) => ({
  backgroundColor: color,
  color: '#fff',
  padding: '0.4rem 0.8rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
});

const inputStyle = {
  padding: '0.5rem',
  width: '100%',
  marginBottom: '0.8rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

export default AdminUsersPage;

