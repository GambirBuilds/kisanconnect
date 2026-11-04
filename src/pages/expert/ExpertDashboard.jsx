import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileText,
  HelpCircle,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Sprout,
  Star,
  Users,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { api } from '../../services/api.js';

export default function ExpertDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [articles, setArticles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New article modal
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Pest Management & Bio-Controls',
    summary: '',
    content: '',
  });

  // Answering question modal
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const artRes = await api.getArticles();
    if (artRes.data) setArticles(artRes.data);

    const qRes = await api.getQuestions();
    if (qRes.data) setQuestions(qRes.data);

    setLoading(false);
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    await api.createArticle(newArticle, user);
    setShowArticleModal(false);
    setNewArticle({
      title: '',
      category: 'Pest Management & Bio-Controls',
      summary: '',
      content: '',
    });
    loadData();
  };

  const handleAnswerQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuestion || !answerText.trim()) return;

    await api.answerQuestion(selectedQuestion.id, answerText, user);
    setSelectedQuestion(null);
    setAnswerText('');
    loadData();
  };

  const pendingQuestions = questions.filter((q) => q.status === 'open');
  const answeredQuestions = questions.filter((q) => q.status === 'answered');

  return (
    <DashboardLayout currentTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-[#143d26] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-800/80 text-purple-200 px-2.5 py-0.5 rounded-md border border-purple-600">
                Agronomic Advisory Bureau
              </span>
              <span className="text-xs text-purple-200">• Nepal Agricultural Research Council (NARC)</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Greetings, {user?.fullName || 'Dr. Anil Karki'}!
            </h2>
            <p className="text-xs text-purple-100 max-w-xl">
              Publish scientific crop management guides, diagnostic bio-controls, and resolve farmer queries from mid-hill and Terai valleys.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowArticleModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Advisory Guide</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Published Field Guides</span>
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">{articles.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">2,400+ farmer reads</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Pending Farmer Queries</span>
              <HelpCircle className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-600">{pendingQuestions.length}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Awaiting scientific reply</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Resolved Diagnoses</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-[#14532D]">{answeredQuestions.length}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% resolution rate</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Scientist Credibility</span>
              <Award className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-2xl font-black text-gray-900 flex items-center gap-1">
              <span>4.95</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">License: NEA-AG-4910</p>
          </div>
        </div>

        {/* 2 Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Pending Farmer Diagnostic Queries (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Farmer Diagnostic Queries</h3>
                <p className="text-[11px] text-gray-500">Provide cultural, organic and chemical pest recommendations</p>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {pendingQuestions.length} Open
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {questions.map((q) => (
                <div key={q.id} className="p-4 space-y-2 hover:bg-gray-50 transition text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">{q.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      q.status === 'answered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500">
                    Crop: <strong className="text-emerald-800">{q.crop}</strong> • Asked by: <strong className="text-gray-800">{q.farmerName}</strong> ({q.district})
                  </p>

                  <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    "{q.description}"
                  </p>

                  {q.answer ? (
                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-0.5">
                      <p className="text-[10px] font-bold text-emerald-900">Your Recommended Advisory:</p>
                      <p className="text-[11px] text-emerald-800 italic">{q.answer}</p>
                      <p className="text-[10px] text-emerald-600">Answered on {q.answeredAt}</p>
                    </div>
                  ) : (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedQuestion(q);
                          setAnswerText('');
                        }}
                        className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Provide Scientific Advisory</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Published Advisory Guides (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">My Published Guides</h3>
                <p className="text-[11px] text-gray-500">Agronomic knowledge base</p>
              </div>
              <button
                onClick={() => setShowArticleModal(true)}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Guide
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {articles.map((art) => (
                <div key={art.id} className="p-4 space-y-1.5 hover:bg-gray-50 transition text-xs">
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {art.category}
                  </span>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{art.title}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{art.summary}</p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>{art.readTime} • {art.date}</span>
                    <span className="text-emerald-700 font-semibold">{art.views} reads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* PUBLISH ARTICLE MODAL */}
      {showArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Publish Agronomic Guide</h3>
              <button onClick={() => setShowArticleModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Guide Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Managing Bacterial Wilt in Solanaceous Crops"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                >
                  <option value="Pest Management & Bio-Controls">Pest Management & Bio-Controls</option>
                  <option value="Post-Harvest & Cold Chain">Post-Harvest & Cold Chain</option>
                  <option value="Soil Health & Organic Nutrients">Soil Health & Organic Nutrients</option>
                  <option value="Terrace Irrigation & Rain Harvesting">Terrace Irrigation & Rain Harvesting</option>
                  <option value="High-Altitude Horticulture">High-Altitude Horticulture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Summary (1-2 sentences) *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Key actionable takeaway for farmers..."
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Technical Guide *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Detailed symptoms, organic remedies, recommended dosage per liter, and cultural precautions..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800"
                >
                  Publish to Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ANSWER QUESTION MODAL */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-1">Answer Farmer Query</h4>
            <div className="p-3 bg-gray-50 rounded-xl text-xs mb-3 space-y-1">
              <p className="font-bold text-gray-900">{selectedQuestion.title}</p>
              <p className="text-gray-500">Crop: {selectedQuestion.crop} • Farmer: {selectedQuestion.farmerName} ({selectedQuestion.district})</p>
              <p className="text-gray-700 italic">"{selectedQuestion.description}"</p>
            </div>

            <form onSubmit={handleAnswerQuestion} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Agronomic Recommendation *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify disease identification, cultural remedy, organic bio-control and spray schedule..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Transmit Answer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
