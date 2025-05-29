import { useState } from 'react';
import { useJobContext } from '../context/JobContext';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setJobs } = useJobContext();
  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmed = searchTerm.trim();
    if (trimmed === '') {
      setJobs([]);
      setError('');
      if (onSearch) onSearch([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      params.append('q', trimmed);

      const res = await fetch(`https://assignment-backend-he4q.onrender.com/api/jobs?${params.toString()}`);
      const contentType = res.headers.get('content-type') || '';

      if (!res.ok) {
        let errorMessage = `Error: ${res.status}`;
        if (contentType.includes('application/json')) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const text = await res.text();
          errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Server did not return JSON');
      }

      const jobs = await res.json();
      const jobList = jobs.jobs || [];
      console.log('job list',jobList)
      setJobs(jobList);
      if (onSearch) onSearch(jobList);

      if (jobList.length > 0) {
        navigate('/results');
      } else {
        setError('No jobs found for your search.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setJobs([]);
      if (onSearch) onSearch([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Field */}
      <label htmlFor="job-search" className="sr-only">Search jobs</label>
      <input
        id="job-search"
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setError('');
        }}
        placeholder="Search by role, location, or company..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={loading || searchTerm.trim() === ''}
        className="w-full sm:w-auto bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
