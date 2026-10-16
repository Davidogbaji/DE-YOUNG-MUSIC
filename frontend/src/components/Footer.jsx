import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Music, Phone, Mail, MapPin, MessageSquare, ShieldCheck, Truck, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings().then(data => {
      if (data?.settings) setSettings(data.settings);
    }).catch(() => {});
  }, []);

  const whatsappNum = settings?.whatsappNumber || '2348100090843';
  const phone = settings?.phoneNumber || '+234 810 009 0843';
  const email = settings?.email || 'info@deyoungmusical.com';
  const address = settings?.address || 'Shop 14/15, City Spot Plaza, Lagos, Nigeria';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Authentic Gear</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct from verified distributors & brands.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Nationwide Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fast, safe dispatch across all Nigerian states.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/50">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Studio Consultation</h4>
              <p className="text-xs text-slate-400 mt-0.5">Professional church & studio acoustics advice.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Bio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <Music className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                DE YOUNG <span className="text-amber-400">MUSICAL</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Your premier destination for professional musical instruments, live stage audio systems, church equipment, and music studio soundproofing.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello De Young Musical! I want to enquire about your products.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Instrument Categories</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/shop?category=Keyboards%20%26%20Pianos" className="hover:text-amber-400 transition-colors">
                  Keyboards & Synthesizers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Guitars%20%26%20Bass" className="hover:text-amber-400 transition-colors">
                  Acoustic & Electric Guitars
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Drums%20%26%20Percussion" className="hover:text-amber-400 transition-colors">
                  Acoustic & Electronic Drums
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Studio%20%26%20Recording" className="hover:text-amber-400 transition-colors">
                  Studio Monitors & Interfaces
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Live%20Sound%20%26%20PA" className="hover:text-amber-400 transition-colors">
                  Live Sound Speakers & Mixers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=DJ%20Equipment" className="hover:text-amber-400 transition-colors">
                  DJ Controllers & Mixers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Services */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Services & Help</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/studio-setup" className="hover:text-amber-400 transition-colors">
                  Studio Setup & Sound Engineering
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  Browse All Inventory
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors">
                  Cart & Instant Checkout
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Store Location
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 text-amber-500/80 font-medium transition-colors">
                  Store Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} De Young Musical and City Spot. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Fast Dispatch Nigeria</span>
            <span>•</span>
            <span>WhatsApp Ordering</span>
            <span>•</span>
            <Link to="/admin/login" className="hover:underline text-slate-400">Admin Area</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
