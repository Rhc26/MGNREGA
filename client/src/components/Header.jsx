import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Header.css';

function Header() {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-emblem">🏛️</div>
            <div className="logo-text">
              <h1>MGNREGA</h1>
              <p className="logo-subtitle">
                {language === 'en' ? 'Our voice, our rights' : 
                 language === 'hi' ? 'हमारी आवाज़, हमारे अधिकार' : 
                 'आमचा आवाज, आमचे अधिकार'}
              </p>
            </div>
          </Link>
          
          <nav className="nav">
            <div className="language-selector">
              <Globe size={20} />
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="language-dropdown"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
            <Link to="/" className="nav-link">
              <MapPin size={24} />
              <span>{t('backToHome')}</span>
            </Link>
            <Link to="/about" className="nav-link">
              <span>{t('information')}</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
