import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Check, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, whatsappNumber = '2348100090843' }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const formatPrice = (val) => {
    return '₦' + Number(val || 0).toLocaleString();
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const whatsappMessage = encodeURIComponent(
    `Hello De Young Musical! I want to order this item:\n- *${product.name}*\n- Price: *${formatPrice(product.price)}*\n- Brand: ${product.brand || 'N/A'}\nIs it currently available for delivery?`
  );

  return (
    <div className="group relative flex flex-col bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
      
      {/* Product Image Area */}
      <Link to={`/product/${product.slug || product.id}`} className="relative block aspect-[4/3] bg-slate-950 overflow-hidden">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
          {hasDiscount && (
            <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-rose-600 text-white shadow-md">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {product.stock > 0 ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/90 text-slate-950 backdrop-blur-sm">
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/90 text-white backdrop-blur-sm">
              Sold Out
            </span>
          )}
        </div>
      </Link>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-amber-400/90 tracking-wide uppercase text-[10px]">
            {product.brand || 'Authentic'}
          </span>
          <span className="truncate max-w-[120px] text-slate-400 text-[11px]">
            {product.category}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.slug || product.id}`}
          className="text-sm sm:text-base font-bold text-white hover:text-amber-400 line-clamp-2 leading-snug transition-colors mb-3 flex-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-lg sm:text-xl font-extrabold text-amber-400">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-slate-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 mt-auto">
          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all text-center"
            title="Order directly via WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
              product.stock <= 0
                ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-slate-700'
                : added
                ? 'bg-amber-500 text-slate-950 font-extrabold'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
