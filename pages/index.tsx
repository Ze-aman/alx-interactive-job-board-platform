// pages/index.tsx
import { Hero } from "@/components/hero/Hero";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { FilterSidebar } from "@/components/jobs/FilterSidebar";
import { JobCard } from "@/components/jobs/JobCard";

export default function Home() {
  return (
    <>
      <Hero />
      <SectionContainer className="py-10 flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        
        <div className="flex-1">
          {/* Header/Tabs Placeholder */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 dark:border-slate-800 pb-4">
             <h2 className="text-xl font-bold">Relevant Jobs (4)</h2>
             <div className="text-sm text-gray-500">
               Sort by: <span className="text-[#137fec] font-bold">Most Recent</span>
             </div>
          </div>
          
          {/* Job Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <JobCard 
              title="Senior Frontend Developer"
              company="TechFlow"
              location="New York, NY"
              salary="$120k - $150k"
              type="Full-time"
              postedAt="Posted 2 days ago"
              isRemote={true}
              logoColor="bg-blue-400/20"
            />
            <JobCard 
              title="UX/UI Designer"
              company="Creative Studio"
              location="Austin, TX"
              salary="$90k - $120k"
              type="Contract"
              postedAt="Posted 5 hours ago"
              logoColor="bg-orange-400/20"
            />
            <JobCard 
              title="Data Engineer"
              company="CloudScale"
              location="San Francisco, CA"
              salary="$150k - $190k"
              type="Full-time"
              postedAt="Posted 1 week ago"
              logoColor="bg-emerald-400/20"
            />
            <JobCard 
              title="Growth Marketing Lead"
              company="BrandPulse"
              location="London, UK"
              salary="$80k - $110k"
              type="Remote"
              postedAt="Posted 3 days ago"
              isRemote={true}
              logoColor="bg-purple-400/20"
            />
          </div>
        </div>
      </SectionContainer>
    </>
  );
}