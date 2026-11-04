import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  ShoppingBag,
  Sprout,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import NotificationBell from './NotificationBell.jsx';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!role) return '/login';
    switch (role) {
      case 'farmer':
        return '/dashboard/farmer';
      case 'buyer':
        return '/dashboard/buyer';
      case 'expert':
        return '/dashboard/expert';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/dashboard/farmer';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Mandi Rates', path: '/mandi-prices' },
    { name: 'Agri Assistant', path: '/farming-assistant' },
    { name: 'Weather', path: '/weather' },
    { name: 'Knowledge Hub', path: '/knowledge-hub' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getRoleBadgeColor = (r) => {
    switch (r) {
      case 'farmer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'buyer':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'expert':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#166534] to-[#14532D] flex items-center justify-center text-white shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="w-6 h-6 text-emerald-300 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#14532D]">
                  Kisan<span className="text-emerald-700 font-normal">Connect</span>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                  नेपाल
                </span>
              </div>
              <span className="text-[11px] font-medium text-gray-700 tracking-wide">
                Smart Agriculture Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'text-emerald-900 bg-emerald-100/90'
                    : 'text-gray-800 hover:text-emerald-950 hover:bg-emerald-50/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 relative">
                {/* In-App Notifications */}
                <NotificationBell />

                {/* Dashboard Shortcut Button */}
                <Link
                  to={getDashboardPath()}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#14532D] text-white hover:bg-emerald-800 transition flex items-center gap-2 shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                  <span>Dashboard</span>
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded font-extrabold border ${getRoleBadgeColor(role)}`}>
                    {role}
                  </span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition border border-gray-200"
                    aria-expanded={userMenuOpen}
                  >
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=14532D&color=fff`}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getRoleBadgeColor(role)}`}>
                            {role}
                          </span>
                          {user.isVerified && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                              <Shield className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                          <span>My Role Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <User className="w-4 h-4 text-emerald-700" />
                          <span>User Profile</span>
                        </Link>
                        <Link
                          to="/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          <TrendingUp className="w-4 h-4 text-emerald-700" />
                          <span>Account Settings</span>
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#14532D] hover:text-emerald-800 hover:bg-emerald-50/70 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold bg-[#14532D] text-white hover:bg-emerald-800 rounded-xl transition shadow-sm hover:shadow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <>
                <NotificationBell />
                <Link
                  to={getDashboardPath()}
                  className="px-2.5 py-1 text-xs font-bold bg-emerald-800 text-white rounded-lg"
                >
                  Dashboard
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-base font-semibold rounded-lg ${
                  isActive(link.path)
                    ? 'text-emerald-900 bg-emerald-100/90'
                    : 'text-gray-800 hover:bg-emerald-50/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=14532D&color=fff`}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize">{role} • {user.district}</p>
                  </div>
                </div>

                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to {role} Dashboard
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                  >
                    <User className="w-3.5 h-3.5" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 py-2 border border-red-200 bg-red-50 rounded-xl text-xs font-semibold text-red-600"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 border border-emerald-800 text-emerald-800 rounded-xl font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
