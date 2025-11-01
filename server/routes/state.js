const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DistrictData = require('../models/DistrictData');
const { cache, getSampleData, transformAPIData } = require('../services/dataSync');

/**
 * GET /api/states
 * Get list of all states
 */
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'all_states';
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ source: 'cache', data: cached });
    }

    // If MongoDB is not connected, return fallback sample states
    if (mongoose.connection.readyState !== 1) {
      const fallbackStates = ['GUJARAT', 'MAHARASHTRA', 'RAJASTHAN', 'UTTAR PRADESH', 'MADHYA PRADESH', 'BIHAR'];
      cache.set(cacheKey, fallbackStates);
      return res.json({ source: 'fallback', data: fallbackStates });
    }

    const states = await DistrictData.distinct('stateName');

    cache.set(cacheKey, states);

    res.json({ source: 'database', data: states });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

/**
 * GET /api/states/:stateName/overview
 * Get state-level overview
 */
router.get('/:stateName/overview', async (req, res) => {
  try {
    const { stateName } = req.params;
    const { year = '2024-2025' } = req.query;
    
    const cacheKey = `state_overview_${stateName}_${year}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json({ source: 'cache', data: cached });
    }

    // If MongoDB not connected, build overview from sample data
    if (mongoose.connection.readyState !== 1) {
      const sample = getSampleData(stateName.toUpperCase());
      const transformed = transformAPIData(sample);

      const overviewData = transformed.reduce((acc, rec) => {
        acc.totalDistricts += 1;
        acc.totalJobCards += rec.totalJobCards || 0;
        acc.totalWorkers += rec.totalWorkers || 0;
        acc.activeWorkers += rec.activeWorkers || 0;
        acc.totalExpenditure += rec.totalExpenditure || 0;
        acc.totalWorks += rec.totalWorks || 0;
        acc.completedWorks += rec.completedWorks || 0;
        acc.avgDaysSum += rec.averageDaysPerHousehold || 0;
        acc.womenWorkers += rec.womenWorkers || 0;
        return acc;
      }, { totalDistricts: 0, totalJobCards: 0, totalWorkers: 0, activeWorkers: 0, totalExpenditure: 0, totalWorks: 0, completedWorks: 0, avgDaysSum: 0, womenWorkers: 0 });

      const overview = {
        totalDistricts: overviewData.totalDistricts,
        totalJobCards: overviewData.totalJobCards,
        totalWorkers: overviewData.totalWorkers,
        activeWorkers: overviewData.activeWorkers,
        totalExpenditure: overviewData.totalExpenditure,
        totalWorks: overviewData.totalWorks,
        completedWorks: overviewData.completedWorks,
        avgDays: overviewData.totalDistricts > 0 ? (overviewData.avgDaysSum / overviewData.totalDistricts) : 0,
        womenWorkers: overviewData.womenWorkers
      };

      const topDistricts = transformed
        .sort((a, b) => (b.averageDaysPerHousehold || 0) - (a.averageDaysPerHousehold || 0))
        .slice(0, 5)
        .map(d => ({ districtName: d.districtName, averageDaysPerHousehold: d.averageDaysPerHousehold, activeWorkers: d.activeWorkers }));

      const result = { overview, topPerformers: topDistricts };
      cache.set(cacheKey, result);
      return res.json({ source: 'fallback', data: result });
    }

    const overview = await DistrictData.aggregate([
      {
        $match: {
          stateName: stateName.toUpperCase(),
          financialYear: year
        }
      },
      {
        $group: {
          _id: null,
          totalDistricts: { $sum: 1 },
          totalJobCards: { $sum: '$totalJobCards' },
          totalWorkers: { $sum: '$totalWorkers' },
          activeWorkers: { $sum: '$activeWorkers' },
          totalExpenditure: { $sum: '$totalExpenditure' },
          totalWorks: { $sum: '$totalWorks' },
          completedWorks: { $sum: '$completedWorks' },
          avgDays: { $avg: '$averageDaysPerHousehold' },
          womenWorkers: { $sum: '$womenWorkers' }
        }
      }
    ]);

    const topDistricts = await DistrictData.find({
      stateName: stateName.toUpperCase(),
      financialYear: year
    })
    .sort({ averageDaysPerHousehold: -1 })
    .limit(5)
    .select('districtName averageDaysPerHousehold activeWorkers');

    const result = {
      overview: overview[0] || {},
      topPerformers: topDistricts
    };

    cache.set(cacheKey, result);

    res.json({ source: 'database', data: result });
  } catch (error) {
    console.error('Error fetching state overview:', error);
    res.status(500).json({ error: 'Failed to fetch state overview' });
  }
});

module.exports = router;
