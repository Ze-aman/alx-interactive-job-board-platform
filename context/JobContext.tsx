import React, { createContext, useContext, useEffect, useState } from 'react';

export interface JobFilters {
  search?: string;
  category?: string;
  location?: string;
  experience?: 'entry' | 'mid' | 'senior';
  page?: number;
}

interface Job {
  id: number;
  title: string;
  company_name: string;
  location: string;
  employment_type?: string;
  salary_min?: number;
  salary_max?: number;
  created_at: string;
}

interface JobContextType {
  jobs: Job[];
  filters: JobFilters;
  loading: boolean;
  setFilters: (filters: JobFilters) => void;
  refresh: () => void;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({});
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    const usp = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      const str = String(val);
      if (str.trim() === '') return;
      usp.append(key, str);
    });
    const params = usp.toString();

    try {
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setJobs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  return (
    <JobContext.Provider
      value={{
        jobs,
        filters,
        loading,
        setFilters,
        refresh: fetchJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};
