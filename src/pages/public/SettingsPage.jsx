import {
  Bell,
  CheckCircle2,
  Database,
  Globe,
  Key,
  Lock,
  Moon,
  Save,
  Shield,
  Smartphone,
  Sun
} from 'lucide-react';
import { useState } from 'react';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function SettingsPage() {
  const { user, isSupabaseConfigured } = useAuth();

  const [notifications, setNotifications] = useState({
    smsMandiRates: true,
    inquiryAlerts: true,
    expertReplies: true,
    weeklyMarketSummary: false,
  });

  const [language, setLanguage] = useState('en');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Platform Settings</h1>
          <p className="text-xs text-gray-500">Configure alerts, preferences, and security options for your account.</p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Communication & Notification Preferences</h3>
                <p className="text-[11px] text-gray-500">Control SMS and digital alerts sent to your phone</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                <div>
                  <p className="text-xs font-bold text-gray-900">SMS Daily Mandi Rate Bulletin (07:00 AM)</p>
                  <p className="text-[11px] text-gray-500">Receive SMS with wholesale rates for your selected district.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.smsMandiRates}
                  onChange={(e) => setNotifications({ ...notifications, smsMandiRates: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                <div>
                  <p className="text-xs font-bold text-gray-900">Direct Purchase Inquiry Alerts</p>
                  <p className="text-[11px] text-gray-500">Instant SMS and in-app alert when a buyer submits a bid for your produce.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.inquiryAlerts}
                  onChange={(e) => setNotifications({ ...notifications, inquiryAlerts: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                <div>
                  <p className="text-xs font-bold text-gray-900">Agronomic Advisory Replies</p>
                  <p className="text-[11px] text-gray-500">Receive notification when a NARC expert answers your crop disease query.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.expertReplies}
                  onChange={(e) => setNotifications({ ...notifications, expertReplies: e.target.checked })}
                  className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-600"
                />
              </label>
            </div>
          </div>

          {/* Language & Regional Settings */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Language & Regional Preferences</h3>
                <p className="text-[11px] text-gray-500">Bilingual agricultural display settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between ${
                language === 'en' ? 'border-[#14532D] bg-emerald-50/50' : 'border-gray-200'
              }`}>
                <div>
                  <p className="text-xs font-bold text-gray-900">English Interface (Default)</p>
                  <p className="text-[11px] text-gray-500">Standard English terms with Nepali crop tags</p>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                  className="text-emerald-700 focus:ring-emerald-600"
                />
              </label>

              <label className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between ${
                language === 'np' ? 'border-[#14532D] bg-emerald-50/50' : 'border-gray-200'
              }`}>
                <div>
                  <p className="text-xs font-bold text-gray-900">Nepali Localization (नेपाली)</p>
                  <p className="text-[11px] text-gray-500">कृषक बजार तथा मन्डी मूल्य नेपालीमा</p>
                </div>
                <input
                  type="radio"
                  name="language"
                  value="np"
                  checked={language === 'np'}
                  onChange={() => setLanguage('np')}
                  className="text-emerald-700 focus:ring-emerald-600"
                />
              </label>
            </div>
          </div>

          {/* Database & Security Inspector */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Supabase & Database Architecture</h3>
                <p className="text-[11px] text-gray-500">Backend connectivity status</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Supabase Connection:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                  isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isSupabaseConfigured ? 'CONNECTED' : 'SANDBOX SIMULATION ACTIVE'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Database Engine:</span>
                <span className="font-mono text-gray-600">PostgreSQL with RLS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Migration File:</span>
                <span className="font-mono text-gray-600 text-[11px]">/supabase/migrations/20261102000000_kisanconnect_initial_schema.sql</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#14532D] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  );
}
