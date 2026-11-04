import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CloudSun,
  Droplets,
  Edit,
  Eye,
  Filter,
  HelpCircle,
  Layers,
  Lock,
  MapPin,
  MessageSquare,
  Package,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  Wind,
  Wrench,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal.jsx';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { api } from '../../services/api.js';
import { weatherService } from '../../services/weatherService.js';
import {
  AGRICULTURAL_CATEGORIES,
  NEPAL_DISTRICTS
} from '../../utils/nepalData.js';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'crops', 'inquiries', 'calendar', 'weather', 'reminders', 'questions'

  const [myListings, setMyListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [cropRecords, setCropRecords] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // New crop harvest listing modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [submittingCrop, setSubmittingCrop] = useState(false);
  const [newCrop, setNewCrop] = useState({
    title: '',
    category: 'Fresh Vegetables',
    variety: '',
    quality: 'grade_a_premium',
    quantity: '',
    unit: 'Quintal',
    pricePerUnit: '',
    currency: 'NPR/Kg',
    harvestDate: new Date().toISOString().split('T')[0],
    availabilityStatus: 'in_stock',
    isOrganic: true,
    description: ''
  });

  // Crop Record Modal
  const [showCropRecordModal, setShowCropRecordModal] = useState(false);
  const [newCropRecord, setNewCropRecord] = useState({
    cropName: '',
    category: 'Vegetable Farming',
    variety: '',
    fieldName: 'Terrace Plot 1 - North Slope',
    landArea: '4 Ropani',
    plantationDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    growthStage: 'sowing_germination',
    expectedProductionQuantity: '50',
    productionUnit: 'Quintal',
    healthStatus: 'healthy',
    notes: ''
  });

  // Field Activity Modal
  const [activityTargetCrop, setActivityTargetCrop] = useState(null);
  const [newActivity, setNewActivity] = useState({
    type: 'fertilizer',
    date: new Date().toISOString().split('T')[0],
    details: '',
    cost: '500'
  });

  // Inquiry message thread modal
  const [selectedInquiryThread, setSelectedInquiryThread] = useState(null);
  const [threadReplyMessage, setThreadReplyMessage] = useState('');

  // Ask expert modal
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ crop: '', title: '', description: '' });

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    isDanger: false,
    action: null
  });

  // Reminders state
  const [reminders, setReminders] = useState([
    { id: 'rem-101', text: 'Apply 2nd top-dressing Urea for Cauliflower plot', date: '2026-11-05', done: false, priority: 'high' },
    { id: 'rem-102', text: 'Irrigate Spring Maize before Friday hot winds', date: '2026-11-07', done: false, priority: 'medium' },
    { id: 'rem-103', text: 'Check yellow sticky traps in tomato polyhouse', date: '2026-11-04', done: true, priority: 'low' },
  ]);
  const [newReminderText, setNewReminderText] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [listingsRes, inquiriesRes, cropsRes, questionsRes, mandiRes, weatherRes] = await Promise.all([
      api.getCropListings({ farmerId: user?.id }),
      api.getInquiries('farmer', user?.id),
      api.getCropRecords(user?.id),
      api.getQuestions(user?.id),
      api.getMandiPrices(),
      weatherService.getForecastForDistrict(user?.district || 'Kathmandu')
    ]);

    if (listingsRes.data) setMyListings(listingsRes.data);
    if (inquiriesRes.data) setInquiries(inquiriesRes.data);
    if (cropsRes.data) setCropRecords(cropsRes.data);
    if (questionsRes.data) setQuestions(questionsRes.data);
    if (mandiRes.data) setMandiPrices(mandiRes.data.slice(0, 3));
    if (weatherRes.data) setWeatherData(weatherRes.data);

    setLoading(false);
  };

  const handleCreateCropListing = async (e) => {
    e.preventDefault();
    if (!newCrop.title || !newCrop.quantity || !newCrop.pricePerUnit) return;

    setSubmittingCrop(true);
    const res = await api.createCropListing(newCrop, user);
    setSubmittingCrop(false);

    if (!res.error) {
      setShowAddModal(false);
      setNewCrop({
        title: '',
        category: 'Fresh Vegetables',
        variety: '',
        quality: 'grade_a_premium',
        quantity: '',
        unit: 'Quintal',
        pricePerUnit: '',
        currency: 'NPR/Kg',
        harvestDate: new Date().toISOString().split('T')[0],
        availabilityStatus: 'in_stock',
        isOrganic: true,
        description: ''
      });
      toast.success('Crop harvest listed on marketplace!');
      loadData();
    }
  };

  const handleCreateCropRecord = async (e) => {
    e.preventDefault();
    if (!newCropRecord.cropName || !newCropRecord.plantationDate) return;

    await api.createCropRecord(newCropRecord, user);
    setShowCropRecordModal(false);
    setNewCropRecord({
      cropName: '',
      category: 'Vegetable Farming',
      variety: '',
      fieldName: 'Terrace Plot 1 - North Slope',
      landArea: '4 Ropani',
      plantationDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      growthStage: 'sowing_germination',
      expectedProductionQuantity: '50',
      productionUnit: 'Quintal',
      healthStatus: 'healthy',
      notes: ''
    });
    toast.success('Field plot added to farm tracker!');
    loadData();
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!activityTargetCrop || !newActivity.details) return;

    await api.addCropActivity(activityTargetCrop.id, newActivity);
    setActivityTargetCrop(null);
    setNewActivity({
      type: 'fertilizer',
      date: new Date().toISOString().split('T')[0],
      details: '',
      cost: '500'
    });
    toast.success('Farm field operation logged.');
    loadData();
  };

  const handleUpdateGrowthStage = async (cropId, stage) => {
    await api.updateCropRecord(cropId, { growthStage: stage });
    toast.success('Growth stage updated.');
    loadData();
  };

  const handleSendThreadReply = async (e) => {
    e.preventDefault();
    if (!selectedInquiryThread || !threadReplyMessage.trim()) return;

    await api.sendInquiryMessage(selectedInquiryThread.id, threadReplyMessage, user);
    setThreadReplyMessage('');
    const updated = await api.getInquiryById(selectedInquiryThread.id);
    if (updated.data) setSelectedInquiryThread(updated.data);
    toast.success('Message sent to buyer.');
    loadData();
  };

  const handleUpdateInquiryStatus = async (inquiryId, status) => {
    await api.updateInquiryStatus(
      inquiryId,
      status,
      status === 'accepted' ? 'Confirmed. Please arrange truck pickup.' : 'Declined.'
    );
    toast.success(`Inquiry marked as ${status}.`);
    loadData();
    if (selectedInquiryThread && selectedInquiryThread.id === inquiryId) {
      setSelectedInquiryThread({ ...selectedInquiryThread, status });
    }
  };

  const handleToggleListing = async (listingId) => {
    await api.toggleListingStatus(listingId);
    toast.info('Listing status toggled.');
    loadData();
  };

  const handleRenewListing = async (listingId) => {
    await api.renewListing(listingId);
    toast.success('Listing extended for 30 days!');
    loadData();
  };

  const handleDeleteListing = (listingId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Crop Listing',
      message: 'Are you sure you want to permanently delete this listing from the marketplace?',
      confirmLabel: 'Delete Listing',
      isDanger: true,
      action: async () => {
        await api.deleteListing(listingId);
        toast.info('Crop listing deleted.');
        loadData();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.title || !newQuestion.crop) return;

    await api.askQuestion(newQuestion, user);
    setShowAskModal(false);
    setNewQuestion({ crop: '', title: '', description: '' });
    toast.success('Agricultural inquiry submitted to agronomists!');
    loadData();
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminderText.trim()) return;
    const r = {
      id: `rem-${Date.now()}`,
      text: newReminderText.trim(),
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      done: false,
      priority: 'medium'
    };
    setReminders([r, ...reminders]);
    setNewReminderText('');
    toast.success('Reminder added.');
  };

  const handleToggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  const activeCount = myListings.filter((l) => l.status === 'active').length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'pending').length;
  const acceptedInquiriesCount = inquiries.filter((i) => i.status === 'accepted').length;

  const growthStages = [
    { id: 'sowing_germination', label: '1. Sowing / Seedling' },
    { id: 'vegetative', label: '2. Vegetative Canopy' },
    { id: 'flowering', label: '3. Flowering Stage' },
    { id: 'fruiting_grain_filling', label: '4. Fruit / Grain Filling' },
    { id: 'harvest_ready', label: '5. Ready for Harvest' },
    { id: 'harvested', label: '6. Harvest Completed' }
  ];

  return (
    <DashboardLayout currentTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">

        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#14532D] via-[#166534] to-[#1e3a29] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-200 px-3 py-0.5 rounded-full border border-emerald-600">
                Farmer Operations Hub • कृषक कार्यशाला
              </span>
              <span className="text-xs text-emerald-300">• {user?.district}, {user?.province}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {user?.fullName || 'Farmer Friend'}!
            </h2>
            <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
              Manage terrace crop plots, monitor upcoming harvest countdowns, negotiate direct wholesale buyer offers, and track localized weather spray windows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>List Harvest</span>
            </button>
            <button
              onClick={() => setShowCropRecordModal(true)}
              className="px-4 py-2.5 bg-white text-emerald-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm hover:bg-emerald-50"
            >
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>Add Field Plot</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-2xl overflow-x-auto shadow-xs text-xs font-bold text-gray-600">
          {[
            { id: 'overview', label: 'Overview & Performance', icon: Layers },
            { id: 'calendar', label: 'Upcoming Harvest Calendar', icon: Calendar },
            { id: 'crops', label: `Field Crop Management (${cropRecords.length})`, icon: Sprout },
            { id: 'marketplace', label: `Produce Listings (${myListings.length})`, icon: Package },
            { id: 'inquiries', label: `Buyer Inquiries (${inquiries.length})`, icon: MessageSquare },
            { id: 'reminders', label: 'Field Reminders', icon: Bell },
            { id: 'questions', label: `Agronomy Advisory (${questions.length})`, icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition shrink-0 ${
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

        {/* 4 Performance Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Tracked Field Plots</span>
            <p className="text-2xl font-black text-gray-900">{cropRecords.length} Crops</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Active Growth Monitoring</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Marketplace Listings</span>
            <p className="text-2xl font-black text-gray-900">{myListings.length}</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">{activeCount} Live on Mandi</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Direct Buyer Proposals</span>
            <p className="text-2xl font-black text-blue-900">{inquiries.length}</p>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">
              {pendingInquiriesCount} Pending • {acceptedInquiriesCount} Accepted
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <span className="text-[11px] font-bold text-gray-500 block mb-1">Farm Land Registry</span>
            <p className="text-2xl font-black text-[#14532D]">12 Ropani</p>
            <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Ward Verified • Organic</p>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & PERFORMANCE */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Weather & Spray Window Alert Banner */}
            {weatherData && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-emerald-700" />
                    <h3 className="text-sm font-bold text-gray-900">
                      Local Agri-Weather: {weatherData.district} ({weatherData.conditionText})
                    </h3>
                  </div>
                  <Link
                    to="/weather"
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                  >
                    <span>Full 7-Day Weather Radar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Temperature</span>
                    <span className="text-lg font-black text-gray-900">{weatherData.temperature}°C</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Rain Probability</span>
                    <span className="text-lg font-black text-blue-900">{weatherData.rainProb}%</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-500 block text-[11px]">Wind Velocity</span>
                    <span className="text-lg font-black text-gray-900">{weatherData.windSpeed} km/h</span>
                  </div>
                  <div className={`p-3 rounded-xl border ${
                    weatherData.advisories?.spray?.favorable
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <span className="block text-[11px] font-bold">Spray Index:</span>
                    <span className="text-xs font-black">
                      {weatherData.advisories?.spray?.favorable ? '✓ Spray Window Open' : '⚠️ Delay Spraying'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Field Crops Summary & Upcoming Harvests */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Active Field Crops (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Active Field Crops & Yield Forecast</h3>
                    <p className="text-xs text-gray-500">Tracked plots with growth progress and estimated production</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('crops')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    View All ({cropRecords.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {cropRecords.slice(0, 3).map((crop) => (
                    <div key={crop.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 text-sm">{crop.cropName}</span>
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {crop.growthStage.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-600">
                        <div>Plot: <strong>{crop.fieldName}</strong></div>
                        <div>Area: <strong>{crop.landArea}</strong></div>
                        <div>Est. Yield: <strong className="text-emerald-900">{crop.expectedProductionQuantity} {crop.productionUnit}</strong></div>
                      </div>
                      <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">Expected Harvest: <strong>{crop.expectedHarvestDate}</strong></span>
                        <button
                          onClick={() => setActivityTargetCrop(crop)}
                          className="text-emerald-800 font-bold hover:underline flex items-center gap-1"
                        >
                          <Wrench className="w-3 h-3" /> Log Activity
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Quick Reminders & Inquiries Status (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-emerald-700" />
                    <span>Important Reminders</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('reminders')}
                    className="text-xs font-bold text-emerald-800 hover:underline"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-2.5">
                  {reminders.map((rem) => (
                    <div
                      key={rem.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                        rem.done ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-white text-gray-900 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleToggleReminder(rem.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            rem.done ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-gray-300'
                          }`}
                        >
                          {rem.done && <Check className="w-3 h-3" />}
                        </button>
                        <span className={rem.done ? 'line-through' : 'font-semibold'}>{rem.text}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{rem.date}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <Link
                    to="/farming-assistant"
                    className="w-full py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold hover:bg-emerald-100 transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Smart Agricultural Assistant</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: UPCOMING HARVEST CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Upcoming Harvest Calendar & Dispatch Window</h3>
                <p className="text-xs text-gray-500">Maturity countdowns, expected yields, and wholesale preparation schedule</p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {cropRecords.length} Tracked Batches
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cropRecords.map((crop) => {
                const harvestTime = new Date(crop.expectedHarvestDate).getTime();
                const daysRemaining = Math.max(0, Math.ceil((harvestTime - Date.now()) / (24 * 60 * 60 * 1000)));

                return (
                  <div key={crop.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-900">{crop.cropName}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        daysRemaining <= 14 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {daysRemaining === 0 ? 'Harvest Ready' : `${daysRemaining} days left`}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Plot / Location:</span>
                        <strong>{crop.fieldName}</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Harvest Date:</span>
                        <strong className="text-emerald-900">{crop.expectedHarvestDate}</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Expected Volume:</span>
                        <strong>{crop.expectedProductionQuantity} {crop.productionUnit}</strong>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setNewCrop((prev) => ({
                            ...prev,
                            title: `${crop.cropName} (Fresh Farm Gate)`,
                            quantity: crop.expectedProductionQuantity,
                            harvestDate: crop.expectedHarvestDate
                          }));
                          setShowAddModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Pre-List on Mandi</span>
                      </button>
                      <span className="text-[10px] text-gray-400 capitalize">{crop.growthStage.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FIELD CROPS MANAGEMENT */}
        {activeTab === 'crops' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Terraced Field Crops Registry</h3>
                <p className="text-xs text-gray-500">Record growth stages, manage planting dates, and log farm activities</p>
              </div>
              <button
                onClick={() => setShowCropRecordModal(true)}
                className="px-3.5 py-2 bg-[#14532D] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Track New Plot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cropRecords.map((crop) => (
                <div key={crop.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {crop.category}
                      </span>
                      <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                        {crop.landArea}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-gray-900">{crop.cropName}</h4>
                    <p className="text-xs text-gray-500">Plot: <strong>{crop.fieldName}</strong></p>

                    <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Planted:</span>
                        <strong>{crop.plantationDate}</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Harvest Window:</span>
                        <strong className="text-emerald-800">{crop.expectedHarvestDate}</strong>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Est. Yield:</span>
                        <strong>{crop.expectedProductionQuantity} {crop.productionUnit}</strong>
                      </div>
                    </div>

                    {/* Growth stage selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Current Growth Stage:
                      </label>
                      <select
                        value={crop.growthStage}
                        onChange={(e) => handleUpdateGrowthStage(crop.id, e.target.value)}
                        className="w-full text-xs font-semibold py-1.5 px-2 rounded-lg border border-gray-300 bg-white"
                      >
                        {growthStages.map((st) => (
                          <option key={st.id} value={st.id}>{st.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Activities List */}
                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Recent Field Operations:</p>
                      {(crop.activities || []).slice(0, 2).map((act) => (
                        <div key={act.id} className="text-[11px] text-gray-600 flex items-start gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{act.date}: {act.details}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => setActivityTargetCrop(crop)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Log Activity
                    </button>
                    <span className="text-[10px] text-gray-400 capitalize">{crop.healthStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MY MARKETPLACE PRODUCE LISTINGS */}
        {activeTab === 'marketplace' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Marketplace Produce Offerings</h3>
                <p className="text-xs text-gray-500">Live crops visible to commercial wholesale buyers</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Produce Listing
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {myListings.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-0.5">
                        Quantity: <strong className="text-gray-900">{item.quantity} {item.unit}</strong> • Asking:{' '}
                        <strong className="text-emerald-800 font-bold">Rs. {item.pricePerUnit} / {item.unit}</strong>
                      </p>
                      <p className="text-gray-400 text-[11px]">Harvest: {item.harvestDate} • {item.farmerDistrict}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      to={`/marketplace/${item.id}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <button
                      onClick={() => handleRenewListing(item.id)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-100 transition"
                      title="Renew listing for 30 days"
                    >
                      Renew
                    </button>
                    <button
                      onClick={() => handleToggleListing(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                        item.status === 'active'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {item.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BUYER INQUIRIES & NEGOTIATION */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Direct Buyer Inquiries & Trade Proposals</h3>
                <p className="text-xs text-gray-500">Commercial trade proposals sent for your produce</p>
              </div>
              <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
                {inquiries.length} Inquiries
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {inquiries.map((inq) => (
                <div key={inq.id} className="py-4 space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{inq.listingTitle}</h4>
                      <p className="text-gray-500">
                        Buyer: <strong className="text-gray-800">{inq.buyerName}</strong> ({inq.buyerCompany})
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
                      Offer: <strong className="text-gray-900">{inq.requestedQuantity} {inq.unit}</strong> at{' '}
                      <strong className="text-emerald-800 font-bold">Rs. {inq.offeredPrice} / {inq.unit}</strong>
                    </p>
                    <p className="text-gray-600 italic">"{inq.message}"</p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/60">
                      <button
                        onClick={() => setSelectedInquiryThread(inq)}
                        className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>View Discussion Thread ({(inq.messages || []).length} messages)</span>
                      </button>

                      {inq.status === 'accepted' ? (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Buyer Phone: <strong>{inq.buyerPhone}</strong>
                        </span>
                      ) : inq.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'accepted')}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 transition"
                          >
                            Accept Offer
                          </button>
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, 'rejected')}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                          >
                            Decline
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FIELD REMINDERS */}
        {activeTab === 'reminders' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-700" />
                  <span>Custom Farming Reminders</span>
                </h3>
                <p className="text-xs text-gray-500">Configure notifications for fertilizer top-dressing, irrigation, and harvest</p>
              </div>
            </div>

            <form onSubmit={handleAddReminder} className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="e.g. Irrigate Potato Plot 2 before Saturday sun..."
                value={newReminderText}
                onChange={(e) => setNewReminderText(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800 transition"
              >
                Add Reminder
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    rem.done ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-white text-gray-900 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                        rem.done ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-gray-300'
                      }`}
                    >
                      {rem.done && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <span className={rem.done ? 'line-through' : 'font-semibold'}>{rem.text}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{rem.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: AGRONOMY ADVISORY (ASK EXPERTS) */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Ask Certified Agronomists</h3>
                <p className="text-xs text-gray-500">Submit pest, soil, and crop health questions directly to NARC experts</p>
              </div>
              <button
                onClick={() => setShowAskModal(true)}
                className="px-3.5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Ask Expert
              </button>
            </div>

            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{q.title}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      q.status === 'answered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{q.description}</p>
                  {q.answer && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 mt-2">
                      <p className="font-bold text-[11px]">Agronomist Answer ({q.answeredBy}):</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* TRACK NEW CROP RECORD MODAL */}
      {showCropRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Add Field Plot to Farm Tracker</h3>
              <button onClick={() => setShowCropRecordModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCropRecord} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Crop Name & Variety *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Srijana Tomato Hybrid"
                  value={newCropRecord.cropName}
                  onChange={(e) => setNewCropRecord({ ...newCropRecord, cropName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Field / Plot Name</label>
                  <input
                    type="text"
                    required
                    value={newCropRecord.fieldName}
                    onChange={(e) => setNewCropRecord({ ...newCropRecord, fieldName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Plot Area</label>
                  <input
                    type="text"
                    value={newCropRecord.landArea}
                    onChange={(e) => setNewCropRecord({ ...newCropRecord, landArea: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Planting Date *</label>
                  <input
                    type="date"
                    required
                    value={newCropRecord.plantationDate}
                    onChange={(e) => setNewCropRecord({ ...newCropRecord, plantationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    value={newCropRecord.expectedHarvestDate}
                    onChange={(e) => setNewCropRecord({ ...newCropRecord, expectedHarvestDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Estimated Yield</label>
                  <input
                    type="number"
                    value={newCropRecord.expectedProductionQuantity}
                    onChange={(e) => setNewCropRecord({ ...newCropRecord, expectedProductionQuantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit</label>
                  <select
                    value={newCropRecord.productionUnit}
                    onChange={(e) => setNewCropRecord({ ...newCropRecord, productionUnit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="Quintal">Quintal</option>
                    <option value="Kg">Kg</option>
                    <option value="Crate">Crate</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCropRecordModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  Save to Crop Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG ACTIVITY MODAL */}
      {activityTargetCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-1">Log Field Activity</h3>
            <p className="text-xs text-gray-500 mb-3">
              For: <strong>{activityTargetCrop.cropName}</strong> ({activityTargetCrop.fieldName})
            </p>

            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Activity Type</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="fertilizer">Fertilizer / Compost</option>
                    <option value="pest_spray">Pest / Bio-Spray</option>
                    <option value="weeding">Weeding / Hoeing</option>
                    <option value="irrigation">Irrigation / Watering</option>
                    <option value="pruning">Pruning / Staking</option>
                    <option value="harvesting">Harvest Flush</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Activity Details *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Applied 5% Neem seed oil extract across all plots during early morning..."
                  value={newActivity.details}
                  onChange={(e) => setNewActivity({ ...newActivity, details: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActivityTargetCrop(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  Save Activity Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INQUIRY COMMUNICATION THREAD MODAL */}
      {selectedInquiryThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">{selectedInquiryThread.listingTitle}</h3>
                <p className="text-xs text-gray-500">
                  Buyer: {selectedInquiryThread.buyerName} ({selectedInquiryThread.buyerCompany})
                </p>
              </div>
              <button onClick={() => setSelectedInquiryThread(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
              {(selectedInquiryThread.messages || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                    msg.senderId === user?.id
                      ? 'bg-emerald-800 text-white ml-auto'
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
                placeholder="Type your response to the buyer..."
                value={threadReplyMessage}
                onChange={(e) => setThreadReplyMessage(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CROP LISTING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">List Harvest in Marketplace</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCropListing} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Crop Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Farm Cauliflower (Snowball Variety)"
                  value={newCrop.title}
                  onChange={(e) => setNewCrop({ ...newCrop, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCrop.category}
                    onChange={(e) => setNewCrop({ ...newCrop, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    {AGRICULTURAL_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quality Grade</label>
                  <select
                    value={newCrop.quality}
                    onChange={(e) => setNewCrop({ ...newCrop, quality: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="grade_a_premium">Grade-A Premium</option>
                    <option value="grade_b_standard">Grade-B Standard</option>
                    <option value="organic_certified">Organic Certified</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="45"
                    value={newCrop.quantity}
                    onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unit</label>
                  <select
                    value={newCrop.unit}
                    onChange={(e) => setNewCrop({ ...newCrop, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="Quintal">Quintal</option>
                    <option value="Kg">Kg</option>
                    <option value="Sack (50kg)">Sack (50kg)</option>
                    <option value="Box (20kg)">Box (20kg)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Asking Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="35"
                    value={newCrop.pricePerUnit}
                    onChange={(e) => setNewCrop({ ...newCrop, pricePerUnit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Harvest / Dispatch Date</label>
                  <input
                    type="date"
                    value={newCrop.harvestDate}
                    onChange={(e) => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Availability</label>
                  <select
                    value={newCrop.availabilityStatus}
                    onChange={(e) => setNewCrop({ ...newCrop, availabilityStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="in_stock">In Stock & Ready</option>
                    <option value="forward_harvest">Forward Harvest</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Cultivation Notes / Origin</label>
                <textarea
                  rows={2}
                  value={newCrop.description}
                  onChange={(e) => setNewCrop({ ...newCrop, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCrop}
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  {submittingCrop ? 'Publishing...' : 'Publish Produce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASK EXPERT MODAL */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Ask Agricultural Expert</h3>
              <button onClick={() => setShowAskModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Crop / Variety *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Srijana Tomato"
                  value={newQuestion.crop}
                  onChange={(e) => setNewQuestion({ ...newQuestion, crop: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Issue / Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yellow leaf spots with concentric black rings"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description & Field Symptoms *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe when the symptom started, soil moisture, previous fertilizer applied..."
                  value={newQuestion.description}
                  onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl font-bold hover:bg-emerald-800"
                >
                  Submit Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
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
