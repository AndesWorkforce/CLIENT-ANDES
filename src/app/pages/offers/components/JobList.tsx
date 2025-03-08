"use client";

import { Job } from "../data/mockData";

interface JobListProps {
  jobs: Job[];
  selectedJobId?: number;
  onSelectJob: (job: Job) => void;
}

export default function JobList({
  jobs,
  selectedJobId,
  onSelectJob,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">
          No se encontraron ofertas de trabajo que coincidan con los filtros
          seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg text-[#08252A]">
          Servicios requeridos
        </h2>
        <p className="text-gray-500 text-sm">
          {jobs.length} ofertas encontradas
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
              job.id === selectedJobId
                ? "bg-gray-50 border-l-4 border-[#0097B2]"
                : ""
            }`}
            onClick={() => onSelectJob(job)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {job.logoUrl && (
                  <img
                    src={job.logoUrl}
                    alt={`${job.company} logo`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="font-medium text-[#08252A]">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                {job.department}
              </span>
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                {job.location}
              </span>
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                {job.modality}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
