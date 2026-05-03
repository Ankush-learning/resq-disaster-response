const router = require('express').Router()
const axios = require('axios')

// In-memory weather cache (use Redis in production)
const weatherCache = new Map()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

router.get('/', async (req, res, next) => {
  try {
    const { lat, lng } = req.query
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng required' })
    }

    const cacheKey = `${parseFloat(lat).toFixed(2)},${parseFloat(lng).toFixed(2)}`
    const cached = weatherCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ success: true, data: cached.data, cached: true })
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY
    if (!API_KEY) {
      return res.json({ success: true, data: { condition: 'Unknown', temperature: 25, windSpeed: 0, humidity: 50 }, cached: false })
    }

    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat, lon: lng, appid: API_KEY, units: 'metric' },
      timeout: 5000,
    })

    const weather = {
      condition: data.weather[0].main,
      description: data.weather[0].description,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      visibility: data.visibility,
      icon: data.weather[0].icon,
    }

    weatherCache.set(cacheKey, { data: weather, timestamp: Date.now() })
    res.json({ success: true, data: weather, cached: false })
  } catch (err) {
    // Return last cached data as fallback
    const cacheKey = `${parseFloat(req.query.lat).toFixed(2)},${parseFloat(req.query.lng).toFixed(2)}`
    const cached = weatherCache.get(cacheKey)
    if (cached) return res.json({ success: true, data: cached.data, cached: true, stale: true })
    next(err)
  }
})

module.exports = router
