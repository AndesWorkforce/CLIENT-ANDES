"use client";

import { useState } from "react";
import { jobs, Job } from "./data/mockData";
import JobFilters from "./components/JobFilters";
import JobList from "./components/JobList";
import JobDetail from "./components/JobDetail";

interface Filters {
  department: string;
  date: string;
  seniority: string;
  location: string;
  modality: string;
}

export default function JobOffersPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(
    jobs.length > 0 ? jobs[0] : null
  );
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleFilterJobs = (filters: Filters) => {
    const filtered = jobs.filter((job) => {
      if (
        filters.department !== "todos" &&
        job.department !== filters.department
      )
        return false;
      if (filters.date !== "todos" && job.postDate !== filters.date)
        return false;
      if (filters.seniority !== "todos" && job.seniority !== filters.seniority)
        return false;
      if (filters.location !== "todos" && job.location !== filters.location)
        return false;
      if (filters.modality !== "todos" && job.modality !== filters.modality)
        return false;
      return true;
    });

    setFilteredJobs(filtered);
    if (
      filtered.length > 0 &&
      !filtered.find((j: Job) => j.id === selectedJob?.id)
    ) {
      setSelectedJob(filtered[0]);
    } else if (filtered.length === 0) {
      setSelectedJob(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <div className="container mx-auto pt-4 px-4">
        <h1 className="text-3xl font-bold text-[#08252A] mb-6">
          Ofertas de empleo
        </h1>

        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <JobFilters onFilter={handleFilterJobs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <JobList
              jobs={filteredJobs}
              selectedJobId={selectedJob?.id}
              onSelectJob={handleSelectJob}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedJob ? (
              <JobDetail job={selectedJob} />
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">
                  Selecciona una oferta de trabajo para ver los detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
