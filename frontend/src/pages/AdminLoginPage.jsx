import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Music, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Login failure:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('ogidithomasiji43@gmail.com');
    setPassword('Admin@12345');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-slate-800/90 p-8 sm:p-10 rounded-3xl border border-slate-700/80 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Store Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Sign in to upload products, manage stock, and view customer orders
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="ogidithomasiji43@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-400"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-400"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper */}
        <div className="pt-4 border-t border-slate-700/60 text-center space-y-2">
          <p className="text-[11px] text-slate-400">Default Admin Credentials:</p>
          <div className="p-3 bg-slate-900 rounded-xl text-left text-[11px] font-mono text-slate-300 space-y-1">
            <p>Email: <span className="text-amber-400">ogidithomasiji43@gmail.com</span></p>
            <p>Password: <span className="text-amber-400">Admin@12345</span></p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
          >
            Auto-fill credentials
          </button>
        </div>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-400 hover:text-white">
            ← Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
