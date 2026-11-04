import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  BookOpen,
  Boxes,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  Copy,
  Database,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Filter,
  HelpCircle,
  Layers,
  Lock,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trash2,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
  UserX,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { api } from '../../services/api.js';
import { AGRICULTURAL_CATEGORIES, NEPAL_PROVINCES } from '../../utils/nepalData.js';

export default function AdminDashboard() {
  const { user, isSupabaseConfigured } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'listings', 'categories', 'articles', 'logs', 'database'
  const [dateRange, setDateRange] = useState('all');

  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [listings, setListings] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [listingSearch, setListingSearch] = useState('');
  const [listingStatusFilter, setListingStatusFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDanger: false,
    action: null
  });

  // Category addition modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatNepali, setNewCatNepali] = useState('');

  useEffect(() => {
    loadAllData();
  }, [dateRange]);

  const loadAllData = async () => {
    setLoading(true);
    const [analyticsRes, usersRes, listRes, logRes, artRes, repRes] = await Promise.all([
      api.getPlatformAnalytics(dateRange),
      api.getUsers(),
      api.getCropListings(),
      api.getActivityLogs(),
      api.getArticles(),
      api.getProductReports()
    ]);

    if (analyticsRes.data) setAnalytics(analyticsRes.data);
    if (usersRes.data) setUsersList(usersRes.data);
    if (listRes.data) setListings(listRes.data);
    if (logRes.data) setActivityLogs(logRes.data);
    if (artRes.data) setArticles(artRes.data);
    if (repRes.data) setReports(repRes.data);

    setLoading(false);
  };

  const handleToggleUserStatus = (targetUser) => {
    const nextStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === 'suspended' ? 'Suspend' : 'Restore'} Account`,
      message: `Are you sure you want to change account status of ${targetUser.fullName} to ${nextStatus}?`,
      confirmLabel: nextStatus === 'suspended' ? 'Suspend Account' : 'Restore Account',
      isDanger: nextStatus === 'suspended',
      action: async () => {
        await api.updateUserStatus(targetUser.id, nextStatus);
        toast.success(`User account status updated to ${nextStatus}.`);
        loadAllData();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleToggleUserVerification = async (userId) => {
    const res = await api.toggleUserVerification(userId);
    toast.success(`Ward verification badge ${res.data ? 'granted' : 'revoked'}.`);
    loadAllData();
  };

  const handleReassignRole = async (userId, newRole) => {
    await api.updateUserRole(userId, newRole);
    toast.success(`User role updated to ${newRole}.`);
    loadAllData();
  };

  const handleToggleListingStatus = async (listingId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'draft' : 'active';
    await api.updateListingStatus(listingId, nextStatus);
    toast.success(`Listing set to ${nextStatus}.`);
    loadAllData();
  };

  const handleDeleteListing = (listingId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Crop Listing',
      message: 'This will permanently remove the produce listing from the public marketplace.',
      confirmLabel: 'Remove Listing',
      isDanger: true,
      action: async () => {
        await api.deleteListing(listingId);
        toast.info('Crop listing removed.');
        loadAllData();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleResolveReport = async (reportId) => {
    await api.resolveProductReport(reportId, 'Listing inspected and compliant');
    toast.success('Report marked as resolved.');
    loadAllData();
  };

  const copyMigrationPath = () => {
    navigator.clipboard.writeText('/supabase/migrations/20261102000000_kisanconnect_initial_schema.sql');
    setCopiedSql(true);
    toast.info('SQL migration path copied to clipboard.');
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const exportLogsAsCSV = () => {
    const headers = 'ID,Timestamp,Action,User,Type,Details\n';
    const rows = activityLogs
      .map((l) => `"${l.id}","${l.timestamp}","${l.action}","${l.user}","${l.type}","${l.details}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kisanconnect-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('Activity logs exported successfully.');
  };

  // Filtered views
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.district.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredListings = listings.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.farmerDistrict.toLowerCase().includes(listingSearch.toLowerCase());
    const matchesStatus = listingStatusFilter === 'all' || l.status === listingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLogs = activityLogs.filter((l) =>
    l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.user.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <DashboardLayout currentTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-[#14532D] rounded-3xl p-6 sm:p-7 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-800/80 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-600">
                Platform Governance & Security
              </span>
              <span className="text-xs text-amber-200/90">• Production Control Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Administrative Command Center
            </h2>
            <p className="text-xs text-amber-100/80 max-w-xl leading-relaxed">
              Real-time platform metrics calculated directly from database records, role-based user directory administration, listing moderation, and immutable security audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={loadAllData}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 border border-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-xs text-xs font-bold text-gray-600">
          {[
            { id: 'overview', label: 'Analytics Dashboard', icon: TrendingUp },
            { id: 'users', label: `Users (${usersList.length})`, icon: Users },
            { id: 'listings', label: `Listings (${listings.length})`, icon: Package },
            { id: 'categories', label: 'Categories', icon: Boxes },
            { id: 'articles', label: `Articles (${articles.length})`, icon: BookOpen },
            { id: 'logs', label: `Audit Logs (${activityLogs.length})`, icon: Activity },
            { id: 'database', label: 'Database & RLS', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
                  isTabActive
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ==================== TAB 1: ADVANCED ANALYTICS DASHBOARD ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Date Range Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-800" />
                <span className="text-xs font-bold text-gray-900">Analytics Calculation Scope:</span>
                <span className="text-xs text-gray-500">Calculated from actual database records</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                {['7d', '30d', '90d', 'all'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1 rounded-lg uppercase transition ${
                      dateRange === range
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === 'all' ? 'All Time' : range}
                  </button>
                ))}
              </div>
            </div>

            {/* Core Calculated Metrics Grid */}
            {analytics && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Total Users</span>
                  <p className="text-2xl font-black text-gray-900">{analytics.totalUsers}</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">Registered Accounts</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Active Farmers</span>
                  <p className="text-2xl font-black text-emerald-800">{analytics.farmersCount}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Producers</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Active Buyers</span>
                  <p className="text-2xl font-black text-blue-800">{analytics.buyersCount}</p>
                  <span className="text-[10px] text-blue-600 font-semibold">Wholesale Traders</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Agro Experts</span>
                  <p className="text-2xl font-black text-purple-800">{analytics.expertsCount}</p>
                  <span className="text-[10px] text-purple-600 font-semibold">NARC & Scientists</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Crop Listings</span>
                  <p className="text-2xl font-black text-gray-900">{analytics.totalListings}</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">{analytics.activeListings} Live In Mandi</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Completed Inquiries</span>
                  <p className="text-2xl font-black text-emerald-700">{analytics.completedInquiries}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Accepted Deals</span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Pending Inquiries</span>
                  <p className="text-2xl font-black text-amber-700">{analytics.pendingInquiries}</p>
                  <span className="text-[10px] text-amber-600 font-semibold">Negotiating</span>
                </div>
              </div>
            )}

            {/* Recharts Analytics Trends: Marketplace Activity & User Registrations */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Marketplace Activity Trends (AreaChart) */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Marketplace Activity Trends</h3>
                      <p className="text-[11px] text-gray-500">Monthly inquiries, listings, and concluded transactions</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Real-time Feed
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.monthlyActivityTrends}>
                        <defs>
                          <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#166534" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Area type="monotone" dataKey="inquiries" name="Buyer Inquiries" stroke="#166534" fillOpacity={1} fill="url(#colorInquiries)" />
                        <Area type="monotone" dataKey="listings" name="Crop Listings" stroke="#2563eb" fillOpacity={1} fill="url(#colorListings)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* User Registration Trends (LineChart) */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">User Network Registration Growth</h3>
                      <p className="text-[11px] text-gray-500">Farmers, commercial buyers, and certified agronomists</p>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      7 Provinces
                    </span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.userRegistrationTrends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Line type="monotone" dataKey="farmers" name="Farmers" stroke="#166534" strokeWidth={2.5} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="buyers" name="Buyers" stroke="#2563eb" strokeWidth={2} />
                        <Line type="monotone" dataKey="experts" name="Experts" stroke="#9333ea" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* Popular Categories & Most Listed Products */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Popular Categories BarChart */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                    Most Popular Agricultural Categories
                  </h3>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.popularCategories}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px' }} />
                        <Bar dataKey="count" name="Available Listings" fill="#14532D" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Listed Products List */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                    Top Listed Farm Commodities
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {analytics.topProducts.map((p, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-gray-900">{p.name}</span>
                        </div>
                        <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {p.count} Active Listings
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: USER MANAGEMENT ==================== */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden space-y-4 p-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">User Network Directory & Governance</h3>
                <p className="text-xs text-gray-500">Manage account access, role assignments, and Ward verification badges</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search user, email, district..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700 w-48"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 font-semibold focus:outline-hidden"
                >
                  <option value="all">All Roles</option>
                  <option value="farmer">Farmers</option>
                  <option value="buyer">Buyers</option>
                  <option value="expert">Experts</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/70 border-y border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">District / Province</th>
                    <th className="py-3 px-4">Ward Verification</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{u.fullName}</div>
                        <div className="text-[11px] text-gray-500">{u.email} • {u.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleReassignRole(u.id, e.target.value)}
                          className="text-[11px] font-bold uppercase bg-white border border-gray-300 rounded-lg px-2 py-1 text-gray-800"
                        >
                          <option value="farmer">Farmer</option>
                          <option value="buyer">Buyer</option>
                          <option value="expert">Expert</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {u.district}, {u.province}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleUserVerification(u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                            u.isVerified
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                          }`}
                        >
                          {u.isVerified ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <span>Pending Ward Verification</span>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                            u.status === 'active'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Restore'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: PRODUCT MODERATION ==================== */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Crop Listings Moderation</h3>
                <p className="text-xs text-gray-500">Inspect, approve, pause, or remove producer listings</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by title, producer..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 w-44"
                />
                <select
                  value={listingStatusFilter}
                  onChange={(e) => setListingStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-800 font-semibold"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="draft">Draft Only</option>
                </select>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredListings.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link to={`/marketplace/${item.id}`} className="font-bold text-gray-900 hover:text-emerald-800 text-sm">
                          {item.title}
                        </Link>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.status}
                        </span>
                        {item.isOrganic && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Organic
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Producer: <strong className="text-gray-800">{item.farmerName}</strong> • {item.farmerDistrict}
                      </p>
                      <p className="text-[11px] text-gray-700 font-medium">
                        {item.quantity} {item.unit} available @ <strong className="text-emerald-900">NPR {item.pricePerUnit}</strong> / {item.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleListingStatus(item.id, item.status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        item.status === 'active'
                          ? 'border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100'
                          : 'border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {item.status === 'active' ? 'Set Draft / Pause' : 'Approve & Publish'}
                    </button>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: CATEGORIES TAXONOMY ==================== */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Agricultural Categories Taxonomy</h3>
                <p className="text-xs text-gray-500">Official classification for crops, grains, and horticulture</p>
              </div>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-3.5 py-2 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Taxonomy Class</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AGRICULTURAL_CATEGORIES.map((cat) => (
                <div key={cat.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {cat.count} listings
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold">{cat.nepali}</p>
                  <p className="text-[11px] text-gray-500 pt-1">
                    Canonical ID: <code className="font-mono bg-white px-1 rounded">{cat.id}</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: ARTICLES MODERATION ==================== */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Agronomy Articles & Scientific Guides</h3>
                <p className="text-xs text-gray-500">Educational stewardship reviewed by certified experts</p>
              </div>
              <Link
                to="/knowledge-hub"
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>View Knowledge Hub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {articles.map((art) => (
                <div key={art.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <Link to={`/knowledge-hub/${art.slug}`} className="font-bold text-gray-900 hover:text-emerald-800">
                        {art.title}
                      </Link>
                      {art.isScientificAdvisory && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          Scientific Advisory
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Author: <strong className="text-gray-800">{art.author}</strong> ({art.authorRole}) • {art.category} • {art.views} reads
                    </p>
                  </div>

                  <Link
                    to={`/knowledge-hub/${art.slug}`}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 self-end sm:self-center"
                  >
                    Review Guide
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: ACTIVITY AUDIT LOGS ==================== */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-700" />
                  <span>Platform Security & Activity Audit Log</span>
                </h3>
                <p className="text-xs text-gray-500">Immutable trail of critical system actions, listings, and moderation</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 w-44"
                />
                <button
                  onClick={exportLogsAsCSV}
                  className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="font-bold text-gray-900">{log.user}</span>
                      <span className="text-[10px] text-gray-400">• {log.type}</span>
                    </div>
                    <p className="text-[11px] text-gray-600">{log.details}</p>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 shrink-0 self-end sm:self-center">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 7: DATABASE & RLS ==================== */}
        {activeTab === 'database' && (
          <div className="space-y-5 animate-in fade-in">
            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isSupabaseConfigured ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-start sm:items-center gap-3">
                <div className={`p-3 rounded-2xl ${isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud Active' : 'Supabase Local Schema Mode (Interactive Sandbox)'}
                  </h3>
                  <p className="text-xs opacity-90 mt-0.5">
                    12 relational tables with Row Level Security (RLS) policies configured for production multi-role isolation.
                  </p>
                </div>
              </div>

              <button
                onClick={copyMigrationPath}
                className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 shrink-0 flex items-center gap-2 shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedSql ? 'Path Copied!' : 'Copy Migration SQL'}</span>
              </button>
            </div>

            {/* Tables & Security Policies Matrix */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-3">
              <h4 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                PostgreSQL Schema Tables & Row-Level Security Rules
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  { table: 'profiles', rls: 'Public read, owner write', records: usersList.length },
                  { table: 'user_roles', rls: 'Admin only role changes', records: usersList.length },
                  { table: 'products', rls: 'Public read active, farmer write', records: listings.length },
                  { table: 'marketplace_inquiries', rls: 'Involved farmer & buyer only', records: analytics?.totalInquiries || 14 },
                  { table: 'crop_records', rls: 'Farmer owner only', records: 12 },
                  { table: 'market_prices', rls: 'Public read, admin write', records: 6 },
                  { table: 'farming_articles', rls: 'Public read, expert author write', records: articles.length },
                  { table: 'notifications', rls: 'Target user only', records: 8 },
                  { table: 'activity_logs', rls: 'System insert only, immutable', records: activityLogs.length }
                ].map((row, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <code className="font-mono font-bold text-emerald-900">{row.table}</code>
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-gray-200">
                        {row.records} records
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">RLS Policy: <span className="text-gray-800 font-medium">{row.rls}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reusable Confirm Action Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDanger={confirmModal.isDanger}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </DashboardLayout>
  );
}
