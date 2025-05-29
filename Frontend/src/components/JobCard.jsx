import { useState } from 'react';

export default function JobCard({ job, matchScore, matchedSkills }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const previewLength = 300;
  const description = job.description || '';
  const isLong = description.length > previewLength;
  const previewText = isLong ? description.slice(0, previewLength) + '...' : description;

  // Support both formats (different keys)
  const title = job.job_title || job.title || 'Untitled Role';
  const company = job.company_name || job.company || 'Unknown Company';
  const location = job.job_location || job.location || 'Unknown Location';
  const applyLink = job.apply_link || job.applyUrl || job.application_link || null;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 border border-gray-200 flex flex-col gap-4">
      {/* Job Title */}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      {/* Company and Location */}
      <p className="text-gray-600 text-sm">
        <span className="font-medium">{company}</span>
        {' • '}
        <span>{location}</span>
      </p>

      {/* Match Score and Skills */}
      {typeof matchScore === 'number' && (
        <p className="text-green-600 font-semibold text-sm">Match Score: {matchScore}%</p>
      )}

      {Array.isArray(matchedSkills) && matchedSkills.length > 0 && (
        <p className="text-gray-500 text-xs">Matched Skills: {matchedSkills.join(', ')}</p>
      )}

      {/* Description */}
      <div className="text-gray-700 text-sm whitespace-pre-line">
        {isExpanded ? description : previewText}
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-blue-600 font-semibold hover:underline focus:outline-none"
            aria-label={isExpanded ? 'Read less' : 'Read more'}
            type="button"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Apply Link */}
      <div className="mt-4">
        {applyLink ? (
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition"
          >
            Apply Now
          </a>
        ) : (
          <span className="text-gray-400 italic">No application link available</span>
        )}
      </div>
    </div>
  );
}
