"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getCompaniesAdmin } from "../../superAdmin/actions/company.actions";
import { assignOfferToCompanies } from "../offers/actions/offers.actions";
import { useNotificationStore } from "@/store/notifications.store";
import { Search } from "lucide-react";

interface Client {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  usuarioResponsable: {
    nombre?: string;
    apellido?: string;
    correo: string;
  };
  propuestasAsociadas?: Array<{
    propuestaId: string;
  }>;
}

interface AssignOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  offerTitle: string;
}

export default function AssignOfferModal({
  isOpen,
  onClose,
  offerId,
  offerTitle,
}: AssignOfferModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { addNotification } = useNotificationStore();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastClientElementRef = useCallback(
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

  const fetchClients = async (reset = true) => {
    if (reset) {
      setIsLoading(true);
      setCurrentPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getCompaniesAdmin(
        reset ? 1 : currentPage,
        10,
        searchTerm,
        true
      );

      if (response.success) {
        const activeClients =
          response.data?.companies.filter((client: Client) => client.activo) ||
          [];

        if (reset) {
          // Preseleccionar clientes que ya tienen la oferta asignada
          const preselectedClients = activeClients
            .filter((client) =>
              client.propuestasAsociadas?.some(
                (propuesta) => propuesta.propuestaId === offerId
              )
            )
            .map((client) => client.id);

          setClients(activeClients);
          setSelectedClients(preselectedClients);
        } else {
          setClients((prevClients) => [...prevClients, ...activeClients]);
        }

        setHasMore(activeClients.length === 10); // Si vienen menos de 10, no hay más
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      if (reset) {
        setIsLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    } else {
      setSearchTerm("");
      setSelectedClients([]);
      setClients([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [isOpen, offerId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchClients(true);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchClients(false);
    }
  }, [currentPage]);

  const handleClientSelection = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleAssign = async () => {
    if (selectedClients.length === 0) {
      addNotification("Please select at least one client", "warning");
      return;
    }

    try {
      const response = await assignOfferToCompanies(offerId, selectedClients);
      if (response.success) {
        addNotification("Offer assigned successfully", "success");
        onClose();
      } else {
        addNotification(response.message || "Error assigning offer", "error");
      }
    } catch (error) {
      console.error("Error assigning offer:", error);
      addNotification("Error assigning offer", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Assign Offer to Clients
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Select the clients to assign the offer: {offerTitle}
          </p>
        </div>

        {/* Search bar */}
        <div className="px-6 pt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#0097B2] focus:border-[#0097B2] sm:text-sm"
            />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0097B2] border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {clients.length > 0 ? (
                clients.map((client, index) => (
                  <div
                    key={client.id}
                    ref={
                      index === clients.length - 1 ? lastClientElementRef : null
                    }
                    onClick={() => handleClientSelection(client.id)}
                    style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
                    className={`transform transition-all duration-200 cursor-pointer rounded-lg ${
                      selectedClients.includes(client.id)
                        ? "bg-[#0097B2] text-white shadow-lg scale-[1.02]"
                        : "bg-white hover:bg-[#0097B2]/5 border border-gray-200"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`font-semibold ${
                              selectedClients.includes(client.id)
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {client.nombre}
                          </h4>
                          <p
                            className={`text-sm mt-1 ${
                              selectedClients.includes(client.id)
                                ? "text-white/80"
                                : "text-gray-500"
                            }`}
                          >
                            {client.usuarioResponsable.correo}
                          </p>
                          {client.descripcion && (
                            <p
                              className={`text-sm mt-2 line-clamp-2 ${
                                selectedClients.includes(client.id)
                                  ? "text-white/70"
                                  : "text-gray-600"
                              }`}
                            >
                              {client.descripcion}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={selectedClients.includes(client.id)}
                            onChange={() => {}}
                            className="h-5 w-5 rounded border-gray-300 text-[#0097B2] focus:ring-[#0097B2]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No clients found matching your search
                </div>
              )}
              {loadingMore && (
                <div className="py-2 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0097B2]"></div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedClients.length} client(s) selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedClients.length === 0}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md cursor-pointer ${
                selectedClients.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#0097B2] hover:bg-[#007B8E]"
              }`}
            >
              Assign ({selectedClients.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
