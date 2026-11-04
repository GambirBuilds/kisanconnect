import {
  Award,
  BookOpen,
  CheckCircle,
  Flag,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';

export default function AboutPage() {
  const leadership = [
    {
      name: 'Dr. Hari Krishna Shrestha',
      title: 'Chief Agricultural Strategist',
      affiliation: 'Former Lead Agronomist, NARC',
      bio: 'Over 28 years dedicated to cereal breeding, cold-hardy potato varieties, and high-altitude terrace irrigation across Karnali and Gandaki provinces.'
    },
    {
      name: 'Sunita Adhikari',
      title: 'Head of Agro-Supply Chain & Logistics',
      affiliation: 'Ex-Kalimati Market Infrastructure Board',
      bio: 'Specialist in post-harvest cold storage, crate circulation logistics, and minimizing transport losses along the Prithvi and BP Highways.'
    },
    {
      name: 'Pradeep Basnet',
      title: 'Director of Platform Engineering',
      affiliation: 'Rural AgTech Pioneer',
      bio: 'Architecting resilient mobile-first, low-bandwidth software that works reliably for farmers in remote rural terrain.'
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
            About KisanConnect • किसान कनेक्ट
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Building Nepal’s Digital Agricultural Spine
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We are on a mission to democratize market access, secure fair price realization for farmers, and ensure wholesome, traceable food distribution across Nepal.
          </p>
        </div>
      </section>

      {/* Mission & Problem Statement */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">The Challenge in Nepal</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Why Agriculture in Nepal Needed a Sovereign Digital Network
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Nepal’s agricultural sector employs over 65% of the national workforce, yet rural farmers persistently capture less than 30% of the final consumer rupee. Perishable vegetables and crops pass through 4 to 6 informal middlemen before reaching urban markets like Kalimati or Pokhara.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              In addition, sudden gluts lead to dumping of tomatoes and cabbage on highways, while urban consumers pay inflated prices. KisanConnect replaces this fractured system with direct transparency, forward contracts, and certified advisory.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-2xl font-black text-[#14532D]">35%</p>
                <p className="text-xs text-gray-600 font-medium">Avg. Farmer Revenue Uplift via Direct Trade</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-gray-200">
                <p className="text-2xl font-black text-[#14532D]">Under 8%</p>
                <p className="text-xs text-gray-600 font-medium">Post-Harvest Transit Spoilage Target</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-700" />
              Our Core Strategic Pillars
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Farmer Sovereignty & Price Certainty</h4>
                  <p className="text-xs text-gray-600">Producers set their asking price based on transparent mandi benchmarks rather than accepting distress distress sales at farm gate.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Democratized Agronomy</h4>
                  <p className="text-xs text-gray-600">Free, actionable advisory on pest cycles, organic bio-controls, and climate adaptation tailored to mid-hill and Terai soils.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Traceable Food Systems</h4>
                  <p className="text-xs text-gray-600">Every batch is verified to district and municipality, validating organic methods and building consumer trust.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Advisory Board */}
      <section className="py-16 bg-[#F4F7F4] border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Steering Committee</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Agronomic Advisory Board</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Guiding our algorithms, agronomy content, and field validation protocols.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base mb-4">
                    {leader.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{leader.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700">{leader.title}</p>
                  <p className="text-[11px] text-gray-500 mb-3">{leader.affiliation}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{leader.bio}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified Agricultural Scientist
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-gray-200 text-center">
        <div className="max-w-xl mx-auto px-4 space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Be Part of Nepal's Agri-Transformation</h3>
          <p className="text-xs text-gray-600">Register as a producer, buyer or certified expert.</p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="px-6 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition">
              Create Account
            </Link>
            <Link to="/contact" className="px-6 py-2.5 border border-gray-300 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
