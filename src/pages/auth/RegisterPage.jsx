import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Sprout,
  User,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { NEPAL_DISTRICTS, NEPAL_PROVINCES } from '../../utils/nepalData.js';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('farmer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    province: 'Bagmati Province',
    district: 'Kavrepalanchok',
    municipality: '',
    // Farmer fields
    farmName: '',
    farmSize: '',
    primaryCrop: '',
    // Buyer fields
    companyName: '',
    businessType: 'wholesaler',
    panNumber: '',
    // Expert fields
    designation: '',
    institution: '',
    specialization: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 8) errs.phone = 'Valid phone is required';
    if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (selectedRole === 'farmer' && !formData.farmName.trim()) {
      errs.farmName = 'Farm Name is required';
    }
    if (selectedRole === 'buyer' && !formData.companyName.trim()) {
      errs.companyName = 'Company / Enterprise name is required';
    }
    if (selectedRole === 'expert' && !formData.specialization.trim()) {
      errs.specialization = 'Agricultural specialization is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setLoading(true);

    const extraDetails = {
      ...(selectedRole === 'farmer' && {
        farm_name: formData.farmName,
        farm_size_ropani: Number(formData.farmSize) || 5,
        primary_crop: formData.primaryCrop || 'Vegetables',
      }),
      ...(selectedRole === 'buyer' && {
        company_name: formData.companyName,
        business_type: formData.businessType,
        pan_number: formData.panNumber,
      }),
      ...(selectedRole === 'expert' && {
        designation: formData.designation || 'Agricultural Scientist',
        institution_affiliation: formData.institution || 'NARC / Ministry of Agriculture',
        specialization: formData.specialization,
      }),
    };

    const res = await register({
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      fullName: formData.fullName,
      phone: formData.phone,
      district: formData.district,
      province: formData.province,
      extraDetails,
    });

    setLoading(false);

    if (res.success) {
      navigate(`/dashboard/${selectedRole}`);
    } else {
      setServerError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#166534] to-[#14532D] text-white flex items-center justify-center shadow-md">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="text-2xl font-black text-[#14532D] tracking-tight">
                Kisan<span className="text-emerald-700 font-normal">Connect</span>
              </span>
            </Link>
            <h2 className="text-2xl font-black text-gray-900">Create Your Account</h2>
            <p className="text-xs text-gray-500">
              Join Nepal’s premier agricultural ecosystem. Select your role to get started.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'farmer',
                title: 'Farmer / Producer',
                nepali: 'कृषक उत्पादक',
                icon: Sprout,
                desc: 'Sell crops directly, discover mandi prices, and consult agronomists.',
              },
              {
                id: 'buyer',
                title: 'Commercial Buyer',
                nepali: 'व्यापारी / खरिदकर्ता',
                icon: ShoppingBag,
                desc: 'Procure bulk produce directly from growers with verified forward terms.',
              },
              {
                id: 'expert',
                title: 'Agricultural Expert',
                nepali: 'कृषि विज्ञ / अनुसन्धानकर्ता',
                icon: BookOpen,
                desc: 'Publish peer-reviewed advisories and resolve farmer disease queries.',
              },
            ].map((roleCard) => {
              const Icon = roleCard.icon;
              const isSelected = selectedRole === roleCard.id;
              return (
                <button
                  key={roleCard.id}
                  type="button"
                  onClick={() => setSelectedRole(roleCard.id)}
                  className={`p-4 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#14532D] bg-emerald-50/70 shadow-sm ring-2 ring-emerald-600/30'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#14532D] text-white' : 'bg-gray-100 text-gray-700'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected ? 'bg-emerald-200 text-emerald-950 font-extrabold' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {roleCard.id}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-gray-900">{roleCard.title}</h3>
                    <p className="text-[10px] text-gray-400 font-medium">{roleCard.nepali}</p>
                    <p className="text-[11px] text-gray-600 mt-1 leading-normal">{roleCard.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="mt-3 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selected Role
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Bahadur Thapa"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.fullName ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone Number (+977 Nepal) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+977-9841234567"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Province *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {NEPAL_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    District *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {NEPAL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Municipality & Ward
                  </label>
                  <input
                    type="text"
                    value={formData.municipality}
                    onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                    placeholder="e.g. Panauti - Ward 4"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {selectedRole === 'farmer' && (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Farmer Farm Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Farm Name *</label>
                      <input
                        type="text"
                        value={formData.farmName}
                        onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                        placeholder="e.g. Thapa Agro Farm"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                      {errors.farmName && <p className="text-[10px] text-red-600 mt-0.5">{errors.farmName}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Land Size (Ropani)</label>
                      <input
                        type="number"
                        value={formData.farmSize}
                        onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                        placeholder="e.g. 12"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Primary Crops</label>
                      <input
                        type="text"
                        value={formData.primaryCrop}
                        onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                        placeholder="e.g. Cauliflower, Potato"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'buyer' && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                    Agro-Enterprise Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Himalayan Wholesale"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                      {errors.companyName && <p className="text-[10px] text-red-600 mt-0.5">{errors.companyName}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Business Type</label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      >
                        <option value="wholesaler">Wholesaler / Mandi Trader</option>
                        <option value="retailer">Supermarket / Retail Chain</option>
                        <option value="processor">Food Processing Mill</option>
                        <option value="exporter">Agro-Exporter</option>
                        <option value="hotel_restaurant">Hotel & Restaurant Group</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">PAN / VAT Number</label>
                      <input
                        type="text"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        placeholder="e.g. 601928471"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedRole === 'expert' && (
                <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200/80 space-y-3">
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wide">
                    Agronomic Credentials
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g. Senior Horticulturalist"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Institution Affiliation</label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g. NARC / IAAS Rampur"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Specialization *</label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        placeholder="e.g. Organic Pest Control"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                      {errors.specialization && <p className="text-[10px] text-red-600 mt-0.5">{errors.specialization}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="At least 6 characters"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.password ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Repeat password"
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden ${
                        errors.confirmPassword ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#14532D] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Creating Account & Profile...' : `Register as ${selectedRole.toUpperCase()}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="text-center pt-2 text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-800 hover:underline">
                Sign in here
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
