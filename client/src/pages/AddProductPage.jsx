import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaUpload, FaPlusCircle } from 'react-icons/fa';

const AddProductPage = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // 🔐 Redirect unauthenticated users
  useEffect(() => {
    if (!userInfo?.token) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
    }
  }, [navigate, userInfo]);

  // 🔽 Dropdown states
  const [categories, setCategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);

  // 📦 Images (can be file OR URL)
  const [images, setImages] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📝 Product Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: '',
    countInStock: '',
    brand: '',
    category: '',
    subcategory: '',
    tags: '',
    sizes: '',
    colors: '',
    description: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    isFeatured: false,
    isDealOfWeek: false,
    isActive: true,
  });

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data || []);
      } catch {
        toast.error('❌ Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // ✅ Fetch Subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const { data } = await axios.get(`/api/subcategories?category=${form.category}`);
        setFilteredSubs(data || []);
      } catch {
        toast.error('❌ Failed to load subcategories');
        setFilteredSubs([]);
      }
    };

    if (form.category) fetchSubcategories();
    else setFilteredSubs([]);
  }, [form.category]);

  // ✅ Handle Form Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in form.dimensions) {
      setForm((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [name]: value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        ...(name === 'name' && { slug: value.toLowerCase().replace(/\s+/g, '-') }),
      }));
    }
  };

  // ✅ Upload Local Files
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isURL: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // ✅ Add Image via Online URL
  const handleImageURL = (e) => {
    const url = e.target.value.trim();
    if (url) {
      setImages((prev) => [...prev, { file: null, preview: url, isURL: true, url }]);
      e.target.value = '';
    }
  };

  // ✅ Remove Selected Image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ✅ Submit Product Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.countInStock || !form.brand || !form.category) {
      return toast.error('⚠️ Please fill all required fields');
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'dimensions') {
        Object.entries(val).forEach(([k, v]) => formData.append(`dimensions[${k}]`, v));
      } else {
        formData.append(key, val);
      }
    });

    // Attach both local and online images
    images.forEach((img) => {
      if (img.isURL) formData.append('imageUrls', img.url);
      else formData.append('images', img.file);
    });

    try {
      setLoading(true);
      await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success('✅ Product created successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Bulk CSV Upload
  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return toast.error('Please select a CSV file');
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      setLoading(true);
      const { data } = await axios.post('/api/products/import-csv', formData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success(`✅ ${data.message}`);
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ CSV import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h2 className="text-2xl font-bold mb-6 text-orange-600 flex items-center gap-2">
        <FaPlusCircle /> Add New Product
      </h2>

      {/* 📝 Manual Entry Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} style={input} />
        <input name="slug" placeholder="SEO Slug" value={form.slug} onChange={handleChange} style={input} />
        <input name="price" type="number" placeholder="Price (Ksh)" value={form.price} onChange={handleChange} style={input} />
        <input name="countInStock" type="number" placeholder="Stock Count" value={form.countInStock} onChange={handleChange} style={input} />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} style={input} />

        {/* Dropdowns */}
        <select name="category" value={form.category} onChange={handleChange} style={input}>
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select name="subcategory" value={form.subcategory} onChange={handleChange} style={input}>
          <option value="">Select Subcategory</option>
          {filteredSubs.map((sc) => <option key={sc._id} value={sc._id}>{sc.name}</option>)}
        </select>

        <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} style={input} />
        <input name="sizes" placeholder="Sizes (comma-separated)" value={form.sizes} onChange={handleChange} style={input} />
        <input name="colors" placeholder="Colors (comma-separated)" value={form.colors} onChange={handleChange} style={input} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={4} style={input} />

        {/* Dimensions & weight */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input name="weight" placeholder="Weight (kg)" value={form.weight} onChange={handleChange} style={input} />
          <input name="length" placeholder="Length (cm)" value={form.dimensions.length} onChange={handleChange} style={input} />
          <input name="width" placeholder="Width (cm)" value={form.dimensions.width} onChange={handleChange} style={input} />
          <input name="height" placeholder="Height (cm)" value={form.dimensions.height} onChange={handleChange} style={input} />
        </div>

        {/* Flags */}
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
          <label><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured</label>
          <label><input type="checkbox" name="isDealOfWeek" checked={form.isDealOfWeek} onChange={handleChange} /> Deal of the Week</label>
          <label><input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active</label>
        </div>

        {/* Local File Upload */}
        <input type="file" multiple onChange={handleImageUpload} accept="image/*" style={{ marginBottom: '1rem' }} />

        {/* Image URL Input */}
        <input
          type="text"
          placeholder="Paste online image URL (optional)"
          onBlur={handleImageURL}
          style={input}
        />

        {/* Image Previews */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={img.preview} alt="preview" style={{ width: 100, borderRadius: 6 }} />
              <button type="button" onClick={() => removeImage(i)} style={removeBtn}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} style={submitBtn}>
          {loading ? 'Submitting...' : '✅ Submit Product'}
        </button>
      </form>

      {/* CSV Import */}
      <hr style={{ margin: '3rem 0' }} />
      <h3 className="text-xl font-semibold text-gray-700 mb-2"><FaUpload /> Import Products via CSV</h3>
      <form onSubmit={handleCSVUpload} encType="multipart/form-data">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          style={{ marginBottom: '1rem' }}
        />
        <button type="submit" disabled={loading} style={submitBtn}>
          {loading ? 'Importing...' : '📂 Upload CSV'}
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
  padding: '0.8rem 1.5rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '1rem',
  marginTop: '1rem',
  cursor: 'pointer',
};

const removeBtn = {
  position: 'absolute',
  top: -10,
  right: -10,
  background: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: 24,
  height: 24,
  cursor: 'pointer',
};

export default AddProductPage;
