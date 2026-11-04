import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Clock,
  Heart,
  HelpCircle,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  Pause,
  Phone,
  Play,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  Trash2,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { api } from '../../services/api.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, switchSandboxRole } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Inquiry modal
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryQuantity, setInquiryQuantity] = useState('');
  const [inquiryOfferPrice, setInquiryOfferPrice] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    quantity: '',
    pricePerUnit: '',
    description: '',
    quality: 'grade_a_premium',
    availabilityStatus: 'in_stock'
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const res = await api.getCropListingById(id);
    if (res.data) {
      setProduct(res.data);
      setIsSaved(api.isProductSaved(res.data.id));
      setInquiryQuantity(String(Math.min(res.data.quantity, 10)));
      setInquiryOfferPrice(String(res.data.pricePerUnit));
      setInquiryMessage(`Hello ${res.data.farmerName}, we would like to procure ${res.data.title}. Please confirm delivery/pickup schedule.`);
      setEditFormData({
        title: res.data.title,
        quantity: res.data.quantity,
        pricePerUnit: res.data.pricePerUnit,
        description: res.data.description || '',
        quality: res.data.quality || 'grade_a_premium',
        availabilityStatus: res.data.availabilityStatus || 'in_stock'
      });
    }
    setLoading(false);
  };

  const handleToggleSave = async () => {
    if (!product) return;
    const res = await api.toggleSaveProduct(product.id);
    if (res.data !== undefined) setIsSaved(res.data);
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryQuantity || !inquiryOfferPrice) return;

    setSubmittingInquiry(true);
    const buyerUser = user?.role === 'buyer' ? user : {
      id: user?.id || 'usr-buyer-001',
      fullName: user?.fullName || 'Commercial Agro-Buyer',
      role: 'buyer',
      companyName: user?.companyName || 'Himalayan Wholesale Distributors',
      phone: user?.phone || '+977-9851098765'
    };

    const res = await api.createInquiry({
      listingId: product.id,
      listingTitle: product.title,
      farmerId: product.farmerId,
      requestedQuantity: Number(inquiryQuantity),
      unit: product.unit,
      offeredPrice: Number(inquiryOfferPrice),
      proposedDeliveryDate: deliveryDate || null,
      message: inquiryMessage
    }, buyerUser);

    setSubmittingInquiry(false);
    if (!res.error) setInquirySuccess(true);
  };

  const handleToggleStatus = async () => {
    await api.toggleListingStatus(product.id);
    loadProduct();
  };

  const handleDeleteListing = async () => {
    if (window.confirm('Are you sure you want to remove this crop listing from the marketplace?')) {
      await api.deleteCropListing(product.id);
      navigate('/marketplace');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await api.updateCropListing(product.id, {
      title: editFormData.title,
      quantity: Number(editFormData.quantity),
      pricePerUnit: Number(editFormData.pricePerUnit),
      description: editFormData.description,
      quality: editFormData.quality,
      availabilityStatus: editFormData.availabilityStatus
    });
    setShowEditModal(false);
    loadProduct();
  };

  const isOwner = user && (user.id === product?.farmerId || user.role === 'admin');

  const getQualityBadge = (q) => {
    switch (q) {
      case 'grade_a_premium':
        return { label: 'Grade-A Premium', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'grade_b_standard':
        return { label: 'Grade-B Standard', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'organic_certified':
        return { label: 'Organic Certified', color: 'bg-green-100 text-green-950 border-green-300' };
      default:
        return { label: 'Quality Standard', color: 'bg-gray-100 text-gray-800 border-gray-300' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Crop Marketplace</span>
        </Link>

        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-semibold">Loading harvest details...</p>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 cols: Image Gallery and Crop Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
                <div className="relative h-72 sm:h-96 bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wide bg-black/75 backdrop-blur-xs text-white px-3 py-1 rounded-lg">
                      {product.category}
                    </span>
                    {product.isOrganic && (
                      <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        <Sprout className="w-3.5 h-3.5" /> Organic Certified
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleToggleSave}
                    className={`absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md shadow-sm transition ${
                      isSaved
                        ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-400'
                        : 'bg-white/90 text-gray-600 hover:text-rose-600'
                    }`}
                    title={isSaved ? 'Saved to Favorites' : 'Save to Favorites'}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${getQualityBadge(product.quality).color}`}>
                        {getQualityBadge(product.quality).label}
                      </span>
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-md ${
                        product.status === 'active' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {product.status === 'active' ? 'Available in Market' : 'Paused Listing'}
                      </span>
                    </div>

                    <span className="text-xs text-gray-400">
                      Listed on {product.createdAt || 'Nov 2026'}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                    {product.title}
                  </h1>

                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Producer Asking Price</p>
                      <p className="text-3xl font-black text-[#14532D]">
                        Rs. {product.pricePerUnit} <span className="text-sm font-semibold text-gray-600">/ {product.unit} (NPR)</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Available Quantity</p>
                      <p className="text-xl font-black text-gray-900">{product.quantity} {product.unit}</p>
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Crop Variety</span>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">{product.variety || 'Local Standard'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Harvest Date</span>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">{product.harvestDate}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Availability Mode</span>
                      <p className="text-xs font-bold text-emerald-800 mt-0.5 capitalize">
                        {product.availabilityStatus === 'forward_harvest' ? 'Forward Harvest' : 'In Stock & Ready'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-2 space-y-2">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Farm Origin & Cultivation Notes</h3>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                      {product.description || 'Quality harvest produced in accordance with good agricultural practices.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Owner actions if farmer owns this product */}
              {isOwner && (
                <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Producer Controls</h4>
                    <p className="text-[11px] text-gray-500">You are the author of this listing</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition"
                    >
                      Edit Listing
                    </button>
                    <button
                      onClick={handleToggleStatus}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                        product.status === 'active'
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                      }`}
                    >
                      {product.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{product.status === 'active' ? 'Pause' : 'Activate'}</span>
                    </button>
                    <button
                      onClick={handleDeleteListing}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 cols: Producer Profile & Purchase Inquiry Action */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Farmer Profile Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Producer Information</h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Ward Verified
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {product.farmerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{product.farmerName}</h4>
                    <p className="text-xs text-emerald-800 font-medium">Independent Grower</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{product.farmerDistrict}, Nepal</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1.5 border border-gray-100">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Farm Location:</span>
                    <strong className="text-gray-900">{product.farmerDistrict} District</strong>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Direct Handover:</span>
                    <strong className="text-emerald-800">Farm Gate / Roadhead</strong>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Contact Privacy:</span>
                    <span className="text-gray-500 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Shared upon confirmed inquiry
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full py-3.5 px-4 bg-[#14532D] hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Send Purchase Inquiry</span>
                </button>
              </div>

              {/* Trade Assurance Card */}
              <div className="bg-[#102a1c] text-white rounded-3xl p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  KisanConnect Trade Protection
                </h4>
                <div className="space-y-2 text-xs text-emerald-100/90">
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Direct negotiation with zero broker commission.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Quality verification based on physical samples before truck loading.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Binding digital agreements with scheduled pickup dates.</span>
                  </p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8">
            <h3 className="text-base font-bold text-gray-900">Crop Listing Not Found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">This crop offering may have expired or been removed by the farmer.</p>
            <Link to="/marketplace" className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold">
              Browse Available Produce
            </Link>
          </div>
        )}
      </main>

      {/* PURCHASE INQUIRY MODAL */}
      {showInquiryModal && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Submit Purchase Proposal</h3>
                  <p className="text-xs text-gray-500">Direct Farmer Procurement Agreement</p>
                </div>
              </div>
              <button
                onClick={() => setShowInquiryModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Purchase Inquiry Dispatched!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Your proposal for <strong className="text-gray-900">{inquiryQuantity} {product.unit}</strong> has been transmitted to <strong className="text-gray-900">{product.farmerName}</strong>.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setShowInquiryModal(false);
                      navigate('/dashboard/buyer');
                    }}
                    className="px-4 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    View in Buyer Portal
                  </button>
                  <button
                    onClick={() => setShowInquiryModal(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="mt-4 space-y-3.5">
                <div className="p-3 bg-gray-50 rounded-xl text-xs flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="font-bold text-gray-900">{product.title}</p>
                    <p className="text-gray-500">{product.farmerDistrict} • Max {product.quantity} {product.unit}</p>
                  </div>
                  <span className="font-bold text-emerald-800 text-sm">
                    Rs. {product.pricePerUnit}/{product.unit}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Required Quantity ({product.unit}) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={product.quantity}
                      value={inquiryQuantity}
                      onChange={(e) => setInquiryQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Offered Price (Rs. / {product.unit}) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={inquiryOfferPrice}
                      onChange={(e) => setInquiryOfferPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Target Delivery / Pickup Date
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Message / Negotiation Terms
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600"
                    placeholder="Specify freight dispatch arrangement or packaging requirements..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="px-5 py-2 bg-[#14532D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingInquiry ? 'Dispatching...' : 'Transmit Proposal'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL FOR PRODUCER */}
      {showEditModal && product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Edit Crop Listing</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Crop Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quantity ({product.unit}) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.quantity}
                    onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price per {product.unit} (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editFormData.pricePerUnit}
                    onChange={(e) => setEditFormData({ ...editFormData, pricePerUnit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Quality Grade</label>
                  <select
                    value={editFormData.quality}
                    onChange={(e) => setEditFormData({ ...editFormData, quality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                  >
                    <option value="grade_a_premium">Grade-A Premium</option>
                    <option value="grade_b_standard">Grade-B Standard</option>
                    <option value="organic_certified">Organic Certified</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Availability</label>
                  <select
                    value={editFormData.availabilityStatus}
                    onChange={(e) => setEditFormData({ ...editFormData, availabilityStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                  >
                    <option value="in_stock">In Stock & Ready</option>
                    <option value="forward_harvest">Forward Harvest</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                >
                  Save Changes
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
