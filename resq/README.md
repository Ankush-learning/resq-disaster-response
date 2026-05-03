# ResQ — Disaster Response & Relief Coordination System

A production-ready, full-stack disaster management platform featuring a stunning 3D interactive globe, real-time incident tracking, and a complete coordination pipeline from citizen reports to authority response.

---

## ✨ Key Features

- **3D Interactive Earth** — Kurzgesagt-inspired globe with cursor-driven rotation via React Three Fiber
- **Emergency Reporting** — Multi-step form with GPS auto-detection, image upload, severity scoring
- **Live Disaster Map** — Custom SVG world map with real-time Socket.IO incident markers
- **Authority Dashboard** — Full incident command center with filtering, assignment, and stats
- **Real-Time Updates** — Socket.IO broadcasts new reports and status changes instantly
- **JWT Authentication** — Citizen / Volunteer / Authority role-based access
- **Priority Scoring** — Automated severity × report-frequency algorithm
- **Weather Context** — OpenWeatherMap integration with intelligent fallback caching
- **PWA-Ready** — Offline report queuing with service workers
- **Rate Limiting + Helmet** — Production-grade security middleware

---

## 🗂 Project Structure

```
resq/
├── client/                     # React (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Globe.jsx        # 3D Earth — React Three Fiber
│   │   │   ├── Hero.jsx         # Interactive hero section
│   │   │   ├── Features.jsx     # Animated feature cards
│   │   │   ├── HowItWorks.jsx   # Step-flow visualization
│   │   │   ├── DashboardPreview.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── CustomCursor.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ReportEmergency.jsx
│   │   │   ├── LiveMap.jsx
│   │   │   └── Dashboard.jsx
│   │   └── services/
│   │       ├── api.js           # Axios instance with JWT interceptors
│   │       └── socket.js        # Socket.IO client manager
│   ├── .env.example
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                     # Node.js + Express backend
    ├── controllers/
    │   ├── authController.js
    │   ├── reportController.js
    │   └── resourceController.js
    ├── models/
    │   ├── User.js              # Mongoose schema with bcrypt
    │   ├── Report.js            # Incident model with geo-indexing
    │   └── Resource.js
    ├── routes/
    │   ├── auth.js
    │   ├── reports.js
    │   ├── resources.js
    │   ├── alerts.js
    │   └── weather.js
    ├── middleware/
    │   └── auth.js              # JWT protect + authorize + optionalAuth
    ├── socket/
    │   └── handlers.js          # Socket.IO event handlers
    ├── uploads/                 # Image upload directory (git-ignored)
    ├── .env.example
    └── server.js
```

---

## 🚀 Local Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | v18+ |
| MongoDB | v6+ (local or Atlas) |
| npm | v9+ |

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourname/resq.git
cd resq

# Install all dependencies (server + client)
npm run install:all
```

### 2. Configure Environment Variables

**Server:**
```bash
cd server
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET at minimum
```

**Client:**
```bash
cd client
cp .env.example .env
# Edit .env — set VITE_API_URL if backend is not on localhost:5000
```

### 3. Create uploads directory

```bash
mkdir -p server/uploads
```

### 4. Start Development Servers

```bash
# From project root — starts both client and server
npm run dev

# Or start individually:
npm run dev:server    # Express on :5000
npm run dev:client    # Vite on :5173
```

### 5. Open in Browser

```
http://localhost:5173
```

---

## 🔑 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create account | — |
| POST | `/api/auth/login` | Get JWT token | — |
| GET | `/api/auth/me` | Get current user | Bearer |
| PATCH | `/api/auth/fcm-token` | Update FCM push token | Bearer |

### Emergency Reports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reports` | List reports (filterable) | — |
| GET | `/api/reports/stats` | Dashboard statistics | — |
| GET | `/api/reports/:id` | Single report detail | — |
| POST | `/api/reports` | Submit new report | Optional |
| PATCH | `/api/reports/:id/status` | Update status | Authority |
| PATCH | `/api/reports/:id/assign` | Assign volunteers | Authority |

**Query params for GET /api/reports:**
- `severity` — critical | high | medium | low
- `status` — pending | active | assigned | monitoring | resolved
- `lat`, `lng`, `radius` — geo filter (km)
- `page`, `limit`, `sort`

### Resources

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/resources` | List resources | — |
| POST | `/api/resources` | Add resource | Bearer |
| PATCH | `/api/resources/:id` | Update resource | Bearer (owner) |
| DELETE | `/api/resources/:id` | Remove resource | Bearer (owner) |

### Weather

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?lat=&lng=` | Current weather at location |

### Alerts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/alerts/broadcast` | Broadcast area alert | Authority |

---

## ⚡ Socket.IO Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_area` | `{ lat, lng }` | Join geo-based room |
| `subscribe_incident` | `incidentId` | Subscribe to incident updates |
| `volunteer_location` | `{ lat, lng }` | Broadcast volunteer position |
| `request_stats` | — | Request dashboard stats |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new_report` | Report summary | New emergency submitted |
| `report_status_update` | `{ id, status }` | Status changed |
| `volunteers_assigned` | `{ reportId }` | Team assigned |
| `resource_added` | Resource summary | New resource registered |
| `broadcast_alert` | Alert object | Authority broadcast |
| `stats_update` | Stats object | Dashboard stats refresh |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| 3D Globe | React Three Fiber + Three.js |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Real-time Server | Socket.IO |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Security | Helmet + express-rate-limit |
| File Upload | Multer |
| Weather API | OpenWeatherMap |

---

## 🔐 Security Features

- **JWT authentication** with configurable expiry
- **bcrypt password hashing** (salt rounds: 12)
- **Rate limiting** — global (200 req/15min), auth (10/15min), reports (20/10min)
- **Helmet.js** security headers
- **Input validation** via express-validator on all POST/PATCH routes
- **File type validation** on image uploads
- **Role-based access control** for authority-only endpoints
- **CORS** restricted to configured client origin

---

## 📱 PWA / Offline Support

The app is structured for PWA enhancement:

1. Add `vite-plugin-pwa` to client dependencies
2. Configure `vite.config.js` with workbox strategies
3. Cache map tiles, last 20 reports, and user auth locally
4. Offline report form → submits to IndexedDB → syncs on reconnect

---

## 🌐 Production Deployment

```bash
# Build frontend
npm run build

# Set NODE_ENV=production in server .env
# Use PM2 or similar process manager:
pm2 start server/server.js --name resq-api

# Serve client/dist via nginx or CDN
```

**Recommended stack:** MongoDB Atlas + Railway/Render (Node) + Vercel/Netlify (React)

---

## 📄 License

MIT — Open source for humanitarian use.
