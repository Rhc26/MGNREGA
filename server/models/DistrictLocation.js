const mongoose = require('mongoose');

const districtLocationSchema = new mongoose.Schema({
  districtName: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stateName: {
    type: String,
    required: true,
    index: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  boundingBox: {
    north: Number,
    south: Number,
    east: Number,
    west: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DistrictLocation', districtLocationSchema);
