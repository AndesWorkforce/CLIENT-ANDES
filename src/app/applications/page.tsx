"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import {
  Application,
  getMyApplications,
} from "@/app/applications/actions/applications.actions";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await getMyApplications(page);

      console.log("response", response);

      if (page === 1) {
        setApplications(response.data.items);
      } else {
        setApplications((prev) => [...prev, ...response.data.items]);
      }

      setHasMore(page < response.data.pagination.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setIsLoading(false);
    }
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    fetchApplications();
  }, [page]);

  console.log("[page] applications", applications);

  const renderStatusIndicator = (status: string) => {
    if (status === "PENDIENTE") {
      return (
        <div className="flex items-center">
          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
          <span className="text-gray-600">Pending</span>
        </div>
      );
    } else if (status === "EN_EVALUACION") {
      return (
        <div className="flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-blue-500 font-medium">In Evaluation</span>
        </div>
      );
    } else if (status === "FINALISTA") {
      return (
        <div className="flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          <span className="text-red-500 font-medium">Finalist</span>
        </div>
      );
    } else if (status === "ACEPTADO") {
      return (
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-green-500 font-medium">Accepted</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
          <span className="text-red-500 font-medium">Finalist</span>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="text-gray-700">
              <ChevronLeft size={20} color="#0097B2" />
            </Link>
            <h1 className="text-xl font-medium">My Applications</h1>
          </div>
          <div>
            <Logo />
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        {applications.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {applications.length > 0 &&
              applications.map((app, index) => (
                <div
                  key={app.id}
                  className="py-4"
                  ref={
                    index === applications.length - 1 ? lastElementRef : null
                  }
                >
                  <div className="mb-2">
                    <h2 className="text-lg font-medium text-[#0097B2]">
                      {app?.propuesta.titulo}
                    </h2>

                    <div className="flex flex-col mt-3">
                      <div
                        className="text-gray-600 text-sm prose prose-sm max-h-24 overflow-hidden relative"
                        dangerouslySetInnerHTML={{
                          __html: app?.propuesta.descripcion || "",
                        }}
                      />
                      <button className="text-xs text-[#0097B2] mt-1 self-end">
                        Ver más
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    {app.applicationDate && (
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-5 h-5 rounded-sm bg-[#0097B2] flex items-center justify-center mr-2">
                          <Calendar size={12} className="text-white" />
                        </div>
                        <span>Application date: {app?.applicationDate}</span>
                      </div>
                    )}

                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-sm bg-[#0097B2] flex items-center justify-center mr-2">
                        <Clock size={12} className="text-white" />
                      </div>
                      <span>Process stage: </span>
                      <span className="ml-1">
                        {renderStatusIndicator(app?.estadoPostulacion)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0097B2] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        )}

        {!hasMore && applications.length > 0 && (
          <p className="text-center text-gray-500 py-4">
            No more applications to show
          </p>
        )}
      </div>
    </div>
  );
}
