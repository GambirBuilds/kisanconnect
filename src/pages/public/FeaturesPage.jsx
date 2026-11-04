import {
  Activity,
  Award,
  BookOpen,
  Boxes,
  CheckCircle2,
  Database,
  FileCheck,
  Lock,
  MessageSquare,
  Package,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';

export default function FeaturesPage() {
  const featureModules = [
    {
      icon: Package,
      title: 'Farmer Harvest Marketplace',
      tag: 'Core Marketplace',
      description: 'Enables farmers in any district to list produce prior to harvest. Specify crop variety, quantity in Quintals, unit pricing in NPR, harvest dates, and organic cultivation methods.',
      benefits: [
        'Direct connection to millers and wholesalers',
        'Forward contracting reduces harvest dumping',
        'Transparent grading and photo verification',
        'District & municipality location tagging'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Mandi Price Index',
      tag: 'Price Discovery',
      description: 'Daily benchmark wholesale rates directly from Kalimati (Kathmandu) and regional agricultural markets with complete date and source transparency. Compare trends to price harvests accurately.',
      benefits: [
        'Min, Max, and Average daily rates',
        'Historical trend direction (up, steady, down)',
        'Zero speculation or fabricated figures',
        'Updated daily at 07:00 AM'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Inquiry Negotiation System',
      tag: 'B2B Trade',
      description: 'Structured procurement inquiries where buyers specify volume, counter-offer price, and delivery window. Farmers can accept, negotiate, or decline directly.',
      benefits: [
        'Clear terms before transport begins',
        'Status tracking (Pending, Accepted, In Transit)',
        'Direct phone and message contact details',
        'Audit trail of agreed terms'
      ]
    },
    {
      icon: BookOpen,
      title: 'NARC Agro-Advisory Knowledge Hub',
      tag: 'Scientific Advisory',
      description: 'Certified agronomists publish field guides on pest mitigation, climate adaptation, zero-energy cool chambers, and organic soil enhancement. Farmers can submit direct diagnostic queries.',
      benefits: [
        'Peer-reviewed cultural and biological pest controls',
        'Direct Q&A with plant pathologists',
        'Tailored recommendations for mid-hill and Terai agro-ecologies',
        'Reduces reliance on hazardous synthetic chemicals'
      ]
    },
    {
      icon: ShieldCheck,
      title: 'Multi-Role Access Control & Security',
      tag: 'Security & RLS',
      description: 'Strict Row Level Security (RLS) policies implemented at PostgreSQL database level. Farmer, Buyer, Expert, and Admin accounts have separate boundaries enforced cryptographically.',
      benefits: [
        'Supabase Auth session persistence',
        'Database-level authorization rules (RLS)',
        'Immutable activity logs for compliance',
        'Verified Farmer and Buyer badges'
      ]
    },
    {
      icon: Activity,
      title: 'Administrative Governance & Audit Logs',
      tag: 'Platform Governance',
      description: 'Real-time oversight dashboard for verifying farmer registrations, moderating crop listings, managing agricultural categories, and monitoring transactions across all 7 provinces.',
      benefits: [
        'Single-pane platform metrics and user health',
        'Listing approval and anti-fraud moderation',
        'Complete chronological audit log feed',
        'Instant Supabase migration status inspector'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-[#14532D] to-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
            Platform Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Features Built for Nepal’s Agricultural Realities
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every module of KisanConnect has been architected from real farmer interviews, mandi observations, and agronomic extension practices.
          </p>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureModules.map((module, idx) => {
            const Icon = module.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md border border-emerald-200">
                      {module.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{module.description}</p>

                  <div className="space-y-1.5 pt-3 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">Key Capabilities:</p>
                    {module.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Production Ready</span>
                  <Link to="/marketplace" className="hover:underline flex items-center gap-1">
                    Try Now &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-gray-200 text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Explore the Platform Today</h3>
          <p className="text-xs text-gray-600">Register an account or browse live produce listings across Nepal.</p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="px-6 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition">
              Get Started
            </Link>
            <Link to="/marketplace" className="px-6 py-2.5 border border-gray-300 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition">
              View Marketplace
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
