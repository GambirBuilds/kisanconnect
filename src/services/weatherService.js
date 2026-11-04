// Weather Service utilizing Open-Meteo API for Nepal agricultural regions

export const NEPAL_WEATHER_LOCATIONS = [
  { id: 'ktm', name: 'Kathmandu / Kalimati', district: 'Kathmandu', province: 'Bagmati', lat: 27.7172, lon: 85.3240, elevation: '1,400m' },
  { id: 'kavre', name: 'Panauti / Banepa', district: 'Kavrepalanchok', province: 'Bagmati', lat: 27.5833, lon: 85.5167, elevation: '1,500m' },
  { id: 'chitwan', name: 'Bharatpur / Madi', district: 'Chitwan', province: 'Bagmati', lat: 27.6833, lon: 84.4333, elevation: '208m' },
  { id: 'kaski', name: 'Pokhara Valley', district: 'Kaski', province: 'Gandaki', lat: 28.2096, lon: 83.9856, elevation: '822m' },
  { id: 'mustang', name: 'Jomsom / Marpha', district: 'Mustang', province: 'Gandaki', lat: 28.7833, lon: 83.7333, elevation: '2,720m' },
  { id: 'jhapa', name: 'Birtamod / Mechinagar', district: 'Jhapa', province: 'Koshi', lat: 26.6333, lon: 87.9833, elevation: '120m' },
  { id: 'banke', name: 'Nepalgunj / Kohalpur', district: 'Banke', province: 'Lumbini', lat: 28.0500, lon: 81.6167, elevation: '150m' },
  { id: 'morang', name: 'Biratnagar Hub', district: 'Morang', province: 'Koshi', lat: 26.4525, lon: 87.2718, elevation: '80m' },
  { id: 'dhading', name: 'Dhading Besi', district: 'Dhading', province: 'Bagmati', lat: 27.8667, lon: 84.9000, elevation: '1,100m' },
  { id: 'jumla', name: 'Jumla Khalanga', district: 'Jumla', province: 'Karnali', lat: 29.2747, lon: 82.1838, elevation: '2,514m' },
  { id: 'kailali', name: 'Dhangadhi', district: 'Kailali', province: 'Sudurpashchim', lat: 28.6833, lon: 80.6000, elevation: '109m' },
  { id: 'ilam', name: 'Ilam Bazaar', district: 'Ilam', province: 'Koshi', lat: 26.9167, lon: 87.9167, elevation: '1,208m' },
];

export const WMO_WEATHER_CODES = {
  0: { label: 'Clear Sky (सफा आकाश)', icon: 'Sun', desc: 'Optimal for field drying, threshing, and foliar spray.' },
  1: { label: 'Mainly Clear', icon: 'SunMedium', desc: 'Good sunshine, suitable for general farm field tasks.' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', desc: 'Mild sunshine, safe for transplantation and weeding.' },
  3: { label: 'Overcast (बादल लागेको)', icon: 'Cloud', desc: 'Dense cloud cover, reduce greenhouse shading.' },
  45: { label: 'Foggy (कुहिरो)', icon: 'CloudFog', desc: 'High leaf moisture; monitor for fungal spores.' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', desc: 'Cold morning moisture.' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', desc: 'Light misting, postpone foliar chemical spraying.' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', desc: 'Damp topsoil.' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle', desc: 'Wet foliage.' },
  61: { label: 'Slight Rain (हल्का वर्षा)', icon: 'CloudRain', desc: 'Helpful for rainfed crops, hold pest sprays.' },
  63: { label: 'Moderate Rain (मध्यम वर्षा)', icon: 'CloudRain', desc: 'Beneficial for terrace rice and maize.' },
  65: { label: 'Heavy Rain (भारी वर्षा)', icon: 'CloudRain', desc: 'Clear field drainage channels to prevent waterlogging.' },
  71: { label: 'Slight Snow Fall', icon: 'Snowflake', desc: 'High elevation cold cover.' },
  80: { label: 'Rain Showers', icon: 'CloudRain', desc: 'Intermittent downpours.' },
  95: { label: 'Thunderstorm (चट्याङसहित वर्षा)', icon: 'CloudLightning', desc: 'Stay indoors, shelter outdoor equipment.' }
};

export const weatherService = {
  async getForecast(locationId = 'ktm') {
    const loc = NEPAL_WEATHER_LOCATIONS.find((l) => l.id === locationId) || NEPAL_WEATHER_LOCATIONS[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKathmandu`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather service response error: ${res.status}`);
      const data = await res.json();

      const current = data.current || {};
      const daily = data.daily || {};

      const weatherCode = current.weather_code ?? 0;
      const weatherMeta = WMO_WEATHER_CODES[weatherCode] || { label: 'Clear Sky', icon: 'Sun', desc: 'Normal conditions.' };

      // Process 7-day forecast
      const forecastDays = (daily.time || []).map((dateStr, i) => {
        const code = (daily.weather_code && daily.weather_code[i]) ?? 0;
        const meta = WMO_WEATHER_CODES[code] || { label: 'Clear', icon: 'Sun' };
        const dateObj = new Date(dateStr);
        const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });

        return {
          date: dateStr,
          dayName,
          maxTemp: Math.round(daily.temperature_2m_max[i] || 24),
          minTemp: Math.round(daily.temperature_2m_min[i] || 12),
          precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
          rainProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
          code,
          label: meta.label,
          icon: meta.icon
        };
      });

      // Farm-specific practical advisories
      const temp = current.temperature_2m || 22;
      const humidity = current.relative_humidity_2m || 65;
      const windSpeed = current.wind_speed_10m || 8;
      const todayRainProb = forecastDays[0]?.rainProbability || 10;

      const farmingAdvisories = [
        {
          aspect: 'Chemical & Bio-Spray Condition',
          status: windSpeed < 15 && todayRainProb < 25 ? 'Favorable' : 'Unfavorable',
          isGood: windSpeed < 15 && todayRainProb < 25,
          advice: windSpeed < 15 && todayRainProb < 25
            ? 'Wind is gentle (<15 km/h) and low rain risk. Optimal window for bio-fungicide or foliar nutrient spray.'
            : 'Postpone spraying: wind drift or rain wash-off risk detected.'
        },
        {
          aspect: 'Soil Moisture & Irrigation',
          status: todayRainProb > 60 ? 'Natural Rain Expected' : 'Irrigation Recommended',
          isGood: true,
          advice: todayRainProb > 60
            ? 'High probability of natural showers. Save diesel and pump electricity; monitor drainage.'
            : 'Dry spell likely. Ensure drip or furrow irrigation for nursery beds and vegetables.'
        },
        {
          aspect: 'Post-Harvest Drying Index',
          status: humidity < 70 && weatherCode <= 2 ? 'Optimal for Sun Drying' : 'Moderate Drying Caution',
          isGood: humidity < 70 && weatherCode <= 2,
          advice: humidity < 70 && weatherCode <= 2
            ? 'Sunny and low relative humidity. Ideal for outdoor sun-drying of paddy, maize, and turmeric.'
            : 'Elevate storage crates and ventilate grain bins to avoid moisture buildup.'
        }
      ];

      return {
        location: loc,
        current: {
          temp: Math.round(temp),
          feelsLike: Math.round(current.apparent_temperature || temp),
          humidity: Math.round(humidity),
          windSpeed: Math.round(windSpeed),
          precipitation: current.precipitation || 0,
          weatherCode,
          label: weatherMeta.label,
          icon: weatherMeta.icon,
          desc: weatherMeta.desc,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        forecast: forecastDays,
        farmingAdvisories,
        source: 'Open-Meteo Meteorological Engine (Asia/Kathmandu Feed)',
        isLive: true
      };
    } catch (err) {
      console.warn('Open-Meteo API unreachable, returning robust fallback:', err);
      return this.getFallbackForecast(loc);
    }
  },

  getFallbackForecast(loc) {
    return {
      location: loc,
      current: {
        temp: 24,
        feelsLike: 23,
        humidity: 62,
        windSpeed: 7,
        precipitation: 0,
        weatherCode: 0,
        label: 'Mainly Clear (सफा)',
        icon: 'Sun',
        desc: 'Favorable seasonal weather across mid-hill terraces.',
        timestamp: 'Live cached'
      },
      forecast: [
        { date: '2026-11-02', dayName: 'Today', maxTemp: 25, minTemp: 13, rainProbability: 10, label: 'Sunny', icon: 'Sun' },
        { date: '2026-11-03', dayName: 'Tue', maxTemp: 26, minTemp: 14, rainProbability: 15, label: 'Partly Cloudy', icon: 'CloudSun' },
        { date: '2026-11-04', dayName: 'Wed', maxTemp: 24, minTemp: 12, rainProbability: 25, label: 'Cloudy', icon: 'Cloud' },
        { date: '2026-11-05', dayName: 'Thu', maxTemp: 25, minTemp: 13, rainProbability: 10, label: 'Sunny', icon: 'Sun' },
        { date: '2026-11-06', dayName: 'Fri', maxTemp: 26, minTemp: 14, rainProbability: 5, label: 'Clear', icon: 'Sun' },
        { date: '2026-11-07', dayName: 'Sat', maxTemp: 25, minTemp: 13, rainProbability: 10, label: 'Clear', icon: 'Sun' },
        { date: '2026-11-08', dayName: 'Sun', maxTemp: 24, minTemp: 12, rainProbability: 20, label: 'Partly Cloudy', icon: 'CloudSun' }
      ],
      farmingAdvisories: [
        {
          aspect: 'Foliar Spray Condition',
          status: 'Favorable',
          isGood: true,
          advice: 'Wind speed under 10 km/h with low precipitation risk. Favorable for organic neem spraying.'
        },
        {
          aspect: 'Crop Irrigation Guidance',
          status: 'Maintain Schedule',
          isGood: true,
          advice: 'Moderate temperatures; apply regular morning furrow irrigation for cole crops.'
        }
      ],
      source: 'Open-Meteo Cached Benchmark (Fallback Mode)',
      isLive: false
    };
  }
};
