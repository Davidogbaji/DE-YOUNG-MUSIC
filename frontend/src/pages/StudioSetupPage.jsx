import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Speaker, Headphones, Volume2, ShieldCheck, ArrowRight, MessageSquare, CheckCircle, Sliders, Radio } from 'lucide-react';
import { api } from '../services/api';

const SERVICES = [
  {
    id: 'church-sound',
    title: 'Church & Worship Auditorium Sound Engineering',
    desc: 'Complete digital console wiring, speaker delay alignment, stage monitor setup, and vocal microphone tuning for feedback-free worship.',
    icon: Volume2
  },
  {
    id: 'commercial-studio',
    title: 'Commercial Music Studio Setup',
    desc: 'Audio interface routing, patchbay integration, nearfield studio monitor acoustic calibration, and multi-track recording workstation setup.',
    icon: Mic
  },
  {
    id: 'home-studio',
    title: 'Home Studio & Podcasting Suite',
    desc: 'Space-saving vocal booths, portable reflection filters, USB/XLR audio interfaces, and condenser microphone package recommendations.',
    icon: Headphones
  },
  {
    id: 'live-band',
    title: 'Live Band Stage Sound & PA Systems',
    desc: 'Line array speakers, subwoofers, active DI boxes, drum mic kits, and in-ear monitor transmitter synchronization.',
    icon: Speaker
  },
  {
    id: 'dj-nightclub',
    title: 'DJ Booth & Club Sound Reinforcement',
    desc: 'High-SPL DJ monitors, Pioneer controller setup, booth isolation, and venue surround speaker distribution.',
    icon: Sliders
  },
  {
    id: 'wireless-rf',
    title: 'Wireless Mic RF Frequency Management',
    desc: 'Multi-channel wireless mic antenna distribution, frequency coordination, and interference elimination for large events.',
    icon: Radio
  },
  {
    id: 'acoustic-treatment',
    title: 'Acoustic Wall Panels & Soundproofing',
    desc: 'High-density acoustic foam, bass traps, wooden diffusers, and soundproof door seals for echo and noise control.',
    icon: ShieldCheck
  }
];

export default function StudioSetupPage() {
  const [settings, setSettings] = useState(null);
  const [selectedService, setSelectedService] = useState('Church & Worship Auditorium Sound Engineering');
  const [venueType, setVenueType] = useState('Church / Worship Center');
  const [budget, setBudget] = useState('₦500,000 - ₦2,000,000');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    api.getSettings().then(d => { if (d?.settings) setSettings(d.settings); }).catch(() => {});
  }, []);

  const whatsappNum = settings?.whatsappNumber || '2348100090843';

  const handleConsultation = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `*STUDIO / SOUND CONSULTATION ENQUIRY*\n\n` +
      `*Service Required:* ${selectedService}\n` +
      `*Venue Type:* ${venueType}\n` +
      `*Estimated Budget:* ${budget}\n` +
      `*Client Name:* ${clientName || 'N/A'}\n` +
      `*Client Phone:* ${clientPhone || 'N/A'}\n` +
      `*Project Details:* ${details || 'Please contact me for site inspection.'}\n\n` +
      `Looking forward to your professional quote.`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-24 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-5">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            Audio Engineering & Consulting
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Professional Studio Setup & <span className="text-amber-400">Church Sound Engineering</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From crystal-clear auditorium acoustics to high-end music production suites, De Young Musical provides complete equipment supply, cabling, acoustic treatment, and on-site engineering.
          </p>
        </div>
      </section>

      {/* 7 Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Engineering Services</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tailored sound solutions for worship centres, professional recording facilities, schools, and event centres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/50 space-y-3 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">{srv.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Consultation / Quote Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl space-y-6">
          <div className="border-b border-slate-700 pb-4 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black text-white">Request A Consultation / Quote</h2>
            <p className="text-xs text-slate-400 mt-1">
              Fill out your venue details below to immediately chat with our senior sound engineer on WhatsApp.
            </p>
          </div>

          <form onSubmit={handleConsultation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Service Type</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                >
                  {SERVICES.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Space Type</label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                >
                  <option value="Church / Worship Center">Church / Worship Center</option>
                  <option value="Commercial Music Studio">Commercial Music Studio</option>
                  <option value="Home Studio / Bedroom Setup">Home Studio / Bedroom Setup</option>
                  <option value="Auditorium / Conference Hall">Auditorium / Conference Hall</option>
                  <option value="Club / Lounge / Bar">Club / Lounge / Bar</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Pastor Paul / Producer David"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 08100090843"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Budget Range</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-400"
              >
                <option value="Under ₦500,000">Under ₦500,000</option>
                <option value="₦500,000 - ₦2,000,000">₦500,000 - ₦2,000,000</option>
                <option value="₦2,000,000 - ₦5,000,000">₦2,000,000 - ₦5,000,000</option>
                <option value="Above ₦5,000,000 (Full Auditorium/Mega Studio)">Above ₦5,000,000 (Full Auditorium / Mega Studio)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Details / Current Equipment</label>
              <textarea
                rows="3"
                placeholder="Mention any existing equipment or room dimensions..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>Send Project Enquiry to WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
