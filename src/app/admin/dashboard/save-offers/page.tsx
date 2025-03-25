"use client";

import { Calendar, Edit, Trash2 } from "lucide-react";
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

export default function SaveOffersPage() {
  const { addNotification } = useNotificationStore();
  const [offers, setOffers] = useState<OfferWithContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOfferId, setSelectedOfferId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<
    OfferWithContent | undefined
  >();

  // Estados para el modal de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | undefined>();

  const fetchSavedOffers = useCallback(async () => {
    try {
      console.log("[DEBUG] Obteniendo ofertas guardadas...");
      setLoading(true);
      const response = await getSavedOffers();

      if (response.success && response.data) {
        // Parsear las ofertas para asegurar que tengan el formato correcto
        const rawOffers = response.data.data || [];
        console.log("[DEBUG] Ofertas obtenidas (raw):", rawOffers.length);

        // Aplicar parseOfferContent a cada oferta
        const parsedOffers = rawOffers.map((offer: Offer) => {
          const parsed = parseOfferContent(offer);
          console.log(`[DEBUG] Oferta ${offer.id} parseada:`, {
            titulo: parsed.titulo,
            desc_tipo: typeof parsed.descripcion,
            desc_claves:
              typeof parsed.descripcion === "object"
                ? Object.keys(parsed.descripcion).length
                : "string",
          });
          return parsed;
        });

        setOffers(parsedOffers);
      } else {
        console.warn("[DEBUG] No se obtuvieron ofertas:", response.message);
        setOffers([]);
      }
    } catch (error) {
      console.error("[DEBUG] Error al obtener ofertas:", error);
      setOffers([]);
      addNotification("Error al cargar ofertas", "error");
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchSavedOffers();
  }, [fetchSavedOffers]);

  const handleOpenModal = (offerId?: string, offer?: OfferWithContent) => {
    console.log("[MODAL] Abriendo modal con oferta:", offerId);

    if (offer) {
      try {
        // Verificar que tengamos datos válidos
        console.log("[MODAL] Datos originales de offer:", {
          id: offer.id,
          titulo: offer.titulo,
          desc_tipo: typeof offer.descripcion,
          desc_muestra:
            typeof offer.descripcion === "string"
              ? offer.descripcion.substring(0, 50) + "..."
              : typeof offer.descripcion === "object"
              ? "Objeto JSON"
              : "Tipo desconocido",
        });

        // Crear una copia de la oferta para el modal
        const ofertaParaModal: OfferWithContent = {
          id: offer.id,
          titulo: offer.titulo || "",
          descripcion: offer.descripcion, // Mantener el formato original sin procesar
          estado: offer.estado || "borrador",
          fechaCreacion: offer.fechaCreacion,
          fechaActualizacion: offer.fechaActualizacion,
        };

        // Si la descripción es un objeto, convertirlo a HTML
        if (
          typeof ofertaParaModal.descripcion === "object" &&
          ofertaParaModal.descripcion !== null
        ) {
          console.log("[MODAL] Convirtiendo objeto a HTML");
          // Formato simplificado para compatibilidad
          ofertaParaModal.descripcion =
            "<p>Contenido migrado desde formato anterior</p>";
        }

        console.log("[MODAL] Oferta preparada lista para enviar al modal:", {
          id: ofertaParaModal.id,
          desc_tipo_final: typeof ofertaParaModal.descripcion,
          desc_muestra:
            typeof ofertaParaModal.descripcion === "string"
              ? ofertaParaModal.descripcion.substring(0, 50) + "..."
              : "No es string",
        });

        setSelectedOffer(ofertaParaModal);
      } catch (error) {
        console.error("[ERROR] Error preparando oferta:", error);
        // En caso de error, crear objeto mínimo
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
    console.log("[DEBUG] Cerrando modal y limpiando estados");
    setIsModalOpen(false);
    setSelectedOffer(undefined);
    setSelectedOfferId(undefined);

    // Volvemos a cargar las ofertas para asegurar que tengamos los datos más recientes
    fetchSavedOffers();
  };

  const handleSaveOffer = async (offerData: Offer) => {
    try {
      const formData = new FormData();
      formData.append("title", offerData.titulo);

      // La descripción ahora es siempre HTML
      if (typeof offerData.descripcion === "string") {
        formData.append("description", offerData.descripcion);
      } else {
        // Si por alguna razón es un objeto, lo convertimos a string HTML
        formData.append(
          "description",
          typeof offerData.descripcion === "object"
            ? "<p>Contenido migrado desde formato anterior</p>"
            : String(offerData.descripcion || "")
        );
      }

      formData.append("estado", offerData.estado);

      if (offerData.id) {
        const response = await updateOffer(offerData.id, formData);
        if (response.success) {
          addNotification("Oferta actualizada correctamente", "success");

          // Recargar ofertas
          await fetchSavedOffers();
        } else {
          addNotification(
            `Error al actualizar oferta: ${response.message}`,
            "error"
          );
        }
      } else {
        addNotification(
          "Función de crear nueva oferta no implementada",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error al guardar oferta:", error);
      addNotification("Error al guardar oferta", "error");
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
        addNotification("Oferta eliminada correctamente", "success");
        await fetchSavedOffers();
      } else {
        addNotification(
          `Error al eliminar oferta: ${response.message}`,
          "error"
        );
      }

      // Cerrar el modal y limpiar el estado
      setIsDeleteModalOpen(false);
      setOfferToDelete(undefined);
    } catch (error) {
      console.error("Error al eliminar oferta:", error);
      addNotification("Error al eliminar oferta", "error");
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading ? (
        <div className="flex justify-center py-10">
          <p>Cargando ofertas...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-lg shadow-sm border border-[#B6B4B4] overflow-hidden"
                style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <h3 className="text-base font-medium text-gray-900">
                        {offer.titulo}
                      </h3>
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
            <div className="text-center py-10">
              <p className="text-gray-500">No se encontraron ofertas</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de edición */}
      <EditOfferModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        offerId={selectedOfferId}
        onSave={handleSaveOffer}
        initialData={selectedOffer}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteOffer}
        title="Eliminar Oferta"
        message="¿Estás seguro que deseas eliminar esta oferta? Esta acción no se puede deshacer."
        confirmButtonText="Sí, Eliminar"
        cancelButtonText="Cancelar"
      />
    </div>
  );
}
