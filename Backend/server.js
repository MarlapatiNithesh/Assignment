const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const connectDB = require("./config/db");
const Job = require("./Models/Job");

const jobRoutes = require("./routes/jobs");
const uploadRoutes = require("./routes/upload");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Load jobs from JSONL on startup if env variable is set
if (process.env.LOAD_JOBS_ON_STARTUP === "true") {
  const filePath = path.join(__dirname, "jobs.json");
  loadJobsFromJSON(filePath);
}

async function loadJobsFromJSONL(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return;
    }

    await Job.deleteMany({});
    console.log("🗑️ Cleared existing jobs in DB");

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (!line.trim()) continue;

      try {
        const job = JSON.parse(line);

        // Normalize property
        if (job.job_description) {
          job.description = job.job_description;
          delete job.job_description;
        }

        await Job.create(job);
      } catch (err) {
        console.error("❌ Failed to parse/save job:", err.message);
      }
    }

    console.log("✅ Jobs loaded from JSONL file");
  } catch (error) {
    console.error("❌ Failed to load jobs from JSONL:", error.message);
  }
}
