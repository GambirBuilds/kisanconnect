import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck,
  HelpCircle,
  MessageSquare,
  Package,
  Shield,
  ShoppingBag,
  Sprout,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';

export default function HowItWorksPage() {
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [openFaq, setOpenFaq] = useState(null);

  const roleWorkflows = {
    farmer: {
      title: 'Farmer Workflow',
      desc: 'How rural growers list crops, negotiate fair wholesale agreements, and receive direct payment.',
      steps: [
        {
          num: '01',
          title: 'Register & Complete Farm Profile',
          desc: 'Sign up with your phone number and district. Specify your land holding in Ropani or Bigha and primary crops grown (e.g. cauliflower, potato, cardamom).',
          badge: '100% Free'
        },
        {
          num: '02',
          title: 'Publish Harvest Crop Listing',
          desc: 'Submit upcoming harvest details: estimated yield (Quintals/Kg), harvest date, crop variety, organic status, and target price.',
          badge: 'Instant Visibility'
        },
        {
          num: '03',
          title: 'Review Buyer Purchase Inquiries',
          desc: 'Wholesalers and institutional buyers send direct trade bids. You inspect offered price, requested volume, and delivery terms before accepting.',
          badge: 'You Decide Price'
        },
        {
          num: '04',
          title: 'Farm Gate Handover & Payment',
          desc: 'Produce is inspected and weighed at your farm or local collection center. Payments settle securely without unrecorded deductions.',
          badge: 'Direct Settlement'
        }
      ]
    },
    buyer: {
      title: 'Commercial Buyer Workflow',
      desc: 'How agro-dealers, food processors, supermarkets, and hotels procure verified farm produce.',
      steps: [
        {
          num: '01',
          title: 'Create Verified Buyer Account',
          desc: 'Register your enterprise with PAN/VAT and procurement interests (e.g., fresh vegetables, Mustang apples, aromatic rice).',
          badge: 'Commercial Tier'
        },
        {
          num: '02',
          title: 'Browse Live Crop Offerings',
          desc: 'Search our directory by agricultural category, harvest maturity date, district proximity, and organic certification.',
          badge: 'Filtered Search'
        },
        {
          num: '03',
          title: 'Send Structured Purchase Inquiry',
          desc: 'Specify your volume requirements, delivery deadline, and counter-offer. Communicate directly with the producer.',
          badge: 'Binding Proposals'
        },
        {
          num: '04',
          title: 'Logistics Coordination & Receipt',
          desc: 'Coordinate with farmer-gate logistics hubs or dispatch your own freight vehicles with verified digital consignment bills.',
          badge: 'Reduced Spoilage'
        }
      ]
    },
    expert: {
      title: 'Agricultural Expert Workflow',
      desc: 'How agronomists, plant pathologists, and extension officers share scientific recommendations.',
      steps: [
        {
          num: '01',
          title: 'Institutional Accreditation',
          desc: 'Create an expert profile with credentials from NARC, IAAS, or certified agricultural universities.',
          badge: 'Peer-Verified'
        },
        {
          num: '02',
          title: 'Publish Agronomic Guides',
          desc: 'Write actionable advisories on pest cycles (e.g., Fall Armyworm, Late Blight), low-cost cold chambers, and organic soil enhancement.',
          badge: 'Knowledge Hub'
        },
        {
          num: '03',
          title: 'Answer Farmer Consultations',
          desc: 'Receive direct diagnostic questions submitted by farmers with disease symptoms and recommend cultural and bio-controls.',
          badge: 'Community Impact'
        }
      ]
    },
    admin: {
      title: 'Platform Governance Workflow',
      desc: 'How administrators verify identities, monitor commodity market prices, and audit integrity.',
      steps: [
        {
          num: '01',
          title: 'Identity & Land Verification',
          desc: 'Review farmer registrations against local ward agricultural records to ensure genuine local farmers.',
          badge: 'Integrity Check'
        },
        {
          num: '02',
          title: 'Mandi Price Index Updates',
          desc: 'Sync daily benchmark wholesale prices from Kalimati and regional wholesale boards to maintain fair pricing transparency.',
          badge: 'Market Transparency'
        },
        {
          num: '03',
          title: 'Audit Logs & Dispute Mediation',
          desc: 'Monitor trade inquiry timelines and maintain immutable activity logs for dispute resolution.',
          badge: 'Full Traceability'
        }
      ]
    }
  };

  const currentWorkflow = roleWorkflows[selectedRole];

  const faqs = [
    {
      q: 'Does KisanConnect charge commission on farmer crop sales?',
      a: 'No. KisanConnect does not deduct broker commissions or agent percentages from farmers. Our platform empowers direct price transparency and negotiation between producers and buyers.'
    },
    {
      q: 'Where do the daily Mandi prices come from?',
      a: 'Official benchmark prices are sourced daily from the Kalimati Fruits and Vegetable Market Development Board (KFVMDB) and regional wholesale boards in Birtamod, Pokhara, and Bharatpur with full date and source transparency.'
    },
    {
      q: 'How are farmer identities verified?',
      a: 'Farmers can link their municipal ward agricultural verification or Kisan Card number. Our administration team validates producer details to prevent speculative trader impostors.'
    },
    {
      q: 'What happens if a buyer fails to collect agreed produce?',
      a: 'Our digital inquiry agreement records the buyer’s confirmed volume and date. Repeated cancellations or defaults result in buyer account suspension and forfeiture of verified status.'
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
            Transparent Agritech Workflows
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            How KisanConnect Operates
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Select a role to inspect the complete operational workflow from listing to payment and agronomic advisory.
          </p>
        </div>
      </section>

      {/* Role Selector Tabs */}
      <section className="max-w-5xl mx-auto px-4 -mt-7 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'farmer', label: 'Farmer Workflow', icon: Sprout },
            { id: 'buyer', label: 'Buyer Workflow', icon: ShoppingBag },
            { id: 'expert', label: 'Expert Workflow', icon: HelpCircle },
            { id: 'admin', label: 'Admin Governance', icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedRole === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedRole(item.id)}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition ${
                  isSelected
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-300' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Workflow Step Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{currentWorkflow.title}</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">{currentWorkflow.desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentWorkflow.steps.map((step, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between relative group hover:border-emerald-400 transition">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-emerald-800/30 group-hover:text-emerald-700 transition">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Fully functional step
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 bg-[#F4F7F4] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Common Questions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between font-bold text-sm text-gray-900 hover:text-emerald-800 transition"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
