"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Clock, Calendar, X, CheckCircle, Trash2 } from "lucide-react";

import {
  Application,
  getMyApplications,
  removeMyApplication,
} from "@/app/applications/actions/applications.actions";
import SimpleHeader from "../components/SimpleHeader";
import { useNotificationStore } from "@/store/notifications.store";

export default function ApplicationsPage() {
  const { addNotification } = useNotificationStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] =
    useState<Application | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await getMyApplications(page);

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

  const openModal = (app: Application) => {
    setSelectedApplication(app);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    document.body.style.overflow = "auto";
  };

  const handleDeleteApplication = (app: Application) => {
    setApplicationToDelete(app);
    setShowDeleteModal(true);
  };

  const confirmDeleteApplication = async () => {
    if (!applicationToDelete) return;

    try {
      const response = await removeMyApplication(applicationToDelete.id);

      if (response.success) {
        addNotification("Application removed successfully", "success");
        // Remove the application from the local state
        setApplications((prev) =>
          prev.filter((app) => app.id !== applicationToDelete.id)
        );
        setShowDeleteModal(false);
        setApplicationToDelete(null);
      } else {
        addNotification(
          response.error || "Error removing application",
          "error"
        );
      }
    } catch (error) {
      console.error("Error removing application:", error);
      addNotification("Error removing application", "error");
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setApplicationToDelete(null);
  };

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
    } else if (status === "ACEPTADA") {
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
          <span className="text-red-500 font-medium">Rejected</span>
        </div>
      );
    }
  };

  console.log("\n\n\n [Applications] applications: ", applications, "\n\n\n");

  return (
    <div className="container mx-auto min-h-screen bg-white">
      {/* Header */}
      <SimpleHeader title="My Applications" />

      {/* Contenido */}
      <div className="container mx-auto px-4 py-6">
        {applications.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {applications.length > 0 &&
              applications.map((app, index) => (
                <div
                  key={app.id}
                  className="bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  ref={
                    index === applications.length - 1 ? lastElementRef : null
                  }
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-medium text-[#0097B2] line-clamp-2 flex-1">
                        {app?.propuesta.titulo}
                      </h2>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteApplication(app);
                        }}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        title="Remove application"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex flex-col">
                      <div
                        className="text-gray-600 text-sm prose prose-sm max-h-16 overflow-hidden relative"
                        dangerouslySetInnerHTML={{
                          __html: app?.propuesta.descripcion || "",
                        }}
                      />
                      <button
                        className="text-xs text-[#0097B2] mt-2 self-end hover:underline cursor-pointer"
                        onClick={() => openModal(app)}
                      >
                        View more
                      </button>
                    </div>
                  </div>

                  <div className="border-t flex flex-col items-start justify-start border-gray-200 p-4 space-y-2 bg-gray-100 rounded-b-lg">
                    {/* {app.applicationDate && (
                      <div className="flex items-center text-xs text-gray-600">
                        <div className="w-5 h-5 rounded-sm bg-[#0097B2] flex items-center justify-center mr-2">
                          <Calendar size={12} className="text-white" />
                        </div>
                        <span>Application date: {app?.applicationDate}</span>
                      </div>
                    )} */}

                    <div className="flex items-center text-xs text-gray-600">
                      <div className="w-5 h-5 rounded-sm bg-[#0097B2] flex items-center justify-center mr-2">
                        <Clock size={12} className="text-white" />
                      </div>
                      <span>Process stage: </span>
                      <span className="ml-1">
                        {renderStatusIndicator(app?.estadoPostulacion)}
                      </span>
                    </div>

                    {app.estadoPostulacion === "ACEPTADA" && (
                      <div className="w-full mt-2 text-sm text-green-600 flex items-center justify-center gap-2">
                        <CheckCircle size={14} />
                        <a
                          href="/currentApplication"
                          className="underline hover:text-green-700 transition-colors"
                        >
                          Accepted - View in Current Application
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0097B2] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        )}

        {!hasMore && applications.length > 0 && (
          <div className="text-center py-8 mt-4">
            <p className="text-gray-400 text-sm">
              ✓ You&apos;ve reached the end of your applications
            </p>
          </div>
        )}
      </div>

      {/* Modal para ver detalles completos */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-medium text-[#0097B2]">
                {selectedApplication?.propuesta.titulo}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Service Offer</h3>
                <div
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: selectedApplication?.propuesta.descripcion || "",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {selectedApplication.applicationDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-6 h-6 rounded-sm bg-[#0097B2] flex items-center justify-center mr-3">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Application date</p>
                      <p>{selectedApplication.applicationDate}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-6 h-6 rounded-sm bg-[#0097B2] flex items-center justify-center mr-3">
                    <Clock size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Process stage</p>
                    <div className="mt-1">
                      {renderStatusIndicator(
                        selectedApplication.estadoPostulacion
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar aplicación */}
      {showDeleteModal && applicationToDelete && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Remove Application
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {`Are you sure you want to remove your application for "
                ${applicationToDelete.propuesta.titulo}"? This action cannot be
                undone.`}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteApplication}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
