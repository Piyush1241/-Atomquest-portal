# ⚡ AtomQuest — Performance Tracking Engine

A full-stack employee performance management portal built with React, Node.js, Express, and MongoDB Atlas.

**Live Demo → [atomquest-portal-chi.vercel.app](https://atomquest-portal-chi.vercel.app)**

---

## 🚀 Features

### 💼 Employee
- Create and submit goal sheets with up to 8 KRAs (Key Result Areas)
- Set thrust areas, UoM (%, Numeric, Binary, Timeline), targets, and weightages
- Weightage validation — must sum to exactly 100%
- Phase 2 quarterly check-in portal (unlocks after manager approval)
- Log actual achievements and update goal status per quarter
- Per-sheet analytics — weighted score, goal score bar chart, status donut chart
- Export goal data to CSV
- Read-only view of manager check-in feedback

### 🛡️ Executive L1 (Manager)
- Review all submitted goal sheets from direct reports
- Inline goal editing before approval
- Approve / Return sheets with one click
- Add quarterly check-in comments (Q1–Q4) per employee
- Team analytics dashboard — employee score comparison, goal status breakdown

### ⚙️ System Administrator
- Global view of all goal sheets across the organization
- Filter by status: All / Pending / Approved / Returned
- Force approve or unlock any sheet
- Delete sheets with confirmation
- Live stat cards — total, pending, approved, returned counts
- Export any sheet or all sheets to CSV

---

## 🔐 Demo Credentials

| Role | User ID | Password |
|------|---------|----------|
| Employee | `EMP101` | `emp123` |
| Manager | `MGR555` | `mgr123` |
| Admin | `ADMIN01` | `admin123` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Charts | Pure SVG (custom, no dependencies) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Project Structure

```
atomquest-portal/
├── client/                 # React frontend
│   ├── src/
│   │   └── App.jsx         # Main application
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
├── server/                 # Express backend
│   ├── server.js           # Entry point
│   ├── routes/
│   │   └── goalRoutes.js   # API routes
│   ├── models/             # Mongoose models
│   ├── render.yaml         # Render deployment config
│   └── package.json
└── README.md
```

---

## 🔧 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend
```bash
cd server
npm install
# Create .env file
echo "PORT=5001" >> .env
echo "MONGO_URI=your_mongodb_uri" >> .env
node server.js
```

### Frontend
```bash
cd client
npm install
# Create .env file
echo "VITE_API_URL=http://localhost:5001/api/goals" >> .env
npm run dev
```

App runs at `http://localhost:5173`

---

## 🌐 Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://atomquest-portal-chi.vercel.app |
| Backend (Render) | https://atomquest-portal-944z.onrender.com |

---

## 📸 Workflow

```
Employee submits goal sheet
        ↓
Manager reviews → Approves or Returns
        ↓
Employee logs quarterly achievements
        ↓
Manager adds check-in comments
        ↓
Admin monitors everything globally
```

---

Built by **Piyush** · [GitHub](https://github.com/Piyush1241)
