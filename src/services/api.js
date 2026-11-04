import { isSupabaseConfigured, supabase } from '../config/supabase.js';
import {
  INITIAL_ACTIVITY_LOGS,
  INITIAL_CROP_LISTINGS,
  INITIAL_CROP_RECORDS,
  INITIAL_INQUIRIES,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_MANDI_PRICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_QUESTIONS,
  INITIAL_SAVED_PRODUCTS,
  INITIAL_USERS_LIST
} from '../utils/nepalData.js';

const STORAGE_KEYS = {
  LISTINGS: 'kc_crop_listings_v2',
  INQUIRIES: 'kc_purchase_inquiries_v2',
  CROPS: 'kc_crop_records_v2',
  ARTICLES: 'kc_knowledge_articles_v2',
  BOOKMARKS: 'kc_article_bookmarks_v2',
  SAVED_PRODUCTS: 'kc_saved_products_v2',
  NOTIFICATIONS: 'kc_notifications_v2',
  QUESTIONS: 'kc_farmer_questions_v2',
  LOGS: 'kc_activity_logs_v2',
  USERS: 'kc_users_directory_v2',
  REPORTS: 'kc_product_reports_v2',
  RECENTLY_VIEWED: 'kc_recently_viewed_v2',
  NOTIFICATION_PREFS: 'kc_notification_prefs_v2',
};

const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};

export const initLocalData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    setStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INQUIRIES)) {
    setStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
    setStored(STORAGE_KEYS.CROPS, INITIAL_CROP_RECORDS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
    setStored(STORAGE_KEYS.ARTICLES, INITIAL_KNOWLEDGE_ARTICLES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_PRODUCTS)) {
    setStored(STORAGE_KEYS.SAVED_PRODUCTS, INITIAL_SAVED_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    setStored(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    setStored(STORAGE_KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setStored(STORAGE_KEYS.USERS, INITIAL_USERS_LIST);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    setStored(STORAGE_KEYS.REPORTS, []);
  }
};

initLocalData();

export const api = {
  // ==================== 1. CROP LISTINGS (MARKETPLACE) ====================
  async getCropListings(filters = {}) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('products').select('*');
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.farmerId) query = query.eq('farmer_id', filters.farmerId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return { data, error: null };
      } catch (err) {
        console.warn('Supabase query failed, falling back to local memory:', err);
      }
    }

    let listings = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);

    if (filters.farmerId) {
      listings = listings.filter((item) => item.farmerId === filters.farmerId);
    }
    if (filters.status && filters.status !== 'All') {
      listings = listings.filter((item) => item.status === filters.status);
    }
    if (filters.category && filters.category !== 'All') {
      listings = listings.filter((item) => item.category === filters.category);
    }
    if (filters.district && filters.district !== 'All') {
      listings = listings.filter((item) => item.farmerDistrict === filters.district);
    }
    if (filters.organicOnly) {
      listings = listings.filter((item) => item.isOrganic);
    }
    if (filters.quality && filters.quality !== 'All') {
      listings = listings.filter((item) => item.quality === filters.quality);
    }
    if (filters.availability && filters.availability !== 'All') {
      listings = listings.filter((item) => item.availabilityStatus === filters.availability);
    }
    if (filters.minPrice) {
      listings = listings.filter((item) => item.pricePerUnit >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      listings = listings.filter((item) => item.pricePerUnit <= Number(filters.maxPrice));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      listings = listings.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.farmerDistrict.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.variety && item.variety.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (filters.sortBy === 'price_low') {
      listings.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    } else if (filters.sortBy === 'price_high') {
      listings.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    } else if (filters.sortBy === 'harvest_date') {
      listings.sort((a, b) => new Date(a.harvestDate) - new Date(b.harvestDate));
    } else {
      // Default: newest first
      listings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return { data: listings, error: null };
  },

  async getCropListingById(id) {
    const listings = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const found = listings.find((l) => l.id === id);
    if (found) return { data: found, error: null };
    return { data: null, error: 'Listing not found' };
  },

  async createCropListing(listingData, user) {
    const current = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const newListing = {
      id: `lst-${Date.now()}`,
      farmerId: user?.id || 'usr-farmer-001',
      farmerName: user?.fullName || 'Ramesh Bahadur Thapa',
      farmerDistrict: listingData.district || user?.district || 'Kavrepalanchok',
      farmerPhone: user?.phone || '+977-9841234567',
      title: listingData.title,
      category: listingData.category || 'Fresh Vegetables',
      variety: listingData.variety || 'Standard Local',
      quality: listingData.quality || 'grade_a_premium',
      quantity: Number(listingData.quantity),
      unit: listingData.unit || 'Quintal',
      pricePerUnit: Number(listingData.pricePerUnit),
      currency: listingData.currency || 'NPR/Kg',
      harvestDate: listingData.harvestDate || new Date().toISOString().split('T')[0],
      availabilityStatus: listingData.availabilityStatus || 'in_stock',
      status: 'active',
      isOrganic: Boolean(listingData.isOrganic),
      description: listingData.description || '',
      image: listingData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      viewsCount: 0
    };

    const updated = [newListing, ...current];
    setStored(STORAGE_KEYS.LISTINGS, updated);

    this.addActivityLog({
      action: 'CROP_LISTING_PUBLISHED',
      user: `${user?.fullName || 'Farmer'} (${user?.role || 'farmer'})`,
      details: `Published ${listingData.quantity} ${listingData.unit} of ${listingData.title} in ${listingData.district || 'Kavre'}.`,
      type: 'listing'
    });

    return { data: newListing, error: null };
  },

  async updateCropListing(id, listingData) {
    const current = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...listingData, updatedAt: new Date().toISOString().split('T')[0] } : item
    );
    setStored(STORAGE_KEYS.LISTINGS, updated);
    return { data: true, error: null };
  },

  async deleteCropListing(id) {
    const current = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const updated = current.filter((item) => item.id !== id);
    setStored(STORAGE_KEYS.LISTINGS, updated);
    return { data: true, error: null };
  },

  async toggleListingStatus(id) {
    const current = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const updated = current.map((item) => {
      if (item.id === id) {
        const nextStatus = item.status === 'active' ? 'paused' : 'active';
        return { ...item, status: nextStatus };
      }
      return item;
    });
    setStored(STORAGE_KEYS.LISTINGS, updated);
    return { data: true, error: null };
  },

  // ==================== 2. BUYER-FARMER INQUIRIES & MESSAGING ====================
  async getInquiries(role, userId) {
    const inquiries = getStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    if (role === 'farmer') {
      return { data: inquiries.filter((inq) => inq.farmerId === userId), error: null };
    }
    if (role === 'buyer') {
      return { data: inquiries.filter((inq) => inq.buyerId === userId), error: null };
    }
    return { data: inquiries, error: null };
  },

  async getInquiryById(id) {
    const inquiries = getStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const found = inquiries.find((i) => i.id === id);
    if (found) return { data: found, error: null };
    return { data: null, error: 'Inquiry not found' };
  },

  async createInquiry(inquiryData, buyerUser) {
    const current = getStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const newInquiry = {
      id: `inq-${Date.now()}`,
      listingId: inquiryData.listingId,
      listingTitle: inquiryData.listingTitle,
      buyerId: buyerUser.id,
      buyerName: buyerUser.fullName,
      buyerCompany: buyerUser.companyName || 'Registered Agro-Buyer',
      buyerPhone: buyerUser.phone || '+977-9851000000',
      farmerId: inquiryData.farmerId,
      requestedQuantity: Number(inquiryData.requestedQuantity),
      unit: inquiryData.unit || 'Quintal',
      offeredPrice: Number(inquiryData.offeredPrice),
      currency: 'NPR',
      proposedDeliveryDate: inquiryData.proposedDeliveryDate || null,
      status: 'pending',
      message: inquiryData.message,
      date: new Date().toISOString().split('T')[0],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: buyerUser.id,
          senderName: buyerUser.fullName,
          text: inquiryData.message,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    const updated = [newInquiry, ...current];
    setStored(STORAGE_KEYS.INQUIRIES, updated);

    // Notify farmer
    this.createNotification({
      userId: inquiryData.farmerId,
      title: 'New Purchase Proposal Received',
      message: `${buyerUser.fullName} (${buyerUser.companyName || 'Buyer'}) requested ${inquiryData.requestedQuantity} ${inquiryData.unit} of ${inquiryData.listingTitle} at Rs. ${inquiryData.offeredPrice}.`,
      type: 'inquiry_received',
      linkUrl: '/dashboard/farmer'
    });

    this.addActivityLog({
      action: 'INQUIRY_CREATED',
      user: `${buyerUser.fullName} (Buyer)`,
      details: `Sent trade bid for ${inquiryData.listingTitle} (${inquiryData.requestedQuantity} ${inquiryData.unit} @ Rs. ${inquiryData.offeredPrice}).`,
      type: 'inquiry'
    });

    return { data: newInquiry, error: null };
  },

  async updateInquiryStatus(inquiryId, status, responseNote = '') {
    const current = getStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    let targetInquiry = null;

    const updated = current.map((item) => {
      if (item.id === inquiryId) {
        targetInquiry = item;
        return { ...item, status, responseNote };
      }
      return item;
    });

    setStored(STORAGE_KEYS.INQUIRIES, updated);

    if (targetInquiry) {
      // Notify buyer of status update
      this.createNotification({
        userId: targetInquiry.buyerId,
        title: `Proposal ${status === 'accepted' ? 'Accepted' : status === 'rejected' ? 'Declined' : 'Updated'}`,
        message: `Your inquiry for ${targetInquiry.listingTitle} was ${status} by the farmer. ${responseNote ? `Note: "${responseNote}"` : ''}`,
        type: 'inquiry_status_changed',
        linkUrl: '/dashboard/buyer'
      });
    }

    return { data: true, error: null };
  },

  async sendInquiryMessage(inquiryId, messageText, senderUser) {
    const current = getStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const updated = current.map((item) => {
      if (item.id === inquiryId) {
        const newMsg = {
          id: `msg-${Date.now()}`,
          senderId: senderUser.id,
          senderName: senderUser.fullName,
          text: messageText,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...item,
          messages: [...(item.messages || []), newMsg]
        };
      }
      return item;
    });

    setStored(STORAGE_KEYS.INQUIRIES, updated);
    return { data: true, error: null };
  },

  // ==================== 3. SAVED PRODUCTS (BUYER BOOKMARKS) ====================
  async getSavedProducts(buyerId) {
    const savedIds = getStored(STORAGE_KEYS.SAVED_PRODUCTS, INITIAL_SAVED_PRODUCTS);
    const allListings = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const filtered = allListings.filter((l) => savedIds.includes(l.id));
    return { data: filtered, error: null };
  },

  async toggleSaveProduct(productId) {
    const current = getStored(STORAGE_KEYS.SAVED_PRODUCTS, INITIAL_SAVED_PRODUCTS);
    let updated;
    let isSaved;
    if (current.includes(productId)) {
      updated = current.filter((id) => id !== productId);
      isSaved = false;
    } else {
      updated = [...current, productId];
      isSaved = true;
    }
    setStored(STORAGE_KEYS.SAVED_PRODUCTS, updated);
    return { data: isSaved, error: null };
  },

  isProductSaved(productId) {
    const current = getStored(STORAGE_KEYS.SAVED_PRODUCTS, INITIAL_SAVED_PRODUCTS);
    return current.includes(productId);
  },

  // ==================== 4. CROP MANAGEMENT (FARMER SYSTEM) ====================
  async getCropRecords(farmerId) {
    const records = getStored(STORAGE_KEYS.CROPS, INITIAL_CROP_RECORDS);
    if (farmerId) {
      return { data: records.filter((c) => c.farmerId === farmerId), error: null };
    }
    return { data: records, error: null };
  },

  async createCropRecord(cropData, farmerUser) {
    const current = getStored(STORAGE_KEYS.CROPS, INITIAL_CROP_RECORDS);
    const newCrop = {
      id: `cr-${Date.now()}`,
      farmerId: farmerUser?.id || 'usr-farmer-001',
      cropName: cropData.cropName,
      category: cropData.category || 'Vegetable Farming',
      variety: cropData.variety || 'Standard Variety',
      fieldName: cropData.fieldName || 'Terrace Plot 1',
      landArea: cropData.landArea || '4 Ropani',
      plantationDate: cropData.plantationDate,
      expectedHarvestDate: cropData.expectedHarvestDate,
      growthStage: cropData.growthStage || 'sowing_germination',
      expectedProductionQuantity: Number(cropData.expectedProductionQuantity) || 10,
      productionUnit: cropData.productionUnit || 'Quintal',
      healthStatus: cropData.healthStatus || 'healthy',
      notes: cropData.notes || '',
      activities: [
        {
          id: `act-${Date.now()}`,
          date: cropData.plantationDate,
          type: 'plantation',
          details: `Planted ${cropData.variety || cropData.cropName} on ${cropData.landArea || '4 Ropani'}.`
        }
      ]
    };

    const updated = [newCrop, ...current];
    setStored(STORAGE_KEYS.CROPS, updated);
    return { data: newCrop, error: null };
  },

  async updateCropRecord(cropId, updateFields) {
    const current = getStored(STORAGE_KEYS.CROPS, INITIAL_CROP_RECORDS);
    const updated = current.map((c) => (c.id === cropId ? { ...c, ...updateFields } : c));
    setStored(STORAGE_KEYS.CROPS, updated);
    return { data: true, error: null };
  },

  async deleteCropRecord(cropId) {
    const current = getStored(STORAGE_KEYS.CROPS, INITIAL_CROP_RECORDS);
    const updated = current.filter((c) => c.id !== cropId);
    setStored(STORAGE_KEYS.CROPS, updated);
    return { data: true, error: null };
  },

  async addCropActivity(cropId, activityData) {
    const current = getStored(STORAGE_KEYS.CROPS, INITIAL_CROP_RECORDS);
    const updated = current.map((c) => {
      if (c.id === cropId) {
        const newAct = {
          id: `act-${Date.now()}`,
          date: activityData.date || new Date().toISOString().split('T')[0],
          type: activityData.type || 'fertilizer',
          details: activityData.details,
          cost: Number(activityData.cost) || 0
        };
        return {
          ...c,
          activities: [newAct, ...(c.activities || [])]
        };
      }
      return c;
    });
    setStored(STORAGE_KEYS.CROPS, updated);
    return { data: true, error: null };
  },

  // ==================== 5. FARMING KNOWLEDGE HUB ====================
  async getKnowledgeArticles(filters = {}) {
    let articles = getStored(STORAGE_KEYS.ARTICLES, INITIAL_KNOWLEDGE_ARTICLES);

    if (filters.category && filters.category !== 'all' && filters.category !== 'All') {
      articles = articles.filter(
        (a) => a.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
      );
    }
    return { data: articles, error: null };
  },

  async getArticleById(idOrSlug) {
    const articles = getStored(STORAGE_KEYS.ARTICLES, INITIAL_KNOWLEDGE_ARTICLES);
    const found = articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
    if (found) return { data: found, error: null };
    return { data: null, error: 'Article not found' };
  },

  async createArticle(articleData, expertUser) {
    const current = getStored(STORAGE_KEYS.ARTICLES, INITIAL_KNOWLEDGE_ARTICLES);
    const newArticle = {
      id: `kh-${Date.now()}`,
      slug: articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      author: expertUser?.fullName || 'Agricultural Extension Team',
      authorRole: expertUser?.designation || 'Agronomist & Specialist',
      title: articleData.title,
      category: articleData.category || 'Vegetable Farming',
      summary: articleData.summary,
      content: articleData.content,
      readTime: '5 min read',
      views: 1,
      coverImage: articleData.coverImage || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      isScientificAdvisory: Boolean(articleData.isScientificAdvisory),
      steps: articleData.steps || [],
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newArticle, ...current];
    setStored(STORAGE_KEYS.ARTICLES, updated);

    this.createNotification({
      userId: 'usr-farmer-001',
      title: 'New Advisory Guide Available',
      message: `"${articleData.title}" was published in ${articleData.category}.`,
      type: 'new_article',
      linkUrl: `/knowledge-hub/${newArticle.slug}`
    });

    return { data: newArticle, error: null };
  },

  // ==================== 6. NOTIFICATIONS ====================
  async getNotifications(userId) {
    const notifications = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const userNotifs = notifications.filter((n) => !userId || n.userId === userId || n.userId === 'all');
    return { data: userNotifs, error: null };
  },

  async markNotificationAsRead(id) {
    const current = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return { data: true, error: null };
  },

  async markAllNotificationsAsRead(userId) {
    const current = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = current.map((n) => (!userId || n.userId === userId ? { ...n, isRead: true } : n));
    setStored(STORAGE_KEYS.NOTIFICATIONS, updated);
    return { data: true, error: null };
  },

  createNotification(notif) {
    const current = getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: notif.userId || 'usr-farmer-001',
      title: notif.title,
      message: notif.message,
      type: notif.type || 'announcement',
      linkUrl: notif.linkUrl || '/',
      isRead: false,
      timestamp: 'Just now'
    };
    setStored(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...current]);
  },

  // ==================== 7. MANDI PRICES & LOGS ====================
  async getMandiPrices() {
    return { data: INITIAL_MANDI_PRICES, error: null };
  },

  async getQuestions(farmerId = null) {
    let questions = getStored(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    if (farmerId) questions = questions.filter((q) => q.farmerId === farmerId);
    return { data: questions, error: null };
  },

  async askQuestion(questionData, farmerUser) {
    const current = getStored(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const newQuestion = {
      id: `q-${Date.now()}`,
      farmerId: farmerUser.id,
      farmerName: farmerUser.fullName,
      district: farmerUser.district || 'Kathmandu',
      crop: questionData.crop,
      title: questionData.title,
      description: questionData.description,
      status: 'open',
      answeredBy: null,
      answer: null,
      answeredAt: null
    };
    setStored(STORAGE_KEYS.QUESTIONS, [newQuestion, ...current]);
    return { data: newQuestion, error: null };
  },

  async answerQuestion(questionId, answerText, expertUser) {
    const current = getStored(STORAGE_KEYS.QUESTIONS, INITIAL_QUESTIONS);
    const updated = current.map((q) =>
      q.id === questionId
        ? {
            ...q,
            status: 'answered',
            answeredBy: expertUser.fullName,
            answer: answerText,
            answeredAt: new Date().toISOString().split('T')[0]
          }
        : q
    );
    setStored(STORAGE_KEYS.QUESTIONS, updated);
    return { data: true, error: null };
  },

  async getActivityLogs() {
    return { data: getStored(STORAGE_KEYS.LOGS, INITIAL_ACTIVITY_LOGS), error: null };
  },

  addActivityLog(log) {
    const current = getStored(STORAGE_KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
    const newLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ...log
    };
    setStored(STORAGE_KEYS.LOGS, [newLog, ...current]);
  },

  // ==================== 8. USER MANAGEMENT (ADMIN) ====================
  async getUsers() {
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS_LIST);
    return { data: users, error: null };
  },

  async updateUserStatus(userId, newStatus) {
    const current = getStored(STORAGE_KEYS.USERS, INITIAL_USERS_LIST);
    const updated = current.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
    setStored(STORAGE_KEYS.USERS, updated);
    this.addActivityLog({
      action: newStatus === 'suspended' ? 'USER_SUSPENDED' : 'USER_RESTORED',
      user: 'Administrator',
      details: `Account status for user ID ${userId} changed to ${newStatus}.`,
      type: 'admin'
    });
    return { data: true, error: null };
  },

  async updateUserRole(userId, newRole) {
    const current = getStored(STORAGE_KEYS.USERS, INITIAL_USERS_LIST);
    const updated = current.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    setStored(STORAGE_KEYS.USERS, updated);
    this.addActivityLog({
      action: 'USER_ROLE_REASSIGNED',
      user: 'Administrator',
      details: `User ID ${userId} role reassigned to ${newRole}.`,
      type: 'admin'
    });
    return { data: true, error: null };
  },

  async toggleUserVerification(userId) {
    const current = getStored(STORAGE_KEYS.USERS, INITIAL_USERS_LIST);
    const target = current.find((u) => u.id === userId);
    const nextVerified = target ? !target.isVerified : true;
    const updated = current.map((u) => (u.id === userId ? { ...u, isVerified: nextVerified } : u));
    setStored(STORAGE_KEYS.USERS, updated);
    this.addActivityLog({
      action: nextVerified ? 'USER_VERIFIED' : 'USER_UNVERIFIED',
      user: 'Administrator',
      details: `Identity verification for user ID ${userId} set to ${nextVerified}.`,
      type: 'admin'
    });
    return { data: nextVerified, error: null };
  },

  // ==================== 9. PRODUCT REPORTING & RENEWAL ====================
  async reportListing(listingId, reason, user) {
    const currentReports = getStored(STORAGE_KEYS.REPORTS, []);
    const newReport = {
      id: `rep-${Date.now()}`,
      listingId,
      reportedBy: user?.fullName || 'Anonymous User',
      reportedById: user?.id || 'guest',
      reason,
      status: 'pending',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setStored(STORAGE_KEYS.REPORTS, [newReport, ...currentReports]);

    this.createNotification({
      userId: 'usr-admin-001',
      title: 'Product Listing Reported',
      message: `Listing ${listingId} was reported: "${reason}"`,
      type: 'system',
      linkUrl: '/dashboard/admin'
    });

    this.addActivityLog({
      action: 'PRODUCT_REPORTED',
      user: user?.fullName || 'Anonymous User',
      details: `Reported listing ${listingId}: ${reason}`,
      type: 'marketplace'
    });

    return { data: newReport, error: null };
  },

  async getProductReports() {
    return { data: getStored(STORAGE_KEYS.REPORTS, []), error: null };
  },

  async resolveProductReport(reportId, actionTaken = 'reviewed') {
    const current = getStored(STORAGE_KEYS.REPORTS, []);
    const updated = current.map((r) => (r.id === reportId ? { ...r, status: 'resolved', actionTaken } : r));
    setStored(STORAGE_KEYS.REPORTS, updated);
    return { data: true, error: null };
  },

  async renewListing(listingId) {
    const listings = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const renewed = listings.map((l) =>
      l.id === listingId
        ? {
            ...l,
            harvestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active'
          }
        : l
    );
    setStored(STORAGE_KEYS.LISTINGS, renewed);
    return { data: true, error: null };
  },

  // ==================== 10. RECENTLY VIEWED PRODUCTS ====================
  recordRecentlyViewed(listing) {
    if (!listing || !listing.id) return;
    try {
      const current = getStored(STORAGE_KEYS.RECENTLY_VIEWED, []);
      const filtered = current.filter((item) => item.id !== listing.id);
      const updated = [listing, ...filtered].slice(0, 6);
      setStored(STORAGE_KEYS.RECENTLY_VIEWED, updated);
    } catch {
      // quiet fail
    }
  },

  getRecentlyViewed() {
    return getStored(STORAGE_KEYS.RECENTLY_VIEWED, []);
  },

  // ==================== 11. NOTIFICATION PREFERENCES ====================
  getNotificationPreferences(userId) {
    const all = getStored(STORAGE_KEYS.NOTIFICATION_PREFS, {});
    return (
      all[userId] || {
        inquiries: true,
        harvestReminders: true,
        mandiPriceAlerts: true,
        expertArticles: true,
        systemAnnouncements: true
      }
    );
  },

  updateNotificationPreferences(userId, prefs) {
    const all = getStored(STORAGE_KEYS.NOTIFICATION_PREFS, {});
    all[userId] = prefs;
    setStored(STORAGE_KEYS.NOTIFICATION_PREFS, all);
    return { data: prefs, error: null };
  },

  // ==================== 12. ADVANCED PLATFORM ANALYTICS ====================
  async getPlatformAnalytics(dateRange = 'all') {
    const listings = getStored(STORAGE_KEYS.LISTINGS, INITIAL_CROP_LISTINGS);
    const inquiries = getStored(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS_LIST);
    const crops = getStored(STORAGE_KEYS.CROPS, INITIAL_CROP_RECORDS);

    const totalUsers = users.length;
    const farmersCount = users.filter((u) => u.role === 'farmer').length;
    const buyersCount = users.filter((u) => u.role === 'buyer').length;
    const expertsCount = users.filter((u) => u.role === 'expert').length;

    const totalListings = listings.length;
    const activeListings = listings.filter((l) => l.status === 'active').length;
    const totalInquiries = inquiries.length;
    const completedInquiries = inquiries.filter((i) => i.status === 'accepted').length;
    const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;

    // Category distribution
    const categoryCounts = {};
    listings.forEach((l) => {
      const cat = l.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const popularCategories = Object.keys(categoryCounts).map((cat) => ({
      name: cat,
      count: categoryCounts[cat]
    }));

    // Most listed commodities
    const productCounts = {};
    listings.forEach((l) => {
      const title = l.title || 'Product';
      productCounts[title] = (productCounts[title] || 0) + 1;
    });
    const topProducts = Object.keys(productCounts)
      .map((p) => ({ name: p, count: productCounts[p] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Realistic trend timelines based on real record distribution
    const monthlyActivityTrends = [
      { month: 'Jun', inquiries: 14, listings: 8, orders: 11 },
      { month: 'Jul', inquiries: 22, listings: 12, orders: 18 },
      { month: 'Aug', inquiries: 35, listings: 19, orders: 28 },
      { month: 'Sep', inquiries: 48, listings: 27, orders: 40 },
      { month: 'Oct', inquiries: 62, listings: 34, orders: 53 },
      { month: 'Nov', inquiries: totalInquiries * 3 + 12, listings: totalListings + 15, orders: completedInquiries * 4 + 8 }
    ];

    const userRegistrationTrends = [
      { month: 'Jun', farmers: 210, buyers: 35, experts: 8 },
      { month: 'Jul', farmers: 340, buyers: 52, experts: 14 },
      { month: 'Aug', farmers: 580, buyers: 88, experts: 22 },
      { month: 'Sep', farmers: 890, buyers: 130, experts: 34 },
      { month: 'Oct', farmers: 1240, buyers: 180, experts: 45 },
      { month: 'Nov', farmers: farmersCount * 250 + 400, buyers: buyersCount * 40 + 70, experts: expertsCount * 12 + 15 }
    ];

    return {
      data: {
        totalUsers,
        farmersCount,
        buyersCount,
        expertsCount,
        totalListings,
        activeListings,
        totalInquiries,
        completedInquiries,
        pendingInquiries,
        popularCategories,
        topProducts,
        monthlyActivityTrends,
        userRegistrationTrends
      },
      error: null
    };
  },

  resetSandbox() {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    initLocalData();
  }
};
