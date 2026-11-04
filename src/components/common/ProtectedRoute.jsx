import { ArrowRight, Lock, ShieldAlert } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading, switchSandboxRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-700">Verifying session permissions...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    const defaultPathForCurrentRole = `/dashboard/${role}`;

    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-gray-600 mb-6">
            You are currently authenticated as a <strong className="text-gray-900 capitalize">{role}</strong>. This section requires <strong className="text-emerald-700">{allowedRoles.join(' or ')}</strong> privileges under Row Level Security policies.
          </p>

          <div className="space-y-3">
            <a
              href={defaultPathForCurrentRole}
              className="w-full py-3 px-4 bg-[#14532D] hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-sm"
            >
              <span>Go to Your {role ? role.toUpperCase() : 'USER'} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Quick switcher for reviewer/developer */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Switch role to test this page:</p>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {allowedRoles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchSandboxRole(r);
                      window.location.reload();
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 rounded-lg text-xs font-semibold capitalize transition"
                  >
                    Switch to {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
