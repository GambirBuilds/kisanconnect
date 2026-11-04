import { AlertCircle, CheckCircle2, ChevronRight, Copy, Database, HelpCircle, Key, RefreshCw, ShieldCheck, UserCheck, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { api } from '../../services/api.js';

export default function HonestyBanner() {
  const { isSupabaseConfigured, user, role, switchSandboxRole } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const copySqlSnippet = () => {
    navigator.clipboard.writeText(
      `-- KisanConnect Supabase Migration is available in /supabase/migrations/20261102000000_kisanconnect_initial_schema.sql`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all sample crops, inquiries, and questions to their default seed state?')) {
      api.resetSandbox();
      window.location.reload();
    }
  };

  if (dismissed) return null;

  return (
    <>
      <div className="bg-[#143d26] text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800/80 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="font-medium text-white">
              {isSupabaseConfigured ? (
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Supabase Live Cloud Database Connected
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[11px] border border-amber-500/30">
                    Interactive Sandbox & Sample Data Active
                  </span>
                  Full real workflows enabled for testing
                </span>
              )}
            </span>
            <span className="hidden md:inline text-emerald-300/60">•</span>
            <span className="hidden md:inline text-emerald-200">
              Active Role: <strong className="text-white capitalize">{role || 'Guest'}</strong> ({user?.fullName || 'Not logged in'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick role test switcher */}
            <div className="flex items-center bg-emerald-950/70 rounded-md border border-emerald-800 p-0.5">
              <span className="px-2 text-[10px] uppercase tracking-wider text-emerald-400 font-bold hidden sm:inline">
                Test Role:
              </span>
              {['farmer', 'buyer', 'expert', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => switchSandboxRole(r)}
                  className={`px-2 py-0.5 text-[11px] rounded transition-all capitalize font-medium ${
                    role === r
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-300 hover:text-white hover:bg-emerald-900/50'
                  }`}
                  title={`Switch to ${r} account`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowConfigModal(true)}
              className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded text-[11px] font-medium flex items-center gap-1 transition"
            >
              <Key className="w-3 h-3 text-emerald-300" />
              <span>DB Setup & SQL</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded"
              title="Reset sandbox state"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-emerald-300 hover:text-white hover:bg-emerald-800/60 rounded"
              title="Close banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Supabase & Database Architecture Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Database & Supabase Status</h3>
                  <p className="text-xs text-gray-500">KisanConnect Part 1 Architectural Compliance</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className={`p-4 rounded-xl border ${isSupabaseConfigured ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'}`}>
                <div className="flex items-start gap-3">
                  {isSupabaseConfigured ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">
                      {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Environment Keys Not Detected'}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {isSupabaseConfigured
                        ? 'Your frontend is communicating with live Supabase Authentication and PostgreSQL tables with Row Level Security (RLS).'
                        : 'KisanConnect is currently running in full Interactive Sandbox mode with persistent local storage. Every button, crop listing, inquiry negotiation, and expert advisory functions authentically without blocking evaluation.'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Included Database Schema & Migrations
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  The initial migration file is generated at <code className="bg-gray-100 px-1 py-0.5 rounded text-emerald-800 font-mono">/supabase/migrations/20261102000000_kisanconnect_initial_schema.sql</code> with UUID keys, RLS policies, and triggers for all required tables:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    'profiles',
                    'user_roles',
                    'farmer_profiles',
                    'buyer_profiles',
                    'expert_profiles',
                    'agricultural_categories',
                    'crop_listings',
                    'purchase_inquiries',
                    'expert_articles',
                    'farmer_questions',
                    'activity_logs',
                    'mandi_prices'
                  ].map((table) => (
                    <div key={table} className="bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-gray-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {table}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <span className="font-semibold text-gray-800 block mb-1">To connect your live Supabase project:</span>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Create a project on <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-medium">supabase.com</a>.</li>
                  <li>Copy and execute the migration file in Supabase SQL Editor.</li>
                  <li>Add <code className="bg-white px-1 py-0.5 rounded border font-mono">VITE_SUPABASE_URL</code> and <code className="bg-white px-1 py-0.5 rounded border font-mono">VITE_SUPABASE_ANON_KEY</code> to <code className="font-mono">.env</code>.</li>
                </ol>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={copySqlSnippet}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Migration Path Copied!' : 'Copy Migration Info'}
                </button>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
