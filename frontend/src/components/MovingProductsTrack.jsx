import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function MovingProductsTrack({ products = [] }) {
  if (!products || products.length === 0) return null;

  const formatPrice = (val) => '₦' + Number(val || 0).toLocaleString();

  // Split into two rows if we have enough items, otherwise reuse
  const row1 = products.slice(0, Math.ceil(products.length / 2));
  const row2 = products.slice(Math.ceil(products.length / 2)).concat(row1.slice(0, 3));

  // Duplicate arrays for seamless infinite loop
  const duplicatedRow1 = [...row1, ...row1, ...row1, ...row1];
  const duplicatedRow2 = [...row2, ...row2, ...row2, ...row2];

  const renderCard = (product, idx) => (
    <Link
      key={`${product.id}-${idx}`}
      to={`/product/${product.slug || product.id}`}
      className="group relative flex items-center space-x-3.5 p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/60 shadow-xl backdrop-blur-md transition-all duration-300 min-w-[240px] sm:min-w-[280px] shrink-0 hover:scale-105 active:scale-95"
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700/60">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=80';
          }}
        />
        {product.featured && (
          <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 p-0.5 rounded shadow text-[9px] font-black">
            ★
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block truncate">
          {product.brand || 'Authentic'}
        </span>
        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 truncate transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold px-1.5 py-0.2 rounded bg-emerald-500/10">
            In Stock
          </span>
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-1 text-amber-400">
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </Link>
  );

  return (
    <div className="relative w-full overflow-hidden py-4 space-y-4 mask-gradient-x select-none">
      
      {/* Top Track: Moves Left */}
      <div className="flex overflow-hidden py-1">
        <div className="animate-marquee-left flex items-center space-x-4">
          {duplicatedRow1.map((p, i) => renderCard(p, `r1-${i}`))}
        </div>
      </div>

      {/* Bottom Track: Moves Right */}
      <div className="flex overflow-hidden py-1">
        <div className="animate-marquee-right flex items-center space-x-4">
          {duplicatedRow2.map((p, i) => renderCard(p, `r2-${i}`))}
        </div>
      </div>

    </div>
  );
}
