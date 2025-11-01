const { getSampleData, transformAPIData } = require('./server/services/dataSync');
const fs = require('fs');
const path = require('path');

// Generate sample data for all states
const states = ['GUJARAT', 'MAHARASHTRA', 'RAJASTHAN', 'UTTAR PRADESH', 'MADHYA PRADESH', 'BIHAR'];

const allData = [];

states.forEach(state => {
  console.log(`Generating data for ${state}...`);
  const sampleData = getSampleData(state);
  const transformedData = transformAPIData(sampleData);
  allData.push(...transformedData);
  console.log(`✅ ${state}: ${transformedData.length} districts`);
});

// Write to JSON file
const outputPath = path.join(__dirname, 'sample-data-all-states.json');
fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));

console.log(`\n🎉 Generated ${allData.length} records for ${states.length} states`);
console.log(`📄 Saved to: ${outputPath}`);

// Summary
const summary = states.map(state => {
  const stateData = allData.filter(d => d.stateName === state);
  return {
    state,
    districts: stateData.length,
    totalWorkers: stateData.reduce((sum, d) => sum + d.totalWorkers, 0),
    totalExpenditure: stateData.reduce((sum, d) => sum + d.totalExpenditure, 0)
  };
});

console.log('\n📊 Summary:');
summary.forEach(s => {
  console.log(`   ${s.state}: ${s.districts} districts, ${s.totalWorkers.toLocaleString()} workers, ₹${(s.totalExpenditure/10000000).toFixed(2)}Cr`);
});
