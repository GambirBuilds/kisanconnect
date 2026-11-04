import {
  ArrowLeft,
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Info,
  Layers,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { api } from '../../services/api.js';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    const res = await api.getArticleById(slug);
    if (res.data) {
      setArticle(res.data);
      // Fetch related articles
      const allRes = await api.getKnowledgeArticles({ category: res.data.category });
      if (allRes.data) {
        setRelated(allRes.data.filter((a) => a.id !== res.data.id).slice(0, 3));
      }
    }
    setLoading(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        <Link
          to="/knowledge-hub"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Knowledge Guides</span>
        </Link>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-semibold">Retrieving guide...</p>
          </div>
        ) : article ? (
          <div className="space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-900 px-3 py-1 rounded-md border border-emerald-200">
                    {article.category}
                  </span>
                  {article.isScientificAdvisory ? (
                    <span className="text-[11px] font-bold bg-emerald-700 text-white px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Peer-Verified Scientific Advisory
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                      Practical Educational Guide
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-xl border transition ${
                      bookmarked ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    title="Bookmark guide"
                  >
                    <BookMarked className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                {article.title}
              </h1>

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {article.author.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{article.author}</p>
                    <p className="text-[11px] text-emerald-800 font-semibold">{article.authorRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>{article.views} reads</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.coverImage && (
              <div className="h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xs border border-gray-200">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Step-by-Step Practical Protocol (If Available) */}
            {article.steps && article.steps.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Step-by-Step Implementation Protocol</h3>
                    <p className="text-xs text-gray-500">Sequential methodology for farm terraces</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {article.steps.map((st) => (
                    <div
                      key={st.step}
                      className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 flex items-start gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#14532D] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {st.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{st.title}</h4>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Content */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                Detailed Field Findings & Recommendations
              </h3>
              <div className="space-y-4 whitespace-pre-line">
                {article.content}
              </div>

              <div className="mt-8 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  Agricultural Adaptation Disclaimer
                </p>
                <p className="opacity-90">
                  Dosages and transplantation dates may vary slightly based on altitude (e.g., Terai vs. Mid-Hills) and local soil acidity. Always conduct a local soil test before heavy limestone or zinc application.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-gray-900">Related Articles in {article.category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {related.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/knowledge-hub/${rel.slug || rel.id}`}
                      className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {rel.category}
                        </span>
                        <h4 className="font-bold text-gray-900 text-xs mt-2 line-clamp-2">{rel.title}</h4>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-3 block">{rel.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8">
            <h3 className="text-base font-bold text-gray-900">Guide not found</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">This article could not be located in our repository.</p>
            <Link to="/knowledge-hub" className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold">
              Return to Knowledge Hub
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
