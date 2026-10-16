import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getSettings().then(d => { if (d?.settings) setSettings(d.settings); }).catch(() => {});
  }, []);

  const formatPrice = (val) => '₦' + Number(val || 0).toLocaleString();
  const whatsappNum = settings?.whatsappNumber || '2348100090843';

  // Format cart items for direct WhatsApp checkout
  const cartSummaryText = items.map(
    (item, index) => `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity)}`
  ).join('\n');

  const whatsappMessage = encodeURIComponent(
    `Hello De Young Musical! I want to order these items from my cart:\n\n${cartSummaryText}\n\n*Subtotal: ${formatPrice(subtotal)}*\n\nPlease let me know the delivery procedure.`
  );

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Cart is Empty</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          You have not added any musical instruments or audio gear to your cart yet.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all"
        >
          <span>Explore Equipment</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your order</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center space-x-4 flex-1">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=200&q=80'}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-950 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${item.slug || item.id}`}
                    className="text-sm sm:text-base font-bold text-white hover:text-amber-400 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {formatPrice(item.price)} each
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
                
                {/* Quantity */}
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-300 hover:text-white text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-white min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-300 hover:text-white text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Line Total */}
                <span className="text-sm sm:text-base font-extrabold text-white min-w-[5rem] text-right">
                  {formatPrice(item.price * item.quantity)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-5 sticky top-24">
            <h2 className="text-lg font-bold text-white border-b border-slate-700 pb-3">Order Summary</h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Delivery Fee</span>
                <span className="text-amber-400 font-semibold">Calculated at checkout</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between text-base font-black text-white">
                <span>Total Amount</span>
                <span className="text-amber-400">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${whatsappNum}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-900/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Cart to WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              🔒 Safe & secure checkout. Bank transfer, Pay on Delivery (selected states), or WhatsApp order confirmation.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
