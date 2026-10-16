import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Upload, Link as LinkIcon, Sparkles, Check, AlertCircle, RefreshCw, X } from 'lucide-react';
import { api } from '../../services/api';

const DEFAULT_CATEGORIES = [
  'Keyboards & Pianos',
  'Guitars & Bass',
  'Drums & Percussion',
  'Studio & Recording',
  'Live Sound & PA',
  'DJ Equipment',
  'Accessories & Cables'
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Keyboards & Pianos',
    brand: '',
    price: '',
    comparePrice: '',
    stock: '1',
    image: '',
    description: '',
    featured: false,
    status: 'active',
    specs: [{ key: '', value: '' }]
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts({ admin: 'true' });
      if (data?.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const formatPrice = (val) => '₦' + Number(val || 0).toLocaleString();

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Keyboards & Pianos',
      brand: '',
      price: '',
      comparePrice: '',
      stock: '1',
      image: '',
      description: '',
      featured: false,
      status: 'active',
      specs: [{ key: '', value: '' }]
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const handleOpenEditModal = (p) => {
    setIsEditing(true);
    setEditingId(p.id);
    
    // Parse specs object into array of {key, value}
    const specsArray = p.specs && typeof p.specs === 'object'
      ? Object.entries(p.specs).map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: '', value: '' }];

    setFormData({
      name: p.name || '',
      category: p.category || 'Keyboards & Pianos',
      brand: p.brand || '',
      price: String(p.price || ''),
      comparePrice: p.comparePrice ? String(p.comparePrice) : '',
      stock: String(p.stock || '0'),
      image: p.image || '',
      description: p.description || '',
      featured: Boolean(p.featured),
      status: p.status || 'active',
      specs: specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]
    });
    setModalOpen(true);
    setFeedback(null);
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specs];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, specs: updated }));
  };

  const addSpecRow = () => {
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }]
    }));
  };

  const removeSpecRow = (index) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };

  // Image File Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await api.uploadImage(file);
      if (res?.base64) {
        // Use base64 data URI directly for 100% permanence across ephemeral container restarts!
        setFormData(prev => ({ ...prev, image: res.base64 }));
      } else if (res?.url) {
        setFormData(prev => ({ ...prev, image: res.url }));
      }
      setFeedback({ type: 'success', message: 'Image uploaded successfully!' });
    } catch (err) {
      console.error('Image upload failed:', err);
      setFeedback({ type: 'error', message: 'Image upload failed: ' + err.message });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      setFeedback({ type: 'error', message: 'Product name and price are required.' });
      return;
    }

    try {
      setSubmitting(true);

      // Convert specs array back to object
      const specsObject = {};
      formData.specs.forEach(s => {
        if (s.key.trim() && s.value.trim()) {
          specsObject[s.key.trim()] = s.value.trim();
        }
      });

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim() || 'Generic',
        price: Number(formData.price),
        comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
        stock: Number(formData.stock) || 0,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
        description: formData.description.trim(),
        featured: formData.featured,
        status: formData.status,
        specs: specsObject
      };

      if (isEditing) {
        await api.updateProduct(editingId, payload);
        setFeedback({ type: 'success', message: 'Product updated successfully.' });
      } else {
        await api.createProduct(payload);
        setFeedback({ type: 'success', message: 'Product created and uploaded successfully.' });
      }

      setModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error('Save product failed:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save product.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.deleteProduct(id);
      setFeedback({ type: 'success', message: `Deleted product: ${name}` });
      loadProducts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete product.' });
    }
  };

  const handleStockUpdate = async (id, currentStock) => {
    const newStockStr = window.prompt('Enter new stock quantity:', currentStock);
    if (newStockStr === null) return;
    const newStock = Number(newStockStr);
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid stock number.');
      return;
    }

    try {
      await api.updateStock(id, newStock);
      loadProducts();
    } catch (err) {
      alert('Failed to update stock: ' + err.message);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Restore initial demo musical instruments catalog? This will add back default items.')) return;

    try {
      await api.resetDemoProducts();
      setFeedback({ type: 'success', message: 'Demo instruments restored!' });
      loadProducts();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h2 className="text-xl font-bold text-white">Product Inventory ({products.length})</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add new equipment, upload photos, manage stock and set discount pricing
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            title="Restore default demo catalog"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Product</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
          feedback.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
        >
          <option value="">All Categories</option>
          {DEFAULT_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-400 text-sm">No products found matching your search.</p>
            <button
              onClick={handleOpenAddModal}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              + Upload your first instrument now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-700">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category & Brand</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3 max-w-xs">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{p.name}</p>
                          {p.featured && (
                            <span className="inline-flex items-center space-x-1 text-[10px] text-amber-400 font-semibold">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-3 px-4">
                      <p className="text-slate-300 font-medium">{p.category}</p>
                      <p className="text-[11px] text-slate-500">{p.brand}</p>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-amber-400">{formatPrice(p.price)}</p>
                      {p.comparePrice && (
                        <p className="text-[11px] text-slate-500 line-through">{formatPrice(p.comparePrice)}</p>
                      )}
                    </td>

                    {/* Stock with quick inline editor */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStockUpdate(p.id, p.stock)}
                        className={`px-2 py-0.5 rounded font-bold hover:ring-1 hover:ring-amber-400 ${
                          p.stock > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}
                        title="Click to edit stock quantity"
                      >
                        {p.stock} units
                      </button>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white">
                {isEditing ? 'Edit Product Details' : 'Upload New Musical Equipment'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name & Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yamaha PSR-SX900 Arranger Keyboard"
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  >
                    {DEFAULT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Yamaha, Roland, Fender, Pearl, Shure"
                    value={formData.brand}
                    onChange={(e) => setFormData(f => ({ ...f, brand: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₦) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 850000"
                    value={formData.price}
                    onChange={(e) => setFormData(f => ({ ...f, price: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Old / Compare Price (₦)</label>
                  <input
                    type="number"
                    placeholder="e.g. 950000"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData(f => ({ ...f, comparePrice: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(f => ({ ...f, stock: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Product Photo (Upload File or Enter URL)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  {/* File Upload Button */}
                  <div>
                    <label className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-amber-500/40 hover:border-amber-500 bg-amber-500/10 text-amber-400 text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading image...' : 'Choose Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>

                  {/* URL fallback */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Or paste direct image URL"
                      value={formData.image}
                      onChange={(e) => setFormData(f => ({ ...f, image: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-amber-400"
                    />
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                {/* Image Preview */}
                {formData.image && (
                  <div className="flex items-center space-x-3 pt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 border border-slate-700"
                    />
                    <div className="text-xs text-slate-400">
                      <span className="text-emerald-400 font-semibold block">Photo Ready</span>
                      <span className="text-[11px] truncate max-w-xs block">{formData.image.substring(0, 40)}...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description</label>
                <textarea
                  rows="3"
                  placeholder="Detail key sounds, features, church/studio performance..."
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Specifications (Key - Value)
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    + Add Spec Row
                  </button>
                </div>

                {formData.specs.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Spec (e.g. Keys, Power, Polyphony)"
                      value={spec.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="w-1/2 bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 61 Keys, 1000W)"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="w-1/2 bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2"
                    />
                    {formData.specs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecRow(index)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(f => ({ ...f, featured: e.target.checked }))}
                    className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-200">Show in Featured on Homepage</span>
                </label>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-300">Status:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(f => ({ ...f, status: e.target.value }))}
                    className="bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-lg px-2.5 py-1"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20"
                >
                  {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Upload Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
