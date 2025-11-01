import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Briefcase, Calendar, DollarSign, 
  TrendingUp, Building2, CheckCircle, Clock, Award
} from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import './DistrictDashboard.css';

function DistrictDashboard() {
  const { districtName } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get state from URL query params, default to GUJARAT
  const searchParams = new URLSearchParams(window.location.search);
  const selectedState = searchParams.get('state') || 'GUJARAT';

  useEffect(() => {
    fetchDistrictData();
  }, [districtName, selectedState]);

  const fetchDistrictData = async () => {
    try {
      const response = await axios.get(`/api/districts/${districtName}/summary?state=${selectedState}`);
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching district data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-page">
        <p>{t('noData')}</p>
        <button onClick={() => navigate('/')} className="back-btn">
          {t('backToHome')}
        </button>
      </div>
    );
  }

  const { metrics, indicators } = data;

  // Chart data
  const workerDistribution = [
    { name: 'महिला कर्मचारी', value: metrics.womenWorkers, color: '#ec4899' },
    { name: 'अन्य कर्मचारी', value: metrics.totalWorkers - metrics.womenWorkers, color: '#3b82f6' }
  ];

  const projectStatus = [
    { name: 'पूर्ण', value: metrics.projectsCompleted, color: '#10b981' },
    { name: 'चल रहे', value: metrics.projectsOngoing, color: '#f59e0b' }
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={24} />
          <span>वापस जाएं</span>
        </button>

        <div className="district-header">
          <div>
            <h1 className="district-title">{metrics.districtName}</h1>
            <p className="district-subtitle">
              {selectedState === 'GUJARAT' ? 'गुजरात' : 
               selectedState === 'MAHARASHTRA' ? 'महाराष्ट्र' : 
               selectedState} - MGNREGA प्रदर्शन
            </p>
          </div>
          {indicators.isPerformingWell && (
            <div className="performance-badge">
              <Award size={32} />
              <span>अच्छा प्रदर्शन</span>
            </div>
          )}
        </div>

        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="metric-icon" style={{ background: '#dbeafe' }}>
              <Users size={32} style={{ color: '#3b82f6' }} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.totalFamilies.toLocaleString('en-IN')}</div>
              <div className="metric-label">कुल परिवार (जॉब कार्ड)</div>
              <div className="metric-sublabel">पंजीकृत परिवारों की संख्या</div>
            </div>
          </div>

          <div className="metric-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="metric-icon" style={{ background: '#d1fae5' }}>
              <Briefcase size={32} style={{ color: '#10b981' }} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.peopleWorking.toLocaleString('en-IN')}</div>
              <div className="metric-label">कार्यरत श्रमिक</div>
              <div className="metric-sublabel">वर्तमान में काम कर रहे लोग</div>
            </div>
          </div>

          <div className="metric-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="metric-icon" style={{ background: '#fef3c7' }}>
              <Calendar size={32} style={{ color: '#f59e0b' }} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.daysOfWork} दिन</div>
              <div className="metric-label">औसत रोजगार दिवस</div>
              <div className="metric-sublabel">प्रति परिवार औसत</div>
            </div>
          </div>

          <div className="metric-card" style={{ borderLeftColor: '#8b5cf6' }}>
            <div className="metric-icon" style={{ background: '#ede9fe' }}>
              <DollarSign size={32} style={{ color: '#8b5cf6' }} />
            </div>
            <div className="metric-content">
              <div className="metric-value">{metrics.moneySpent}</div>
              <div className="metric-label">कुल व्यय</div>
              <div className="metric-sublabel">वर्तमान वित्तीय वर्ष</div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="performance-section card">
          <h2 className="section-heading">
            <TrendingUp size={28} />
            प्रदर्शन संकेतक
          </h2>
          
          <div className="indicators-grid">
            <div className="indicator-card">
              <div className="indicator-label">रोजगार दर</div>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill" 
                  style={{ 
                    width: `${indicators.employmentRate}%`,
                    background: indicators.employmentRate > 60 ? '#10b981' : '#f59e0b'
                  }}
                ></div>
              </div>
              <div className="indicator-value">{indicators.employmentRate}%</div>
            </div>

            <div className="indicator-card">
              <div className="indicator-label">परियोजना पूर्णता दर</div>
              <div className="indicator-bar">
                <div 
                  className="indicator-fill" 
                  style={{ 
                    width: `${indicators.completionRate}%`,
                    background: indicators.completionRate > 50 ? '#10b981' : '#f59e0b'
                  }}
                ></div>
              </div>
              <div className="indicator-value">{indicators.completionRate}%</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card card">
            <h3 className="chart-title">
              <Users size={24} />
              श्रमिक वितरण
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workerDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {workerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <h3 className="chart-title">
              <Building2 size={24} />
              परियोजना स्थिति
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects Summary */}
        <div className="projects-section card">
          <h2 className="section-heading">
            <Building2 size={28} />
            परियोजना सारांश
          </h2>
          
          <div className="projects-grid">
            <div className="project-stat">
              <CheckCircle size={48} style={{ color: '#10b981' }} />
              <div className="project-stat-value">{metrics.projectsCompleted}</div>
              <div className="project-stat-label">पूर्ण परियोजनाएं</div>
            </div>

            <div className="project-stat">
              <Clock size={48} style={{ color: '#f59e0b' }} />
              <div className="project-stat-value">{metrics.projectsOngoing}</div>
              <div className="project-stat-label">चल रही परियोजनाएं</div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box card">
          <h3>MGNREGA के बारे में</h3>
          <p>
            महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (MGNREGA) भारत सरकार की एक 
            योजना है जो ग्रामीण परिवारों को 100 दिनों की गारंटीड मजदूरी रोजगार प्रदान करती है।
          </p>
          <p>
            यह योजना ग्रामीण क्षेत्रों में बुनियादी ढांचे के विकास और रोजगार सृजन के लिए काम करती है।
          </p>
        </div>

        <div className="last-updated">
          अंतिम अपडेट: {new Date(data.lastUpdated).toLocaleDateString('hi-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}

export default DistrictDashboard;
