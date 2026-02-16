"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalAverageForInterval = getHistoricalAverageForInterval;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const METEOSTAT_API_KEY = process.env.METEOSTAT_API_KEY;
const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const historicalCache = {};
async function getCityCoordinates(city, country) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${OPENWEATHER_KEY}`;
    try {
        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok)
            throw new Error(`Erro na geolocalização: ${geoRes.status}`);
        const geoData = (await geoRes.json());
        if (!geoData[0])
            return null;
        return { lat: geoData[0].lat, lon: geoData[0].lon };
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
function getDatesBetween(startDate, endDate) {
    const dates = [];
    let current = new Date(startDate);
    while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
async function getHistoricalAverageForDay(lat, lon, month, day) {
    const cacheKey = `${lat}_${lon}_${month}_${day}`;
    if (historicalCache[cacheKey]) {
        const temps = historicalCache[cacheKey];
        const avgMin = temps.reduce((a, b) => a + b.tmin, 0) / temps.length;
        const avgMax = temps.reduce((a, b) => a + b.tmax, 0) / temps.length;
        return { temp_min_avg: avgMin, temp_max_avg: avgMax, temp_avg: (avgMin + avgMax) / 2 };
    }
    const startYear = 2023;
    const endYear = 2025;
    const temps = [];
    for (let year = startYear; year <= endYear; year++) {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const url = `https://meteostat.p.rapidapi.com/point/daily?lat=${lat}&lon=${lon}&start=${dateStr}&end=${dateStr}&units=metric`;
        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'meteostat.p.rapidapi.com',
                    'x-rapidapi-key': METEOSTAT_API_KEY,
                },
            });
            if (!res.ok)
                continue;
            const data = (await res.json());
            if (data.data && data.data.length > 0) {
                const { tmin, tmax } = data.data[0];
                if (typeof tmin === 'number' && typeof tmax === 'number') {
                    temps.push({ tmin, tmax });
                }
            }
        }
        catch (err) {
            console.error(`Erro na API Meteostat para ${dateStr}:`, err);
            continue;
        }
    }
    if (!temps.length)
        return null;
    historicalCache[cacheKey] = temps;
    const avgMin = temps.reduce((a, b) => a + b.tmin, 0) / temps.length;
    const avgMax = temps.reduce((a, b) => a + b.tmax, 0) / temps.length;
    return { temp_min_avg: avgMin, temp_max_avg: avgMax, temp_avg: (avgMin + avgMax) / 2 };
}
async function getHistoricalAverageForInterval(city, country, startDateStr, endDateStr) {
    const coords = await getCityCoordinates(city, country);
    if (!coords)
        return null;
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const dates = getDatesBetween(startDate, endDate);
    const MAX_CONCURRENT = 5;
    const results = [];
    for (let i = 0; i < dates.length; i += MAX_CONCURRENT) {
        const batch = dates.slice(i, i + MAX_CONCURRENT);
        const batchResults = await Promise.all(batch.map(async (date) => {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const avg = await getHistoricalAverageForDay(coords.lat, coords.lon, month, day);
            const status = avg ? "ok" : "no_data";
            return {
                temp_min_avg: avg?.temp_min_avg ?? null,
                temp_max_avg: avg?.temp_max_avg ?? null,
                temp_avg: avg?.temp_avg ?? null,
                status,
            };
        }));
        results.push(...batchResults);
    }
    const validDays = results.filter((r) => r.status === "ok");
    if (validDays.length === 0)
        return null;
    const tempMinAvg = validDays.reduce((sum, d) => sum + (d.temp_min_avg ?? 0), 0) / validDays.length;
    const tempMaxAvg = validDays.reduce((sum, d) => sum + (d.temp_max_avg ?? 0), 0) / validDays.length;
    const tempAvg = validDays.reduce((sum, d) => sum + (d.temp_avg ?? 0), 0) / validDays.length;
    return { temp_avg: tempAvg };
}
//# sourceMappingURL=HistoricalAverage.js.map