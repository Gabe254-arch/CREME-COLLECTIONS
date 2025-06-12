import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaEdit, FaImage } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    countInStock: '',
    description: '',
    category: '',
    subcategory: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 Protect route if token missing
  useEffect(() => {
    if (!userInfo?.token) {
      toast.error('Please login as admin to continue');
      navigate('/login');
    }
  }, [navigate, userInfo]);

  // 📥 Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setForm({
          name: data.name || '',
          brand: data.brand || '',
          price: data.price || '',
          countInStock: data.countInStock || '',
          description: data.description || '',
          category: data.category?._id || '',
          subcategory: data.subcategory?._id || '',
        });
        setImagePreview(data.images?.[0] || '');
      } catch (err) {
        toast.error('❌ Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 📁 Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (err) {
        toast.error('❌ Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  // 🔁 Load subcategories if category changes
  useEffect(() => {
    if (!form.category) return;
    const loadSubcategories = async () => {
      try {
        const { data } = await axios.get(`/api/subcategories?category=${form.category}`);
        setSubcategories(data);
      } catch (err) {
        toast.error('❌ Failed to load subcategories');
        setSubcategories([]);
      }
    };
    loadSubcategories();
  }, [form.category]);

  // 🔄 Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 📸 Image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append('imageFile', imageFile);

      await axios.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success('✅ Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error('❌ Failed to update product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h2 className="text-2xl font-bold mb-6 text-orange-600 flex items-center gap-2">
        <FaEdit /> Edit Product
      </h2>

      {loading && <p className="text-gray-600">Loading...</p>}

      <form onSubmit={handleSubmit}>
        {/* Text Inputs */}
        <label>Product Name *</label>
        <input name="name" value={form.name} onChange={handleChange} required style={input} />

        <label>Brand *</label>
        <input name="brand" value={form.brand} onChange={handleChange} required style={input} />

        <label>Price (Ksh) *</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} required style={input} />

        <label>Stock Count</label>
        <input name="countInStock" type="number" value={form.countInStock} onChange={handleChange} style={input} />

        <label>Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          style={input}
        />

        {/* Category */}
        <label>Category *</label>
        <select name="category" value={form.category} onChange={handleChange} required style={input}>
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        {/* Subcategory */}
        <label>Subcategory</label>
        <select name="subcategory" value={form.subcategory} onChange={handleChange} style={input}>
          <option value="">-- Select Subcategory --</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>{sub.name}</option>
          ))}
        </select>

        {/* Image */}
        <label className="block mb-1 font-medium">Product Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={{ width: '120px', marginTop: '1rem', borderRadius: '6px' }} />
        )}

        {/* Submit */}
        <button type="submit" style={submitBtn} disabled={loading}>
          <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

const input = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const submitBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '0.8rem 1.5rem',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginTop: '1rem',
  cursor: 'pointer',
};

export default EditProductPage;
