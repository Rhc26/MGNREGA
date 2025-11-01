import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Home from './pages/Home';
import DistrictDashboard from './pages/DistrictDashboard';
import About from './pages/About';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/district/:districtName" element={<DistrictDashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
