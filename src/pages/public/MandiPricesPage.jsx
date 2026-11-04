import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Filter,
  Info,
  LineChart as LineChartIcon,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
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
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
  COMMODITY_CATEGORIES,
  NEPAL_MANDI_HUBS,
  marketPriceService
} from '../../services/marketPriceService.js';

export default function MandiPricesPage() {
  const { user, role } = useAuth();
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [loading, setLoading] = useState(true);

  // Analytics view tab: 'distribution' or 'trends' or 'comparison'
  const [chartView, setChartView] = useState('distribution');
  const [selectedCommodityForHistory, setSelectedCommodityForHistory] = useState('Tomato Big (Nepali)');
  const [historyData, setHistoryData] = useState([]);
  const [marketCompData, setMarketCompData] = useState([]);

  // Admin record modal
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newPriceRecord, setNewPriceRecord] = useState({
    commodity: '',
    nepali: '',
    category: 'Vegetables',
    market: 'Kalimati Fruits and Vegetable Market',
    district: 'Kathmandu',
    minPrice: '',
    maxPrice: '',
    unit: 'Kg',
    trend: 'stable'
  });

  useEffect(() => {
    loadPrices();
  }, [selectedCategory, selectedMarket, search]);

  useEffect(() => {
    loadHistoricalData(selectedCommodityForHistory);
  }, [selectedCommodityForHistory]);

  const loadPrices = async () => {
    setLoading(true);
    const res = await marketPriceService.getMarketPrices({
      category: selectedCategory,
      market: selectedMarket,
      search
    });
    if (res.data) setPrices(res.data);
    setLoading(false);
  };

  const loadHistoricalData = async (commodity) => {
    const histRes = await marketPriceService.getHistoricalPriceTrends(commodity);
    if (histRes.data) setHistoryData(histRes.data);

    const compRes = await marketPriceService.getMarketComparison(commodity);
    if (compRes.data) setMarketCompData(compRes.data);
  };

  const handleAdminSubmitPrice = async (e) => {
    e.preventDefault();
    if (!newPriceRecord.commodity || !newPriceRecord.minPrice || !newPriceRecord.maxPrice) return;

    await marketPriceService.recordPrice(newPriceRecord, user);
    setShowAdminModal(false);
    setNewPriceRecord({
      commodity: '',
      nepali: '',
      category: 'Vegetables',
      market: 'Kalimati Fruits and Vegetable Market',
      district: 'Kathmandu',
      minPrice: '',
      maxPrice: '',
      unit: 'Kg',
      trend: 'stable'
    });
    loadPrices();
  };

  // Distribution chart data
  const distributionData = prices.slice(0, 6).map((p) => ({
    name: p.commodity.split(' ')[0],
    Min: p.minPrice,
    Avg: p.avgPrice,
    Max: p.maxPrice,
  }));

  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-[#14532D] to-emerald-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Daily Wholesale Rate Index • दैनिक कृषि बजार मूल्य
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Live Mandi Price Discovery
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Authentic wholesale rates from Kalimati and regional wholesale boards with date stamps, historical trends, and inter-market comparisons.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => setShowAdminModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Record New Mandi Price</span>
              </button>
            )}
            <div className="bg-emerald-900/80 border border-emerald-700/80 rounded-2xl p-3.5 text-xs space-y-1 text-emerald-200 shrink-0">
              <p className="font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Effective: 2026-11-02
              </p>
              <p className="text-[11px] text-emerald-300">Released 07:00 AM • Verified Board Data</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Suite (Charts & Comparisons) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <div className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">Mandi Price Intelligence Suite</h3>
              <p className="text-xs text-gray-500">Historical trends, inter-mandi price spreads, and daily distributions</p>
            </div>

            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setChartView('distribution')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartView === 'distribution' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-600'
                }`}
              >
                Price Distribution
              </button>
              <button
                onClick={() => setChartView('trends')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartView === 'trends' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-600'
                }`}
              >
                6-Day Historical Trend
              </button>
              <button
                onClick={() => setChartView('comparison')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartView === 'comparison' ? 'bg-white text-gray-900 shadow-2xs font-bold' : 'text-gray-600'
                }`}
              >
                Inter-Market Spread
              </button>
            </div>
          </div>

          {/* Commodity Selector for Trend & Comparison */}
          {(chartView === 'trends' || chartView === 'comparison') && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs pb-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide shrink-0">Select Commodity:</span>
              {['Tomato Big (Nepali)', 'Potato Red (Local)', 'Large Cardamom', 'Ginger (Fresh)', 'Mustang Apple', 'Chitwan Maize'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCommodityForHistory(c)}
                  className={`px-3 py-1 rounded-lg shrink-0 font-medium transition ${
                    selectedCommodityForHistory.includes(c.split(' ')[0])
                      ? 'bg-[#14532D] text-white shadow-2xs'
                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Chart Rendering */}
          <div className="h-72 w-full pt-2">
            {chartView === 'distribution' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Min" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Min (Rs.)" />
                  <Bar dataKey="Avg" fill="#166534" radius={[4, 4, 0, 0]} name="Average Rate (Rs.)" />
                  <Bar dataKey="Max" fill="#f87171" radius={[4, 4, 0, 0]} name="Max (Rs.)" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartView === 'trends' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="Kalimati" stroke="#166534" strokeWidth={3} dot={{ r: 4 }} name="Kalimati (KTM)" />
                  <Line type="monotone" dataKey="Pokhara" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="Pokhara (Kaski)" />
                  <Line type="monotone" dataKey="Birtamod" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} name="Birtamod (Jhapa)" />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartView === 'comparison' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 h-full items-center">
                {marketCompData.map((comp, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-1">
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{comp.market.split(' ')[0]}</p>
                    <p className="text-[10px] text-gray-500">{comp.district}</p>
                    <p className="text-xl font-black text-[#14532D]">Rs. {comp.avgPrice}</p>
                    <span className="text-[10px] text-gray-400 block">per {comp.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search commodity or district (e.g. Tomato, Cardamom, Ginger)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              {COMMODITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories (सबै)' : cat}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
            >
              <option value="All">All Agricultural Mandis</option>
              {NEPAL_MANDI_HUBS.map((hub) => (
                <option key={hub.id} value={hub.name}>{hub.name} ({hub.district})</option>
              ))}
            </select>
          </div>

          <button
            onClick={loadPrices}
            className="p-2.5 border border-gray-200 text-gray-600 hover:text-emerald-800 rounded-xl hover:bg-gray-50 transition shrink-0"
            title="Refresh prices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Main Prices Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Official Daily Wholesale Price Records</h3>
              <p className="text-[11px] text-gray-500">Live price discovery benchmarks</p>
            </div>
            <span className="text-xs font-semibold text-gray-500">
              Showing {prices.length} commodities
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Commodity (बाली)</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Market & Location</th>
                  <th className="py-3.5 px-4 text-right">Min Rate</th>
                  <th className="py-3.5 px-4 text-right">Avg Rate</th>
                  <th className="py-3.5 px-4 text-right">Max Rate</th>
                  <th className="py-3.5 px-4 text-center">Trend</th>
                  <th className="py-3.5 px-4">Source & Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prices.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{item.commodity}</p>
                      {item.nepali && <p className="text-[11px] text-gray-500">{item.nepali}</p>}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 font-medium text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-gray-800">{item.market}</p>
                      <p className="text-[10px] text-gray-500">{item.district}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-700 font-mono">
                      Rs. {item.minPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#14532D] font-mono text-sm">
                      Rs. {item.avgPrice}
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-700 font-mono">
                      Rs. {item.maxPrice}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.trend === 'up'
                          ? 'bg-red-50 text-red-600'
                          : item.trend === 'down'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                        <span className="capitalize">{item.trend}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-gray-500 max-w-[200px] truncate" title={`${item.source} (${item.date})`}>
                      {item.source}
                      <span className="block text-[10px] text-gray-400">{item.date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ADMIN PRICE ENTRY MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Record Mandi Price Bulletin</h3>
              <button onClick={() => setShowAdminModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminSubmitPrice} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Commodity Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato Big (Nepali)"
                  value={newPriceRecord.commodity}
                  onChange={(e) => setNewPriceRecord({ ...newPriceRecord, commodity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nepali Name (नेपाली नाम)</label>
                <input
                  type="text"
                  placeholder="e.g. गोलभेंडा ठूलो"
                  value={newPriceRecord.nepali}
                  onChange={(e) => setNewPriceRecord({ ...newPriceRecord, nepali: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newPriceRecord.category}
                    onChange={(e) => setNewPriceRecord({ ...newPriceRecord, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                  >
                    {COMMODITY_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Market Location</label>
                  <select
                    value={newPriceRecord.market}
                    onChange={(e) => {
                      const selected = NEPAL_MANDI_HUBS.find((m) => m.name === e.target.value);
                      setNewPriceRecord({
                        ...newPriceRecord,
                        market: e.target.value,
                        district: selected?.district || 'Kathmandu'
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                  >
                    {NEPAL_MANDI_HUBS.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Min Rate (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPriceRecord.minPrice}
                    onChange={(e) => setNewPriceRecord({ ...newPriceRecord, minPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max Rate (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newPriceRecord.maxPrice}
                    onChange={(e) => setNewPriceRecord({ ...newPriceRecord, maxPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Unit</label>
                  <select
                    value={newPriceRecord.unit}
                    onChange={(e) => setNewPriceRecord({ ...newPriceRecord, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Quintal">Quintal</option>
                    <option value="Crate">Crate</option>
                    <option value="Box">Box</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                >
                  Record Bulletin
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
