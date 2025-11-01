require('dotenv').config();
const mongoose = require('mongoose');
const DistrictData = require('../models/DistrictData');
const { getSampleData, transformAPIData } = require('../services/dataSync');

/**
 * Seed database with sample data for all supported states
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mgnrega';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // List of all supported states
    const states = [
      'GUJARAT',
      'MAHARASHTRA',
      'RAJASTHAN',
      'UTTAR PRADESH',
      'MADHYA PRADESH',
      'BIHAR'
    ];

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await DistrictData.deleteMany({});
    console.log('✅ Existing data cleared');

    let totalRecords = 0;

    // Seed data for each state
    for (const state of states) {
      console.log(`\n📊 Processing ${state}...`);
      
      // Get sample data for this state
      const sampleData = getSampleData(state);
      const transformedData = transformAPIData(sampleData);
      
      console.log(`   Found ${transformedData.length} districts`);

      // Prepare bulk operations
      const bulkOps = transformedData.map(record => ({
        updateOne: {
          filter: {
            stateName: record.stateName,
            districtName: record.districtName,
            financialYear: record.financialYear,
            monthYear: record.monthYear
          },
          update: { 
            $set: { 
              ...record, 
              dataSource: 'sample',
              lastUpdated: new Date() 
            } 
          },
          upsert: true
        }
      }));

      // Insert records
      const result = await DistrictData.bulkWrite(bulkOps);
      console.log(`   ✅ Inserted/Updated: ${result.upsertedCount + result.modifiedCount} records`);
      totalRecords += transformedData.length;
    }

    console.log(`\n🎉 Database seeding completed!`);
    console.log(`📊 Total records: ${totalRecords}`);
    console.log(`🗂️  States: ${states.length}`);
    
    // Show summary
    const summary = await DistrictData.aggregate([
      {
        $group: {
          _id: '$stateName',
          districts: { $sum: 1 },
          totalWorkers: { $sum: '$totalWorkers' },
          totalExpenditure: { $sum: '$totalExpenditure' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📈 Summary by State:');
    summary.forEach(state => {
      console.log(`   ${state._id}: ${state.districts} districts, ${state.totalWorkers.toLocaleString()} workers, ₹${(state.totalExpenditure / 10000000).toFixed(2)}Cr expenditure`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
