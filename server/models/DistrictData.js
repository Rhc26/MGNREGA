const mongoose = require('mongoose');

const districtDataSchema = new mongoose.Schema({
  stateName: {
    type: String,
    required: true,
    index: true
  },
  districtName: {
    type: String,
    required: true,
    index: true
  },
  financialYear: {
    type: String,
    required: true,
    index: true
  },
  monthYear: {
    type: String,
    required: true,
    index: true
  },
  totalJobCards: {
    type: Number,
    default: 0
  },
  totalWorkers: {
    type: Number,
    default: 0
  },
  activeJobCards: {
    type: Number,
    default: 0
  },
  activeWorkers: {
    type: Number,
    default: 0
  },
  employmentProvided: {
    type: Number,
    default: 0
  },
  averageDaysPerHousehold: {
    type: Number,
    default: 0
  },
  totalWorks: {
    type: Number,
    default: 0
  },
  completedWorks: {
    type: Number,
    default: 0
  },
  ongoingWorks: {
    type: Number,
    default: 0
  },
  totalExpenditure: {
    type: Number,
    default: 0
  },
  wageExpenditure: {
    type: Number,
    default: 0
  },
  materialExpenditure: {
    type: Number,
    default: 0
  },
  scWorkers: {
    type: Number,
    default: 0
  },
  stWorkers: {
    type: Number,
    default: 0
  },
  othersWorkers: {
    type: Number,
    default: 0
  },
  womenWorkers: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
districtDataSchema.index({ stateName: 1, districtName: 1, financialYear: 1, monthYear: 1 }, { unique: true });

module.exports = mongoose.model('DistrictData', districtDataSchema);
