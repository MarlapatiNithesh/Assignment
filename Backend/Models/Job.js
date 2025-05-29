const mongoose = require('mongoose');

// Define the schema
const jobSchema = new mongoose.Schema({
  job_title: String,
  company_name: String,
  job_location: String,
  apply_link: String,
  source: String,
  description: String, // This field stores job descriptions
}, { timestamps: true }); // Adds createdAt and updatedAt

// ✅ Create a text index for full-text search support
jobSchema.index({
  job_title: 'text',
  company_name: 'text',
  description: 'text',
});

// Create and export the model
const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
