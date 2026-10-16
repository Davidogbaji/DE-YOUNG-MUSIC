import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, MessageSquare, ArrowRight, Building2, PackageCheck } from 'lucide-react';
import { api } from '../services/api';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    api.getSettings().then(d => { if (d?.settings) setSettings(d.settings); }).catch(() => {});

    if (!order && orderNumber) {
      api.getOrder(orderNumber)
        .then(data => {
          if (data?.order) setOrder(data.order);
        })
        .catch(err => console.error('Failed to load order:', err))
        .finally(() => setLoading(false));
    }
  }, [orderNumber, order]);

  const formatPrice = (val) => '₦' + Number(val || 0).toLocaleString();
  const whatsappNum = settings?.whatsappNumber || '2348100090843';

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-xs">Retrieving order details...</p>
      </div>
    );
  }

  const itemsList = order?.items?.map(
    (item, i) => `${i + 1}. *${item.name}* x ${item.quantity} (${formatPrice(item.price * item.quantity)})`
  ).join('\n') || '';

  const whatsappMessage = encodeURIComponent(
    `*NEW ORDER RECEIVED: ${order?.orderNumber || orderNumber}*\n\n` +
    `*Customer:* ${order?.customer?.name}\n` +
    `*Phone:* ${order?.customer?.phone}\n` +
    `*Address:* ${order?.customer?.address}, ${order?.customer?.city}, ${order?.customer?.state}\n\n` +
    `*Items:*\n${itemsList}\n\n` +
    `*Delivery Fee:* ${formatPrice(order?.deliveryFee || 0)}\n` +
    `*Total Due:* ${formatPrice(order?.total || 0)}\n` +
    `*Payment Method:* ${order?.paymentMethod}\n\n` +
    `Please confirm my order and send payment/delivery instructions.`
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-8">
      
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order Received!</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Thank you for choosing De Young Musical and City Spot.
        </p>
        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-sm">
          Ref: {order?.orderNumber || orderNumber}
        </div>
      </div>

      {/* WhatsApp Immediate Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 border border-emerald-500/40 space-y-4 text-center">
        <h2 className="text-base font-bold text-white">Next Step: Send Order to WhatsApp</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Tap the button below to send your order reference directly to our sales manager on WhatsApp to finalize delivery and payment.
        </p>
        <a
          href={`https://wa.me/${whatsappNum}?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span>Send Order on WhatsApp</span>
        </a>
      </div>

      {/* Bank Details (if selected) */}
      {order?.paymentMethod === 'BANK_TRANSFER' && (
        <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Store Bank Account Details</span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <p><span className="text-slate-400">Bank Name:</span> <strong className="text-white">First Bank of Nigeria</strong></p>
            <p><span className="text-slate-400">Account Name:</span> <strong className="text-white">De Young Musical Spot</strong></p>
            <p><span className="text-slate-400">Account Number:</span> <strong className="text-amber-400 font-mono text-sm">3124567890</strong></p>
          </div>
          <p className="text-[11px] text-slate-400">
            Please include your order reference (<strong>{order?.orderNumber}</strong>) in the payment narration and message proof to WhatsApp.
          </p>
        </div>
      )}

      {/* Order Summary Details */}
      {order && (
        <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm border-b border-slate-700 pb-2">Order Breakdown</h3>
          
          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-3 space-y-1 text-slate-400">
            <div className="flex justify-between">
              <span>Delivery Address</span>
              <span className="text-white text-right max-w-xs">{order.customer?.address}, {order.customer?.city}, {order.customer?.state}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-white">{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-amber-400 pt-2 border-t border-slate-700">
              <span>Total Paid/Due</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-white"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
