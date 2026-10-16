import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters from URL
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentSearch = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentInStock = searchParams.get('inStock') === 'true';

  useEffect(() => {
    // Load categories, brands, settings once
    api.getCategories().then(data => {
      if (data?.categories) setCategories(data.categories);
      if (data?.brands) setBrands(data.brands);
    }).catch(() => {});

    api.getSettings().then(data => {
      if (data?.settings) setSettings(data.settings);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          q: currentSearch,
          category: currentCategory,
          brand: currentBrand,
          sort: currentSort,
          inStock: currentInStock ? 'true' : ''
        };
        const data = await api.getProducts(params);
        if (data?.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to load shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory, currentBrand, currentSearch, currentSort, currentInStock]);

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const activeFiltersCount = [currentCategory, currentBrand, currentSearch, currentInStock].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentCategory || 'All Musical Equipment'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'} available
              {currentBrand ? ` by ${currentBrand}` : ''}
              {currentSearch ? ` matching "${currentSearch}"` : ''}
            </p>
          </div>

          {/* Sort Selector & Mobile filter toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Search input in shop */}
        <div className="mt-4 max-w-md relative">
          <input
            type="text"
            placeholder="Search within instruments..."
            value={currentSearch}
            onChange={(e) => updateParam('q', e.target.value)}
            className="w-full bg-slate-800/80 text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {currentSearch && (
            <button
              onClick={() => updateParam('q', '')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Filters</span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !currentCategory
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateParam('category', cat.name)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentCategory === cat.name
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Brands</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => updateParam('brand', '')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !currentBrand
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => updateParam('brand', b)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        currentBrand === b
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* In Stock Only Toggle */}
            <div className="pt-3 border-t border-slate-700">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentInStock}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-200">In-Stock Items Only</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xs bg-slate-900 h-full p-6 space-y-6 overflow-y-auto border-l border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-base font-bold text-white">Filter Products</span>
                <button onClick={() => setMobileFilterOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { updateParam('category', ''); setMobileFilterOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { updateParam('category', cat.name); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        currentCategory === cat.name ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {brands.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Brand</h3>
                  <div className="space-y-1">
                    {brands.map((b) => (
                      <button
                        key={b}
                        onClick={() => { updateParam('brand', b); setMobileFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                          currentBrand === b ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="animate-pulse bg-slate-800 rounded-2xl h-80 border border-slate-700/60" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-4">
              <p className="text-slate-300 font-semibold text-lg">No equipment matched your filters.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try clearing your search query or selecting a different brand or category.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={settings?.whatsappNumber || '2348100090843'}
                />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
