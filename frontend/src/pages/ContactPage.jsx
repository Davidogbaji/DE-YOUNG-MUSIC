import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Clock, Send } from 'lucide-react';
import { api } from '../services/api';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getSettings().then(d => { if (d?.settings) setSettings(d.settings); }).catch(() => {});
  }, []);

  const whatsappNum = settings?.whatsappNumber || '2348100090843';
  const displayPhone = settings?.phoneNumber || '08100090843';
  const email = settings?.email || 'ogidithomasiji43@gmail.com';
  const address = settings?.address || 'Shop 1001 Area 1 shopping complex garki Abuja';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatted = encodeURIComponent(
      `*GENERAL STORE INQUIRY*\n\n` +
      `*From:* ${name || 'Customer'}\n` +
      `*Phone:* ${phone || 'N/A'}\n` +
      `*Message:* ${message}\n\n` +
      `Sent via De Young Musical Contact Form`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${formatted}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Store Headquarters</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Visit or Contact Us</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Have questions regarding gear availability, testing an instrument, or organizing nationwide delivery?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
            <h2 className="text-base font-bold text-white">Contact Information</h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Store Address</p>
                  <p className="text-slate-300 mt-0.5">{address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Telephone</p>
                  <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} className="text-slate-300 hover:text-amber-400 mt-0.5 block">
                    {displayPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">WhatsApp Line</p>
                  <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline mt-0.5 block">
                    +{whatsappNum}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Email</p>
                  <a href={`mailto:${email}`} className="text-slate-300 hover:text-white mt-0.5 block">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Business Hours</p>
                  <p className="text-slate-300 mt-0.5">Monday - Saturday: 8:00 AM - 7:00 PM</p>
                  <p className="text-slate-400 text-xs">Sunday: 12:00 PM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-800 border border-slate-700 space-y-5">
            <h2 className="text-lg font-bold text-white">Send Us A Quick Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08100090843"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Message or Enquiry</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Tell us what instrument you are looking for or any questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send to WhatsApp</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
