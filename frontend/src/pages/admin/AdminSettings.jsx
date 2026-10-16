import React, { useState, useEffect } from 'react';
import { Save, Lock, Store, MessageSquare, Phone, MapPin, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: '',
    tagline: '',
    whatsappNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    announcementText: '',
    bankDetails: {
      bankName: '',
      accountName: '',
      accountNumber: ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    api.getSettings().then(data => {
      if (data?.settings) {
        setSettings(data.settings);
      }
    }).catch(err => {
      console.error('Failed to load settings:', err);
    }).finally(() => setLoading(false));
  }, []);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      setFeedback(null);
      await api.updateSettings(settings);
      setFeedback({ type: 'success', message: 'Store contact details and settings updated successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    try {
      setSavingPassword(true);
      setFeedback(null);
      await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setFeedback({ type: 'success', message: 'Admin password updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to change password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading store configuration...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      
      {feedback && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
          feedback.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Store Contacts & Details Form */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-700 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Store className="w-5 h-5 text-amber-400" />
            <span>Store Contact & Public Details</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            These details are displayed in your store header, footer, and WhatsApp checkout links
          </p>
        </div>

        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => setSettings(s => ({ ...s, storeName: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Store Tagline</label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => setSettings(s => ({ ...s, tagline: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp Phone Number (with Country Code e.g. 2348100090843)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings(s => ({ ...s, whatsappNumber: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Telephone Number</label>
              <input
                type="text"
                value={settings.phoneNumber || ''}
                onChange={(e) => setSettings(s => ({ ...s, phoneNumber: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings(s => ({ ...s, email: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Store Physical Address</label>
              <input
                type="text"
                value={settings.address || ''}
                onChange={(e) => setSettings(s => ({ ...s, address: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Top Announcement Bar Text
            </label>
            <input
              type="text"
              value={settings.announcementText || ''}
              onChange={(e) => setSettings(s => ({ ...s, announcementText: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Bank Details for checkout */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/80 space-y-3">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Official Store Bank Account Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={settings.bankDetails?.bankName || ''}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    bankDetails: { ...(s.bankDetails || {}), bankName: e.target.value }
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Account Name</label>
                <input
                  type="text"
                  value={settings.bankDetails?.accountName || ''}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    bankDetails: { ...(s.bankDetails || {}), accountName: e.target.value }
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={settings.bankDetails?.accountNumber || ''}
                  onChange={(e) => setSettings(s => ({
                    ...s,
                    bankDetails: { ...(s.bankDetails || {}), accountNumber: e.target.value }
                  }))}
                  className="w-full bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving...' : 'Save Store Details'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Change Password Form */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-700 pb-3">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>Change Administrator Password</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Update your admin login password securely
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password (min 6 characters)</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs"
            >
              {savingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
