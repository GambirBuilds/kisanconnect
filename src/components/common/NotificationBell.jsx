import {
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  MessageSquare,
  Package,
  Settings,
  SlidersHorizontal,
  Sprout,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { api } from '../../services/api.js';

export default function NotificationBell() {
  const { user } = useAuth();
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'inquiries', 'harvest', 'system'

  // Preferences modal
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    inquiries: true,
    harvestReminders: true,
    mandiPriceAlerts: true,
    expertArticles: true,
    systemAnnouncements: true
  });

  useEffect(() => {
    loadNotifications();
    if (user) {
      const prefs = api.getNotificationPreferences(user.id);
      setPreferences(prefs);
    }
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    const res = await api.getNotifications(user.id);
    if (res.data) setNotifications(res.data);
  };

  const handleMarkAsRead = async (id) => {
    await api.markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsAsRead(user?.id);
    loadNotifications();
    toast.success('All notifications marked as read.');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    if (user) {
      api.updateNotificationPreferences(user.id, preferences);
    }
    setShowPreferences(false);
    toast.success('Notification preferences updated.');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type) => {
    switch (type) {
      case 'inquiry_received':
      case 'inquiry_status_changed':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'harvest_due':
      case 'crop_activity_reminder':
        return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'new_article':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-amber-600" />;
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'inquiries') {
      return n.type === 'inquiry_received' || n.type === 'inquiry_status_changed';
    }
    if (categoryFilter === 'harvest') {
      return n.type === 'harvest_due' || n.type === 'crop_activity_reminder';
    }
    if (categoryFilter === 'system') {
      return n.type === 'system' || n.type === 'announcement' || n.type === 'new_article';
    }
    return true;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition focus:outline-hidden"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-extrabold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in">
          {/* Header */}
          <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreferences(true)}
                className="p-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200"
                title="Notification Preferences"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="px-3 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center gap-1 overflow-x-auto text-[11px]">
            {['all', 'inquiries', 'harvest', 'system'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition ${
                  categoryFilter === cat
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 text-xs transition flex items-start gap-3 ${
                    notif.isRead ? 'bg-white opacity-80' : 'bg-emerald-50/40'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-gray-100 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-gray-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-gray-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center justify-between mt-2 pt-1">
                      {notif.linkUrl ? (
                        <Link
                          to={notif.linkUrl}
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="text-[11px] font-semibold text-emerald-800 hover:underline flex items-center gap-0.5"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span />
                      )}

                      {!notif.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-[10px] text-gray-500 hover:text-emerald-700 flex items-center gap-0.5"
                        >
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Notification Preferences</h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                <span className="font-semibold text-gray-800">Buyer Inquiries & Negotiation</span>
                <input
                  type="checkbox"
                  checked={preferences.inquiries}
                  onChange={(e) => setPreferences({ ...preferences, inquiries: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                <span className="font-semibold text-gray-800">Upcoming Harvest Reminders</span>
                <input
                  type="checkbox"
                  checked={preferences.harvestReminders}
                  onChange={(e) => setPreferences({ ...preferences, harvestReminders: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                <span className="font-semibold text-gray-800">Mandi Price Shifts & Spread</span>
                <input
                  type="checkbox"
                  checked={preferences.mandiPriceAlerts}
                  onChange={(e) => setPreferences({ ...preferences, mandiPriceAlerts: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                <span className="font-semibold text-gray-800">New Scientific Agronomy Guides</span>
                <input
                  type="checkbox"
                  checked={preferences.expertArticles}
                  onChange={(e) => setPreferences({ ...preferences, expertArticles: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-gray-50">
                <span className="font-semibold text-gray-800">Platform System Announcements</span>
                <input
                  type="checkbox"
                  checked={preferences.systemAnnouncements}
                  onChange={(e) => setPreferences({ ...preferences, systemAnnouncements: e.target.checked })}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="px-3.5 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition"
                >
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
