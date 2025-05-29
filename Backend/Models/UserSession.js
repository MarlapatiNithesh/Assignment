const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, required: true },
  uploadedFiles: [String], // Array of file names or URLs
  predictedRoles: [String], // Array of predicted job roles for this session
  createdAt: { type: Date, default: Date.now }
});

const UserSession = mongoose.model('UserSession', UserSessionSchema);

module.exports = UserSession;
