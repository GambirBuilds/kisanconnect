// Nepal Provinces and key agricultural districts
export const NEPAL_PROVINCES = [
  'Koshi Province',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province'
];

export const NEPAL_DISTRICTS = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Kavrepalanchok', 'Dhading', 'Nuwakot', 'Sindhupalchok',
  'Chitwan', 'Makwanpur', 'Morang', 'Sunsari', 'Jhapa', 'Ilam', 'Dhanusha', 'Parsa', 'Bara',
  'Kaski', 'Mustang', 'Gorkha', 'Tanahun', 'Rupandehi', 'Kapilvastu', 'Palpa', 'Dang',
  'Banke', 'Surkhet', 'Jumla', 'Kailali', 'Kanchanpur'
];

export const AGRICULTURAL_CATEGORIES = [
  { id: 'cat-1', name: 'Fresh Vegetables', nepali: 'ताजा तरकारी', icon: 'Carrot', count: 68 },
  { id: 'cat-2', name: 'Cereal & Grains', nepali: 'खाद्यान्न बाली', icon: 'Wheat', count: 42 },
  { id: 'cat-3', name: 'Fruits & Orchards', nepali: 'फलफूल बाली', icon: 'Apple', count: 35 },
  { id: 'cat-4', name: 'Pulses & Legumes', nepali: 'दलहन बाली', icon: 'Boxes', count: 21 },
  { id: 'cat-5', name: 'Cash Crops & Spices', nepali: 'नगदे तथा मसला', icon: 'Flame', count: 19 },
  { id: 'cat-6', name: 'Dairy & Livestock', nepali: 'पशुपालन तथा दुग्ध', icon: 'Milk', count: 27 },
];

export const KNOWLEDGE_HUB_CATEGORIES = [
  { id: 'all', name: 'All Guides (सबै विधा)' },
  { id: 'vegetable', name: 'Vegetable Farming' },
  { id: 'fruit', name: 'Fruit Farming' },
  { id: 'rice', name: 'Rice Cultivation' },
  { id: 'wheat', name: 'Wheat Cultivation' },
  { id: 'maize', name: 'Maize Cultivation' },
  { id: 'organic', name: 'Organic Farming' },
  { id: 'soil', name: 'Soil Management' },
  { id: 'irrigation', name: 'Irrigation & Water' },
  { id: 'pest', name: 'Pest & Disease Control' },
  { id: 'livestock', name: 'Livestock & Fodder' },
];

export const INITIAL_MANDI_PRICES = [
  {
    id: 'mp-1',
    commodity: 'Tomato Big (Nepali)',
    nepali: 'गोलभेंडा ठूलो (नेपाली)',
    category: 'Vegetables',
    market: 'Kalimati Fruits and Vegetable Market',
    district: 'Kathmandu',
    minPrice: 40,
    maxPrice: 50,
    avgPrice: 45,
    unit: 'Kg',
    date: '2026-11-02',
    source: 'Kalimati Fruits and Vegetable Market Development Board (KFVMDB)',
    trend: 'down',
  },
  {
    id: 'mp-2',
    commodity: 'Potato Red (Local)',
    nepali: 'रातो आलु (स्थानीय)',
    category: 'Vegetables',
    market: 'Kalimati Fruits and Vegetable Market',
    district: 'Kathmandu',
    minPrice: 55,
    maxPrice: 65,
    avgPrice: 60,
    unit: 'Kg',
    date: '2026-11-02',
    source: 'KFVMDB',
    trend: 'stable',
  },
  {
    id: 'mp-3',
    commodity: 'Large Cardamom (Alainchi - Ramsai)',
    nepali: 'अलैंची (रामसाई)',
    category: 'Cash Crops',
    market: 'Birtamod Agriculture Mandi',
    district: 'Jhapa',
    minPrice: 1900,
    maxPrice: 2150,
    avgPrice: 2025,
    unit: 'Kg',
    date: '2026-11-01',
    source: 'Nepal Cardamom Entrepreneurs Federation',
    trend: 'up',
  },
  {
    id: 'mp-4',
    commodity: 'Ginger (Fresh Adhuwa)',
    nepali: 'अदुवा (ताजा)',
    category: 'Spices',
    market: 'Palpa Agriculture Center',
    district: 'Palpa',
    minPrice: 110,
    maxPrice: 130,
    avgPrice: 120,
    unit: 'Kg',
    date: '2026-11-02',
    source: 'Regional Krishi Gyan Kendra',
    trend: 'up',
  },
  {
    id: 'mp-5',
    commodity: 'Mustang Royal Delicious Apple',
    nepali: 'मुस्ताङी स्याउ (रोयल)',
    category: 'Fruits',
    market: 'Pokhara Krishi Upaj Mandi',
    district: 'Kaski',
    minPrice: 160,
    maxPrice: 200,
    avgPrice: 180,
    unit: 'Kg',
    date: '2026-11-02',
    source: 'District Agriculture Office, Mustang',
    trend: 'stable',
  },
  {
    id: 'mp-6',
    commodity: 'Chitwan Maize (Hybrid Corn)',
    nepali: 'मकै (हाइब्रिड)',
    category: 'Grains',
    market: 'Bharatpur Wholesale Mandi',
    district: 'Chitwan',
    minPrice: 38,
    maxPrice: 42,
    avgPrice: 40,
    unit: 'Kg',
    date: '2026-11-01',
    source: 'Chitwan Chamber of Agri-Commerce',
    trend: 'down',
  },
];

// Predefined authentic seed accounts
export const DEMO_USERS = {
  farmer: {
    id: 'usr-farmer-001',
    email: 'ramesh.farmer@kisanconnect.np',
    fullName: 'Ramesh Bahadur Thapa',
    role: 'farmer',
    phone: '+977-9841234567',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    province: 'Bagmati Province',
    district: 'Kavrepalanchok',
    municipality: 'Panauti Municipality - Ward 4',
    farmName: 'Thapa Organic Vegetable Farm',
    farmSize: '12 Ropani',
    primaryCrops: ['Off-season Cauliflower', 'Red Potato', 'Capsicum'],
    farmingType: 'organic',
    irrigationSource: 'Boring & Rainwater Harvesting',
    kisanCardNumber: 'KCN-2081-KV-0941',
    isVerified: true,
    joinedDate: 'March 2025'
  },
  buyer: {
    id: 'usr-buyer-001',
    email: 'sita.agrotrade@kisanconnect.np',
    fullName: 'Sita Shrestha',
    role: 'buyer',
    phone: '+977-9851098765',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metro - Ward 14, Kalimati',
    companyName: 'Himalayan Fresh Wholesale Pvt. Ltd.',
    businessType: 'wholesaler',
    panVatNumber: '601928471',
    preferredCategories: ['Fresh Vegetables', 'Fruits & Orchards', 'Cereal & Grains'],
    annualDemand: '4,500 Quintals',
    isVerified: true,
    joinedDate: 'January 2025'
  },
  expert: {
    id: 'usr-expert-001',
    email: 'dr.anil.agronomist@kisanconnect.np',
    fullName: 'Dr. Anil Karki, Ph.D.',
    role: 'expert',
    phone: '+977-9842551122',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    province: 'Bagmati Province',
    district: 'Lalitpur',
    municipality: 'Godawari - Ward 3',
    designation: 'Senior Horticulture Scientist',
    specialization: 'Soil Health, Organic Pest Management & Cold Storage',
    institution: 'Nepal Agricultural Research Council (NARC)',
    licenseNumber: 'NEA-AG-4910',
    yearsOfExperience: 14,
    totalAnswers: 320,
    rating: 4.95,
    isVerified: true,
    joinedDate: 'October 2024'
  },
  admin: {
    id: 'usr-admin-001',
    email: 'admin@kisanconnect.np',
    fullName: 'KisanConnect Administrator',
    role: 'admin',
    phone: '+977-01-4433221',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    municipality: 'Babarmahal, Kathmandu',
    department: 'Platform Governance & Agritech Operations',
    isVerified: true,
    joinedDate: 'September 2024'
  }
};

export const INITIAL_USERS_LIST = [
  {
    id: 'usr-farmer-001',
    fullName: 'Ramesh Bahadur Thapa',
    email: 'ramesh.farmer@kisanconnect.np',
    role: 'farmer',
    district: 'Kavrepalanchok',
    province: 'Bagmati Province',
    phone: '+977-9841234567',
    status: 'active',
    isVerified: true,
    joinedDate: '2025-03-12',
    activityCount: 18
  },
  {
    id: 'usr-buyer-001',
    fullName: 'Sita Shrestha',
    email: 'sita.agrotrade@kisanconnect.np',
    role: 'buyer',
    district: 'Kathmandu',
    province: 'Bagmati Province',
    phone: '+977-9851098765',
    status: 'active',
    isVerified: true,
    joinedDate: '2025-01-20',
    activityCount: 24
  },
  {
    id: 'usr-expert-001',
    fullName: 'Dr. Anil Karki, Ph.D.',
    email: 'dr.anil.agronomist@kisanconnect.np',
    role: 'expert',
    district: 'Lalitpur',
    province: 'Bagmati Province',
    phone: '+977-9842551122',
    status: 'active',
    isVerified: true,
    joinedDate: '2024-10-15',
    activityCount: 42
  },
  {
    id: 'usr-farmer-002',
    fullName: 'Bhimsen Adhikari',
    email: 'bhimsen.dhading@kisanconnect.np',
    role: 'farmer',
    district: 'Dhading',
    province: 'Bagmati Province',
    phone: '+977-9841998877',
    status: 'active',
    isVerified: true,
    joinedDate: '2025-02-18',
    activityCount: 12
  },
  {
    id: 'usr-farmer-003',
    fullName: 'Hari Bahadur Karki',
    email: 'hari.jhapa@kisanconnect.np',
    role: 'farmer',
    district: 'Jhapa',
    province: 'Koshi Province',
    phone: '+977-9801234567',
    status: 'active',
    isVerified: false,
    joinedDate: '2025-04-05',
    activityCount: 7
  },
  {
    id: 'usr-buyer-002',
    fullName: 'Bikram Thapa (Everest Cold Stores)',
    email: 'bikram.everest@kisanconnect.np',
    role: 'buyer',
    district: 'Kaski',
    province: 'Gandaki Province',
    phone: '+977-9856012345',
    status: 'active',
    isVerified: true,
    joinedDate: '2025-02-01',
    activityCount: 19
  },
  {
    id: 'usr-expert-002',
    fullName: 'Sunita Adhikari',
    email: 'sunita.horticulture@kisanconnect.np',
    role: 'expert',
    district: 'Chitwan',
    province: 'Bagmati Province',
    phone: '+977-9845012345',
    status: 'active',
    isVerified: true,
    joinedDate: '2024-11-10',
    activityCount: 31
  },
  {
    id: 'usr-admin-001',
    fullName: 'KisanConnect Administrator',
    email: 'admin@kisanconnect.np',
    role: 'admin',
    district: 'Kathmandu',
    province: 'Bagmati Province',
    phone: '+977-01-4433221',
    status: 'active',
    isVerified: true,
    joinedDate: '2024-09-01',
    activityCount: 95
  }
];

export const INITIAL_CROP_LISTINGS = [
  {
    id: 'lst-101',
    farmerId: 'usr-farmer-001',
    farmerName: 'Ramesh Bahadur Thapa',
    farmerDistrict: 'Kavrepalanchok',
    farmerPhone: '+977-9841234567',
    title: 'Fresh Farm Cauliflower (Snowball Variety)',
    category: 'Fresh Vegetables',
    variety: 'Snowball 16',
    quality: 'grade_a_premium',
    quantity: 45,
    unit: 'Quintal',
    pricePerUnit: 35,
    currency: 'NPR/Kg',
    harvestDate: '2026-11-08',
    availabilityStatus: 'in_stock', // 'in_stock', 'forward_harvest', 'paused'
    status: 'active',
    isOrganic: true,
    description: 'Crisp, pest-free white cauliflowers grown using compost manure and neem oil sprays in Panauti valley.',
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-11-01'
  },
  {
    id: 'lst-102',
    farmerId: 'usr-farmer-002',
    farmerName: 'Birendra Chaudhary',
    farmerDistrict: 'Chitwan',
    farmerPhone: '+977-9845012345',
    title: 'Aromatic Basmati Paddy (Long Grain)',
    category: 'Cereal & Grains',
    variety: 'Kasturi Basmati',
    quality: 'grade_a_premium',
    quantity: 120,
    unit: 'Quintal',
    pricePerUnit: 5200,
    currency: 'NPR/Quintal',
    harvestDate: '2026-10-25',
    availabilityStatus: 'in_stock',
    status: 'active',
    isOrganic: false,
    description: 'Naturally dried paddy with 12% moisture content, stored in elevated ventilated silo in Madi, Chitwan.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-10-28'
  },
  {
    id: 'lst-103',
    farmerId: 'usr-farmer-003',
    farmerName: 'Tenzing Gurung',
    farmerDistrict: 'Mustang',
    farmerPhone: '+977-9846098765',
    title: 'High Altitude Crisp Red Apples',
    category: 'Fruits & Orchards',
    variety: 'Royal Delicious',
    quality: 'grade_a_premium',
    quantity: 80,
    unit: 'Box (20kg)',
    pricePerUnit: 3200,
    currency: 'NPR/Box',
    harvestDate: '2026-10-15',
    availabilityStatus: 'forward_harvest',
    status: 'active',
    isOrganic: true,
    description: 'Juicy, naturally sweet apples grown at 2,700m elevation in Marpha, Mustang without synthetic sprays.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-10-20'
  },
  {
    id: 'lst-104',
    farmerId: 'usr-farmer-001',
    farmerName: 'Ramesh Bahadur Thapa',
    farmerDistrict: 'Kavrepalanchok',
    farmerPhone: '+977-9841234567',
    title: 'Grade-A Local Red Potatoes',
    category: 'Fresh Vegetables',
    variety: 'Kufri Jyoti / Local Rato',
    quality: 'grade_b_standard',
    quantity: 90,
    unit: 'Sack (50kg)',
    pricePerUnit: 2600,
    currency: 'NPR/Sack',
    harvestDate: '2026-10-30',
    availabilityStatus: 'in_stock',
    status: 'active',
    isOrganic: true,
    description: 'Uniform size, firm texture red skin potatoes, ideal for wholesale distribution and cold stores.',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-10-30'
  }
];

export const INITIAL_INQUIRIES = [
  {
    id: 'inq-201',
    listingId: 'lst-101',
    listingTitle: 'Fresh Farm Cauliflower (Snowball Variety)',
    buyerId: 'usr-buyer-001',
    buyerName: 'Sita Shrestha',
    buyerCompany: 'Himalayan Fresh Wholesale Pvt. Ltd.',
    buyerPhone: '+977-9851098765',
    farmerId: 'usr-farmer-001',
    requestedQuantity: 30,
    unit: 'Quintal',
    offeredPrice: 33,
    currency: 'NPR/Kg',
    status: 'pending',
    message: 'We can collect from Panauti gate directly on Thursday. Please confirm if 33 NPR/Kg is acceptable for wholesale lot.',
    date: '2026-11-02',
    messages: [
      {
        id: 'msg-1',
        senderId: 'usr-buyer-001',
        senderName: 'Sita Shrestha',
        text: 'Hello Ramesh ji, we require 30 quintals for Kalimati wholesale delivery by Thursday morning. Is 33 NPR/kg acceptable for the whole lot?',
        time: '14:20, Nov 02'
      }
    ]
  },
  {
    id: 'inq-202',
    listingId: 'lst-104',
    listingTitle: 'Grade-A Local Red Potatoes',
    buyerId: 'usr-buyer-001',
    buyerName: 'Sita Shrestha',
    buyerCompany: 'Himalayan Fresh Wholesale Pvt. Ltd.',
    buyerPhone: '+977-9851098765',
    farmerId: 'usr-farmer-001',
    requestedQuantity: 50,
    unit: 'Sack',
    offeredPrice: 2550,
    currency: 'NPR/Sack',
    status: 'accepted',
    message: 'Quality verified via samples. Ready to dispatch pickup truck this weekend.',
    date: '2026-10-31',
    messages: [
      {
        id: 'msg-2',
        senderId: 'usr-buyer-001',
        senderName: 'Sita Shrestha',
        text: 'We are ready to take 50 sacks. Please confirm if packaging is double-stitched jute sacks.',
        time: '10:15, Oct 31'
      },
      {
        id: 'msg-3',
        senderId: 'usr-farmer-001',
        senderName: 'Ramesh Bahadur Thapa',
        text: 'Yes Sita ji, all 50 sacks are graded and stored in ventilated room. Pickup on Saturday morning is confirmed.',
        time: '12:30, Oct 31'
      }
    ]
  }
];

export const INITIAL_SAVED_PRODUCTS = [
  'lst-101',
  'lst-103'
];

export const INITIAL_CROP_RECORDS = [
  {
    id: 'cr-101',
    farmerId: 'usr-farmer-001',
    cropName: 'Snowball Cauliflower (काउली)',
    category: 'Vegetable Farming',
    variety: 'Snowball 16',
    fieldName: 'Terrace Plot A - North Slope',
    landArea: '5 Ropani',
    plantationDate: '2026-09-05',
    expectedHarvestDate: '2026-11-12',
    growthStage: 'fruiting_grain_filling', // 'sowing_germination', 'vegetative', 'flowering', 'fruiting_grain_filling', 'harvest_ready', 'harvested'
    expectedProductionQuantity: 55,
    productionUnit: 'Quintal',
    healthStatus: 'healthy',
    notes: 'Compost added at 200kg/ropani. Mulching completed with rice straw.',
    activities: [
      { id: 'act-1', date: '2026-09-05', type: 'plantation', details: 'Transplanted 3,200 healthy seedlings.' },
      { id: 'act-2', date: '2026-09-22', type: 'weeding', details: 'First manual hoeing and weeding across all 5 terraces.' },
      { id: 'act-3', date: '2026-10-10', type: 'fertilizer', details: 'Applied vermicompost and bio-slurry.' },
      { id: 'act-4', date: '2026-10-25', type: 'pest_spray', details: 'Neem-oil extract foliar spray for cabbage caterpillar.' }
    ]
  },
  {
    id: 'cr-102',
    farmerId: 'usr-farmer-001',
    cropName: 'Kufri Jyoti Red Potato (रातो आलु)',
    category: 'Vegetable Farming',
    variety: 'Kufri Jyoti',
    fieldName: 'Lower Terrace Plot 2',
    landArea: '4 Ropani',
    plantationDate: '2026-10-02',
    expectedHarvestDate: '2026-12-28',
    growthStage: 'vegetative',
    expectedProductionQuantity: 80,
    productionUnit: 'Quintal',
    healthStatus: 'healthy',
    notes: 'Pre-sprouted certified seed tubers used. Furrow irrigation scheduled bi-weekly.',
    activities: [
      { id: 'act-5', date: '2026-10-02', type: 'plantation', details: 'Planted 8 sacks of treated certified tuber seeds.' },
      { id: 'act-6', date: '2026-10-20', type: 'irrigation', details: 'Initial furrow watering after emergence.' }
    ]
  },
  {
    id: 'cr-103',
    farmerId: 'usr-farmer-001',
    cropName: 'Capsicum / Sweet Bell Pepper (भेडे खुर्सानी)',
    category: 'Vegetable Farming',
    variety: 'California Wonder Hybrid',
    fieldName: 'Polyhouse Shed 1',
    landArea: '2 Ropani',
    plantationDate: '2026-08-15',
    expectedHarvestDate: '2026-11-05',
    growthStage: 'harvest_ready',
    expectedProductionQuantity: 24,
    productionUnit: 'Quintal',
    healthStatus: 'healthy',
    notes: 'Greenhouse trellis training in place. Ready for first harvest flush.',
    activities: [
      { id: 'act-7', date: '2026-08-15', type: 'plantation', details: 'Drip lines connected and seedlings set.' },
      { id: 'act-8', date: '2026-09-30', type: 'pruning', details: 'Side sucker de-budding for large uniform fruit sizing.' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'usr-farmer-001',
    title: 'New Purchase Inquiry Received',
    message: 'Sita Shrestha from Himalayan Fresh Wholesale submitted an inquiry for 30 Quintals of Snowball Cauliflower at Rs. 33/Kg.',
    type: 'inquiry_received',
    linkUrl: '/dashboard/farmer',
    isRead: false,
    timestamp: '14:22, Today'
  },
  {
    id: 'notif-2',
    userId: 'usr-farmer-001',
    title: 'Crop Activity Reminder: Harvest Window Approaching',
    message: 'Your Polyhouse Capsicum is currently marked "Harvest Ready". Prepare crates and update marketplace availability.',
    type: 'harvest_due',
    linkUrl: '/dashboard/farmer',
    isRead: false,
    timestamp: '09:00, Today'
  },
  {
    id: 'notif-3',
    userId: 'usr-buyer-001',
    title: 'Proposal Accepted by Farmer',
    message: 'Ramesh Bahadur Thapa confirmed your purchase agreement for 50 Sacks of Local Red Potatoes.',
    type: 'inquiry_status_changed',
    linkUrl: '/dashboard/buyer',
    isRead: true,
    timestamp: 'Oct 31'
  },
  {
    id: 'notif-4',
    userId: 'usr-farmer-001',
    title: 'New Agronomy Guide Published',
    message: 'Dr. Anil Karki published: "Post-Harvest Spoilage Reduction using Brick Zero-Energy Cool Chambers".',
    type: 'new_article',
    linkUrl: '/knowledge-hub',
    isRead: true,
    timestamp: 'Oct 28'
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES = [
  {
    id: 'kh-1',
    title: 'Scientific Cultivation of Off-Season Cauliflower in Nepal’s Mid-Hills',
    slug: 'off-season-cauliflower-cultivation-mid-hills',
    category: 'Vegetable Farming',
    author: 'Dr. Anil Karki, Ph.D.',
    authorRole: 'Senior Agronomist, NARC',
    readTime: '6 min read',
    views: 1840,
    coverImage: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80',
    summary: 'A field blueprint for sowing varieties like Snow Mystique and Snowball 16 to capture high off-season festival prices in Kathmandu and Pokhara markets.',
    isScientificAdvisory: true,
    steps: [
      { step: 1, title: 'Nursery Bed Preparation', desc: 'Raise beds 15 cm above ground to prevent damping-off disease. Solarize nursery soil with transparent plastic for 2 weeks.' },
      { step: 2, title: 'Transplantation & Spacing', desc: 'Transplant 25-day-old vigorous seedlings at 60 cm row-to-row and 45 cm plant-to-plant spacing during cloudy evenings.' },
      { step: 3, title: 'Compost & Organic Nutrition', desc: 'Incorporate well-decomposed farmyard manure at 15-20 tons/hectare. Top-dress with wood ash and vermicompost.' },
      { step: 4, title: 'Blanching for Snow-White Curd', desc: 'Tie outer leaves over developing curds 5 days prior to harvest to prevent yellowing caused by direct solar UV rays.' }
    ],
    content: `Off-season cauliflower production offers some of the highest gross margins for terrace growers in Kavre, Dhading, Makwanpur, and Nuwakot.\n\nSoil Requirements: Well-drained sandy loam with soil pH between 6.0 and 6.8 is ideal. If soil pH is under 5.5, apply agricultural lime (Chun) at 200 kg/ropani at least 3 weeks before seedling transplantation.\n\nWater Management: Cole crops have shallow root systems sensitive to moisture stress during curd initiation. Drip irrigation or furrow watering every 4-5 days maintains optimal turgidity without fostering fungal foot rot.`
  },
  {
    id: 'kh-2',
    title: 'High-Density Royal Delicious Apple Orchard Management in Mustang',
    slug: 'high-density-apple-orchard-mustang',
    category: 'Fruit Farming',
    author: 'Pema Tenzing Lama',
    authorRole: 'Horticultural Specialist, Marpha Research Station',
    readTime: '7 min read',
    views: 1210,
    coverImage: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
    summary: 'Techniques for managing dwarf M9 and MM106 rootstocks in semi-arid Himalayan valleys at 2,400m to 2,800m elevation.',
    isScientificAdvisory: true,
    steps: [
      { step: 1, title: 'Rootstock & Spacing Selection', desc: 'Plant feathered maiden trees on M9 rootstock at 3.5m x 1.2m spacing supported by a 3-wire trellis.' },
      { step: 2, title: 'Winter Dormant Pruning', desc: 'Prune annually in January-February before bud-break to establish a spindle system and maximize light penetration.' },
      { step: 3, title: 'Pollination Ecology', desc: 'Interplant 15% Golden Delicious pollinators and maintain 3 Apis cerana beehives per hectare for uniform fruit set.' }
    ],
    content: `Mustang apples command a commanding premium across Nepal due to high diurnal temperature variation that enhances sugar concentration.\n\nFrost Protection: Late spring frost during bloom is the principal yield threat. Sprinkler irrigation operating throughout freezing night hours creates a protective ice layer that preserves blossoms at 0°C.`
  },
  {
    id: 'kh-3',
    title: 'Direct Seeded Rice (DSR) & System of Rice Intensification (SRI) for Terai',
    slug: 'dsr-sri-rice-cultivation-terai',
    category: 'Rice Cultivation',
    author: 'Kishor Chaudhary',
    authorRole: 'Rice Agronomist, Regional NARC Tarahara',
    readTime: '5 min read',
    views: 2310,
    coverImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    summary: 'Conserving up to 35% irrigation water and cutting labor costs in Morang, Jhapa, and Chitwan paddy ecosystems.',
    isScientificAdvisory: true,
    steps: [
      { step: 1, title: 'Laser Land Levelling', desc: 'Ensure zero-gradient field slope to prevent localized water pooling and weed flushes.' },
      { step: 2, title: 'Seed Priming with Bio-Fertilizer', desc: 'Soak seeds in water for 12 hours and inoculate with Azospirillum culture.' },
      { step: 3, title: 'Alternate Wetting & Drying (AWD)', desc: 'Install perforated PVC pani pipe in field to irrigate only when water table drops 15 cm below soil surface.' }
    ],
    content: `Paddy agriculture in Nepal faces acute labor shortages during peak transplanting seasons. Direct Seeded Rice (DSR) with pre-emergence pendimethalin reduces cultivation expenses by Rs. 8,000 per bigha while delivering comparable yields to puddled transplanted rice.`
  },
  {
    id: 'kh-4',
    title: 'Biological Control of Fall Armyworm (Spodoptera frugiperda) in Maize',
    slug: 'bio-control-fall-armyworm-maize',
    category: 'Maize Cultivation',
    author: 'Dr. Anil Karki, Ph.D.',
    authorRole: 'Senior Agronomist, NARC',
    readTime: '5 min read',
    views: 3100,
    coverImage: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
    summary: 'How to suppress voracious whorl-boring armyworms using pheromone traps, Trichogramma egg parasitoids, and botanical neem formulations.',
    isScientificAdvisory: true,
    steps: [
      { step: 1, title: 'Scout Early Whorls', desc: 'Inspect window-pane leaf feeding within 10 days of seedling emergence.' },
      { step: 2, title: 'Install Pheromone Lures', desc: 'Hang 4 funneled traps per hectare with Spodoptera lures at crop canopy level.' },
      { step: 3, title: 'Botanical Application', desc: 'Apply 5% Neem Seed Kernel Extract (NSKE) or Bacillus thuringiensis (Bt) directly into central whorls.' }
    ],
    content: `Chemical resistance develops rapidly when synthetic pyrethroids are sprayed repeatedly. Biological stewardship preserves predatory ground beetles and native earwigs that feed naturally on Fall Armyworm egg masses.`
  },
  {
    id: 'kh-5',
    title: 'Constructing Zero-Energy Cool Chambers (ZECC) for On-Farm Storage',
    slug: 'zero-energy-cool-chamber-on-farm-storage',
    category: 'Organic Farming',
    author: 'Sunita Adhikari',
    authorRole: 'Post-Harvest Specialist',
    readTime: '6 min read',
    views: 1980,
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    summary: 'A low-cost evaporative cool chamber built with local bricks and wet river sand that keeps vegetables fresh 8-12 days without electricity.',
    isScientificAdvisory: false,
    steps: [
      { step: 1, title: 'Brick Floor & Double Wall', desc: 'Construct a double-brick cavity wall leaving a 7.5 cm gap between inner and outer brick layers.' },
      { step: 2, title: 'Fill with River Sand', desc: 'Pack clean river sand into cavity wall and saturate with clean water twice daily.' },
      { step: 3, title: 'Thatch Shading Cover', desc: 'Erect an elevated bamboo thatch roof over the chamber to block direct sunlight while allowing ventilation.' }
    ],
    content: `Evaporative cooling works on the principle that when water evaporates, it draws heat from surrounding air. In Nepal mid-hills, a ZECC maintains inside temperatures 10-14°C lower than outdoor peak heat with relative humidity above 85%.`
  },
  {
    id: 'kh-6',
    title: 'Soil Acidity Reclamation & Integrated Soil Fertility in Hill Terraces',
    slug: 'soil-acidity-reclamation-hill-terraces',
    category: 'Soil Management',
    author: 'Dr. Hari Krishna Shrestha',
    authorRole: 'Soil Scientist, Former NARC Lead',
    readTime: '6 min read',
    views: 1450,
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    summary: 'Diagnosing aluminum toxicity in acidic red soils (Rato Mato) and deploying agricultural lime with green manure.',
    isScientificAdvisory: true,
    steps: [
      { step: 1, title: 'Soil pH Testing', desc: 'Collect composite core samples from 15 cm depth across terraced plots.' },
      { step: 2, title: 'Lime (Chun) Broadcasting', desc: 'Broadcast finely powdered agricultural limestone 20-30 days before sowing.' },
      { step: 3, title: 'Green Manuring with Dhaincha', desc: 'Incorporate Sesbania (Dhaincha) or Sunn hemp at 45 days of vegetative growth.' }
    ],
    content: `Continuous application of urea without balanced organic matter has caused soil pH across Kavre and Dhading to drop below 5.0. In acidic soil, phosphorus becomes insoluble. Liming restores nutrient availability and earthworm microbial activity.`
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'act-501',
    timestamp: '2026-11-02 18:42',
    action: 'CROP_LISTING_PUBLISHED',
    user: 'Ramesh Bahadur Thapa (Farmer)',
    details: 'Published 45 Quintals of Snowball Cauliflower in Kavrepalanchok.',
    type: 'listing'
  },
  {
    id: 'act-502',
    timestamp: '2026-11-02 19:15',
    action: 'INQUIRY_CREATED',
    user: 'Sita Shrestha (Buyer)',
    details: 'Sent purchase inquiry for 30 Quintals cauliflower at 33 NPR/Kg.',
    type: 'inquiry'
  },
  {
    id: 'act-503',
    timestamp: '2026-11-02 20:04',
    action: 'EXPERT_ADVISORY_POSTED',
    user: 'Dr. Anil Karki (Expert)',
    details: 'Answered pest query regarding Early Blight in Srijana Tomato.',
    type: 'advisory'
  },
  {
    id: 'act-504',
    timestamp: '2026-11-02 20:30',
    action: 'USER_VERIFIED',
    user: 'Admin Governance',
    details: 'Verified farmer identity and land registration for Ramesh Thapa.',
    type: 'admin'
  }
];

export const INITIAL_QUESTIONS = [
  {
    id: 'q-101',
    farmerId: 'usr-farmer-001',
    farmerName: 'Ramesh Bahadur Thapa',
    district: 'Kavrepalanchok',
    crop: 'Tomato (Srijana Hybrid)',
    title: 'Concentric brown rings and yellowing on lower leaves in plastic polyhouse',
    description: 'During nighttime moisture inside the polyhouse, lower leaves develop target-like concentric rings and drop off quickly. Is this Early Blight or Septoria?',
    status: 'answered',
    answeredBy: 'Dr. Anil Karki',
    answer: 'This is Alternaria solani (Early Blight), common when condensation drips onto foliage. Improve tunnel ventilation immediately. Prune diseased lower foliage with clean shears. Apply Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride @ 3 g/L with thorough undersurface coverage.',
    answeredAt: '2026-11-02'
  },
  {
    id: 'q-102',
    farmerId: 'usr-farmer-002',
    farmerName: 'Bhimsen Adhikari',
    district: 'Dhading',
    crop: 'Cauliflower (Snowball)',
    title: 'Seedling stem constriction near soil level causing collapse (Damping off)',
    description: 'Young nursery seedlings in seed trays develop water-soaked constriction at the soil line and fall over within 48 hours.',
    status: 'answered',
    answeredBy: 'Sunita Adhikari',
    answer: 'Classic Pythium damping-off aggravated by heavy seedbed watering. Drench the nursery bed with Trichoderma harzianum biofungicide or Metalaxyl + Mancozeb (Krilaxyl) @ 1.5 g/L. Elevate nursery trays off bare ground and avoid evening sprinkler irrigation.',
    answeredAt: '2026-11-01'
  },
  {
    id: 'q-103',
    farmerId: 'usr-farmer-001',
    farmerName: 'Ramesh Bahadur Thapa',
    district: 'Kavrepalanchok',
    crop: 'Spring Maize (Rampur Composite)',
    title: 'Optimal timing for second top-dressing of Urea in hill terrace maize',
    description: 'Our spring maize is currently at knee-high stage (V6). What is the exact moisture and soil condition required before broadcasting Urea?',
    status: 'open',
    answeredBy: null,
    answer: null,
    answeredAt: null
  }
];
