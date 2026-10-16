import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, MessageSquare, ArrowLeft, Check, ShieldCheck, Truck, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [settings, setSettings] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        setQuantity(1);
        const data = await api.getProduct(slug);
        if (data?.product) {
          setProduct(data.product);
          setRelated(data.related || []);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    api.getSettings().then(d => { if (d?.settings) setSettings(d.settings); }).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading instrument specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-rose-400 font-bold text-lg">{error || 'Product not found.'}</p>
        <Link to="/shop" className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const formatPrice = (val) => '₦' + Number(val || 0).toLocaleString();
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const whatsappNum = settings?.whatsappNumber || '2348100090843';
  const whatsappMessage = encodeURIComponent(
    `Hello De Young Musical! I want to order:\n- *${product.name}*\n- Quantity: *${quantity}*\n- Unit Price: *${formatPrice(product.price)}*\n- Total: *${formatPrice(product.price * quantity)}*\n\nPlease confirm delivery availability to my location.`
  );

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-white">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-white">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-amber-400 truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
        
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.featured && (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Gear</span>
                </span>
              )}
              {hasDiscount && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-600 text-white shadow-lg">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            <div className="absolute bottom-4 right-4">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md shadow-lg ${
                product.stock > 0 ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              Brand: {product.brand || 'Authentic Brand'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-base sm:text-lg text-slate-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                Save {formatPrice(product.comparePrice - product.price)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.description && (
            <p className="text-slate-300 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold text-slate-300">Quantity:</span>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center space-x-2 transition-all ${
                  product.stock <= 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : added
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </>
                )}
              </button>

              {/* Direct WhatsApp Order */}
              <a
                href={`https://wa.me/${whatsappNum}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Order via WhatsApp</span>
              </a>

            </div>

          </div>

          {/* Delivery & Warranty Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-300">
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Safe Nationwide Delivery</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100% Genuine Guaranteed</span>
            </div>
          </div>

        </div>

      </div>

      {/* Specifications Table */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="pt-8 border-t border-slate-800">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            Technical Specifications
          </h2>
          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="divide-y divide-slate-800">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm">
                  <span className="font-semibold text-slate-400">{key}</span>
                  <span className="sm:col-span-2 text-slate-200 mt-0.5 sm:mt-0">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-slate-800 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Related Equipment in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(item => (
              <ProductCard
                key={item.id}
                product={item}
                whatsappNumber={whatsappNum}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
