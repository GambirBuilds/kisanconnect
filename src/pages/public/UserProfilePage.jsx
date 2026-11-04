import {
  AlertCircle,
  Building,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  ShieldCheck,
  Sprout,
  User
} from 'lucide-react';
import { useState } from 'react';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { NEPAL_DISTRICTS, NEPAL_PROVINCES } from '../../utils/nepalData.js';

export default function UserProfilePage() {
  const { user, role, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    province: user?.province || 'Bagmati Province',
    district: user?.district || 'Kathmandu',
    municipality: user?.municipality || '',
    bio: user?.bio || 'Dedicated to agricultural productivity and fair trade.',
    // role specific
    farmName: user?.farmName || '',
    farmSize: user?.farmSize || '10 Ropani',
    companyName: user?.companyName || '',
    specialization: user?.specialization || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-5">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=14532D&color=fff`}
            alt={user?.fullName}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/20"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-gray-900">{user?.fullName || 'Member Profile'}</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                {role}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Record
              </span>
            </div>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-600">
              Location: <strong>{user?.district}</strong>, {user?.province}
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">Personal & Agricultural Credentials</h3>
              <p className="text-xs text-gray-500">Update contact and official farm/business registry information</p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved Successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Province</label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs bg-white"
                >
                  {NEPAL_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Municipality & Ward</label>
                <input
                  type="text"
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>
            </div>

            {/* Role-Specific Editable Attributes */}
            {role === 'farmer' && (
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  Farm Specific Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Farm Name</label>
                    <input
                      type="text"
                      value={formData.farmName}
                      onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Land Size</label>
                    <input
                      type="text"
                      value={formData.farmSize}
                      onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'buyer' && (
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                  Agribusiness Company
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Company Legal Title</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                </div>
              </div>
            )}

            {role === 'expert' && (
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-3">
                <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide">
                  Agronomic Specialization
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Scientific Area</label>
                  <input
                    type="text"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bio / Profile Summary</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#14532D] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Updating Record...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
