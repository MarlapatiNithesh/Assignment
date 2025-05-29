import { useNavigate } from 'react-router-dom';
import { useJobContext } from '../context/JobContext';
import JobCard from '../components/JobCard';

export default function Results() {
  const { jobs } = useJobContext();
  const navigate = useNavigate();

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
            {jobs.map((match, index) => {
              if (!match.job) return null; // skip invalid entries

              const key =
                match.job._id ||
                match.job.id ||
                match.job.job_id ||
                match.job.title ||
                index;

              return (
                <JobCard
                  key={key}
                  job={match.job}
                  matchScore={match.matchScore}
                  matchedSkills={match.matchedSkills}
                />
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
