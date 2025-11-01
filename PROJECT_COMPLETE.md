# 🎉 MGNREGA Dashboard - Complete Project

## ✅ Project Successfully Set Up!

### 📊 Data Summary
- **Total States**: 6 (Gujarat, Maharashtra, Rajasthan, Uttar Pradesh, Madhya Pradesh, Bihar)
- **Total Districts**: 100
- **Total Workers**: 31+ lakh workers
- **Total Records**: 100 district data entries

### 🌍 States & Districts

#### Gujarat (Default State) - 20 Districts
AHMEDABAD, SURAT, VADODARA, RAJKOT, GANDHINAGAR, BHAVNAGAR, JAMNAGAR, JUNAGADH, BHARUCH, NAVSARI, SURENDRANAGAR, MEHSANA, PORBANDAR, AMRELI, NARMADA, MAHESANA, KUTCH, PANCHMAHAL, BANASKANTHA, ANAND

#### Maharashtra - 20 Districts
MUMBAI, PUNE, NAGPUR, THANE, NASHIK, AURANGABAD, SOLAPUR, AMRAVATI, KOLHAPUR, SANGLI, JALGAON, AHMEDNAGAR, LATUR, DHULE, RATNAGIRI, SATARA, NANDED, BEED, JALNA, OSMANABAD

#### Rajasthan - 15 Districts
JAIPUR, JODHPUR, UDAIPUR, KOTA, AJMER, BIKANER, ALWAR, BHARATPUR, BHILWARA, SIKAR, PALI, TONK, CHURU, JAISALMER, BARMER

#### Uttar Pradesh - 15 Districts
LUCKNOW, KANPUR, AGRA, VARANASI, ALLAHABAD, MEERUT, GHAZIABAD, BAREILLY, ALIGARH, MORADABAD, GORAKHPUR, NOIDA, FIROZABAD, JHANSI, MUZAFFARNAGAR

#### Madhya Pradesh - 15 Districts
BHOPAL, INDORE, JABALPUR, GWALIOR, UJJAIN, SAGAR, RATLAM, SATNA, DEWAS, REWA, KATNI, SINGRAULI, BURHANPUR, KHANDWA, CHHINDWARA

#### Bihar - 15 Districts
PATNA, GAYA, BHAGALPUR, MUZAFFARPUR, DARBHANGA, PURNIA, ARRAH, BEGUSARAI, KATIHAR, MUNGER, CHAPRA, SAMASTIPUR, SITAMARHI, BETTIAH, HAJIPUR

---

## 🚀 Deployment Information

### GitHub Repository
- **URL**: https://github.com/Rhc26/MGNREGA
- **Owner**: Rhc26
- **Email**: craksh23it@student.mes.ac.in
- **Branch**: main
- **Commits**: Multiple commits with full project setup

### Railway Deployment
- **URL**: https://mgnrega-production-1a49.up.railway.app
- **Status**: Deployed ✅
- **Auto-Deploy**: Enabled (deploys on every GitHub push)
- **Database**: MongoDB connected
- **Auto-Seed**: Server automatically seeds database if empty

---

## 📁 Project Structure

```
mgnrega-maharashtra-dashboard-main/
├── client/                          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/             # Header, etc.
│   │   ├── context/                # Language context (EN, HI, MR)
│   │   ├── pages/
│   │   │   ├── Home.jsx           # State selector + district list
│   │   │   ├── DistrictDashboard.jsx  # Data visualization
│   │   │   └── About.jsx          # About page
│   │   └── main.jsx
│   └── package.json
│
├── server/                          # Express Backend
│   ├── models/
│   │   ├── DistrictData.js        # MongoDB schema
│   │   └── DistrictLocation.js    # Location data
│   ├── routes/
│   │   ├── state.js               # /api/states
│   │   ├── district.js            # /api/districts
│   │   └── location.js            # /api/location
│   ├── services/
│   │   └── dataSync.js            # Sample data generator
│   ├── scripts/
│   │   └── seedDatabase.js        # Manual seed script
│   └── index.js                    # Server entry (auto-seed enabled)
│
├── generateSampleData.js            # Local data generator
├── sample-data-all-states.json      # 100 records preview
├── railway.json                     # Railway config
├── package.json                     # Root package
└── README.md
```

---

## 🎯 Features Implemented

### ✅ Multi-State Support
- State selector dropdown on home page
- 6 major Indian states supported
- Gujarat set as default
- Dynamic district loading per state

### ✅ Multi-Language Support
- English (EN)
- Hindi (हिंदी)
- Marathi (मराठी)
- Language switcher in header

### ✅ Data Features
- Auto-location detection
- District-wise MGNREGA data
- Interactive charts (Recharts)
- Performance indicators
- Worker demographics
- Project completion tracking

### ✅ Technical Features
- Server-side auto-seeding (if DB empty)
- Fallback sample data (works offline)
- MongoDB database integration
- Responsive design
- RESTful API
- Caching (1 hour TTL)
- Error handling
- Port auto-selection

---

## 🔧 How to Use

### Local Development

```powershell
# Install dependencies
npm run install-all

# Run dev server (client + server)
npm run dev

# Server runs on: http://localhost:5000
# Client runs on: http://localhost:3000
```

### Generate Sample Data
```powershell
node generateSampleData.js
```
Creates `sample-data-all-states.json` with 100 records.

### Manual Database Seed
```powershell
npm run seed
```
Requires MongoDB running locally or MONGODB_URI set.

---

## 🌐 Live URLs

### Production (Railway)
- **App**: https://mgnrega-production-1a49.up.railway.app
- **GitHub**: https://github.com/Rhc26/MGNREGA

### API Endpoints
- `GET /api/states` - List all states
- `GET /api/districts?state=GUJARAT` - Get districts for state
- `GET /api/districts/:name/summary?state=GUJARAT` - District details
- `GET /api/states/:name/overview` - State overview
- `POST /api/location/detect-district` - Auto-detect location

---

## 📊 Data Statistics

**Total Coverage:**
- 6 States
- 100 Districts
- 31,15,753 Total Workers
- ₹94.75 Crore Total Expenditure
- ~42 Average Days of Employment per Household

**Per State Average:**
- 16.67 Districts
- 5,19,292 Workers
- ₹15.79 Crore Expenditure

---

## 🎨 UI/UX Features

- Gradient hero section
- State selector with live updates
- Search districts by name
- Responsive card grid
- Interactive charts (Pie, Bar, Line)
- Performance badges
- Color-coded metrics
- Multi-language labels

---

## 🔐 Environment Variables (Railway)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=[Auto-set by Railway MongoDB]
```

---

## 🚢 Deployment Workflow

1. **Push to GitHub** → Automatic
2. **Railway detects push** → Auto-deploys
3. **Build client** → `npm run build`
4. **Server starts** → Auto-seeds if DB empty
5. **Live!** → https://mgnrega-production-1a49.up.railway.app

---

## 📝 Notes

- **Auto-seed**: Only runs once when database is empty
- **Fallback data**: App works even if MongoDB disconnects
- **Sample data**: Realistic MGNREGA statistics with variance
- **Update frequency**: Daily sync scheduled at 2 AM (configurable)

---

## 🎓 Project By

- **Developer**: Rhc26
- **Email**: craksh23it@student.mes.ac.in
- **GitHub**: https://github.com/Rhc26

---

## ✨ Next Steps

Your project is **100% ready**! 

Visit: **https://mgnrega-production-1a49.up.railway.app**

The Railway deployment will automatically seed the database on next restart (happening now).

---

**Last Updated**: November 1, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
