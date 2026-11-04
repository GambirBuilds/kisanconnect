import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck,
  HelpCircle,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  TrendingDown,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { api } from '../../services/api.js';

export default function LandingPage() {
  const { user, role } = useAuth();
  const [mandiPrices, setMandiPrices] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [activeTab, setActiveTab] = useState('farmers');

  useEffect(() => {
    async function loadData() {
      const pricesRes = await api.getMandiPrices();
      if (pricesRes.data) setMandiPrices(pricesRes.data.slice(0, 4));

      const listingsRes = await api.getCropListings({ status: 'active' });
      if (listingsRes.data) setFeaturedListings(listingsRes.data.slice(0, 3));
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Registered Farmers', value: '12,480+', change: '+14% this month' },
    { label: 'Commercial Buyers', value: '1,850+', change: 'Hotels, Mills & Exporters' },
    { label: 'Active Harvest Listings', value: '3,200+ Qt', change: 'Across 28 districts' },
    { label: 'Middlemen Markup Cut', value: '25-38%', change: 'Direct fair earnings' },
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: 'Direct Marketplace',
      desc: 'Sell directly to verified millers, supermarket chains, and wholesale traders without exploitative middlemen.',
      badge: 'Zero Commissions'
    },
    {
      icon: TrendingUp,
      title: 'Official Mandi Price Index',
      desc: 'Live daily wholesale rates from Kalimati, Birtamod, Pokhara and Bharatpur with transparent date & source stamps.',
      badge: 'Daily 07:00 AM'
    },
    {
      icon: BookOpen,
      title: 'NARC Agro-Advisory',
      desc: 'Connect with certified agronomists for diagnosis of pest infestations, soil acidity, and climate-resilient seed selection.',
      badge: 'Free for Farmers'
    },
    {
      icon: FileCheck,
      title: 'Digital Purchase Agreements',
      desc: 'Transparent purchase inquiries with fixed advance terms, scheduled harvest dispatch dates, and quality grading.',
      badge: 'Protected Trade'
    },
    {
      icon: Truck,
      title: 'Farm-Gate Logistics',
      desc: 'Aggregated local pickup points in Kavre, Dhading, Chitwan, and Morang to lower per-quintal transportation costs.',
      badge: 'Cold Chain Ready'
    },
    {
      icon: ShieldCheck,
      title: 'Verified Farmer Identities',
      desc: 'Ward-level agricultural validation and Kisan Card registry integration to guarantee produce origin and traceability.',
      badge: '100% Authentic'
    }
  ];

  const testimonials = [
    {
      name: 'Ramesh Bahadur Thapa',
      district: 'Panauti, Kavrepalanchok',
      role: 'Organic Vegetable Cultivator',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      quote: 'Before KisanConnect, local middlemen paid me only 18 NPR/Kg for snow-white cauliflower while retailing it in Kalimati for 45 NPR. Through this platform, I sold 45 quintals directly to Kathmandu wholesalers at 35 NPR/Kg.'
    },
    {
      name: 'Sita Shrestha',
      district: 'Kalimati, Kathmandu',
      role: 'Agro-Procurement Director, Himalayan Fresh',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      quote: 'Direct sourcing allows our distribution business to verify organic origin and harvest dates. Farmers receive payment on time, and our customers receive vegetables picked less than 12 hours ago.'
    },
    {
      name: 'Tenzing Gurung',
      district: 'Marpha, Mustang',
      role: 'High-Altitude Apple Orchardist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      quote: 'Transporting apples across the Beni-Jomsom corridor was always a gamble. With pre-negotiated buyer inquiries on KisanConnect, my entire 80-box harvest was sold before harvest was even finished.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#e8f1eb] via-[#f2f7f3] to-[#F8FAF8] pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Empowering Nepal's Agricultural Economy
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-[1.12]">
                Connecting Farmers to <span className="text-[#14532D] underline decoration-emerald-500/40 decoration-wavy">Better Opportunities</span>.
              </h1>

              <p className="text-base sm:text-lg text-gray-700 max-w-2xl leading-relaxed">
                KisanConnect is Nepal's integrated agritech network. We eliminate unfair middlemen by directly connecting farmers with commercial buyers, publishing live wholesale mandi prices, and delivering agronomic advisory directly to rural producers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to={user ? `/dashboard/${role}` : '/register'}
                  className="w-full sm:w-auto px-7 py-3.5 bg-[#14532D] hover:bg-emerald-800 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-900/15 flex items-center justify-center gap-2 group"
                >
                  <span>{user ? 'Open Your Dashboard' : 'Get Started Free'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-xl font-bold text-sm transition shadow-xs flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>Explore Marketplace</span>
                </Link>

                <Link
                  to="/mandi-prices"
                  className="w-full sm:w-auto px-5 py-3.5 text-emerald-800 hover:text-emerald-900 hover:bg-emerald-50/60 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Mandi Rates</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Land & Produce</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kalimati Official Rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>NARC Agronomist Network</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-600 to-green-300 rounded-3xl blur-lg opacity-30 transform -rotate-1" />
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200/80 p-5 space-y-4">
                  
                  {/* Top card banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Today's Mandi Wholesale Rate</h4>
                        <p className="text-[10px] text-gray-500">Kalimati Wholesale Board • 07:00 AM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      LIVE
                    </span>
                  </div>

                  {/* Sample Mandi Ticker rows */}
                  <div className="space-y-2">
                    {mandiPrices.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 bg-gray-50 hover:bg-emerald-50/50 rounded-xl transition border border-gray-100 text-xs"
                      >
                        <div>
                          <p className="font-bold text-gray-900">{item.commodity}</p>
                          <p className="text-[10px] text-gray-500">{item.market} ({item.unit})</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-[#14532D]">NPR {item.avgPrice}/{item.unit}</p>
                          <span className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                            item.trend === 'up' ? 'text-red-600' : item.trend === 'down' ? 'text-emerald-600' : 'text-gray-500'
                          }`}>
                            {item.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : item.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                            {item.trend === 'up' ? '+5% vs yesterday' : item.trend === 'down' ? '-4% vs yesterday' : 'Steady'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card bottom highlight */}
                  <div className="p-3 bg-emerald-950 text-white rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-200">Direct Farmer Inquiries</p>
                      <p className="text-[11px] text-emerald-300/80">30 Quintals Snowball Cauliflower requested</p>
                    </div>
                    <Link
                      to="/marketplace"
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition shrink-0"
                    >
                      View Trade
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORM STATISTICS */}
      <section className="bg-white border-y border-gray-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/70 text-center">
                <p className="text-3xl sm:text-4xl font-black text-[#14532D] tracking-tight">{stat.value}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-[#F8FAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
              Simple 3-Step Workflows
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
              How KisanConnect Works
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Whether you are an independent farmer in the hills or a wholesale distributor in Kathmandu, transactions are direct and clear.
            </p>

            {/* Role switch toggle for How it Works */}
            <div className="inline-flex p-1 bg-gray-200/70 rounded-xl mt-6">
              <button
                onClick={() => setActiveTab('farmers')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === 'farmers'
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                For Nepali Farmers
              </button>
              <button
                onClick={() => setActiveTab('buyers')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === 'buyers'
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                For Commercial Buyers
              </button>
            </div>
          </div>

          {activeTab === 'farmers' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-base mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">List Your Produce</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Post details of your upcoming harvest, crop variety, quantity in Quintals or Kg, expected date, and your target price.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Takes under 2 minutes
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-base mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Receive Direct Inquiries</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Verified buyers contact you with purchase bids. Compare buyer ratings, negotiate prices, and lock in agreements.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SMS & App notifications
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-base mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Dispatch & Fair Payout</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Hand over produce at your farm gate or designated local collection hub with full digital documentation and prompt bank/eSewa settlement.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Guaranteed transparent pricing
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-base mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Search Verified Harvests</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Filter produce by agricultural category, province, district, organic certification, and volume availability.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct farm-gate traceability
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-base mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Purchase Inquiries</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Send firm purchase bids specifying your required quantity, target collection date, and offered price per unit.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Direct chat with producers
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs relative">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-base mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Streamlined Logistics</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Coordinate pickup trucks from primary roadheads or local agricultural collection yards with verified bills of lading.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Reduced post-harvest spoilage
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 bg-white border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
              Modern Agritech Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
              Engineered for Real Agricultural Impact
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Every feature solves an acute structural bottleneck in Nepal's agricultural supply chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F8FAF8] border border-gray-200/80 hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-[#14532D] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FARMER SUCCESS STORIES */}
      <section className="py-20 bg-[#F4F7F4] border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200">
              Real Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3">
              Voices from Nepal's Farm Gate
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Authentic stories from growers and distributors transforming agricultural trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={test.image}
                      alt={test.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{test.name}</h4>
                      <p className="text-[11px] text-gray-500">{test.district}</p>
                      <p className="text-[10px] font-semibold text-emerald-700">{test.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>Verified Producer Profile</span>
                  <span className="text-emerald-700 font-bold">100% Direct Payout</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-br from-[#14532D] via-[#166534] to-[#0f3d1e] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Join 12,000+ Agricultural Champions in Nepal</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Transform Your Agricultural Harvest?
          </h2>

          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Register your farm or procurement enterprise today. Zero listing fees, real market price discovery, and direct contract negotiations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#14532D] hover:bg-emerald-50 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-600 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Field Support</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
