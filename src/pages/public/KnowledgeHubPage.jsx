import {
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  Plus,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { api } from '../../services/api.js';
import { KNOWLEDGE_HUB_CATEGORIES } from '../../utils/nepalData.js';

export default function KnowledgeHubPage() {
  const { user, role } = useAuth();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'saved'
  const [bookmarkedIds, setBookmarkedIds] = useState(['kh-1', 'kh-4']);

  // Publishing modal for experts / admins
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Vegetable Farming',
    summary: '',
    content: '',
    isScientificAdvisory: true,
  });

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  const loadArticles = async () => {
    setLoading(true);
    const res = await api.getKnowledgeArticles({
      category: selectedCategory,
      search: searchQuery,
    });
    if (res.data) setArticles(res.data);
    setLoading(false);
  };

  const toggleBookmark = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bId) => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content) return;

    await api.createArticle(newArticle, user);
    setShowPublishModal(false);
    setNewArticle({
      title: '',
      category: 'Vegetable Farming',
      summary: '',
      content: '',
      isScientificAdvisory: true,
    });
    loadArticles();
  };

  const displayedArticles = activeTab === 'saved'
    ? articles.filter((a) => bookmarkedIds.includes(a.id))
    : articles;

  const canPublish = role === 'expert' || role === 'admin';

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-[#14532D] to-emerald-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Agronomic Knowledge Repository • कृषि ज्ञान केन्द्र
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Farming Knowledge Hub
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Scientific cultivation protocols, bio-controls, soil reclamation techniques, and climate-resilient farming guides authored by licensed agronomists.
            </p>
          </div>

          {canPublish && (
            <button
              onClick={() => setShowPublishModal(true)}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-2 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Field Guide</span>
            </button>
          )}
        </div>
      </section>

      {/* Distinction Disclaimer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Standards Notice:</strong> Content marked with <span className="bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded text-[10px]">SCIENTIFIC ADVISORY</span> is authored by certified research scientists affiliated with NARC or IAAS. General educational guides provide verified standard farming practices and should be adapted to your local terrace soil tests.
          </p>
        </div>
      </section>

      {/* Search & Category Filter Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search guides, pests, crops (e.g. Cauliflower, Fall Armyworm, Lime)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex-1 md:flex-initial ${
                activeTab === 'all'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Articles ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 flex-1 md:flex-initial ${
                activeTab === 'saved'
                  ? 'bg-[#14532D] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>Saved Bookmarks ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* 10 Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {KNOWLEDGE_HUB_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === 'all' ? 'all' : cat.name)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                (cat.id === 'all' && selectedCategory === 'all') || selectedCategory === cat.name
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex-1 w-full">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-semibold">Loading knowledge repository...</p>
          </div>
        ) : displayedArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-gray-800">No Articles Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              {activeTab === 'saved'
                ? 'You have not bookmarked any articles yet. Bookmark helpful guides to access them here.'
                : 'No articles match your current category or search criteria.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article) => {
              const isSaved = bookmarkedIds.includes(article.id);
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover image & badges */}
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                          {article.category}
                        </span>
                        {article.isScientificAdvisory && (
                          <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                            <Sparkles className="w-3 h-3" /> NARC Advisory
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => toggleBookmark(article.id, e)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-xs transition ${
                          isSaved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/90 text-gray-600 hover:text-emerald-700'
                        }`}
                        title={isSaved ? 'Remove bookmark' : 'Bookmark guide'}
                      >
                        <BookMarked className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{article.views} reads</span>
                      </div>

                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-900 transition line-clamp-2">
                        {article.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>

                      <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                        Author: <strong className="text-gray-800">{article.author}</strong> ({article.authorRole})
                      </div>
                    </div>
                  </div>

                  {/* Footer link to full guide */}
                  <div className="p-5 pt-0">
                    <Link
                      to={`/knowledge-hub/${article.slug || article.id}`}
                      className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-[#14532D] text-emerald-900 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 group-hover:bg-[#14532D] group-hover:text-white"
                    >
                      <span>Read Step-by-Step Guide</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PUBLISH ARTICLE MODAL FOR EXPERTS */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Publish Field Advisory Guide</h3>
              <button onClick={() => setShowPublishModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Guide Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Combating Bacterial Wilt in Solanaceous Crops"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Discipline Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white"
                >
                  {KNOWLEDGE_HUB_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Executive Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="1-2 sentences outlining the primary problem and bio-remedy..."
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Technical Advisory Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Provide complete soil criteria, symptoms, bio-control dosage per liter, and cultural precautions..."
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                  <input
                    type="checkbox"
                    checked={newArticle.isScientificAdvisory}
                    onChange={(e) => setNewArticle({ ...newArticle, isScientificAdvisory: e.target.checked })}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span>Mark as Peer-Verified Scientific Advisory (NARC Standard)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14532D] text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                >
                  Publish to Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
