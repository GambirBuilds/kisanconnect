import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  CloudSun,
  Droplets,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  Trash2,
  Wind,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { api } from '../../services/api.js';
import { weatherService } from '../../services/weatherService.js';
import { NEPAL_DISTRICTS } from '../../utils/nepalData.js';

// Documented agricultural crop knowledge based on NARC & Ministry of Agriculture & Livestock Development (MoALD)
const CROP_ADVISORIES = [
  {
    id: 'crop-tomato',
    name: 'Tomato (गोलभेंडा - Srijana / Samjhana)',
    category: 'Solanaceous Vegetable',
    season: 'Autumn-Winter & Spring Tunnel',
    elevation: 'Mid-Hills (800m - 1,800m) & Terai Winter',
    soilRequirement: 'Well-drained sandy loam with pH 6.0 – 6.8; high organic carbon (> 2.5%).',
    spacing: 'Row-to-row: 60 cm | Plant-to-plant: 45 cm (Staked with bamboo / trellis).',
    nutrition: 'Basal: 15-20 MT FYM/ha + 60 kg N, 80 kg P2O5, 60 kg K2O. Top-dress 30 kg N at flowering & fruit setting.',
    criticalIrrigation: 'Flowering initiation, fruit set, and active fruit enlargement. Avoid overhead wetting to minimize blight.',
    majorPestsDiseases: [
      {
        name: 'Late Blight (Phytophthora infestans)',
        symptoms: 'Water-soaked irregular lesions on leaves with white fungal down on undersides during cool, damp fog.',
        management: 'Improve greenhouse ventilation. Avoid evening irrigation. Preventive spray of Mancozeb 75% WP @ 2.5g/L; if disease appears, Metalaxyl 8% + Mancozeb 64% @ 2g/L.'
      },
      {
        name: 'Tomato Leafminer (Tuta absoluta)',
        symptoms: 'Transparent blotch mines on leaf parenchyma and black pinholes in green fruits.',
        management: 'Install delta sex pheromone traps (16 traps/ha). Spray Bacillus thuringiensis (Bt) @ 2g/L or Spinosad 45% SC @ 0.3ml/L.'
      }
    ],
    harvestingProtocol: 'Harvest at breaker or pink stage for long-distance mandi transport (Kalimati/Birtamod); red-ripe for local consumption.'
  },
  {
    id: 'crop-cauliflower',
    name: 'Cauliflower (काउली - Snowball / Silver Cup)',
    category: 'Cole Crop',
    season: 'Winter & Early Spring (Mid-hills autumn)',
    elevation: 'Terai to High Hills (300m - 2,200m)',
    soilRequirement: 'Deep, moisture-retentive loamy soils with pH 6.0 - 7.0. Sensitive to boron and molybdenum deficiency.',
    spacing: 'Early varieties: 45 x 45 cm | Late Snowball: 60 x 45 cm.',
    nutrition: 'Basal FYM 20 MT/ha. NPK 120:80:60 kg/ha. Apply Borax @ 10-15 kg/ha in boron-deficient red soils.',
    criticalIrrigation: 'Curd initiation and curd enlargement. Drought stress at button stage causes premature button curds.',
    majorPestsDiseases: [
      {
        name: 'Diamondback Moth (Plutella xylostella)',
        symptoms: 'Windowpaning holes on outer leaves; small green larvae wriggling backwards when disturbed.',
        management: 'Trap cropping with mustard rows. Neem Seed Kernel Extract (NSKE 5%) spray. Pheromone monitoring.'
      },
      {
        name: 'Clubroot (Plasmodiophora brassicae)',
        symptoms: 'Spindle-shaped galling of roots in acidic soils, causing daytime wilting.',
        management: 'Incorporate agricultural limestone (Chun) @ 2-4 MT/ha 3 weeks before transplanting to raise pH above 7.0.'
      }
    ],
    harvestingProtocol: 'Harvest while curds are compact, pure white, and crisp. Leave 2-3 jacket leaves attached for mechanical protection.'
  },
  {
    id: 'crop-paddy',
    name: 'Paddy / Rice (धान - Sabitri / Radha-4 / Pokhareli Jethobudo)',
    category: 'Cereal Grain',
    season: 'Kharif (Monsoon)',
    elevation: 'Terai (60m) to High altitude Jumli Marshi (2,400m)',
    soilRequirement: 'Heavy clay or clay-loam capable of retaining standing water; pH 5.5 - 7.0.',
    spacing: '20 x 15 cm or 20 x 20 cm with 2-3 seedlings per hill (21-25 day old seedlings).',
    nutrition: 'NPK 100:40:30 kg/ha for improved varieties. Split Nitrogen: 50% basal, 25% active tillering, 25% panicle initiation.',
    criticalIrrigation: 'Tillering, panicle emergence, and milk dough stage. Maintain 3-5 cm water depth during panicle initiation.',
    majorPestsDiseases: [
      {
        name: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
        symptoms: 'Wavy greenish-yellow stripes starting from leaf tips and margins with milky bacterial ooze.',
        management: 'Avoid excess split urea. Drain field temporarily. Apply Copper Hydroxide @ 2g/L.'
      },
      {
        name: 'Rice Stem Borer (Scirpophaga incertulas)',
        symptoms: 'Deadhearts during vegetative stage; whiteheads with empty chaffy grains during panicle stage.',
        management: 'Clip seedling tips before transplanting to destroy egg masses. Release Trichogramma parasitoids.'
      }
    ],
    harvestingProtocol: 'Harvest when 85% of panicles turn golden-yellow and grain moisture drops to 20-22%. Dry thoroughly to 14% for storage.'
  },
  {
    id: 'crop-potato',
    name: 'Potato (आलु - Cardinal / Janak Dev / Kufri Jyoti)',
    category: 'Tuber Crop',
    season: 'Autumn-Winter in Terai; Summer in High Hills',
    elevation: 'Terai plains up to 3,000m trans-Himalayan valleys',
    soilRequirement: 'Loose, friable sandy loam rich in humus; pH 5.2 - 6.5. Avoid alkaline soil to curb Common Scab.',
    spacing: 'Row-to-row: 60 cm | Tuber-to-tuber: 25 cm (Plant whole disease-free certified seed tubers 40-50g).',
    nutrition: 'Basal FYM 25 MT/ha. NPK 100:100:60 kg/ha. Full P and K at planting; half N at planting, half at earthing up.',
    criticalIrrigation: 'Stolon emergence, tuber initiation (30-40 DAP), and rapid tuber bulking. Uneven watering causes tuber cracking.',
    majorPestsDiseases: [
      {
        name: 'Late Blight (Phytophthora infestans)',
        symptoms: 'Rapid water-soaked leaf decay spreading in cool humid fog across Solukhumbu, Kavre, and Palpa.',
        management: 'Prophylactic spray of Mancozeb 75% WP @ 2.5g/L before fog canopy settles. Certified disease-free seed.'
      },
      {
        name: 'Potato Tuber Moth (Phthorimaea operculella)',
        symptoms: 'Mines in storage tubers with brownish frass around eyes.',
        management: 'Perform deep earthing up (10-15 cm) in field. Store tubers with dry Apatite/Lantana camara leaf layers.'
      }
    ],
    harvestingProtocol: 'Dehaulm (cut foliage) 10-14 days before harvest to harden tuber skin. Harvest on a dry sunny morning and cure in shade.'
  },
  {
    id: 'crop-maize',
    name: 'Maize (मकै - Rampur Composite / Deuti / Arun-2)',
    category: 'Cereal Crop',
    season: 'Spring (Chaitra) & Summer (Jestha/Ashadh)',
    elevation: 'Terai to High Hills (up to 2,000m)',
    soilRequirement: 'Deep, fertile, well-drained loam with pH 6.0 – 7.5. Susceptible to waterlogging.',
    spacing: 'Row-to-row: 65 cm | Plant-to-plant: 25 cm (Single healthy plant per hill).',
    nutrition: 'Basal FYM 15 MT/ha. NPK 120:60:40 kg/ha. Top-dress Nitrogen in equal splits: knee-high (V6) and tasseling.',
    criticalIrrigation: 'Knee-high vegetative phase (45 DAS) and silking/tasseling. Moisture stress at silking slashes grain yield by 50%.',
    majorPestsDiseases: [
      {
        name: 'Fall Armyworm (Spodoptera frugiperda)',
        symptoms: 'Shot-hole windowing in central whorls packed with coarse sawdust-like frass.',
        management: 'Handpick egg masses. Apply 5% Neem Seed Kernel Extract (NSKE) or fine river sand mixed with ash into whorls.'
      },
      {
        name: 'Turcicum Leaf Blight (Exserohilum turcicum)',
        symptoms: 'Long elliptical grayish-green or tan lesions on lower leaves merging to cause premature drying.',
        management: 'Plant certified resistant varieties (Deuti/Shitala). Spray Mancozeb @ 2.5g/L at first appearance.'
      }
    ],
    harvestingProtocol: 'Harvest when husks turn papery dry and a black layer forms at the grain attachment base. Shell at 13-14% moisture.'
  }
];

// Seasonal Crop Cycle across Nepal Calendar (विक्रम संवत्)
const SEASONAL_CALENDAR = [
  {
    season: 'Spring / Basanta (फागुन – वैशाख | Mid Feb – Mid May)',
    description: 'Soil warms up across mid-hills and Terai. Crucial window for Spring Maize, cucurbits, and summer nursery.',
    keyCrops: ['Spring Maize (चैते मकै)', 'Bitter Gourd & Cucumber (करेला/काँक्रो)', 'Early Okra (भिण्डी)', 'Chaitay Paddy (चैते धान)'],
    actionItems: [
      'Pre-monsoon land preparation and deep plowing to expose resting soil grubs.',
      'Construct nursery poly-tunnels in mid-hills for tomato and capsicum seedlings.',
      'Check irrigation channel flow from Kulo before dry Chaitra winds intensify.'
    ]
  },
  {
    season: 'Monsoon / Barsha (जेठ – साउन | Mid May – Mid Aug)',
    description: 'Major Kharif season driven by south-west monsoon rains. Peak transplantation period for main-season paddy.',
    keyCrops: ['Monsoon Paddy (वर्षे धान)', 'Finger Millet (कोदो)', 'Soybean (भटमास)', 'Rainy Season Cabbage'],
    actionItems: [
      'Puddle paddy terraces thoroughly and level properly to conserve water depth.',
      'Transplant 21-25 day old paddy seedlings (2-3 seedlings per hill).',
      'Ensure terrace drain outlets (Bhal) are cleared to prevent slope landslides in hill districts.'
    ]
  },
  {
    season: 'Autumn / Sharad (भदौ – कात्तिक | Mid Aug – Mid Nov)',
    description: 'Post-monsoon harvest of maize and millet; nursery preparation for commercial winter cole crops and potatoes.',
    keyCrops: ['Cauliflower & Cabbage (काउली/बन्दा)', 'Autumn Potato (आलु)', 'Mustard (तोरि)', 'Radish & Carrot (मुला/गाजर)'],
    actionItems: [
      'Prepare elevated seedbeds (15 cm high) for cauliflower nurseries to evade damp damping-off.',
      'Harvest maize when black layer matures and sun-dry cobs under covered eaves.',
      'Broadcast agricultural limestone (Chun) on acidic terraced plots 3-4 weeks prior to potato planting.'
    ]
  },
  {
    season: 'Winter / Hemanta & Shishir (मंसिर – माघ | Mid Nov – Mid Feb)',
    description: 'Cool, dry weather across Nepal. Optimal time for wheat, winter pulses (lentil), and protected vegetable tunnels.',
    keyCrops: ['Wheat (गहुँ - WK 1204 / Vijay)', 'Lentil (मुसुरो)', 'Off-Season Polyhouse Tomato', 'Onion & Garlic (प्याज/लसुन)'],
    actionItems: [
      'Sow wheat at optimal depth (4-5 cm) following paddy harvest before December 15.',
      'Deploy protective smoke smudging or plastic mulching during frost nights in Terai/Mid-hill river basins.',
      'Practice zero-tillage lentil broadcasting into standing paddy stubbles in Terai.'
    ]
  }
];

// Frequently Asked Questions on Nepal Agricultural Systems
const AGRI_FAQS = [
  {
    q: 'How can a farmer get soil tested in Nepal, and which parameters are checked?',
    a: 'Farmers can submit composite soil samples to the Central Agricultural Laboratory (Hariharbhawan, Lalitpur), Regional Agricultural Research Stations (NARC Tarahara, Lumle, Parwanipur, Nepalgunj), or District Agriculture Knowledge Centers (Krishi Gyan Kendra). Standard tests evaluate Soil pH, Organic Matter (OM %), Available Nitrogen (N), Available Phosphorus (P2O5), and Available Potassium (K2O).'
  },
  {
    q: 'What is the government subsidy on Crop & Livestock Insurance (कृषि तथा पशुपन्छी बिमा) in Nepal?',
    a: 'Under the Nepal Insurance Authority (Bima Samiti) and Ministry of Agriculture directives, the Government of Nepal provides an 80% premium subsidy on registered crop and livestock insurance policies. Farmers only contribute 20% of the premium. Policies protect against hail, floods, drought, pest epidemics, and unseasonal storms.'
  },
  {
    q: 'How does the Prime Minister Agriculture Modernization Project (PMAMP) categorize farming areas?',
    a: 'PMAMP categorizes agricultural production clusters into four hierarchical scales: Pockets (साना पकेट: minimum 10 ha, local ward level), Blocks (ब्लक: minimum 50 ha in hills, 100 ha in Terai), Zones (जोन: minimum 500 ha), and Super Zones (सुपर जोन: minimum 1,000 ha commercial commodity clusters like Jhapa Paddy or Dang Maize).'
  },
  {
    q: 'How should Agricultural Lime (कृषि चुन) be applied to acidic red soils (रातो माटो)?',
    a: 'Agricultural lime (Calcium carbonate) should be broadcasted at 2 to 4 Metric Tons per hectare (approx. 100-200 kg per Ropani) based on soil test pH. It must be mixed thoroughly into topsoil 20 to 30 days before sowing seeds, allowing moisture to activate chemical neutralization before fertilizer is applied.'
  }
];

export default function FarmingAssistantPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [selectedCropId, setSelectedCropId] = useState('crop-tomato');
  const [selectedDistrict, setSelectedDistrict] = useState('Kathmandu');
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Reminders list
  const [reminders, setReminders] = useState([
    {
      id: 'rem-1',
      title: 'Top-dress Urea for Spring Cauliflower',
      crop: 'Cauliflower',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isDone: false,
      priority: 'high'
    },
    {
      id: 'rem-2',
      title: 'Check delta pheromone traps for Tuta absoluta',
      crop: 'Tomato',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isDone: false,
      priority: 'medium'
    },
    {
      id: 'rem-3',
      title: 'Broadcasting Agricultural Lime in North Plot',
      crop: 'Soil Management',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isDone: true,
      priority: 'low'
    }
  ]);

  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderCrop, setNewReminderCrop] = useState('Tomato');
  const [newReminderDate, setNewReminderDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [newReminderPriority, setNewReminderPriority] = useState('medium');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);

  useEffect(() => {
    loadDistrictWeather();
  }, [selectedDistrict]);

  const loadDistrictWeather = async () => {
    setWeatherLoading(true);
    const res = await weatherService.getForecastForDistrict(selectedDistrict);
    if (res.data) {
      setWeatherData(res.data);
    }
    setWeatherLoading(false);
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    const reminder = {
      id: `rem-${Date.now()}`,
      title: newReminderTitle.trim(),
      crop: newReminderCrop,
      dueDate: newReminderDate,
      isDone: false,
      priority: newReminderPriority
    };

    setReminders([reminder, ...reminders]);
    setNewReminderTitle('');
    setShowAddReminderModal(false);
    toast.success('Crop activity reminder created successfully!');
  };

  const handleToggleReminderDone = (id) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isDone: !r.isDone } : r))
    );
    toast.info('Reminder status updated.');
  };

  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast.info('Reminder removed.');
  };

  const activeCrop = CROP_ADVISORIES.find((c) => c.id === selectedCropId) || CROP_ADVISORIES[0];

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-br from-[#14532D] via-emerald-900 to-[#102a1c] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full border border-emerald-700">
                Scientific Agriculture Intelligence • नेपाल
              </span>
              <span className="text-xs text-emerald-300 font-medium hidden sm:inline">
                NARC & MoALD Grounded
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Smart Agricultural Assistance & Crop Stewardship
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Access documented seasonal cropping guidelines, soil fertility management protocols, pest mitigation practices, and localized weather-driven field advisories designed specifically for Nepal's agro-ecological zones.
            </p>
          </div>
        </div>

        {/* Scientific & Professional Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-950">
              Professional Agricultural Advisory Notice
            </p>
            <p className="leading-relaxed opacity-90">
              All recommendations provided on KisanConnect are derived from documented research by the Nepal Agricultural Research Council (NARC) and the Ministry of Agriculture & Livestock Development (MoALD). We do not provide unverified automated chemical prescriptions. Always inspect field conditions directly and consult your local Ward Agricultural Extension Officer (कृषि प्राविधिक) or certified plant doctor before applying registered crop protection chemicals.
            </p>
          </div>
        </div>

        {/* Section 1: Weather-Driven Field Suggestions & Spray Index */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-gray-900">
                  Real-Time Weather Suggestions for Field Operations
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Localized Open-Meteo telemetry matched with agronomic spraying, drying, and irrigation criteria
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label htmlFor="assistantDistrict" className="text-xs font-semibold text-gray-600">
                Select District:
              </label>
              <select
                id="assistantDistrict"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs font-semibold bg-gray-50 border border-gray-300 rounded-xl px-3 py-1.5 text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              >
                {NEPAL_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {weatherLoading ? (
            <div className="p-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
              <span>Fetching live agricultural weather telemetry...</span>
            </div>
          ) : weatherData ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Current Condition</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <p className="text-lg font-black text-gray-900">{weatherData.conditionText}</p>
                <p className="text-2xl font-black text-emerald-800 mt-1">
                  {weatherData.temperature}°C
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-600 mt-2 pt-2 border-t border-gray-200">
                  <span>Rain: {weatherData.rainProb}%</span>
                  <span>Wind: {weatherData.windSpeed} km/h</span>
                </div>
              </div>

              {/* Spray Advisory */}
              <div className={`p-4 rounded-xl border ${
                weatherData.advisories?.spray?.favorable
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Chemical / Organic Spray Window</span>
                  <Wind className="w-4 h-4" />
                </div>
                <p className="text-sm font-black mt-1">
                  {weatherData.advisories?.spray?.favorable ? '✓ Favorable Spray Window' : '⚠️ Postpone Spraying'}
                </p>
                <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                  {weatherData.advisories?.spray?.tip}
                </p>
              </div>

              {/* Irrigation Advisory */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-950">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Irrigation Scheduling</span>
                  <Droplets className="w-4 h-4 text-blue-700" />
                </div>
                <p className="text-sm font-black mt-1">
                  {weatherData.advisories?.irrigation?.necessity}
                </p>
                <p className="text-[11px] mt-1 leading-relaxed text-blue-900/90">
                  {weatherData.advisories?.irrigation?.tip}
                </p>
              </div>

              {/* Sun-Drying & Curing Index */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-amber-950">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Grain Drying & Sun Curing</span>
                  <Sun className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm font-black mt-1">
                  {weatherData.advisories?.drying?.status}
                </p>
                <p className="text-[11px] mt-1 leading-relaxed text-amber-900/90">
                  {weatherData.advisories?.drying?.tip}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Weather data currently unavailable.</p>
          )}
        </div>

        {/* Section 2: Crop-Specific Educational Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Crop Selector Left Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 px-2 mb-2">
              Major Cultivated Crops
            </h3>
            {CROP_ADVISORIES.map((crop) => (
              <button
                key={crop.id}
                onClick={() => setSelectedCropId(crop.id)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between ${
                  selectedCropId === crop.id
                    ? 'bg-[#14532D] text-white shadow-xs'
                    : 'hover:bg-emerald-50/70 text-gray-800'
                }`}
              >
                <div>
                  <p className="text-xs font-bold">{crop.name}</p>
                  <p className={`text-[11px] ${selectedCropId === crop.id ? 'text-emerald-200' : 'text-gray-500'}`}>
                    {crop.category} • {crop.season}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedCropId === crop.id ? 'text-emerald-300' : 'text-gray-400'}`} />
              </button>
            ))}

            <div className="pt-3 border-t border-gray-100 text-center">
              <Link
                to="/knowledge-hub"
                className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Browse Full Knowledge Hub</span>
              </Link>
            </div>
          </div>

          {/* Crop Details Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black text-gray-900">{activeCrop.name}</h3>
                  <p className="text-xs text-gray-500">{activeCrop.category} • {activeCrop.elevation}</p>
                </div>
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  {activeCrop.season}
                </span>
              </div>
            </div>

            {/* Quick Specification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-700 block mb-1">Soil & pH Requirements</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">{activeCrop.soilRequirement}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-700 block mb-1">Spacing & Plant Density</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">{activeCrop.spacing}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-700 block mb-1">Balanced Nutrition (NPK & FYM)</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">{activeCrop.nutrition}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-700 block mb-1">Critical Irrigation Stages</span>
                <p className="text-gray-600 leading-relaxed text-[11px]">{activeCrop.criticalIrrigation}</p>
              </div>
            </div>

            {/* Major Pests & Diseases Management */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Integrated Pest & Disease Management (IPM)</span>
              </h4>
              <div className="space-y-3">
                {activeCrop.majorPestsDiseases.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200/80 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950">{item.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-700">
                      <strong className="text-gray-900">Symptoms:</strong> {item.symptoms}
                    </p>
                    <p className="text-[11px] text-emerald-900 pt-1 border-t border-emerald-100">
                      <strong className="text-emerald-950">Recommended Action:</strong> {item.management}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Harvesting & Post-Harvest */}
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <span className="font-bold text-gray-900 block mb-1">Harvesting Protocol & Market Preparation:</span>
              <p className="text-gray-700 text-[11px] leading-relaxed">{activeCrop.harvestingProtocol}</p>
            </div>
          </div>

        </div>

        {/* Section 3: Seasonal Farming Guides across Nepal Calendar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Nepali Agro-Climatic Seasonal Calendar (ऋतु तथा बाली चक्र)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Synchronized with Nepal's 4 primary farming seasons across Terai, Mid-Hills, and Valleys
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SEASONAL_CALENDAR.map((sc, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-900">{sc.season}</h3>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">{sc.description}</p>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1">
                    Key Crops in Field:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sc.keyCrops.map((c, cIdx) => (
                      <span key={cIdx} className="text-[10px] font-semibold bg-white border border-gray-300 text-gray-800 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-[10px] font-bold text-emerald-800 block mb-1">Key Field Priorities:</span>
                  <ul className="space-y-1 text-[11px] text-gray-600">
                    {sc.actionItems.map((act, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Interactive Crop Activity Reminders & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Crop Activity Reminders (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-700" />
                  <span>Crop Activity Reminders</span>
                </h3>
                <p className="text-xs text-gray-500">Track scheduled top-dressing, irrigation, and spray windows</p>
              </div>

              <button
                onClick={() => setShowAddReminderModal(true)}
                className="px-3 py-1.5 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Reminder</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  No active reminders scheduled. Add your first crop task above.
                </div>
              ) : (
                reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                      rem.isDone ? 'bg-gray-50/80 border-gray-200 opacity-60' : 'bg-white border-gray-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleReminderDone(rem.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          rem.isDone
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'border-gray-300 hover:border-emerald-600 bg-white'
                        }`}
                        title={rem.isDone ? 'Mark as incomplete' : 'Mark as done'}
                      >
                        {rem.isDone && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div>
                        <p className={`text-xs font-bold ${rem.isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {rem.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                          <span>{rem.crop}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            Due: {rem.dueDate}
                          </span>
                          <span>•</span>
                          <span className={`capitalize font-semibold ${
                            rem.priority === 'high' ? 'text-red-700' : rem.priority === 'medium' ? 'text-amber-700' : 'text-gray-600'
                          }`}>
                            {rem.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Frequently Asked Questions (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Frequently Asked Agricultural Questions</span>
              </h3>
              <p className="text-xs text-gray-500">Government programs, soil labs, and bima subsidies</p>
            </div>

            <div className="space-y-3">
              {AGRI_FAQS.map((faq, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1.5">
                  <p className="font-bold text-gray-900">{faq.q}</p>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">Add Crop Activity Reminder</h3>
              <button
                onClick={() => setShowAddReminderModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Activity Title / Description:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broadcast Zinc Sulphate (25 kg/ha) for Paddy"
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Crop:</label>
                  <input
                    type="text"
                    required
                    value={newReminderCrop}
                    onChange={(e) => setNewReminderCrop(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Target Date:</label>
                  <input
                    type="date"
                    required
                    value={newReminderDate}
                    onChange={(e) => setNewReminderDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Priority:</label>
                <select
                  value={newReminderPriority}
                  onChange={(e) => setNewReminderPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority (Urgent)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14532D] text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition"
                >
                  Save Reminder
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
