import {
  Activity,
  ArrowLeft,
  Bell,
  BookOpen,
  Boxes,
  CheckCircle,
  ChevronDown,
  CloudSun,
  Database,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  PlusCircle,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Sprout,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import HonestyBanner from '../common/HonestyBanner.jsx';
import NotificationBell from '../common/NotificationBell.jsx';

export default function DashboardLayout({ children, currentTab, onTabChange }) {
  const { user, role, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Nav menus per role
  const getNavItems = () => {
    switch (role) {
      case 'farmer':
        return [
          { id: 'overview', label: 'Farmer Overview', icon: LayoutDashboard },
          { id: 'crops', label: 'My Crop Listings', icon: Package },
          { id: 'inquiries', label: 'Buyer Inquiries', icon: MessageSquare },
          { id: 'prices', label: 'Live Mandi Prices', icon: TrendingUp, path: '/mandi-prices' },
          { id: 'weather', label: 'Weather & Spray Index', icon: CloudSun, path: '/weather' },
          { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen, path: '/knowledge-hub' },
          { id: 'questions', label: 'Ask Agro-Expert', icon: HelpCircle },
          { id: 'profile', label: 'Farmer Profile', icon: User, path: '/profile' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      case 'buyer':
        return [
          { id: 'overview', label: 'Buyer Overview', icon: LayoutDashboard },
          { id: 'marketplace', label: 'Browse Farm Produce', icon: ShoppingBag, path: '/marketplace' },
          { id: 'inquiries', label: 'My Inquiries & Orders', icon: MessageSquare },
          { id: 'prices', label: 'Price Discovery', icon: TrendingUp, path: '/mandi-prices' },
          { id: 'weather', label: 'Agri Weather', icon: CloudSun, path: '/weather' },
          { id: 'knowledge', label: 'Farming Knowledge', icon: BookOpen, path: '/knowledge-hub' },
          { id: 'profile', label: 'Company Profile', icon: User, path: '/profile' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      case 'expert':
        return [
          { id: 'overview', label: 'Expert Overview', icon: LayoutDashboard },
          { id: 'articles', label: 'Advisory Guides', icon: BookOpen },
          { id: 'questions', label: 'Farmer Consultations', icon: HelpCircle },
          { id: 'prices', label: 'Market Trends', icon: TrendingUp, path: '/mandi-prices' },
          { id: 'weather', label: 'Regional Weather', icon: CloudSun, path: '/weather' },
          { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen, path: '/knowledge-hub' },
          { id: 'profile', label: 'Expert Credentials', icon: User, path: '/profile' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Platform Metrics', icon: LayoutDashboard },
          { id: 'users', label: 'User Directory', icon: Users },
          { id: 'listings', label: 'Listing Moderation', icon: Package },
          { id: 'categories', label: 'Agri Categories', icon: Boxes },
          { id: 'weather', label: 'Weather Radar', icon: CloudSun, path: '/weather' },
          { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen, path: '/knowledge-hub' },
          { id: 'logs', label: 'Activity Audit Logs', icon: Activity },
          { id: 'database', label: 'Database & RLS', icon: Database },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
      default:
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'weather', label: 'Weather', icon: CloudSun, path: '/weather' },
          { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen, path: '/knowledge-hub' },
          { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
          { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleHeaderDetails = () => {
    switch (role) {
      case 'farmer':
        return {
          title: 'Farmer Operations Hub',
          badge: 'Verified Producer',
          color: 'from-emerald-700 to-green-900',
        };
      case 'buyer':
        return {
          title: 'Agro-Procurement Portal',
          badge: 'Commercial Buyer',
          color: 'from-blue-700 to-slate-900',
        };
      case 'expert':
        return {
          title: 'Agricultural Advisory Bureau',
          badge: 'Agronomist & Scientist',
          color: 'from-purple-700 to-indigo-950',
        };
      case 'admin':
        return {
          title: 'Platform Governance & Security',
          badge: 'System Administrator',
          color: 'from-amber-700 to-stone-900',
        };
      default:
        return {
          title: 'User Portal',
          badge: 'Member',
          color: 'from-gray-700 to-gray-900',
        };
    }
  };

  const roleDetails = getRoleHeaderDetails();

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200/80 shrink-0">
          {/* Brand header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#14532D] text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-extrabold text-gray-900 text-lg tracking-tight">
                Kisan<span className="text-emerald-700 font-normal">Connect</span>
              </span>
            </Link>
          </div>

          {/* User mini profile */}
          <div className="p-4 border-b border-gray-100 bg-[#F4F7F4]/50">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14532D&color=fff`}
                alt={user?.fullName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
              />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {role}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">{user?.district}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = item.path
                ? location.pathname === item.path
                : currentTab === item.id;

              if (item.path) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isItemActive
                        ? 'bg-[#14532D] text-white shadow-xs'
                        : 'text-gray-600 hover:bg-emerald-50/70 hover:text-emerald-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isItemActive ? 'text-emerald-300' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange && onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    isItemActive
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'text-gray-600 hover:bg-emerald-50/70 hover:text-emerald-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isItemActive ? 'text-emerald-300' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer actions in sidebar */}
          <div className="p-3 border-t border-gray-100 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              <Home className="w-4 h-4 text-gray-400" />
              <span>Back to Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-64 max-w-[80%] bg-white h-full flex flex-col z-10 shadow-2xl">
              <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
                <span className="font-extrabold text-gray-900 text-base">Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 border-b border-gray-100 bg-[#F4F7F4]/50">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{role} • {user?.district}</p>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = item.path ? location.pathname === item.path : currentTab === item.id;
                  return item.path ? (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isItemActive ? 'bg-[#14532D] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange && onTabChange(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left ${
                        isItemActive ? 'bg-[#14532D] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Dashboard Header */}
          <header className="bg-white border-b border-gray-200/80 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>{roleDetails.title}</span>
                  <span className="hidden sm:inline-flex text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {roleDetails.badge}
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />

              <Link
                to="/"
                className="text-xs font-semibold text-gray-600 hover:text-emerald-800 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Website</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 border-l border-gray-200 hover:opacity-80 transition"
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14532D&color=fff`}
                  alt={user?.fullName}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              </Link>
            </div>
          </header>

          {/* Children body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
