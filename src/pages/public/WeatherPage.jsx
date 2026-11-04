import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  ExternalLink,
  Info,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Snowflake,
  Sparkles,
  Sprout,
  Sun,
  SunMedium,
  Thermometer,
  Wind
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../../components/common/Footer.jsx';
import HonestyBanner from '../../components/common/HonestyBanner.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import { NEPAL_WEATHER_LOCATIONS, weatherService } from '../../services/weatherService.js';

export default function WeatherPage() {
  const [selectedLocationId, setSelectedLocationId] = useState('kavre');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather(selectedLocationId);
  }, [selectedLocationId]);

  const fetchWeather = async (locId) => {
    setLoading(true);
    const data = await weatherService.getForecast(locId);
    setWeatherData(data);
    setLoading(false);
  };

  const getWeatherIcon = (iconName, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'SunMedium':
        return <SunMedium className={`${className} text-amber-500`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'Cloud':
        return <Cloud className={`${className} text-gray-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-blue-400`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-indigo-500`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-gray-400`} />;
      case 'Snowflake':
        return <Snowflake className={`${className} text-cyan-400`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col font-sans">
      <HonestyBanner />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-emerald-950 via-[#14532D] to-emerald-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-700">
              Agricultural Weather Intelligence • मौसम पूर्वानुमान
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Microclimate & Farm Weather Desk
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              High-resolution meteorological forecasts powered by Open-Meteo with actionable recommendations for irrigation, spray schedules, and harvest drying.
            </p>
          </div>

          <div className="bg-emerald-900/80 border border-emerald-700/80 rounded-2xl p-4 text-xs space-y-2 shrink-0">
            <div className="flex items-center gap-2 text-emerald-200">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Select Farming Valley:</span>
            </div>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full bg-[#143d26] text-white border border-emerald-600 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden"
            >
              {NEPAL_WEATHER_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.district} • {loc.elevation})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Weather Dashboard Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-semibold">Connecting to Open-Meteo API...</p>
          </div>
        ) : weatherData ? (
          <>
            {/* Top Current Weather Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full pointer-events-none -mr-20 -mt-20" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-xs">
                    {getWeatherIcon(weatherData.current.icon, 'w-16 h-16')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                        {weatherData.location.district}, {weatherData.location.province}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                        Elevation {weatherData.location.elevation}
                      </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-1">
                      {weatherData.current.temp}°C
                    </h2>
                    <p className="text-sm font-bold text-emerald-800 mt-0.5">
                      {weatherData.current.label} • Feels like {weatherData.current.feelsLike}°C
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{weatherData.current.desc}</p>
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 font-medium">Relative Humidity</p>
                    <p className="text-sm font-black text-gray-900">{weatherData.current.humidity}%</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <Wind className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 font-medium">Wind Velocity</p>
                    <p className="text-sm font-black text-gray-900">{weatherData.current.windSpeed} km/h</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center col-span-2 sm:col-span-1">
                    <CloudRain className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 font-medium">Precipitation</p>
                    <p className="text-sm font-black text-gray-900">{weatherData.current.precipitation} mm</p>
                  </div>
                </div>
              </div>

              {/* Data source transparency note */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Source: <strong>{weatherData.source}</strong>
                </span>
                <span>Coordinates: {weatherData.location.lat}° N, {weatherData.location.lon}° E</span>
              </div>
            </div>

            {/* Practical Agronomic Advisories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-700" />
                  <span>Farming Operations Guidance</span>
                </h3>
                <span className="text-xs text-gray-500">Tailored to today's meteorological parameters</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherData.farmingAdvisories.map((adv, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-900">{adv.aspect}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          adv.isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {adv.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{adv.advice}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                      <Info className="w-3 h-3 text-emerald-600" /> Field verified indicator
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Extended Forecast */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">7-Day Extended Outlook</h3>
                  <p className="text-xs text-gray-500">High and low temperatures with rain probability</p>
                </div>
                <button
                  onClick={() => fetchWeather(selectedLocationId)}
                  className="p-2 border border-gray-200 text-gray-600 hover:text-emerald-800 rounded-xl hover:bg-gray-50 transition"
                  title="Refresh forecast"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {weatherData.forecast.map((day, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl text-center border transition ${
                      idx === 0
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-gray-50/70 border-gray-200 hover:bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-gray-900">{day.dayName}</p>
                    <p className="text-[10px] text-gray-400">{day.date.slice(5)}</p>
                    
                    <div className="my-2.5 flex justify-center">
                      {getWeatherIcon(day.icon, 'w-8 h-8')}
                    </div>

                    <p className="text-xs font-bold text-gray-900">
                      {day.maxTemp}° <span className="text-gray-400 font-normal">/ {day.minTemp}°</span>
                    </p>

                    <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600">
                      <Droplets className="w-3 h-3" />
                      <span>{day.rainProbability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>

      <Footer />
    </div>
  );
}
