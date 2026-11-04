import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Sprout
} from 'lucide-react';
import { useState } from 'react';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    topic: 'farmer_support',
    district: 'Kathmandu',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Valid phone number is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please provide details of at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const generatedId = `KC-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-[#14532D] to-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
            Contact & Field Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            We Are Here for Nepal’s Agricultural Community
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Reach our field officers, agronomy support desk, or wholesale procurement liaison directly.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Contact Info & Regional Offices */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Connect With Us</h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Whether you need help onboarding your farmer cooperative, verifying mandi pricing, or resolving an inquiry, our dedicated agricultural liaison desk is ready to assist.
              </p>
            </div>

            {/* Quick contact cards */}
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-start gap-3 shadow-xs">
                <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">National Kisan Toll-Free Hotline</h4>
                  <p className="text-xs text-emerald-700 font-semibold">1660-01-95000 (Toll-Free within Nepal)</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Central Desk: +977-1-4433221 / +977-9841234567</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-start gap-3 shadow-xs">
                <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Official Electronic Correspondence</h4>
                  <p className="text-xs text-emerald-700 font-semibold">contact@kisanconnect.np</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Agro-Advisory: advisory@kisanconnect.np</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-start gap-3 shadow-xs">
                <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Operating Hours</h4>
                  <p className="text-xs text-gray-700">Sunday – Friday: 06:30 AM – 06:00 PM (NPT)</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Mandi Support lines open daily at 05:00 AM</p>
                </div>
              </div>
            </div>

            {/* Regional Centers */}
            <div className="p-5 bg-emerald-950 text-white rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Primary Regional Hubs
              </h4>
              <div className="space-y-2 text-xs text-emerald-100">
                <p><strong>Kathmandu Valley:</strong> Kalimati Mandi Market complex & Babarmahal</p>
                <p><strong>Chitwan / Central:</strong> Bharatpur Agricultural Terminal, Ward 10</p>
                <p><strong>Jhapa / Eastern:</strong> Birtamod Krishi Upaj Mandi, Koshi Province</p>
                <p><strong>Pokhara / Western:</strong> Pokhara Wholesale Center, Kaski</p>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                    Thank you, <strong className="text-gray-900">{formData.fullName}</strong>. Your inquiry has been routed to our field support officers with reference:
                  </p>
                  <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl font-mono font-bold text-sm border border-emerald-200">
                    {ticketId}
                  </div>
                  <p className="text-xs text-gray-500">
                    A response will be dispatched to <strong>{formData.email}</strong> or <strong>{formData.phone}</strong> within 1 business day.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          topic: 'farmer_support',
                          district: 'Kathmandu',
                          message: '',
                        });
                      }}
                      className="px-6 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Send an Inquiry or Message</h3>
                    <p className="text-xs text-gray-500">All submissions are logged and answered by real agronomy and operations personnel.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Birendra Chaudhary"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                          errors.fullName ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                        }`}
                      />
                      {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                          errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+977-98XXXXXXXX"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                          errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                        }`}
                      />
                      {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">Topic / Concern *</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                      >
                        <option value="farmer_support">Farmer Listing & Account Support</option>
                        <option value="wholesale_buying">Bulk Buyer Procurement Inquiry</option>
                        <option value="mandi_price_issue">Mandi Price Clarification</option>
                        <option value="expert_partnership">Agronomist & Institution Collaboration</option>
                        <option value="technical_issue">Technical & Security Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">Your Message or Query *</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your crop requirement, farm location, or inquiry in detail..."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600 ${
                        errors.message ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    />
                    {errors.message && <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#14532D] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Official Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
