# ⚛ AtomQuest — Goal Setting & Tracking Portal

> An in-house performance management portal built for **Hackathon 1.0**. Employees set goals, managers approve them, and admins push shared KPIs — all tracked through quarterly check-ins with a live scoring engine.

🔗 **Live Demo:** [atomquest-portal-chi.vercel.app](https://atomquest-portal-chi.vercel.app)

---

## 🚀 Features

### Employee
- Create goals with thrust area, unit of measure, targets & weightage
- Weightage validation — total must equal 100%, min 10% per goal, max 8 goals
- Quarterly check-in — log actual achievement vs planned target
- Goal status tracking — Not Started / On Track / Completed
- View and adjust weightage on admin-pushed shared goals

### Manager (L1)
- Review and approve employee goal sheets with inline editing
- Leave comments on quarterly check-ins
- View team analytics — bar charts, donut charts, completion rates

### Admin / HR
- Push shared KPIs to multiple employees at once
- Unlock approved goals for editing
- Force-approve or delete goal sheets
- View full audit trail of all post-lock changes
- Export achievement reports as CSV
- Real-time completion dashboard

---

## 🧱 Tech Stack

| Layer | Technology | Hosting |
|---|---|---|
| Frontend | React 18, Vite, Tailwind CSS | Vercel |
| Backend | Node.js, Express.js | Render |
| Goal Data | MongoDB Atlas (Mongoose) | MongoDB Cloud |
| Auth Data | PostgreSQL (Neon) | Neon Serverless |
| Auth | JWT + bcryptjs + httpOnly cookie | — |
| HTTP Client | Axios (`withCredentials`) | — |
| Charts | Custom SVG components | — |

---

## 🏗 Architecture

```
Browser (React)
    │
    ▼
Vercel CDN  ──────────────────────────────────┐
    │                                          │
    ▼                                          │
Express API (Render)                           │
    ├── /api/auth       ──► PostgreSQL (Neon)  │
    ├── /api/goals      ──► MongoDB Atlas      │
    └── /api/shared-goals ► MongoDB Atlas      │
         │                                     │
         └── Audit trail (all mutations) ──────┘
```

**Request flow:**
1. Browser loads React app from Vercel CDN
2. `POST /api/auth/login` → bcrypt check against PostgreSQL → JWT issued as httpOnly cookie
3. Role-based UI rendered — Employee / Manager / Admin views managed in React hooks
4. Axios calls (`withCredentials`) hit Render → auth middleware verifies JWT → MongoDB read/write
5. All post-lock goal mutations appended to audit trail → visible to Admin

---

## 🔐 Login Credentials

| Role | User ID | Password |
|---|---|---|
| Employee | EMP101 | emp123 |
| Employee | EMP102 | emp234 |
| Employee | EMP103 | emp345 |
| Manager (L1) | MGR555 | mgr123 |
| Admin / HR | ADMIN01 | admin123 |

---

## 📁 Project Structure

```
atomquest-portal/
├── client/                  # React frontend
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── config/          # API base URLs (api.js)
│   │   ├── features/
│   │   │   ├── employee/    # GoalCreationForm, CheckInPortal, SharedGoalSection
│   │   │   ├── manager/     # ManagerPipeline, SharedGoalManagerSection
│   │   │   └── admin/       # AdminControlCentre
│   │   ├── hooks/           # useEmployeeData, useManagerData, useAdminData, useToast
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
└── server/                  # Express backend
    ├── db/
    │   └── postgres.js      # Neon PostgreSQL pool
    ├── middleware/
    │   └── auth.js          # JWT requireAuth middleware
    ├── models/
    │   ├── GoalSheet.js     # Mongoose schema
    │   └── SharedGoal.js
    ├── routes/
    │   ├── authRoutes.js    # login, logout, /me
    │   ├── goalRoutes.js
    │   └── sharedGoalRoutes.js
    └── server.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI
- PostgreSQL connection string (Neon or local)

### 1. Clone the repo
```bash
git clone https://github.com/Piyush1241/-Atomquest-portal
cd atomquest-portal
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
DATABASE_URL=your_neon_postgres_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Start the server:
```bash
node server.js
```

### 3. Set up the frontend
```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 Deployment

| Service | Platform | Trigger |
|---|---|---|
| Frontend | Vercel | Auto-deploy on push to `main` |
| Backend | Render (Web Service) | Auto-deploy on push to `main` |
| Goal DB | MongoDB Atlas | Cloud managed |
| Auth DB | Neon PostgreSQL | Cloud managed |

> **Note:** Render free tier spins down after 15 minutes of inactivity. A cron job pings the backend every 10 minutes to prevent cold starts.

---

## 📊 Scoring Engine

Supports six scoring methods:

| Method | Description |
|---|---|
| `%` | Percentage of target achieved |
| `%-max` | Percentage capped at 100% |
| `Numeric` | Raw numeric value |
| `Numeric-max` | Numeric capped at maximum |
| `Timeline` | Based on delivery date |
| `Zero-based` | Binary — hit or miss |

---

## 🛡 Security

- Passwords hashed with **bcryptjs**
- Sessions managed via **JWT** stored in **httpOnly cookies** (not localStorage)
- `SameSite=None; Secure` cookies for cross-origin Vercel ↔ Render requests
- Role-based route protection on all API endpoints
- Goal lock after Manager approval — edits require Admin unlock

---

## 📝 Submission

Built for **AtomQuest Hackathon 1.0** — May 2026.

---

*Confidential — Hackathon Submission Only*
