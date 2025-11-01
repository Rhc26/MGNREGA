const axios = require('axios');
const DistrictData = require('../models/DistrictData');
const NodeCache = require('node-cache');

// Cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

/**
 * Fetch MGNREGA data from official NREGA API
 * Using the public MGNREGA reports API
 */
async function fetchFromDataGovAPI(stateName, financialYear) {
  try {
    // MGNREGA provides state-wise data through their public API
    // State code for Maharashtra is 27
    const stateCode = getStateCode(stateName);
    const finyear = financialYear || '2024-2025';
    
    // Official MGNREGA API endpoints
    const apiUrl = `https://nrega.nic.in/netnrega/api/stateDistrictData`;
    
    const response = await axios.get(apiUrl, {
      params: {
        state_code: stateCode,
        fin_year: finyear,
        format: 'json'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      },
      timeout: 30000
    });

    console.log('✅ Successfully fetched data from MGNREGA API');
    return response.data;
  } catch (error) {
    console.error('Error fetching from MGNREGA API:', error.message);
    throw error;
  }
}

/**
 * Get state code for MGNREGA API
 */
function getStateCode(stateName) {
  const stateCodes = {
    'MAHARASHTRA': '27',
    'UTTAR PRADESH': '09',
    'MADHYA PRADESH': '23',
    'RAJASTHAN': '08',
    'BIHAR': '10',
    'GUJARAT': '24',
    // Add more states as needed
  };
  return stateCodes[stateName.toUpperCase()] || '27';
}

/**
 * Transform API data to our schema format
 */
function transformAPIData(apiData) {
  // Handle both real API and fallback data
  const records = apiData.records || apiData.data || apiData;
  
  if (!Array.isArray(records)) {
    console.warn('API data is not in expected format, using records directly');
    return [];
  }
  
  return records.map(record => {
    // Handle various field name formats from API
    const getField = (record, ...possibleNames) => {
      for (const name of possibleNames) {
        if (record[name] !== undefined && record[name] !== null) {
          return record[name];
        }
      }
      return null;
    };
    
    return {
  stateName: getField(record, 'state_name', 'State Name', 'stateName') || 'GUJARAT',
      districtName: getField(record, 'district_name', 'District Name', 'districtName') || 'UNKNOWN',
      financialYear: getField(record, 'financial_year', 'Financial Year', 'fin_year') || '2024-2025',
      monthYear: getField(record, 'month_year', 'Month-Year', 'monthYear') || 'Current',
      totalJobCards: parseInt(getField(record, 'total_jobcards', 'Total Job Cards', 'job_cards_issued')) || 0,
      totalWorkers: parseInt(getField(record, 'total_workers', 'Total Workers', 'registered_workers')) || 0,
      activeJobCards: parseInt(getField(record, 'active_jobcards', 'Active Job Cards', 'active_job_cards')) || 0,
      activeWorkers: parseInt(getField(record, 'active_workers', 'Active Workers', 'workers_employed')) || 0,
      employmentProvided: parseInt(getField(record, 'employment_provided', 'Employment Provided', 'persondays_generated')) || 0,
      averageDaysPerHousehold: parseFloat(getField(record, 'avg_days_per_household', 'Average Days', 'avg_days')) || 0,
      totalWorks: parseInt(getField(record, 'total_works', 'Total Works', 'works_total')) || 0,
      completedWorks: parseInt(getField(record, 'completed_works', 'Completed Works', 'works_completed')) || 0,
      ongoingWorks: parseInt(getField(record, 'ongoing_works', 'Ongoing Works', 'works_ongoing')) || 0,
      totalExpenditure: parseFloat(getField(record, 'total_expenditure', 'Total Expenditure', 'expenditure_total')) || 0,
      wageExpenditure: parseFloat(getField(record, 'wage_expenditure', 'Wage Expenditure', 'wages_paid')) || 0,
      materialExpenditure: parseFloat(getField(record, 'material_expenditure', 'Material Expenditure', 'material_cost')) || 0,
      scWorkers: parseInt(getField(record, 'sc_workers', 'SC Workers', 'sc_persondays')) || 0,
      stWorkers: parseInt(getField(record, 'st_workers', 'ST Workers', 'st_persondays')) || 0,
      othersWorkers: parseInt(getField(record, 'others_workers', 'Others Workers', 'others_persondays')) || 0,
      womenWorkers: parseInt(getField(record, 'women_workers', 'Women Workers', 'women_persondays')) || 0
    };
  });
}

/**
 * Fetch from alternative MGNREGA public data sources
 */
async function fetchFromPublicReports(stateName) {
  try {
    // Try MGNREGA public reports API
    const stateCode = getStateCode(stateName);
    const urls = [
      `https://nrega.nic.in/netnrega/state_html/emp_status.aspx?state_code=${stateCode}`,
      `https://nrega.nic.in/Netnrega/AnnualReport/work_progress.aspx?state_code=${stateCode}`,
      // Add more public endpoints
    ];
    
    // Try multiple sources
    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000
        });
        if (response.data) {
          console.log(`✅ Fetched from public reports: ${url}`);
          return response.data;
        }
      } catch (err) {
        console.log(`Failed to fetch from ${url}`);
        continue;
      }
    }
    throw new Error('All API sources failed');
  } catch (error) {
    console.error('Error fetching from public reports:', error.message);
    throw error;
  }
}

/**
 * Sync MGNREGA data to database
 */
async function syncMGNREGAData(stateName = 'GUJARAT') {
  try {
    console.log(`Syncing MGNREGA data for ${stateName}...`);
    
    const currentYear = '2024-2025';
    let apiData;
    let dataSource = 'fallback';
    
    // Try multiple API sources in order
    try {
      console.log('Attempting to fetch from MGNREGA API...');
      apiData = await fetchFromDataGovAPI(stateName, currentYear);
      dataSource = 'mgnrega-api';
    } catch (apiError) {
      console.log('Primary API failed, trying public reports...');
      try {
        apiData = await fetchFromPublicReports(stateName);
        dataSource = 'public-reports';
      } catch (publicError) {
        console.warn('All API sources failed, using fallback data');
        apiData = getSampleData(stateName);
        dataSource = 'fallback';
      }
    }
    
    console.log(`Using data source: ${dataSource}`);
    const transformedData = transformAPIData(apiData);
    
    if (transformedData.length === 0) {
      console.warn('No data transformed, using fallback');
      const fallbackData = getSampleData(stateName);
      transformedData = transformAPIData(fallbackData);
    }
    
    // Bulk upsert to database
    const bulkOps = transformedData.map(record => ({
      updateOne: {
        filter: {
          stateName: record.stateName,
          districtName: record.districtName,
          financialYear: record.financialYear,
          monthYear: record.monthYear
        },
        update: { $set: { ...record, dataSource, lastUpdated: new Date() } },
        upsert: true
      }
    }));
    
    const result = await DistrictData.bulkWrite(bulkOps);
    console.log(`✅ Synced ${result.upsertedCount} new records, ${result.modifiedCount} updated`);
    
    // Clear cache after sync
    cache.flushAll();
    
    return result;
  } catch (error) {
    console.error('Error syncing MGNREGA data:', error);
    throw error;
  }
}

/**
 * Get sample/fallback data for districts (supports Gujarat and Maharashtra)
 */
function getSampleData(stateName = 'GUJARAT') {
  // Sample data for demonstration - generate districts depending on state
  const upperState = stateName.toUpperCase();

  let districts = [];

  if (upperState === 'GUJARAT') {
    districts = [
      'AHMEDABAD', 'SURAT', 'VADODARA', 'RAJKOT', 'GANDHINAGAR',
      'BHAVNAGAR', 'JAMNAGAR', 'JUNAGADH', 'BHARUCH', 'NAVSARI',
      'SURENDRANAGAR', 'MEHSANA', 'PORBANDAR', 'AMRELI', 'NARMADA',
      'MAHESANA', 'KUTCH', 'PANCHMAHAL', 'BANASKANTHA', 'ANAND'
    ];
  } else if (upperState === 'MAHARASHTRA') {
    districts = [
      'MUMBAI', 'PUNE', 'NAGPUR', 'THANE', 'NASHIK', 
      'AURANGABAD', 'SOLAPUR', 'AMRAVATI', 'KOLHAPUR', 'SANGLI',
      'JALGAON', 'AHMEDNAGAR', 'LATUR', 'DHULE', 'RATNAGIRI',
      'SATARA', 'NANDED', 'BEED', 'JALNA', 'OSMANABAD'
    ];
  } else if (upperState === 'RAJASTHAN') {
    districts = [
      'JAIPUR', 'JODHPUR', 'UDAIPUR', 'KOTA', 'AJMER',
      'BIKANER', 'ALWAR', 'BHARATPUR', 'BHILWARA', 'SIKAR',
      'PALI', 'TONK', 'CHURU', 'JAISALMER', 'BARMER'
    ];
  } else if (upperState === 'UTTAR PRADESH') {
    districts = [
      'LUCKNOW', 'KANPUR', 'AGRA', 'VARANASI', 'ALLAHABAD',
      'MEERUT', 'GHAZIABAD', 'BAREILLY', 'ALIGARH', 'MORADABAD',
      'GORAKHPUR', 'NOIDA', 'FIROZABAD', 'JHANSI', 'MUZAFFARNAGAR'
    ];
  } else if (upperState === 'MADHYA PRADESH') {
    districts = [
      'BHOPAL', 'INDORE', 'JABALPUR', 'GWALIOR', 'UJJAIN',
      'SAGAR', 'RATLAM', 'SATNA', 'DEWAS', 'REWA',
      'KATNI', 'SINGRAULI', 'BURHANPUR', 'KHANDWA', 'CHHINDWARA'
    ];
  } else if (upperState === 'BIHAR') {
    districts = [
      'PATNA', 'GAYA', 'BHAGALPUR', 'MUZAFFARPUR', 'DARBHANGA',
      'PURNIA', 'ARRAH', 'BEGUSARAI', 'KATIHAR', 'MUNGER',
      'CHAPRA', 'SAMASTIPUR', 'SITAMARHI', 'BETTIAH', 'HAJIPUR'
    ];
  } else {
    // Default fallback for unknown states
    districts = [
      'DISTRICT-1', 'DISTRICT-2', 'DISTRICT-3', 'DISTRICT-4', 'DISTRICT-5',
      'DISTRICT-6', 'DISTRICT-7', 'DISTRICT-8', 'DISTRICT-9', 'DISTRICT-10'
    ];
  }

  return {
    records: districts.map((district, index) => {
      const baseValue = 10000 + (index * 1000);
      return {
        state_name: stateName,
        district_name: district,
        financial_year: '2024-2025',
        month_year: 'October-2025',
        total_jobcards: baseValue + Math.floor(Math.random() * 5000),
        total_workers: Math.floor((baseValue * 1.5) + Math.floor(Math.random() * 7000)),
        active_jobcards: Math.floor(baseValue * 0.6) + Math.floor(Math.random() * 2000),
        active_workers: Math.floor(baseValue * 0.9) + Math.floor(Math.random() * 3000),
        employment_provided: Math.floor(baseValue * 2.5) + Math.floor(Math.random() * 10000),
        avg_days_per_household: 30 + Math.floor(Math.random() * 40),
        total_works: Math.floor(baseValue * 0.1) + Math.floor(Math.random() * 500),
        completed_works: Math.floor(baseValue * 0.05) + Math.floor(Math.random() * 200),
        ongoing_works: Math.floor(baseValue * 0.03) + Math.floor(Math.random() * 150),
        total_expenditure: (baseValue * 500) + Math.floor(Math.random() * 1000000),
        wage_expenditure: (baseValue * 350) + Math.floor(Math.random() * 700000),
        material_expenditure: (baseValue * 150) + Math.floor(Math.random() * 300000),
        sc_workers: Math.floor(baseValue * 0.2) + Math.floor(Math.random() * 1000),
        st_workers: Math.floor(baseValue * 0.05) + Math.floor(Math.random() * 500),
        others_workers: Math.floor(baseValue * 0.4) + Math.floor(Math.random() * 2000),
        women_workers: Math.floor(baseValue * 0.48) + Math.floor(Math.random() * 2500)
      };
    })
  };
}

module.exports = {
  fetchFromDataGovAPI,
  syncMGNREGAData,
  cache,
  // Export helpers for routes to use fallback/sample data
  getSampleData,
  transformAPIData
};
