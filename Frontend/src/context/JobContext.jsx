import { createContext, useContext, useEffect, useState } from 'react';

const JobContext = createContext();

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState(() => {
    try {
      const storedJobs = localStorage.getItem('jobs');
      if (!storedJobs || storedJobs === 'undefined') return [];
      return JSON.parse(storedJobs);
    } catch (error) {
      console.error('Failed to parse jobs from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch (error) {
      console.error('Failed to save jobs to localStorage:', error);
    }
  }, [jobs]);

  return (
    <JobContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobContext() {
  return useContext(JobContext);
}
