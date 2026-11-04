import { ArrowLeft, Home, Package, Search, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-5 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <Sprout className="w-8 h-8" />
          </div>
          <span className="text-4xl font-black text-gray-900 block">404</span>
          <h2 className="text-xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            The agricultural resource, crop listing, or page you were looking for does not exist or has been moved.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/marketplace"
              className="w-full sm:w-auto px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>Browse Crops</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
