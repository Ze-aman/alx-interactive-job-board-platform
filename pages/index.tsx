// pages/index.tsx
import { Hero } from "@/components/hero/Hero";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { FilterSidebar } from "@/components/jobs/FilterSidebar";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobs } from "@/hooks/useJobs";

export default function Home() {
  return (
    <>
      <Hero />
      <SectionContainer className="py-10 flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        
        <div className="flex-1">
          <HeaderWithCount />
          <JobsGrid />
        </div>
      </SectionContainer>
    </>
  );
}

function HeaderWithCount() {
  const { jobs } = useJobs();
  return (
    <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
      <h2 className="text-xl font-bold">Relevant Jobs ({jobs.length})</h2>
      <div className="text-sm text-gray-500">
        Sort by: <span className="text-[#137fec] font-bold">Most Recent</span>
      </div>
    </div>
  );
}

function JobsGrid() {
  const { jobs, loading } = useJobs();
  if (loading) return <p className="text-sm text-gray-500">Loading jobs...</p>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {jobs.map((j: any) => (
        <JobCard
          key={j.id}
          id={String(j.id)}
          title={j.title}
          company={j.company_name}
          location={j.location}
          salary={
            j.salary_min && j.salary_max
              ? `${Number(j.salary_min).toLocaleString()} - ${Number(j.salary_max).toLocaleString()}`
              : '—'
          }
          type={j.employment_type || '—'}
          postedAt={new Date(j.created_at).toLocaleDateString()}
        />
      ))}
    </div>
  );
}