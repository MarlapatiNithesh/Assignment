import { useNavigate } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';

export default function Results() {
  const { jobs } = useJobContext();
  const navigate = useNavigate();

  if (!jobs || jobs.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-xl">
          No job results available. Please upload a resume or search again.
        </p>
      </main>
    );
  }

  // Detect format: if first item has 'job' property, it's format A
  // else it's format B (direct job objects)
  const isFormatA = jobs[0] && jobs[0].job !== undefined;

  // Normalize the jobs array to a common shape
  // Each element: { job, matchScore, matchedSkills }
  const normalizedJobs = isFormatA
    ? jobs
    : jobs.map((jobObj) => ({
        job: jobObj,
        matchScore: null,
        matchedSkills: [],
      }));

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Job Results</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Back to home"
            type="button"
          >
            ← Back to Home
          </button>
        </header>

        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-live="polite"
        >
          {normalizedJobs.map(({ job, matchScore, matchedSkills }, index) => {
            if (!job) return null;

            // Use _id or fallback to index for keys
            const key = job._id || job.id || index;

            return (
              <JobCard
                key={key}
                job={job}
                matchScore={matchScore}
                matchedSkills={matchedSkills}
              />
            );
          })}
        </section>
      </div>
    </main>
  );
}
