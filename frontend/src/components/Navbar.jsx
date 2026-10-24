import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Music, Shield, Phone, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Navbar() {
  const { totalItems } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.getSettings().then(data => {
      if (data?.settings) setSettings(data.settings);
    }).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop Gear', path: '/shop' },
    { label: 'Keyboards', path: '/shop?category=Keyboards%20%26%20Pianos' },
    { label: 'Guitars', path: '/shop?category=Guitars%20%26%20Bass' },
    { label: 'Drums', path: '/shop?category=Drums%20%26%20Percussion' },
    { label: 'Studio Setup', path: '/studio-setup' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-xl">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 text-xs sm:text-sm font-semibold py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="truncate">
            {settings?.announcementText || '🔥 Nationwide Delivery Available! Call or WhatsApp us directly for authentic musical gear.'}
          </p>
          <div className="hidden md:flex items-center space-x-4 pl-4 shrink-0">
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '2348100090843'}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:underline text-slate-950 font-bold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp: {settings?.phoneNumber || '08100090843'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Music className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                DE YOUNG <span className="text-amber-400">MUSICAL</span>
              </span>
              <span className="text-[11px] tracking-widest text-slate-400 font-medium uppercase mt-0.5 block">
                & City Spot Instruments
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search guitars, keyboards, speakers, mics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 text-slate-100 placeholder-slate-400 text-sm rounded-full pl-10 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Only show Admin controls when already authenticated - completely hidden from public visitors */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700/80 transition-all flex items-center justify-center"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Desktop Category Sub-nav */}
        <nav className="hidden md:flex items-center space-x-1 border-t border-slate-800/80 py-2.5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.search && location.search.includes(link.path.split('?')[1]));
            return (
              <Link
                key={link.label}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 font-semibold'
                    : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 text-sm rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="border-t border-slate-800 pt-2 mt-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-amber-400 font-semibold bg-amber-500/10"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
