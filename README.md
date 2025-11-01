# MGNREGA Dashboard - हमारी आवाज़, हमारे अधिकार

## 🎯 Project Overview

A production-ready web application that makes MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) data accessible to rural Indians with low data literacy. The platform provides district-wise performance metrics in an easy-to-understand visual format.

### Key Features

- ✅ **Auto-detect user location** to show relevant district data
- 📊 **Visual dashboards** with charts and simple metrics
- 🗣️ **Hindi language interface** for better accessibility
- 💾 **Offline-first architecture** with database caching
- 🚀 **Production-ready** with Docker deployment
- 📱 **Mobile-responsive** design
- ⚡ **High performance** with caching layers

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with Vite
- Recharts for data visualization
- Lucide React for icons
- CSS3 with custom variables

**Backend:**
- Node.js with Express
- MongoDB for data persistence
- Node-Cron for scheduled data sync
- NodeCache for in-memory caching

**Infrastructure:**
- Docker & Docker Compose
- Nginx reverse proxy
- MongoDB database

### Design Decisions

#### 1. **Low-Literacy Friendly UI**
- Large fonts (18px base, up to 2.5rem headings)
- Icon-based navigation with minimal text
- Color-coded metrics (green = good, orange = needs attention)
- Simple charts with clear labels
- Hindi language support

#### 2. **Data Caching Strategy**
- **Layer 1:** In-memory cache (1 hour TTL) for API responses
- **Layer 2:** MongoDB database for historical data
- **Layer 3:** Scheduled daily sync from data.gov.in API
- Graceful fallback to sample data if API is unavailable

#### 3. **Location Detection**
- Browser Geolocation API for coordinates
- Haversine formula for nearest district calculation
- Fallback to manual selection if location denied

#### 4. **Production Readiness**
- Rate limiting (100 req/15min per IP)
- Gzip compression
- Security headers (Helmet.js)
- Error handling middleware
- Health check endpoints
- Logging system

## 📁 Project Structure

```
mgnrega-dashboard/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Header.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── DistrictDashboard.jsx
│   │   │   └── About.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                  # Node.js backend
│   ├── models/             # MongoDB schemas
│   │   ├── DistrictData.js
│   │   └── DistrictLocation.js
│   ├── routes/             # API routes
│   │   ├── district.js
│   │   ├── state.js
│   │   └── location.js
│   ├── services/           # Business logic
│   │   └── dataSync.js
│   └── index.js            # Server entry point
├── Dockerfile              # Container configuration
├── docker-compose.yml      # Multi-container setup
├── nginx.conf              # Nginx configuration
├── deploy.sh               # Deployment script
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 7+
- Docker & Docker Compose (for production)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd GOV\ Project
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# If using Docker:
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use local MongoDB installation
```

5. **Run development servers**
```bash
npm run dev
```

This starts:
- Backend server: http://localhost:5000
- Frontend dev server: http://localhost:3000

### Production Deployment

1. **On your VPS (Ubuntu/Debian):**
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

2. **Configure firewall**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

3. **Access your application**
```
http://YOUR_SERVER_IP
```

### Manual Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/mgnrega

# API (Optional)
DATA_GOV_API_KEY=your_api_key
DATA_GOV_BASE_URL=https://api.data.gov.in/resource

# Caching
CACHE_TTL=3600

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 API Endpoints

### Districts
- `GET /api/districts` - List all districts
- `GET /api/districts/:districtName` - Detailed district data
- `GET /api/districts/:districtName/summary` - Simplified summary

### States
- `GET /api/states` - List all states
- `GET /api/states/:stateName/overview` - State-level overview

### Location
- `POST /api/location/detect-district` - Auto-detect district
- `GET /api/location/districts-map` - All districts with coordinates

### Health
- `GET /api/health` - Service health check

## 🎨 Design for Low-Literacy Population

### Visual Design Principles

1. **Large, Clear Typography**
   - Minimum 18px base font size
   - High contrast (WCAG AA compliant)
   - Hindi language primary

2. **Icon-Heavy Interface**
   - Every metric has an associated icon
   - Color coding for quick understanding
   - Minimal text, maximum visuals

3. **Simple Navigation**
   - Large, touch-friendly buttons
   - Auto-detect location (no typing needed)
   - Search with autocomplete

4. **Data Visualization**
   - Pie charts for proportions
   - Progress bars for percentages
   - Large numbers for key metrics
   - Color indicators (green/yellow/red)

5. **Mobile-First**
   - Responsive grid layouts
   - Touch-optimized interactions
   - Optimized for slow networks

## 🔐 Security Features

- Helmet.js security headers
- Rate limiting per IP
- Input validation
- CORS configuration
- MongoDB injection prevention
- Environment variable protection

## ⚡ Performance Optimizations

- In-memory caching (NodeCache)
- Database indexing
- Gzip compression
- Static asset caching
- Code splitting (Vite)
- Lazy loading
- Image optimization

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Home page loads correctly
- [ ] District selection works
- [ ] Auto-detect location works
- [ ] District dashboard displays data
- [ ] Charts render properly
- [ ] Mobile responsive design
- [ ] API endpoints respond
- [ ] Database stores data
- [ ] Caching works

## 🚦 Monitoring

### Health Checks
```bash
# Application health
curl http://YOUR_SERVER_IP/api/health

# Docker services status
docker-compose ps
```

### Logs
```bash
# Application logs
docker-compose logs -f app

# Nginx logs
docker-compose logs -f nginx

# MongoDB logs
docker-compose logs -f mongodb
```

## 🔄 Data Sync

The application syncs data from data.gov.in:
- **Scheduled:** Daily at 2 AM
- **Manual:** Restart the application
- **Fallback:** Uses sample data if API unavailable

## 🌟 Future Enhancements

- [ ] Multi-language support (English, more regional languages)
- [ ] Voice navigation for complete illiteracy
- [ ] SMS/WhatsApp notifications
- [ ] Comparison between districts
- [ ] Year-over-year trends
- [ ] Export reports as PDF
- [ ] Citizen feedback system
- [ ] Integration with more states

## 📝 License

This project is open source and available for public use.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built for Bharat Digital Fellowship**
*Making government data accessible to every Indian*
