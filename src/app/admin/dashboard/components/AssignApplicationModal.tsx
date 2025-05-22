import { useState, useEffect, useRef, useCallback } from "react";
import { X, Search } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import { getPublishedOffers } from "../actions/offers.actions";
import { assignOffer } from "../actions/assign.offert.actions";
import { sendAssignJobNotification } from "../actions/sendEmail.actions";
import { getProfile } from "../actions/profile.actions";

interface Offer {
  id: string;
  titulo: string;
  estado: string;
  fechaCreacion: string;
}

interface AssignApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
}

export default function AssignApplicationModal({
  isOpen,
  onClose,
  candidateId,
}: AssignApplicationModalProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Offer | null>(null);
  console.log("candidateId", selectedJob);
  console.log("isSearching", isSearching);
  const { addNotification } = useNotificationStore();
  const observer = useRef<IntersectionObserver | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const lastOfferElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  const fetchPublishedOffers = async (reset = true) => {
    if (reset) {
      setIsLoading(true);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getPublishedOffers(
        reset ? 1 : currentPage,
        10,
        searchTerm
      );

      if (!response.success) {
        addNotification("Error loading offers: " + response.message, "error");
        return;
      }

      const offerData = response.data.data || [];

      if (reset) {
        setOffers(offerData);
        if (offerData.length > 0) {
          setSelectedJob(offerData[0]);
        } else {
          setSelectedJob(null);
        }
      } else {
        setOffers((prevOffers) => [...prevOffers, ...offerData]);
      }

      setHasMore(response.hasMore || false);
    } catch (error) {
      console.error("[Dashboard] Error getting published offers:", error);
      addNotification("Error loading offers", "error");
    } finally {
      if (reset) {
        setIsLoading(false);
        setIsSearching(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPublishedOffers();
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsSearching(true);
        fetchPublishedOffers(true);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchPublishedOffers(false);
    }
  }, [currentPage]);

  const handleAssign = async () => {
    if (!selectedOfferId) {
      addNotification("Please select a job offer", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await assignOffer(candidateId, selectedOfferId);

      if (response.success) {
        // Obtener título de la oferta seleccionada
        const selectedOffer = offers.find(
          (offer) => offer.id === selectedOfferId
        );
        const jobTitle = selectedOffer?.titulo || "Job";

        // Obtener datos del candidato desde el servidor
        const profileResponse = await getProfile(candidateId);

        if (profileResponse.success && profileResponse.data?.data) {
          const candidateData = profileResponse.data.data.datosPersonales;

          // Enviar email de notificación
          const emailResponse = await sendAssignJobNotification(
            `${candidateData.nombre} ${candidateData.apellido}`,
            candidateData.correo,
            jobTitle
          );

          if (emailResponse.success) {
            addNotification(
              "Candidate successfully assigned and notification sent",
              "success"
            );
          } else {
            addNotification(
              "Candidate successfully assigned but there was an error sending the notification",
              "warning"
            );
          }
        } else {
          addNotification(
            "Candidate successfully assigned to the job offer",
            "success"
          );
        }

        onClose();
      } else {
        addNotification(
          response.message || "Error assigning the candidate",
          "error"
        );
      }
    } catch (error) {
      console.error("Error assigning candidate:", error);
      addNotification(
        "Error assigning the candidate to the job offer",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const transformedTextState = (state: string) => {
    switch (state) {
      case "activo":
        return "Active";
      case "publicado":
        return "Published";
      case "pendiente":
        return "Pending";
      default:
        return state;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Assign to Job</h3>
          <p className="text-sm text-gray-500">
            Select an active job to assign this candidate
          </p>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
            />
          </div>

          {/* Lista de ofertas */}
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0097B2]" />
            </div>
          ) : offers.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {offers.map((offer, index) => (
                <div
                  key={offer.id}
                  ref={index === offers.length - 1 ? lastOfferElementRef : null}
                  className={`p-3 border rounded-md cursor-pointer ${
                    selectedOfferId === offer.id
                      ? "border-[#0097B2] bg-[#0097B2]/5"
                      : "border-gray-200 hover:border-[#0097B2]/50"
                  }`}
                  onClick={() => setSelectedOfferId(offer.id)}
                >
                  <div className="font-medium text-gray-800">
                    {offer.titulo}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      Created: {offer.fechaCreacion.split("T")[0]}
                    </span>
                    <span
                      className={`text-xs py-1 px-2 rounded-full ${
                        offer.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {offer.estado === "activo"
                        ? "Active"
                        : transformedTextState(offer.estado)}
                    </span>
                  </div>
                </div>
              ))}
              {loadingMore && (
                <div className="py-2 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0097B2]"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No active offers found that match your search
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedOfferId || isSubmitting}
            className="px-4 py-2 bg-[#0097B2] text-white rounded-md hover:bg-[#007a8f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
