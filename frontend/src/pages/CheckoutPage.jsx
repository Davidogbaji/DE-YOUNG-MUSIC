import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, MessageSquare, Building2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const NIGERIAN_STATES = [
  'Lagos', 'Abuja FCT', 'Ogun', 'Oyo', 'Rivers', 'Delta', 'Edo',
  'Anambra', 'Enugu', 'Imo', 'Abia', 'Akwa Ibom', 'Bayelsa',
  'Kano', 'Kaduna', 'Kwara', 'Ondo', 'Osun', 'Plateau', 'Other State'
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Lagos',
    notes: '',
    paymentMethod: 'WHATSAPP_CONFIRM',
    deliveryType: 'DELIVERY' // DELIVERY or PICKUP
  });

  useEffect(() => {
    api.getSettings().then(d => { if (d?.settings) setSettings(d.settings); }).catch(() => {});
  }, []);

  const formatPrice = (val) => '₦' + Number(val || 0).toLocaleString();

  // Delivery fee calculation
  const deliveryFee = formData.deliveryType === 'PICKUP'
    ? 0
    : formData.state === 'Lagos'
    ? 3500
    : 6500;

  const totalAmount = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Your cart is empty</h1>
        <p className="text-xs text-slate-400">Add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and valid phone number.');
      return;
    }

    if (formData.deliveryType === 'DELIVERY' && (!formData.address.trim() || !formData.city.trim())) {
      setError('Please provide your delivery address and city.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          address: formData.deliveryType === 'PICKUP' ? 'Store Pickup: Shop 1001 Area 1 shopping complex garki Abuja' : formData.address.trim(),
          city: formData.city.trim() || 'Lagos',
          state: formData.state,
          notes: formData.notes.trim()
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        paymentMethod: formData.paymentMethod,
        deliveryFee,
        subtotal,
        total: totalAmount
      };

      const res = await api.createOrder(payload);

      if (res?.order) {
        clearCart();
        navigate(`/order-success/${res.order.orderNumber}`, { state: { order: res.order } });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Checkout</h1>
          <p className="text-xs text-slate-400 mt-1">Provide delivery address and select payment preference</p>
        </div>
        <Link to="/cart" className="text-xs text-amber-400 hover:underline flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Delivery Method Choice */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">1. Fulfillment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, deliveryType: 'DELIVERY' }))}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  formData.deliveryType === 'DELIVERY'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                <Truck className="w-4 h-4 text-amber-400 mb-1" />
                <p className="font-extrabold">Doorstep Delivery</p>
                <p className="text-[11px] font-normal text-slate-400">Delivered directly to your home or church</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData(f => ({ ...f, deliveryType: 'PICKUP' }))}
                className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  formData.deliveryType === 'PICKUP'
                    ? 'border-amber-500 bg-amber-500/10 text-white'
                    : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-400 mb-1" />
                <p className="font-extrabold">Store Pickup</p>
                <p className="text-[11px] font-normal text-slate-400">Pick up at Shop 1001 Area 1 shopping complex garki Abuja</p>
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">2. Contact & Address</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Okonkwo"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 08123456789"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              />
            </div>

            {formData.deliveryType === 'DELIVERY' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required={formData.deliveryType === 'DELIVERY'}
                    placeholder="e.g. 12 Cathedral Road, off Broad Street"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">City / Town *</label>
                    <input
                      type="text"
                      name="city"
                      required={formData.deliveryType === 'DELIVERY'}
                      placeholder="e.g. Ikeja, Port Harcourt"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                    >
                      {NIGERIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Delivery Notes / Landmarks</label>
              <textarea
                name="notes"
                rows="2"
                placeholder="Nearby church, bus stop, or special delivery instructions"
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">3. Payment Preference</h2>
            <div className="space-y-2.5">
              <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-700 bg-slate-900 cursor-pointer hover:border-amber-500/50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="WHATSAPP_CONFIRM"
                  checked={formData.paymentMethod === 'WHATSAPP_CONFIRM'}
                  onChange={handleChange}
                  className="mt-0.5 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">Order & Pay via WhatsApp (Fastest)</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Order details are forwarded directly to the store manager on WhatsApp to confirm delivery time and payment.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-700 bg-slate-900 cursor-pointer hover:border-amber-500/50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={handleChange}
                  className="mt-0.5 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-white">Direct Bank Transfer</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Official business bank account will be provided upon submitting order.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3.5 rounded-xl border border-slate-700 bg-slate-900 cursor-pointer hover:border-amber-500/50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PAY_ON_DELIVERY"
                  checked={formData.paymentMethod === 'PAY_ON_DELIVERY'}
                  onChange={handleChange}
                  className="mt-0.5 text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-white">Pay on Delivery / Pickup</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pay with POS or cash upon arrival (Subject to location verification).
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Order Review Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-800 border border-slate-700 space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-white border-b border-slate-700 pb-3">Your Order Items</h2>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/60 pr-1">
              {items.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{item.name}</p>
                      <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-amber-400 shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-3 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Fee</span>
                <span className="font-bold text-white">
                  {deliveryFee === 0 ? 'FREE (Pickup)' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between text-base font-black text-white">
                <span>Total Due</span>
                <span className="text-amber-400">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Order ({formatPrice(totalAmount)})</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 text-center space-y-1">
              <p>🛡️ Genuine musical gear with verified manufacturer warranties.</p>
              <p>Delivery dispatch begins immediately after confirmation.</p>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
