import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [selectedState, setSelectedState] = useState('GUJARAT');
  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDistricts();
    }
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      const response = await axios.get('/api/states');
      const states = response.data.data || [];
      setAvailableStates(states);
      // If Gujarat is not in the list, add it or use first available
      if (states.length > 0 && !states.includes('GUJARAT')) {
        setSelectedState(states[0]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      // Fallback to known states if API fails
      setAvailableStates(['GUJARAT', 'MAHARASHTRA']);
    }
  };

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/districts?state=${selectedState}`);
      setDistricts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setLoading(false);
    }
  };

  const handleDistrictSelect = (districtName) => {
    navigate(`/district/${districtName}?state=${selectedState}`);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSearchTerm(''); // Clear search when changing state
  };

  const handleAutoDetect = () => {
    if ('geolocation' in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await axios.post('/api/location/detect-district', {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            
            const detectedDistrict = response.data.data.district;
            navigate(`/district/${detectedDistrict}`);
          } catch (error) {
            console.error('Error detecting district:', error);
            alert('आपके स्थान का पता नहीं लगाया जा सका। कृपया मैन्युअल रूप से जिला चुनें।');
          } finally {
            setDetectingLocation(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('कृपया अपने ब्राउज़र में लोकेशन एक्सेस की अनुमति दें।');
          setDetectingLocation(false);
        }
      );
    } else {
      alert('आपका ब्राउज़र लोकेशन सेवा का समर्थन नहीं करता।');
    }
  };

  const filteredDistricts = districts.filter(district =>
    district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('heroTitle')}
            </h1>
            <p className="hero-subtitle">
              {t('heroSubtitle')}
            </p>
            
            <button 
              className="auto-detect-btn"
              onClick={handleAutoDetect}
              disabled={detectingLocation}
            >
              <Navigation size={28} />
              <div>
                <div className="btn-text">
                  {detectingLocation ? t('detecting') : t('autoDetect')}
                </div>
                <div className="btn-subtext">{t('autoDetect')}</div>
              </div>
            </button>
            
            <div className="or-divider">
              <span>Or</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="search-section card">
          <h2 className="section-title">
            <MapPin size={32} />
            {t('selectDistrict')}
          </h2>

          {/* State Selector */}
          <div className="state-selector-wrapper">
            <label htmlFor="state-select" className="state-label">
              Select State / राज्य चुनें:
            </label>
            <select 
              id="state-select"
              value={selectedState} 
              onChange={handleStateChange}
              className="state-selector"
            >
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          
          <div className="search-box">
            <Search className="search-icon" size={24} />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>{t('loading')}</p>
            </div>
          ) : (
            <div className="districts-grid">
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((district) => (
                  <button
                    key={district}
                    className="district-card"
                    onClick={() => handleDistrictSelect(district)}
                  >
                    <MapPin size={32} className="district-icon" />
                    <span className="district-name">{district}</span>
                    <TrendingUp size={20} className="arrow-icon" />
                  </button>
                ))
              ) : (
                <p className="no-results">{t('noData')}</p>
              )}
            </div>
          )}
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon" style={{ background: '#dbeafe' }}>
              <span style={{ fontSize: '2rem' }}>👥</span>
            </div>
            <h3>12.15 करोड़+</h3>
            <p>लाभार्थी (2025)</p>
          </div>

          <div className="info-card">
            <div className="info-icon" style={{ background: '#d1fae5' }}>
              <span style={{ fontSize: '2rem' }}>💼</span>
            </div>
            <h3>100 दिन</h3>
            <p>गारंटीड रोजगार</p>
          </div>

          <div className="info-card">
            <div className="info-icon" style={{ background: '#fef3c7' }}>
              <span style={{ fontSize: '2rem' }}>🏗️</span>
            </div>
            <h3>ग्रामीण विकास</h3>
            <p>बुनियादी ढांचा</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
