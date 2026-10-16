import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, PackageCheck, AlertCircle, XCircle, Search } from 'lucide-react';
import { api } from '../../services/api';

const STATUS_OPTIONS = ['PENDING', 'CONTACTED', 'PAID', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders({ status: statusFilter, search });
      if (data?.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const formatPrice = (val) => '₦' + Number(val || 0).toLocaleString();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (err) {
      alert('Failed to update order status: ' + err.message);
    }
  };

  const openCustomerWhatsApp = (order) => {
    let cleanPhone = order.customer?.phone?.replace(/[^0-9]/g, '') || '';
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '234' + cleanPhone.substring(1);
    }
    const message = encodeURIComponent(
      `Hello ${order.customer?.name}! This is De Young Musical & City Spot regarding your order ref *${order.orderNumber}* for total of *${formatPrice(order.total)}*.\n\nWe are preparing your items for delivery. Could you please confirm your availability to receive them?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h2 className="text-xl font-bold text-white">Customer Orders ({orders.length})</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage customer deliveries, update order statuses, and message customers on WhatsApp
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              !statusFilter ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'
            }`}
          >
            All
          </button>
          {STATUS_OPTIONS.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                statusFilter === st ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading customer orders...</div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700 space-y-2">
          <p className="text-slate-300 font-semibold text-sm">No orders found.</p>
          <p className="text-xs text-slate-500">Orders placed on checkout will automatically appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4 hover:border-slate-600 transition-all shadow-md"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-700 gap-3">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-black text-amber-400 font-mono">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-400 font-medium">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-400"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Info & Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                
                {/* Customer Details */}
                <div className="space-y-1 text-slate-300">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider text-amber-400">
                    Customer Information
                  </p>
                  <p className="font-semibold text-sm text-white">{order.customer?.name}</p>
                  <p>Phone: <strong className="text-white">{order.customer?.phone}</strong></p>
                  {order.customer?.email && <p>Email: {order.customer.email}</p>}
                  <p className="text-slate-400 pt-1">
                    Address: {order.customer?.address}, {order.customer?.city}, {order.customer?.state}
                  </p>
                  {order.customer?.notes && (
                    <p className="text-amber-300/90 italic pt-1">Note: "{order.customer.notes}"</p>
                  )}
                </div>

                {/* Items Breakdown */}
                <div className="space-y-1.5 md:col-span-1">
                  <p className="font-bold text-white uppercase text-[10px] tracking-wider text-amber-400">
                    Purchased Gear ({order.items?.length || 0})
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span className="truncate pr-2">{item.name} x{item.quantity}</span>
                        <span className="font-bold text-white shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials & Actions */}
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Payment Preference:</span>
                      <span className="font-bold text-white">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Delivery Fee:</span>
                      <span className="font-bold text-white">{formatPrice(order.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-amber-400 pt-1 border-t border-slate-800">
                      <span>Total Amount:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openCustomerWhatsApp(order)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-900/20"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>WhatsApp Customer</span>
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
