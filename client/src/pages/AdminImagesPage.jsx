import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaTrash, FaSearch, FaEye, FaDownload, FaTag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import debounce from 'lodash.debounce';

const AdminImagesPage = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // ✅ Fetch images from backend
  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/images');
      setImages(data);
    } catch (error) {
      toast.error('❌ Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [refresh]);

  // ✅ Smart filtering
  const filteredImages = images.filter((img) => {
    const filenameMatch = img.filename?.toLowerCase().includes(search.toLowerCase());
    const purposeMatch = purposeFilter === 'all' || img.purpose === purposeFilter;
    return filenameMatch && purposeMatch;
  });

  // ✅ Delete handler
  const deleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await axios.delete(`/api/images/${id}`);
      toast.success('🗑️ Image deleted');
      setRefresh((prev) => !prev);
    } catch (err) {
      toast.error('❌ Failed to delete image');
    }
  };

  // ✅ Debounced search input
  const debouncedSearch = useCallback(
    debounce((val) => setSearch(val), 300),
    []
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">🖼️ Image Manager</h1>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by filename or keyword..."
          className="border px-3 py-2 rounded w-full md:w-1/3"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded"
          value={purposeFilter}
          onChange={(e) => setPurposeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="product">Product</option>
          <option value="profile">Profile</option>
          <option value="banner">Banner</option>
          <option value="promo">Promo</option>
          <option value="brand">Brand</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* 📋 Image Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm border rounded shadow-sm bg-white">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Preview</th>
              <th className="p-2">Filename</th>
              <th className="p-2">Purpose</th>
              <th className="p-2">Size (KB)</th>
              <th className="p-2">Tags</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredImages.map((img) => (
              <tr key={img._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-2">
                  <img
                    src={img.thumbnail || img.original}
                    alt={img.alt || img.filename}
                    className="w-20 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2 truncate max-w-[160px]" title={img.filename}>
                  {img.filename}
                </td>
                <td className="p-2 capitalize">{img.purpose}</td>
                <td className="p-2">{img.sizeKB}</td>
                <td className="p-2 flex flex-wrap gap-1">
                  {(img.tags || []).map((tag, i) => (
                    <span key={i} className="bg-gray-200 px-2 py-0.5 text-xs rounded">
                      <FaTag className="inline mr-1 text-gray-500" />
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="p-2 flex justify-center gap-3">
                  <a
                    href={img.original}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Full Image"
                  >
                    <FaEye className="text-blue-600 hover:text-blue-800" />
                  </a>
                  <button
                    title="Download"
                    onClick={() => saveAs(`${img.original}`, img.filename)}
                  >
                    <FaDownload className="text-green-600 hover:text-green-800" />
                  </button>
                  <button onClick={() => deleteImage(img._id)} title="Delete">
                    <FaTrash className="text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredImages.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No images found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p className="mt-4 text-gray-600 text-sm">Loading images...</p>}
    </div>
  );
};

export default AdminImagesPage;
