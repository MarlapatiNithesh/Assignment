const Job = require("../Models/Job");
const SearchKeyword = require("../Models/SearchKeyword");

const JobSearch = async (req, res) => {
  try {
    const rawQuery = req.query.q || '';
    const query = rawQuery.trim();

    // Log and track non-empty search term
    if (query.length > 0) {
      await SearchKeyword.findOneAndUpdate(
        { term: query },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
    }

    // Return early if query is empty
    if (!query) {
      return res.status(200).json({ jobs: [] });
    }

    let jobs = await Job.find({
      $or: [
        { job_title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { job_location: { $regex: query, $options: 'i' } },
        { company_name: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    // Fallback to word-by-word match if no results
    if (jobs.length === 0) {
      const words = query.split(' ').filter(Boolean);

      if (words.length > 0) {
        const conditions = words.map(word => ({
          $or: [
            { job_title: { $regex: word, $options: 'i' } },
            { description: { $regex: word, $options: 'i' } },
            { job_location: { $regex: word, $options: 'i' } },
            { company_name: { $regex: word, $options: 'i' } }
          ]
        }));

        jobs = await Job.find({ $and: conditions }).limit(20);
      }
    }

    return res.status(200).json({ jobs });

  } catch (error) {
    console.error('JobSearch error:', error);
    return res.status(500).json({ message: 'Something went wrong while searching for jobs' });
  }
};

module.exports = { JobSearch };
