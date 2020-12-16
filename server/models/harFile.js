const mongoose = require('mongoose');

// Create schema for user
const harFileSchema = mongoose.Schema({
  upload: mongoose.Schema.Types.Mixed,
  harRequests: mongoose.Schema.Types.Mixed,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const HarFile = mongoose.model('HarFile', harFileSchema);

module.exports = HarFile;
