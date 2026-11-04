import {
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#102a1c] text-emerald-100 border-t border-emerald-900/60">
      {/* Upper Footer: Stats & Mandi coverage banner */}
      <div className="border-b border-emerald-900/40 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-900/80 rounded-xl text-emerald-400">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">12,400+</p>
              <p className="text-xs text-emerald-300">Verified Nepali Farmers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-900/80 rounded-xl text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">7 Provinces</p>
              <p className="text-xs text-emerald-300">Active District Networks</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-900/80 rounded-xl text-emerald-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">Toll-Free 1660</p>
              <p className="text-xs text-emerald-300">Farmer Advisory Hotline</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-emerald-900/80 rounded-xl text-emerald-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-white">6 Major Mandis</p>
              <p className="text-xs text-emerald-300">Daily Price Discovery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Kisan<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              KisanConnect is a sovereign digital agricultural ecosystem built for Nepal. We bridge the gap between hard-working rural farmers, wholesale buyers, agronomists, and administrative bodies to eliminate unnecessary middlemen margins, provide verified mandi prices, and ensure sustainable food security.
            </p>
            <div className="space-y-2 text-xs text-emerald-200/90 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Babarmahal & Kalimati Mandi Complex, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+977-1-4433221 / Helpline: 1660-01-95000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@kisanconnect.np</span>
              </div>
            </div>
          </div>

          {/* Platform Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 border-l-2 border-emerald-400 pl-2">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/marketplace" className="hover:text-white transition">Browse Crops</Link></li>
              <li><Link to="/mandi-prices" className="hover:text-white transition">Live Mandi Prices</Link></li>
              <li><Link to="/farming-assistant" className="hover:text-white transition">Smart Agri Assistant</Link></li>
              <li><Link to="/weather" className="hover:text-white transition">Weather Intelligence</Link></li>
              <li><Link to="/knowledge-hub" className="hover:text-white transition">Knowledge Hub</Link></li>
              <li><Link to="/features" className="hover:text-white transition">Features & Modules</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About KisanConnect</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact & Support</Link></li>
            </ul>
          </div>

          {/* Role Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 border-l-2 border-emerald-400 pl-2">
              Role Portals
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li><Link to="/dashboard/farmer" className="hover:text-white transition">Farmer Dashboard</Link></li>
              <li><Link to="/dashboard/buyer" className="hover:text-white transition">Buyer Dashboard</Link></li>
              <li><Link to="/dashboard/expert" className="hover:text-white transition">Expert Advisory Portal</Link></li>
              <li><Link to="/dashboard/admin" className="hover:text-white transition">Admin Governance</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">User Profile</Link></li>
              <li><Link to="/settings" className="hover:text-white transition">Account Settings</Link></li>
            </ul>
          </div>

          {/* Regional Mandis & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 border-l-2 border-emerald-400 pl-2">
              Nepal Mandi Coverage
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-200/70">
              <li>• Kalimati Wholesale Board, KTM</li>
              <li>• Birtamod Krishi Mandi, Jhapa</li>
              <li>• Bharatpur Wholesale Center, Chitwan</li>
              <li>• Pokhara Krishi Upaj, Kaski</li>
              <li>• Nepalgunj Agri Hub, Banke</li>
              <li>• Birgunj Border Mandi, Parsa</li>
            </ul>

            <div className="mt-5 pt-3 border-t border-emerald-900/60">
              <p className="text-[11px] text-emerald-300 font-semibold mb-1">Architecture Standard:</p>
              <p className="text-[11px] text-emerald-200/60">
                Supabase Auth + PostgreSQL RLS policies with strict role authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/70 gap-3">
          <p>© 2026 KisanConnect (किसान कनेक्ट) — Smart Agriculture Network. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with dedication for Nepal's farmers and agricultural community
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
