import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Flag,
  Heart,
  HelpCircle,
  MapPin,
  MessageSquare,
  Package,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { api } from '../../services/api.js';
import { marketPriceService } from '../../services/marketPriceService.js';
import {
  AGRICULTURAL_CATEGORIES,
  NEPAL_DISTRICTS,
  NEPAL_PROVINCES
} from '../../utils/nepalData.js';

export default function MarketplacePage() {
  const { user, role, switchSandboxRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedQuality, setSelectedQuality] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [savedProductIds, setSavedProductIds] = useState(['lst-101', 'lst-103']);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'featured', 'recent'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Inquiry modal state
  const [inquiryModalListing, setInquiryModalListing] = useState(null);
  const [inquiryQuantity, setInquiryQuantity] = useState('');
  const [inquiryOfferPrice, setInquiryOfferPrice] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Report listing modal state
  const [reportListingTarget, setReportListingTarget] = useState(null);
  const [reportReason, setReportReason] = useState('Incorrect price or expired produce');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    loadListings();
  }, [
    selectedCategory,
    searchQuery,
    selectedProvince,
    selectedDistrict,
    selectedQuality,
    selectedAvailability,
    sortBy,
    minPrice,
    maxPrice,
    organicOnly
  ]);

  const loadListings = async () => {
    setLoading(true);
    const res = await api.getCropListings({
      category: selectedCategory,
      district: selectedDistrict,
      quality: selectedQuality,
      availability: selectedAvailability,
      minPrice,
      maxPrice,
      sortBy,
      organicOnly,
      search: searchQuery,
      status: 'active'
    });
    if (res.data) setListings(res.data);
    setCurrentPage(1);
    setLoading(false);
  };

  const handleToggleSave = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await api.toggleSaveProduct(id);
    if (res.data) {
      setSavedProductIds([...savedProductIds, id]);
      toast.success('Added to saved watchlist.');
    } else {
      setSavedProductIds(savedProductIds.filter((pId) => pId !== id));
      toast.info('Removed from saved watchlist.');
    }
  };

  const handleOpenInquiry = (listing, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Record recently viewed
    api.recordRecentlyViewed(listing);

    setInquiryModalListing(listing);
    setInquiryQuantity(String(Math.min(listing.quantity, 10)));
    setInquiryOfferPrice(String(listing.pricePerUnit));
    setInquiryMessage(
      `Hello ${listing.farmerName}, we are interested in procuring ${listing.title}. Please confirm dispatch readiness.`
    );
    setInquirySuccess(false);
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryQuantity || !inquiryOfferPrice) return;

    setSubmittingInquiry(true);
    const activeBuyer =
      user?.role === 'buyer'
        ? user
        : {
            id: user?.id || 'usr-buyer-001',
            fullName: user?.fullName || 'Commercial Agro-Buyer',
            role: 'buyer',
            companyName: 'Himalayan Fresh Wholesale',
            phone: user?.phone || '+977-9851098765'
          };

    const res = await api.createInquiry(
      {
        listingId: inquiryModalListing.id,
        listingTitle: inquiryModalListing.title,
        farmerId: inquiryModalListing.farmerId,
        requestedQuantity: Number(inquiryQuantity),
        unit: inquiryModalListing.unit,
        offeredPrice: Number(inquiryOfferPrice),
        message: inquiryMessage
      },
      activeBuyer
    );

    setSubmittingInquiry(false);
    if (!res.error) {
      setInquirySuccess(true);
      toast.success('Inquiry submitted to farmer!');
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportListingTarget) return;

    setSubmittingReport(true);
    await api.reportListing(reportListingTarget.id, reportReason, user);
    setSubmittingReport(false);
    setReportListingTarget(null);
    toast.success('Report submitted for administrative review. Thank you!');
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedProvince('All');
    setSelectedDistrict('All');
    setSelectedQuality('All');
    setSelectedAvailability('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setOrganicOnly(false);
    setSearchQuery('');
    setViewMode('all');
  };

  // Filter view mode (all vs featured vs recently added)
  const displayedListings = listings.filter((item) => {
    if (viewMode === 'featured') return item.isOrganic || item.quality === 'grade_a_premium';
    if (viewMode === 'recent') {
      const isRecent = new Date(item.harvestDate).getTime() >= Date.now() - 14 * 24 * 60 * 60 * 1000;
      return isRecent;
    }
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(displayedListings.length / itemsPerPage) || 1;
  const paginatedListings = displayedListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-emerald-950 via-[#14532D] to-emerald-900 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Farm-Gate Produce Directory • प्रत्यक्ष कृषि बजार
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Agricultural Marketplace
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              Source verified farm produce directly from Nepali growers with transparent pricing, forward harvest dates, and zero broker commissions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {role === 'farmer' ? (
              <Link
                to="/dashboard/farmer"
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>List New Harvest</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  switchSandboxRole('farmer');
                  navigate('/dashboard/farmer');
                }}
                className="px-5 py-3 bg-white hover:bg-emerald-50 text-[#14532D] font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Sprout className="w-4 h-4 text-emerald-700" />
                <span>Sell As Farmer</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* View Mode Segmented Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-2xl shadow-xs text-xs font-bold">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-xl transition ${
                viewMode === 'all'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Harvests ({listings.length})
            </button>
            <button
              onClick={() => setViewMode('featured')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                viewMode === 'featured'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Featured Produce</span>
            </button>
            <button
              onClick={() => setViewMode('recent')}
              className={`px-4 py-2 rounded-xl transition ${
                viewMode === 'recent'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recently Added
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Mandi Benchmark Comparison Enabled
            </span>
          </div>
        </div>
      </section>

      {/* Search & Multi-Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full space-y-3">
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-xs space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search crop variety, vegetable, fruit or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Category Select */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="All">All Categories (सबै वर्ग)</option>
                {AGRICULTURAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name} ({cat.nepali})
                  </option>
                ))}
              </select>
            </div>

            {/* District Select */}
            <div className="md:col-span-3">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="All">All Nepal Districts</option>
                {NEPAL_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white font-medium"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="harvest_date">Harvest Date</option>
              </select>
            </div>
          </div>

          {/* Secondary filter bar: Quality, Min/Max Price, Organic, Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Grade:</span>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-gray-200 text-xs bg-white font-medium"
                >
                  <option value="All">All Grades</option>
                  <option value="grade_a_premium">Grade-A Premium</option>
                  <option value="grade_b_standard">Grade-B Standard</option>
                  <option value="organic_certified">Organic Certified</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Availability:</span>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-gray-200 text-xs bg-white font-medium"
                >
                  <option value="All">All Availabilities</option>
                  <option value="in_stock">In Stock & Ready</option>
                  <option value="forward_harvest">Forward Harvest</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">Price (NPR):</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
                />
                <span>Organic Only</span>
              </label>
            </div>

            <button
              onClick={resetFilters}
              className="px-3 py-1 text-gray-500 hover:text-gray-800 text-xs flex items-center gap-1 font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* Produce Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600 font-medium">
            Showing <strong className="text-gray-900">{displayedListings.length}</strong> available crop listings
          </p>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-medium">Querying fresh harvests...</p>
          </div>
        ) : paginatedListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">No Crop Listings Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              Try adjusting your category, district, or price filters to view other agricultural harvests.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedListings.map((item) => {
              const isSaved = savedProductIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image & Overlays */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <Link to={`/marketplace/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                        {item.isOrganic && (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <Sprout className="w-3 h-3" /> Organic
                          </span>
                        )}
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        <button
                          onClick={() => setReportListingTarget(item)}
                          className="p-1.5 rounded-xl bg-white/90 text-gray-500 hover:text-amber-700 hover:bg-amber-50 backdrop-blur-xs transition"
                          title="Report listing"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleToggleSave(item.id, e)}
                          className={`p-1.5 rounded-xl backdrop-blur-md transition ${
                            isSaved
                              ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-400'
                              : 'bg-white/90 text-gray-600 hover:text-rose-600'
                          }`}
                          title={isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-gray-900 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                        Rs. {item.pricePerUnit}{' '}
                        <span className="text-[10px] font-medium text-gray-600">
                          /{item.currency.split('/')[1] || item.unit}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      <Link to={`/marketplace/${item.id}`}>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-emerald-900 transition line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Mandi Benchmark comparison pill */}
                      <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-950 flex items-center justify-between">
                        <span className="text-gray-500">Mandi Benchmark:</span>
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3 text-emerald-700" />
                          <span>Direct Farm Rate</span>
                        </span>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-gray-100 text-xs">
                        <div className="flex items-center justify-between text-gray-600">
                          <span className="text-gray-400">Available Volume:</span>
                          <strong className="text-gray-900 font-bold">
                            {item.quantity} {item.unit}
                          </strong>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span className="text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> Location:
                          </span>
                          <span className="text-gray-900 font-medium">{item.farmerDistrict}</span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Harvest:
                          </span>
                          <span className="text-gray-900 font-medium">{item.harvestDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                    <Link
                      to={`/marketplace/${item.id}`}
                      className="py-2 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                    <button
                      onClick={(e) => handleOpenInquiry(item, e)}
                      className="py-2 px-2.5 bg-[#14532D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Inquire</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Responsive Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                    currentPage === pg
                      ? 'bg-[#14532D] text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* PURCHASE INQUIRY MODAL */}
      {inquiryModalListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Send Purchase Inquiry</h3>
                  <p className="text-xs text-gray-500">Direct Farmer Negotiation</p>
                </div>
              </div>
              <button
                onClick={() => setInquiryModalListing(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-gray-900">Trade Proposal Dispatched!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your inquiry for <strong>{inquiryQuantity} {inquiryModalListing.unit}</strong> has been notified to{' '}
                  <strong>{inquiryModalListing.farmerName}</strong>. You can follow the negotiation in your Buyer Dashboard.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setInquiryModalListing(null)}
                    className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Close
                  </button>
                  <Link
                    to="/dashboard/buyer"
                    className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                  >
                    View My Inquiries
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4 pt-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{inquiryModalListing.title}</p>
                    <p className="text-[11px] text-gray-500">
                      Farmer: {inquiryModalListing.farmerName} • {inquiryModalListing.farmerDistrict}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-800">
                      Rs. {inquiryModalListing.pricePerUnit} / {inquiryModalListing.unit}
                    </span>
                    <p className="text-[10px] text-gray-400">
                      Stock: {inquiryModalListing.quantity} {inquiryModalListing.unit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Required Quantity ({inquiryModalListing.unit}) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={inquiryModalListing.quantity}
                      value={inquiryQuantity}
                      onChange={(e) => setInquiryQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Proposed Price (NPR/{inquiryModalListing.unit}) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={inquiryOfferPrice}
                      onChange={(e) => setInquiryOfferPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Trade Message / Pickup Timeline:</label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setInquiryModalListing(null)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="px-5 py-2 bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800 transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingInquiry ? 'Dispatching...' : 'Dispatch Proposal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REPORT LISTING MODAL */}
      {reportListingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Report Crop Listing</h3>
                  <p className="text-[11px] text-gray-500">Marketplace Integrity & Safety</p>
                </div>
              </div>
              <button
                onClick={() => setReportListingTarget(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Reporting: <strong>{reportListingTarget.title}</strong> by {reportListingTarget.farmerName}
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reason for Report:</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 text-xs"
                >
                  <option value="Incorrect price or expired produce">Incorrect price or expired produce</option>
                  <option value="Misleading quality grade / non-organic represented as organic">
                    Misleading quality grade / Non-organic represented as organic
                  </option>
                  <option value="Unreachable producer or unresponsive phone">
                    Unreachable producer or unresponsive phone
                  </option>
                  <option value="Suspected fraudulent listing">Suspected fraudulent listing</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReportListingTarget(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-4 py-2 bg-amber-700 text-white rounded-xl font-bold hover:bg-amber-800 transition"
                >
                  {submittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
