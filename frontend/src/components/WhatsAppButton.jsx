import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { api } from '../services/api';

export default function WhatsAppButton() {
  const [whatsappNumber, setWhatsappNumber] = useState('2348100090843');

  useEffect(() => {
    api.getSettings().then(data => {
      if (data?.settings?.whatsappNumber) {
        setWhatsappNumber(data.settings.whatsappNumber);
      }
    }).catch(() => {});
  }, []);

  const message = encodeURIComponent('Hello De Young Musical! I am visiting your website and would like to make an enquiry.');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all group"
    >
      <div className="relative">
        <MessageSquare className="w-5 h-5 fill-current text-slate-950" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-900"></span>
        </span>
      </div>
      <span className="text-xs sm:text-sm font-extrabold tracking-wide hidden sm:inline">
        Chat With Us
      </span>
    </a>
  );
}
