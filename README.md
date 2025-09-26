## Sleep Pattern Monitor with Wellness Bot

Production-ready MERN app to log, track, analyze sleep, and chat with an AI Wellness Bot (Google AI Studio / Gemini).

### Tech
- Frontend: React (Vite), React Router, TailwindCSS, Axios, Chart.js
- Backend: Node + Express, JWT auth, Google OAuth (optional), analysis service
- DB: MongoDB (Mongoose)
- AI: Google AI Studio (Gemini) integration

### Project Structure
```
client/   # React app
server/   # Node/Express API
```

### Prerequisites
- Node 18+
- MongoDB 6+

### Setup - Backend (server)
1) Copy environment file and fill values:
```
cd server
copy .env.example .env   # Windows
# Or manually create .env based on README values below if example is blocked
```

Required .env keys:
```
PORT=5000
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=sleep_monitor
JWT_SECRET=replace_with_long_random_string
JWT_EXPIRES_IN=7d
# Optional Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# Google AI Studio (Gemini)
GEMINI_API_KEY=
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
```

2) Install and run:
```
npm install
npm run dev
```

API runs at `http://localhost:5000` with routes under `/api`.

### Setup - Frontend (client)
1) Create `.env`:
```
cd ../client
copy .env.example .env  # If example is blocked, create manually:
```

`.env` values:
```
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

2) Install and run:
```
npm install
npm run dev
```

Open `http://localhost:5173`.

### User Flow
1) Register/Login (JWT). Optionally use Google login
2) Add a sleep log (start/end, mood, caffeine, disturbances, notes)
3) Dashboard shows last 7 days chart, averages, efficiency, flags
4) Ask Wellness Bot for tips. The bot uses your recent stats for context
5) Export CSV/PDF from dashboard

### API Overview
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `PUT /api/auth/preferences`
- Google OAuth: `GET /api/auth/google`, callback redirects to client with token
- Sleep Logs: `POST/GET /api/sleeplogs`, `PUT/DELETE /api/sleeplogs/:id`
- Analysis: `GET /api/analysis?days=7`
- Bot: `POST /api/bot/ask` (message), `GET /api/bot/history`
- Export: `GET /api/export/csv`, `GET /api/export/pdf`

### Gemini Prompt Template
The backend builds a prompt like:
```
Analyze the following sleep log data and provide friendly, conversational advice to improve the user’s sleep quality. Suggestions should be science-backed, simple, and motivational. Avoid medical advice. Keep it focused on sleep, mental wellness, and lifestyle.

Summary: Avg Duration: <avg>h, Avg Bed: <hh:mm>, Avg Wake: <hh:mm>, Efficiency: <x>%, Flags: <...>

Recent logs:
- Start: <ISO>, End: <ISO>, Mood: <...>, Caffeine: <mg>, Disturbances: <n>
...
```

### Security Notes
- Passwords hashed with bcrypt
- JWT in Authorization: Bearer token
- Environment variables for secrets and API keys

### Production Tips
- Serve client behind a CDN
- Enable HTTPS and secure cookies if using cookies
- Configure CORS to specific origins
- Add logging/monitoring and rate limiting as needed


