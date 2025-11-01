# MGNREGA Dashboard - Multi-State Support

A comprehensive MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data visualization platform with support for multiple Indian states including Gujarat, Maharashtra, Rajasthan, Uttar Pradesh, Madhya Pradesh, and Bihar.

## 🌟 Features

- **Multi-State Support**: View MGNREGA data for 6 major Indian states
- **Multi-Language**: English, Hindi (हिंदी), and Marathi (मराठी)
- **Auto-Location Detection**: Automatically detect user's district
- **Interactive Dashboards**: Rich visualizations with charts and metrics
- **Offline-Compatible**: Works with fallback sample data when database is unavailable
- **Responsive Design**: Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (optional - app works with fallback data)

### Installation

```bash
# Install dependencies for both server and client
npm run install-all

# Run in development mode
npm run dev
```

The server will start on port 5000 (or next available) and the client on port 3000.

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/mgnrega
```

## 📦 Deployment to Railway

### Step 1: Push to GitHub

```bash
# Already configured with your credentials
git remote add origin https://github.com/Rhc26/mgnrega-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to [Railway.app](https://railway.app/)
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your repository: `Rhc26/mgnrega-dashboard`
6. Railway will auto-detect the configuration

### Step 3: Add MongoDB (Optional)

1. In your Railway project, click **"New"** → **"Database"** → **"MongoDB"**
2. Railway will automatically set the `MONGODB_URI` environment variable
3. Redeploy your service

### Step 4: Configure Environment Variables

In Railway project settings → Variables, add:

```
NODE_ENV=production
PORT=5000
```

(MONGODB_URI is auto-set if you added MongoDB database)

### Step 5: Get Your Deployment URL

Railway will provide a public URL like: `https://your-app-name.up.railway.app`

## 🗂️ Project Structure

```
mgnrega-dashboard/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Language context
│   │   ├── pages/         # Main pages (Home, Dashboard, About)
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                # Express backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Data sync services
│   └── index.js          # Server entry
├── package.json          # Root package.json
└── README.md
```

## 🌐 Supported States

- **Gujarat** (default) - 20 districts
- **Maharashtra** - 20 districts
- **Rajasthan** - 15 districts
- **Uttar Pradesh** - 15 districts
- **Madhya Pradesh** - 15 districts
- **Bihar** - 15 districts

## 🛠️ Technology Stack

### Frontend
- React 18
- Vite
- Recharts (data visualization)
- Lucide React (icons)
- Axios

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Node-cron (scheduled sync)
- Helmet & CORS

## 📊 API Endpoints

### States
- `GET /api/states` - Get all available states
- `GET /api/states/:stateName/overview` - Get state-level overview

### Districts
- `GET /api/districts?state=STATE_NAME` - Get districts for a state
- `GET /api/districts/:districtName?state=STATE_NAME` - Get district details
- `GET /api/districts/:districtName/summary?state=STATE_NAME` - Get simplified summary

### Location
- `POST /api/location/detect-district` - Auto-detect district from coordinates
- `GET /api/location/districts-map` - Get all districts with coordinates

## 🔄 Data Sync

The server automatically:
- Syncs MGNREGA data on startup
- Runs scheduled sync daily at 2 AM
- Falls back to sample data if API/DB unavailable

## 👨‍💻 Development

```bash
# Run server only
npm run server

# Run client only
npm run client

# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add more states
- Improve UI/UX
- Add new features
- Report bugs

## 📧 Contact

- **Developer**: Rhc26
- **Email**: craksh23it@student.mes.ac.in
- **GitHub**: [github.com/Rhc26](https://github.com/Rhc26)

---

Made with ❤️ for rural India
