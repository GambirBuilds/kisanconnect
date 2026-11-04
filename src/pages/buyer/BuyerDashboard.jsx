import {
  ArrowRight,
  Boxes,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  Heart,
  History,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Search,
  Send,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Trash2,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { api } from '../../services/api.js';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'inquiries', 'saved', 'recently_viewed', 'procurement'

  const [availableListings, setAvailableListings] = useState([]);
  const [myInquiries, setMyInquiries] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inquiry filter
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Inquiry modal
  const [selectedListing, setSelectedListing] = useState(null);
  const [inquiryQuantity, setInquiryQuantity] = useState('');
  const [inquiryOfferPrice, setInquiryOfferPrice] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Inquiry message thread
  const [activeThreadInquiry, setActiveThreadInquiry] = useState(null);
  const [threadMessage, setThreadMessage] = useState('');

  // Farmer Profile Modal
  const [inspectedFarmer, setInspectedFarmer] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [listingsRes, inquiriesRes, savedRes] = await Promise.all([
      api.getCropListings({ status: 'active' }),
      api.getInquiries('buyer', user?.id),
      api.getSavedProducts(user?.id)
    ]);

    if (listingsRes.data) setAvailableListings(listingsRes.data);
    if (inquiriesRes.data) setMyInquiries(inquiriesRes.data);
    if (savedRes.data) setSavedProducts(savedRes.data);

    // Load recently viewed
    const recents = api.getRecentlyViewed();
    setRecentlyViewed(recents);

    setLoading(false);
  };

  const handleOpenInquiry = (listing) => {
    setSelectedListing(listing);
    setInquiryQuantity(String(Math.min(listing.quantity, 15)));
    setInquiryOfferPrice(String(listing.pricePerUnit));
    setInquiryMessage(
      `We would like to procure ${listing.title} for commercial supply. Please confirm dispatch readiness.`
    );
    setInquirySuccess(false);
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!selectedListing || !inquiryQuantity || !inquiryOfferPrice) return;

    await api.createInquiry(
      {
        listingId: selectedListing.id,
        listingTitle: selectedListing.title,
        farmerId: selectedListing.farmerId,
        requestedQuantity: Number(inquiryQuantity),
        unit: selectedListing.unit,
        offeredPrice: Number(inquiryOfferPrice),
        message: inquiryMessage
      },
      user
    );

    setInquirySuccess(true);
    toast.success('Procurement proposal dispatched to grower!');
    loadData();
  };

  const handleSendThreadReply = async (e) => {
    e.preventDefault();
    if (!activeThreadInquiry || !threadMessage.trim()) return;

    await api.sendInquiryMessage(activeThreadInquiry.id, threadMessage, user);
    setThreadMessage('');
    const updated = await api.getInquiryById(activeThreadInquiry.id);
    if (updated.data) setActiveThreadInquiry(updated.data);
    toast.success('Message sent.');
    loadData();
  };

  const handleRemoveSaved = async (productId, e) => {
    if (e) e.stopPropagation();
    await api.toggleSaveProduct(productId);
    toast.info('Item removed from saved list.');
    loadData();
  };

  const handleInspectFarmer = (inquiry) => {
    setInspectedFarmer({
      name: inquiry.farmerId === 'usr-farmer-001' ? 'Ramesh Bahadur Thapa' : 'Verified Producer',
      district: inquiry.farmerDistrict || 'Kavrepalanchok',
      farm: 'Thapa Organic Vegetable Farm',
      crops: 'Snowball Cauliflower, Srijana Tomato, Red Potato',
      landArea: '12 Ropani',
      phone: inquiry.status === 'accepted' ? '+977-9841234567' : 'Disclosed upon offer acceptance',
      isVerified: true
    });
  };

  const pendingCount = myInquiries.filter((i) => i.status === 'pending').length;
  const acceptedCount = myInquiries.filter((i) => i.status === 'accepted').length;

  // Filtered inquiries
  const filteredInquiries = myInquiries.filter((i) => {
    if (inquiryStatusFilter === 'all') return true;
    return i.status === inquiryStatusFilter;
  });

  // Calculate procurement volume stats
  const totalVolumeContracted = myInquiries
    .filter((i) => i.status === 'accepted')
    .reduce((sum, item) => sum + (Number(item.requestedQuantity) || 0), 0);

  const totalExpenditure = myInquiries
    .filter((i) => i.status === 'accepted')
    .reduce((sum, item) => sum + ((Number(item.requestedQuantity) || 0) * (Number(item.offeredPrice) || 0)), 0);

  return (
    <DashboardLayout currentTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">

        {/* Header Hero */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-[#14532D] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-800/80 text-blue-200 px-3 py-0.5 rounded-full border border-blue-600">
                Agro-Procurement Portal • खरिदकर्ता केन्द्र
              </span>
              <span className="text-xs text-blue-200">• Wholesale Commodity Sourcing</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user?.fullName || 'Commercial Buyer'}!
            </h2>
            <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
              Track farm-gate purchase proposals, negotiate directly with verified growers across 7 provinces, and lock forward harvest contracts without broker commissions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/marketplace"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All Farm Harvests</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-xs text-xs font-bold text-gray-600">
          {[
            { id: 'overview', label: 'Procurement Overview', icon: Building },
            { id: 'inquiries', label: `Proposals (${myInquiries.length})`, icon: MessageSquare },
            { id: 'saved', label: `Saved Watchlist (${savedProducts.length})`, icon: Heart },
            { id: 'recently_viewed', label: `Recently Viewed (${recentlyViewed.length})`, icon: History },
            { id: 'procurement', label: 'Trade Summary', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
                  isSelected
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

        {/* 4 Performance Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Live Farm Harvests</span>
            <p className="text-2xl font-black text-gray-900">{availableListings.length}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Across 18 districts</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Proposals Dispatched</span>
            <p className="text-2xl font-black text-gray-900">{myInquiries.length}</p>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
              {pendingCount} awaiting farmer response
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Confirmed Contracts</span>
            <p className="text-2xl font-black text-[#14532D]">{acceptedCount}</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Ready for pickup transport</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Contracted Volume</span>
            <p className="text-2xl font-black text-indigo-900">{totalVolumeContracted} Qtl</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Rs. {totalExpenditure.toLocaleString()}</p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & INQUIRIES */}
        {(activeTab === 'overview' || activeTab === 'inquiries') && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Procurement Proposals & Direct Negotiations</h3>
                <p className="text-xs text-gray-500">Track grower responses, review counter-offers, and obtain phone contacts</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                {['all', 'pending', 'accepted', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setInquiryStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg capitalize transition ${
                      inquiryStatusFilter === st
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500 space-y-2">
                <Package className="w-8 h-8 text-gray-300 mx-auto" />
                <p>No procurement proposals matching the selected status filter.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredInquiries.map((inq) => (
                  <div key={inq.id} className="py-4 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{inq.listingTitle}</h4>
                        <p className="text-gray-500">
                          Producer: <strong className="text-gray-800">{inq.farmerId === 'usr-farmer-001' ? 'Ramesh Bahadur Thapa' : 'Verified Grower'}</strong>
                        </p>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                        inq.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inq.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-2xl space-y-1.5 border border-gray-100">
                      <p className="text-gray-700">
                        Proposed Volume: <strong className="text-gray-900">{inq.requestedQuantity} {inq.unit}</strong> • Offered Rate:{' '}
                        <strong className="text-emerald-800 font-bold">Rs. {inq.offeredPrice} / {inq.unit}</strong>
                      </p>
                      <p className="text-gray-600 italic">"{inq.message}"</p>

                      {inq.status === 'accepted' && (
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-950 font-medium flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Farmer Contact: <strong>+977-9841234567</strong></span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold uppercase">Ready for Pickup</span>
                        </div>
                      )}

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/60">
                        <button
                          onClick={() => setActiveThreadInquiry(inq)}
                          className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>View Discussion Thread ({(inq.messages || []).length} messages)</span>
                        </button>

                        <button
                          onClick={() => handleInspectFarmer(inq)}
                          className="text-[11px] font-bold text-gray-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Inspect Farmer Credentials</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED PRODUCTS WATCHLIST */}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Saved Farm Produce Watchlist</h3>
                <p className="text-xs text-gray-500">Bookmarked harvests for easy price tracking and direct ordering</p>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {savedProducts.length} Bookmarked
              </span>
            </div>

            {savedProducts.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">
                You haven't bookmarked any harvests yet. Browse the marketplace and click the heart icon.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedProducts.map((p) => (
                  <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5 text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{p.title}</span>
                        <button
                          onClick={(e) => handleRemoveSaved(p.id, e)}
                          className="p-1 text-gray-400 hover:text-rose-600 transition"
                          title="Remove bookmark"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500">{p.farmerName} • {p.farmerDistrict}</p>
                      <div className="mt-2 text-emerald-900 font-black text-sm">
                        Rs. {p.pricePerUnit} / {p.unit}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex gap-2">
                      <Link
                        to={`/marketplace/${p.id}`}
                        className="flex-1 py-1.5 text-center bg-white border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleOpenInquiry(p)}
                        className="flex-1 py-1.5 bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800"
                      >
                        Inquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RECENTLY VIEWED PRODUCTS */}
        {activeTab === 'recently_viewed' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Recently Viewed Farm Harvests</h3>
                <p className="text-xs text-gray-500">Quickly re-open harvests inspected during this session</p>
              </div>
              <span className="text-xs font-bold text-gray-500">{recentlyViewed.length} Viewed</span>
            </div>

            {recentlyViewed.length === 0 ? (
              <div className="p-12 text-center text-xs text-gray-500">
                No harvests recently viewed yet. Explore the marketplace.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentlyViewed.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">{item.title}</span>
                      <p className="text-[11px] text-gray-500">{item.farmerDistrict} • {item.quantity} {item.unit} available</p>
                      <p className="text-emerald-900 font-bold mt-1">Rs. {item.pricePerUnit} / {item.unit}</p>
                    </div>
                    <Link
                      to={`/marketplace/${item.id}`}
                      className="w-full py-1.5 text-center bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800 transition"
                    >
                      Re-examine Harvest
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROCUREMENT & TRADE SUMMARY */}
        {activeTab === 'procurement' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-4 animate-in fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Procurement & Trade Summary</h3>
              <p className="text-xs text-gray-500">Commercial transaction volume and accepted wholesale deals</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-950">
                <span className="font-semibold block mb-1">Total Procured Volume</span>
                <span className="text-2xl font-black">{totalVolumeContracted} Quintals</span>
                <span className="text-[10px] text-emerald-700 block mt-1">Across verified producers</span>
              </div>
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-blue-950">
                <span className="font-semibold block mb-1">Committed Capital</span>
                <span className="text-2xl font-black">Rs. {totalExpenditure.toLocaleString()}</span>
                <span className="text-[10px] text-blue-700 block mt-1">Farm-gate settlements</span>
              </div>
              <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200 text-purple-950">
                <span className="font-semibold block mb-1">Direct Farmer Linkages</span>
                <span className="text-2xl font-black">{acceptedCount} Growers</span>
                <span className="text-[10px] text-purple-700 block mt-1">Zero middlemen overhead</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FARMER PROFILE MODAL */}
      {inspectedFarmer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-gray-900">Farmer Verification Card</h3>
              </div>
              <button onClick={() => setInspectedFarmer(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p className="font-bold text-gray-900 text-sm">{inspectedFarmer.name}</p>
                <p className="text-gray-600">{inspectedFarmer.farm}</p>
                <p className="text-gray-500">District: {inspectedFarmer.district}</p>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Registered Land:</span>
                  <strong>{inspectedFarmer.landArea}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Primary Crops:</span>
                  <strong>{inspectedFarmer.crops}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone Contact:</span>
                  <strong className="text-emerald-900">{inspectedFarmer.phone}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setInspectedFarmer(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INQUIRY COMMUNICATION THREAD MODAL */}
      {activeThreadInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{activeThreadInquiry.listingTitle}</h3>
                <p className="text-xs text-gray-500">Negotiation with Farmer</p>
              </div>
              <button onClick={() => setActiveThreadInquiry(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
              {(activeThreadInquiry.messages || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                    msg.senderId === user?.id
                      ? 'bg-blue-800 text-white ml-auto'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="font-bold text-[10px] opacity-80">{msg.senderName} • {msg.time}</p>
                  <p className="mt-1 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendThreadReply} className="pt-3 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="Type your reply to the producer..."
                value={threadMessage}
                onChange={(e) => setThreadMessage(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
