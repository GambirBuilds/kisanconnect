import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';

// Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import BuyerDashboard from './pages/buyer/BuyerDashboard.jsx';
import ExpertDashboard from './pages/expert/ExpertDashboard.jsx';
import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import ArticleDetailPage from './pages/public/ArticleDetailPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import FarmingAssistantPage from './pages/public/FarmingAssistantPage.jsx';
import FeaturesPage from './pages/public/FeaturesPage.jsx';
import HowItWorksPage from './pages/public/HowItWorksPage.jsx';
import KnowledgeHubPage from './pages/public/KnowledgeHubPage.jsx';
import LandingPage from './pages/public/LandingPage.jsx';
import MandiPricesPage from './pages/public/MandiPricesPage.jsx';
import MarketplacePage from './pages/public/MarketplacePage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';
import ProductDetailPage from './pages/public/ProductDetailPage.jsx';
import SettingsPage from './pages/public/SettingsPage.jsx';
import UserProfilePage from './pages/public/UserProfilePage.jsx';
import WeatherPage from './pages/public/WeatherPage.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/marketplace/:id" element={<ProductDetailPage />} />
              <Route path="/mandi-prices" element={<MandiPricesPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
              <Route path="/knowledge-hub/:slug" element={<ArticleDetailPage />} />
              <Route path="/farming-assistant" element={<FarmingAssistantPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Role-Specific Protected Dashboards */}
          <Route
            path="/dashboard/farmer"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/buyer"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/expert"
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <ExpertDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Settings & Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer', 'expert', 'admin']}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'buyer', 'expert', 'admin']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
