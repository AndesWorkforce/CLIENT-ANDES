"use client";

import { Bookmark, Calendar, Edit, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  deleteOffer,
  getSavedOffers,
  updateOffer,
} from "./actions/save-offers.actions";
import { Offer, OfferWithContent, parseOfferContent } from "@/app/types/offers";
import EditOfferModal from "@/app/components/EditOfferModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import { useNotificationStore } from "@/store/notifications.store";
import OfferCardSkeleton from "@/app/admin/dashboard/components/OfferCardSkeleton";
import AssignOfferModal from "../components/AssignOfferModal";

export default function SaveOffersPage() {
  const { addNotification } = useNotificationStore();
  const [offers, setOffers] = useState<OfferWithContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOfferId, setSelectedOfferId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<
    OfferWithContent | undefined
  >();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [offerToDelete, setOfferToDelete] = useState<string | undefined>();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [offerToAssign, setOfferToAssign] = useState<Offer | null>(null);

  const fetchSavedOffers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSavedOffers();

      if (response.success && response.data) {
        const rawOffers = response.data.data || [];

        const parsedOffers = rawOffers.map((offer: Offer) => {
          const parsed = parseOfferContent(offer);
          return parsed;
        });

        setOffers(parsedOffers);
      } else {
        console.warn("[DEBUG] No offers obtained:", response.message);
        setOffers([]);
      }
    } catch (error) {
      console.error("[DEBUG] Error obtaining offers:", error);
      setOffers([]);
      addNotification("Error loading offers", "error");
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchSavedOffers();
  }, [fetchSavedOffers]);

  const handleOpenModal = (offerId?: string, offer?: OfferWithContent) => {
    if (offer) {
      try {
        const ofertaParaModal: OfferWithContent = {
          id: offer.id,
          titulo: offer.titulo || "",
          descripcion: offer.descripcion,
          estado: offer.estado || "borrador",
          fechaCreacion: offer.fechaCreacion,
          fechaActualizacion: offer.fechaActualizacion,
        };

        if (
          typeof ofertaParaModal.descripcion === "object" &&
          ofertaParaModal.descripcion !== null
        ) {
          ofertaParaModal.descripcion =
            "<p>Content migrated from previous format</p>";
        }

        setSelectedOffer(ofertaParaModal);
      } catch (error) {
        console.error("[ERROR] Error preparing offer:", error);
        setSelectedOffer({
          id: offer.id,
          titulo: offer.titulo || "",
          descripcion: "",
          estado: offer.estado || "borrador",
        });
      }
    } else {
      setSelectedOffer(undefined);
    }

    setSelectedOfferId(offerId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(undefined);
    setSelectedOfferId(undefined);

    fetchSavedOffers();
  };

  const handleSaveOffer = async (offerData: Offer) => {
    try {
      const formData = new FormData();
      formData.append("title", offerData.titulo);

      if (typeof offerData.descripcion === "string") {
        formData.append("description", offerData.descripcion);
      } else {
        formData.append(
          "description",
          typeof offerData.descripcion === "object"
            ? "<p>Content migrated from previous format</p>"
            : String(offerData.descripcion || "")
        );
      }

      formData.append("estado", offerData.estado);

      if (offerData.id) {
        const response = await updateOffer(offerData.id, formData);
        if (response.success) {
          addNotification("Offer updated successfully", "success");

          await fetchSavedOffers();
        } else {
          addNotification(`Error updating offer: ${response.message}`, "error");
        }
      } else {
        addNotification(
          "Function to create new offer not implemented",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      addNotification("Error saving offer", "error");
    }
  };

  const confirmDeleteOffer = (offerId: string) => {
    setOfferToDelete(offerId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOffer = async () => {
    if (!offerToDelete) return;

    try {
      const response = await deleteOffer(offerToDelete);
      if (response.success) {
        addNotification("Offer deleted successfully", "success");
        await fetchSavedOffers();
      } else {
        addNotification(`Error deleting offer: ${response.message}`, "error");
      }

      setIsDeleteModalOpen(false);
      setOfferToDelete(undefined);
    } catch (error) {
      console.error("Error deleting offer:", error);
      addNotification("Error deleting offer", "error");
      setIsDeleteModalOpen(false);
    }
  };

  const handleAssignOffer = (offer: Offer) => {
    setOfferToAssign(offer);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
          <OfferCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-lg shadow-sm border border-[#B6B4B4] overflow-hidden"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-base font-medium text-gray-900">
                        {offer.titulo}
                      </h3>
                      <button
                        className="text-gray-400 hover:text-[#0097B2] cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssignOffer(offer);
                        }}
                      >
                        <Bookmark size={20} className="text-[#0097B2]" />
                      </button>
                    </div>
                  </div>
                  <hr className="my-2 border-[#E2E2E2]" />
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-[#0097B2]" />
                        <span>{offer.fechaCreacion?.split("T")[0]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleOpenModal(offer.id, offer)}
                        className="text-[#0097B2] hover:text-[#007A8F]"
                      >
                        <Edit size={18} className="cursor-pointer" />
                      </button>
                      <button
                        onClick={() => confirmDeleteOffer(offer.id || "")}
                        className="text-[#0097B2] hover:text-[#007A8F]"
                      >
                        <Trash2 size={18} className="cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-gray-500">No offers found</p>
            </div>
          )}
        </div>
      )}

      {/* Edit modal */}
      <EditOfferModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        offerId={selectedOfferId}
        onSave={handleSaveOffer}
        initialData={selectedOffer}
      />

      {/* Confirmation modal for deletion */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOffer}
        title="Delete offer"
        message="Are you sure you want to delete this offer? This action cannot be undone."
        confirmButtonText="Yes, delete"
        cancelButtonText="Cancel"
      />

      {/* Modal de asignación */}
      <AssignOfferModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        offerId={offerToAssign?.id || ""}
        offerTitle={offerToAssign?.titulo || ""}
      />
    </div>
  );
}
