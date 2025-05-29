import { useNavigate } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';

export default function Results() {
  const { jobs } = useJobContext();
  const navigate = useNavigate();

  console.log('jobs from context:', jobs);

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

        {(!jobs || jobs.length === 0) ? (
          <p className="text-center text-gray-600 text-lg mt-20">
            No job results available. Please upload a resume or search again.
          </p>
        ) : (
          <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-live="polite"
          >
            {jobs.map((item, index) => {
              // Determine if item is Format A (with job inside) or Format B (direct job)
              const isFormatA = item && item.job !== undefined;

              const job = isFormatA ? item.job : item;
              const matchScore = isFormatA ? item.matchScore : undefined;
              const matchedSkills = isFormatA ? item.matchedSkills : undefined;

              if (!job) return null;

              const key =
                job._id ||
                job.id ||
                job.job_id ||
                job.job_title ||
                index;

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
        )}
      </div>
    </main>
  );
}
