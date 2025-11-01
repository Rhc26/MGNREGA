import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Home Page
    heroTitle: 'View Your District\'s MGNREGA Performance',
    heroSubtitle: 'Mahatma Gandhi National Rural Employment Guarantee Scheme',
    autoDetect: 'Auto-Detect My District',
    searchPlaceholder: 'Search district name...',
    selectDistrict: 'Select District',
    viewDashboard: 'View Dashboard',
    detecting: 'Detecting location...',
    
    // Dashboard
    districtDashboard: 'District Dashboard',
    lastUpdated: 'Last Updated',
    jobCardsIssued: 'Job Cards Issued',
    workersEmployed: 'Workers Employed',
    totalWorkDays: 'Total Work Days',
    totalExpenditure: 'Total Expenditure',
    projectsCompleted: 'Projects Completed',
    
    // Charts
    workDistribution: 'Work Distribution',
    expenditureBreakdown: 'Expenditure Breakdown',
    wagesPayments: 'Wages & Payments',
    materialsCosts: 'Materials & Costs',
    administrativeCosts: 'Administrative Costs',
    performanceIndicators: 'Performance Indicators',
    
    // About
    aboutMGNREGA: 'About MGNREGA',
    aboutDescription: 'This dashboard provides transparent access to MGNREGA data for Maharashtra districts.',
    
    // Common
    loading: 'Loading...',
    error: 'Error loading data',
    noData: 'No data available',
    backToHome: 'Back to Home',
    information: 'Information',
    beneficiaries: 'Beneficiaries',
    guaranteedDays: '100 Days Guaranteed Employment',
    ruralDevelopment: 'Rural Development',
    infrastructure: 'Infrastructure',
  },
  
  hi: {
    // Home Page
    heroTitle: 'अपने जिले का MGNREGA प्रदर्शन देखें',
    heroSubtitle: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना',
    autoDetect: 'मेरा जिला स्वचालित रूप से खोजें',
    searchPlaceholder: 'जिले का नाम खोजें...',
    selectDistrict: 'जिला चुनें',
    viewDashboard: 'Dashboard देखें',
    detecting: 'स्थान का पता लगाया जा रहा है...',
    
    // Dashboard
    districtDashboard: 'जिला Dashboard',
    lastUpdated: 'अंतिम अपडेट',
    jobCardsIssued: 'जारी किए गए जॉब कार्ड',
    workersEmployed: 'कार्यरत श्रमिक',
    totalWorkDays: 'कुल कार्य दिवस',
    totalExpenditure: 'कुल व्यय',
    projectsCompleted: 'पूर्ण की गई परियोजनाएं',
    
    // Charts
    workDistribution: 'कार्य वितरण',
    expenditureBreakdown: 'व्यय विवरण',
    wagesPayments: 'मजदूरी और भुगतान',
    materialsCosts: 'सामग्री लागत',
    administrativeCosts: 'प्रशासनिक लागत',
    performanceIndicators: 'प्रदर्शन संकेतक',
    
    // About
    aboutMGNREGA: 'MGNREGA के बारे में',
    aboutDescription: 'यह डैशबोर्ड महाराष्ट्र जिलों के लिए MGNREGA डेटा तक पारदर्शी पहुंच प्रदान करता है।',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'डेटा लोड करने में त्रुटि',
    noData: 'कोई डेटा उपलब्ध नहीं',
    backToHome: 'होम पर वापस जाएं',
    information: 'जानकारी',
    beneficiaries: 'लाभार्थी',
    guaranteedDays: '100 दिन गारंटीड रोजगार',
    ruralDevelopment: 'ग्रामीण विकास',
    infrastructure: 'बुनियादी ढांचा',
  },
  
  mr: {
    // Home Page - Marathi
    heroTitle: 'तुमच्या जिल्ह्याची MGNREGA कामगिरी पहा',
    heroSubtitle: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार हमी योजना',
    autoDetect: 'माझा जिल्हा स्वयंचलितपणे शोधा',
    searchPlaceholder: 'जिल्ह्याचे नाव शोधा...',
    selectDistrict: 'जिल्हा निवडा',
    viewDashboard: 'Dashboard पहा',
    detecting: 'स्थान शोधत आहे...',
    beneficiaries: 'लाभार्थी',
    guaranteedDays: '100 दिवस गॅरंटीड रोजगार',
    ruralDevelopment: 'ग्रामीण विकास',
    infrastructure: 'पायाभूत सुविधा',
    
    // Dashboard
    districtDashboard: 'जिल्हा Dashboard',
    lastUpdated: 'शेवटचे अपडेट',
    jobCardsIssued: 'जारी केलेली जॉब कार्डे',
    workersEmployed: 'कार्यरत कामगार',
    totalWorkDays: 'एकूण कामाचे दिवस',
    totalExpenditure: 'एकूण खर्च',
    projectsCompleted: 'पूर्ण झालेले प्रकल्प',
    
    // Charts
    workDistribution: 'काम वितरण',
    expenditureBreakdown: 'खर्च तपशील',
    wagesPayments: 'वेतन आणि देयके',
    materialsCosts: 'सामग्री खर्च',
    administrativeCosts: 'प्रशासकीय खर्च',
    performanceIndicators: 'कामगिरी निर्देशक',
    
    // About
    aboutMGNREGA: 'MGNREGA बद्दल',
    aboutDescription: 'हा डॅशबोर्ड महाराष्ट्र जिल्ह्यांसाठी MGNREGA डेटामध्ये पारदर्शक प्रवेश प्रदान करतो।',
    
    // Common
    loading: 'लोड होत आहे...',
    error: 'डेटा लोड करताना त्रुटी',
    noData: 'डेटा उपलब्ध नाही',
    backToHome: 'मुख्यपृष्ठावर परत जा',
    information: 'माहिती',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hi'); // Default to Hindi

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
