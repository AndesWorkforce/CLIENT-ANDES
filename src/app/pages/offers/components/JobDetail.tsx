"use client";

import { Job } from "../data/mockData";

interface JobDetailProps {
  job: Job;
}

export default function JobDetail({ job }: JobDetailProps) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Encabezado */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {job.logoUrl && (
              <img
                src={job.logoUrl}
                alt={`${job.company} logo`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-[#08252A]">{job.title}</h1>
            <p className="text-gray-600">{job.company}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
            {job.location}
          </span>
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
            {job.modality}
          </span>
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
            {job.department}
          </span>
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-600">
            {job.seniority}
          </span>
        </div>

        <div className="mt-4">
          <p className="font-medium text-gray-800">
            Salario: <span className="text-[#0097B2]">{job.salary}</span>
          </p>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#08252A] mb-3">
            Descripción
          </h2>
          <p className="text-gray-700">{job.description}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#08252A] mb-3">
            What You&apos;ll Do
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {job.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#08252A] mb-3">
            Requirements
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#08252A] mb-3">
            What We&apos;re Looking For
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <button className="bg-[#0097B2] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#007A8C] transition-colors">
            Aplicar a esta oferta
          </button>
        </div>
      </div>
    </div>
  );
}
