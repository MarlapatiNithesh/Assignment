const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const Job = require('./Models/Job');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Your API routes
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;

// ✅ Function to load jobs from JSONL file
async function loadJobsFromJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    await Job.deleteMany({});
    console.log('🗑️ Cleared existing jobs in DB');

    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);
    const jobs = lines.map(line => JSON.parse(line));

    for (const job of jobs) {
      if (job.job_description) {
        job.description = job.job_description;
        delete job.job_description;
      }

      await Job.create(job);
    }

    console.log(`✅ Loaded ${jobs.length} jobs from JSONL file`);
  } catch (error) {
    console.error('❌ Failed to load jobs from JSONL:', error.message);
  }
}

// Start server and optionally load jobs on startup
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  if (process.env.LOAD_JOBS_ON_STARTUP === 'true') {
    const filePath = path.join(__dirname, 'jobs.json');
    loadJobsFromJSON(filePath);
  }
});
