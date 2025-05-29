const { v4: uuidv4 } = require("uuid");
const pdfParse = require("pdf-parse");
const UserSession = require("../Models/UserSession");
const Job = require("../Models/Job");

const extractTextFromResume = async (file) => {
  if (!file) return "";
  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  } else {
    return file.buffer.toString("utf-8");
  }
};

const predictJobRole = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    const resumeText = await extractTextFromResume(req.file);
    if (!resumeText.trim()) {
      return res.status(400).json({ message: "Empty resume content" });
    }

    const sessionId = uuidv4();
    const allJobs = await Job.find({});

    const resumeWords = resumeText.toLowerCase().split(/\W+/);
    const topMatches = allJobs.map(job => {
      const jobText = (
        job.job_title + " " +
        job.description + " " +
        job.company_name
      ).toLowerCase();

      const jobWords = jobText.split(/\W+/);
      const matchedWords = resumeWords.filter(word => jobWords.includes(word));
      const matchScore = (matchedWords.length / jobWords.length) * 100;

      const matchedSkills = [...new Set(matchedWords.filter(word =>
        jobText.includes(word)
      ))];

      return {
        job,
        matchScore: Math.round(matchScore),
        matchedSkills
      };
    });

    const sortedMatches = topMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    const predictedRoles = [...new Set(sortedMatches.map(m => m.job.job_title))];

    await UserSession.create({
      sessionId,
      uploadedFiles: [req.file.originalname],
      predictedRoles
    });

    res.status(200).json({
      sessionId,
      predictedRoles,
      matchedJobs: sortedMatches
    });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to process resume" });
  }
};

module.exports = { predictJobRole };
