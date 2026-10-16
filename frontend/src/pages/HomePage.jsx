import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Sparkles, Shield, Truck, Headphones, MessageSquare, Mic, Speaker, Disc, Sliders } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodData, catData, settData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getSettings()
        ]);

        if (prodData?.products) setProducts(prodData.products);
        if (catData?.categories) setCategories(catData.categories);
        if (settData?.settings) setSettings(settData.settings);
      } catch (err) {
        console.error('Error loading homepage:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.featured).slice(0, 8);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  const whatsappNum = settings?.whatsappNumber || '2348100090843';

  const categoryVisuals = [
    { name: 'Keyboards & Pianos', desc: 'Synthesizers, Organs & Digital Pianos', icon: Music, color: 'from-amber-500/20 to-amber-600/10' },
    { name: 'Guitars & Bass', desc: 'Electric, Bass, Classical & Acoustic', icon: Sliders, color: 'from-blue-500/20 to-blue-600/10' },
    { name: 'Drums & Percussion', desc: 'Acoustic Sets, Electronic V-Drums', icon: Disc, color: 'from-red-500/20 to-red-600/10' },
    { name: 'Studio & Recording', desc: 'Audio Interfaces, Monitors & Microphones', icon: Mic, color: 'from-purple-500/20 to-purple-600/10' },
    { name: 'Live Sound & PA', desc: 'Powered Speakers, Mixers & Wireless Mics', icon: Speaker, color: 'from-emerald-500/20 to-emerald-600/10' },
    { name: 'DJ Equipment', desc: 'Pioneer Controllers, Headphones & Mixers', icon: Headphones, color: 'from-rose-500/20 to-rose-600/10' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-slate-800">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4" />
                <span>Original Musical Gear & Pro Audio Solutions</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Power Your Sound With <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Authentic Instruments</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {settings?.bannerSubtitle || 'From church worship auditoriums to commercial recording studios, we supply genuine Yamaha, Roland, Fender, Pearl, Shure, and Pioneer gear with nationwide delivery across Nigeria.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Explore Musical Gear</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello De Young Musical! I want to request a price quote for musical instruments.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm sm:text-base transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">100%</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Original Brands</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">36 States</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Delivery Nigeria</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white">Direct</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">WhatsApp Support</p>
                </div>
              </div>

            </div>

            {/* Right Visual Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 group">
                  <img
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80"
                    alt="Audio studio and musical equipment"
                    className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                          Sound Engineering & Acoustics
                        </span>
                        <h3 className="text-base font-bold text-white">
                          Church & Studio Sound Packages
                        </h3>
                      </div>
                      <Link
                        to="/studio-setup"
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                      >
                        Enquire
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Quick Navigator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Top Equipment</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryVisuals.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 group-hover:bg-amber-500 text-amber-400 group-hover:text-slate-950 flex items-center justify-center mb-3 transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {cat.desc}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Selections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured Musical Equipment
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-amber-400 hover:text-amber-300"
          >
            <span>Browse Full Catalog ({products.length} products)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="animate-pulse bg-slate-800 rounded-2xl h-80 border border-slate-700/60" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-slate-800/80 border border-rose-500/30 text-center space-y-3">
            <p className="text-rose-400 font-semibold">{error}</p>
            <p className="text-xs text-slate-400">If the server is waking up from free hosting, please refresh in a moment.</p>
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700">
            <p className="text-slate-400">No products uploaded yet.</p>
            <Link to="/admin" className="text-amber-400 text-sm font-semibold mt-2 inline-block">
              Upload first product in Admin Panel →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={whatsappNum}
              />
            ))}
          </div>
        )}
      </section>

      {/* Studio Setup Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-8 sm:p-12 shadow-2xl text-slate-950">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-950 text-amber-400 text-xs font-bold tracking-wider uppercase">
              Professional Audio Engineering
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Setting Up A Studio, Church Auditorium, Or Live Stage?
            </h2>
            <p className="text-slate-900 font-medium text-sm sm:text-base leading-relaxed">
              We provide complete turnkey acoustic treatment, mixing console installations, wireless microphone frequency synchronization, and professional sound calibration.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/studio-setup"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl transition-colors"
              >
                <span>Learn About Studio Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello! I would like to request a consultation for church sound / studio equipment.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-slate-950 font-bold text-sm border border-slate-950/20 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
