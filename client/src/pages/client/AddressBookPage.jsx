import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddressBookPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // 🔄 Load from DB
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('/api/users/addresses', config);
        setAddresses(data);
      } catch (err) {
        toast.error('❌ Failed to load addresses');
        console.error('GET error:', err);
      }
    };
    fetchAddresses();
  }, [userInfo.token]);

  // 📤 Sync to DB
  const syncAddresses = async (list) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put('/api/users/addresses', { addresses: list }, config);
      setAddresses(list);
      toast.success('✅ Address book updated');
    } catch (err) {
      toast.error('❌ Failed to update addresses');
      console.error('PUT error:', err);
    }
  };

  // ➕ Add New
  const handleAdd = () => {
    if (!newLabel.trim() || !newAddress.trim()) {
      toast.warning('Label and address are required.');
      return;
    }

    const updated = [
      ...addresses.map(a => ({ ...a, isDefault: false })), // make all not default if this is first
      {
        label: newLabel.trim(),
        address: newAddress.trim(),
        isDefault: addresses.length === 0,
      },
    ];
    syncAddresses(updated);
    setNewAddress('');
    setNewLabel('');
  };

  // 🗑️ Delete
  const handleDelete = (index) => {
    if (window.confirm('Delete this address?')) {
      const updated = addresses.filter((_, i) => i !== index);
      syncAddresses(updated);
    }
  };

  // ⭐ Set Default
  const handleSetDefault = (index) => {
    const updated = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    syncAddresses(updated);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-orange-600 flex items-center gap-2 mb-6">
        <FaMapMarkerAlt className="text-orange-600" /> Address Book
      </h2>

      {/* ➕ Add Form */}
      <div className="mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <input
          type="text"
          placeholder="Label (e.g. Home, Office)"
          className="md:w-1/3 w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter delivery address"
          className="flex-1 w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-orange-500 text-white px-5 py-2 rounded-md flex items-center gap-2 hover:bg-orange-600 transition"
        >
          <FaPlus /> Add Address
        </button>
      </div>

      {/* 📍 List */}
      {addresses.length === 0 ? (
        <p className="text-gray-600 text-center py-12">You have no saved addresses yet.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr, i) => (
            <li
              key={i}
              className={`bg-white border rounded-lg px-5 py-4 flex justify-between items-center shadow-sm hover:shadow-md transition ${
                addr.isDefault ? 'border-orange-500' : 'border-gray-200'
              }`}
            >
              <div className="text-gray-800">
                <p className="font-semibold text-orange-600">{addr.label}</p>
                <p className="text-sm">{addr.address}</p>
                {addr.isDefault && (
                  <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                    <FaCheckCircle /> Default Address
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(i)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(i)}
                  className="text-red-600 text-sm hover:underline flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressBookPage;
