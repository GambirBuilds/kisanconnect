import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Key,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { DEMO_USERS } from '../../utils/nepalData.js';

export default function LoginPage() {
  const { login, resetPassword, switchSandboxRole, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const targetDashboard = `/dashboard/${res.user?.role || 'farmer'}`;
      navigate(from || targetDashboard, { replace: true });
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    const demo = DEMO_USERS[roleKey];
    if (demo) {
      switchSandboxRole(roleKey);
      navigate(from || `/dashboard/${roleKey}`, { replace: true });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    await resetPassword(resetEmail);
    setResetSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Brand header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#166534] to-[#14532D] text-white flex items-center justify-center shadow-md">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="text-2xl font-black text-[#14532D] tracking-tight">
                Kisan<span className="text-emerald-700 font-normal">Connect</span>
              </span>
            </Link>
            <h2 className="text-xl font-black text-gray-900">Sign in to your account</h2>
            <p className="text-xs text-gray-500">
              Access your agricultural dashboard, mandi prices, and crop contracts
            </p>
          </div>

          {/* Quick Demo Role Switcher for seamless testing */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                1-Click Testing Accounts
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                All 4 Roles
              </span>
            </div>
            <p className="text-[11px] text-emerald-800/80 leading-normal">
              Click any role below to instantly log in and inspect its personalized dashboard:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer')}
                className="py-2 px-2.5 bg-white hover:bg-emerald-100/60 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition flex items-center justify-between shadow-2xs"
              >
                <span>🌾 Farmer (Ramesh)</span>
                <ArrowRight className="w-3 h-3 text-emerald-600" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer')}
                className="py-2 px-2.5 bg-white hover:bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold transition flex items-center justify-between shadow-2xs"
              >
                <span>🏢 Buyer (Sita)</span>
                <ArrowRight className="w-3 h-3 text-blue-600" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('expert')}
                className="py-2 px-2.5 bg-white hover:bg-purple-50 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold transition flex items-center justify-between shadow-2xs"
              >
                <span>🔬 Expert (Dr. Anil)</span>
                <ArrowRight className="w-3 h-3 text-purple-600" />
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-2 px-2.5 bg-white hover:bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center justify-between shadow-2xs"
              >
                <span>🛡️ Administrator</span>
                <ArrowRight className="w-3 h-3 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh.farmer@kisanconnect.np"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetModalOpen(true);
                      setResetEmail(email);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#14532D] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In with Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-gray-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-emerald-800 hover:underline">
                Register as Farmer or Buyer
              </Link>
            </div>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-900 transition">
              &larr; Back to KisanConnect Home
            </Link>
          </div>

        </div>
      </div>

      {/* Password Reset Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-1">Reset Password</h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter your email address to receive password reset instructions.
            </p>

            {resetSuccess ? (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs text-gray-700">
                  Password reset link has been dispatched to <strong>{resetEmail}</strong>.
                </p>
                <button
                  onClick={() => {
                    setResetModalOpen(false);
                    setResetSuccess(false);
                  }}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-3.5 py-1.5 border border-gray-200 text-gray-700 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
