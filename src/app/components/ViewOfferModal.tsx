"use client";

import { useRef, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { Offer } from "@/app/types/offers";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notifications.store";
import { applyToOffer } from "../pages/offers/actions/jobs.actions";

interface ViewOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer?: Offer;
}

const descriptionStyles = `
  .description-content {
    overflow-x: hidden;
    word-wrap: break-word;
    overflow-wrap: break-word;
    max-width: 100%;
  }
  
  .description-content p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .description-content h1, 
  .description-content h2, 
  .description-content h3, 
  .description-content h4 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: #333;
  }
  
  .description-content h1 { font-size: 1.25rem; }
  .description-content h2 { font-size: 1.15rem; }
  .description-content h3 { font-size: 1.05rem; }
  
  .description-content ul, 
  .description-content ol {
    margin-left: 1rem;
    margin-bottom: 1rem;
    padding-left: 1rem;
  }
  
  .description-content li {
    margin-bottom: 0.5rem;
    position: relative;
  }
  
  .description-content a {
    color: #0097B2;
    text-decoration: underline;
  }
  
  .description-content img {
    max-width: 100%;
    height: auto;
  }
  
  .description-content table {
    width: 100%;
    overflow-x: auto;
    display: block;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  .description-content pre, 
  .description-content code {
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 100%;
    background-color: #f5f5f5;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }
  
  /* Estilos específicos para las secciones del trabajo */
  .job-section-title {
    font-weight: 600;
    color: #333;
    font-size: 1.05rem;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
  }
`;

export default function ViewOfferModal({
  isOpen,
  onClose,
  offer,
}: ViewOfferModalProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && offer?.descripcion) {
      try {
        let htmlContent =
          typeof offer.descripcion === "string"
            ? offer.descripcion
            : "<p>Content not available</p>";

        htmlContent = formatHtmlContent(htmlContent);

        contentRef.current.innerHTML = htmlContent;

        enhanceContent(contentRef.current);
      } catch (error) {
        console.error("Error rendering HTML content:", error);
        contentRef.current.innerHTML = "<p>Error loading content</p>";
      }
    }
  }, [offer, isOpen]);

  const formatHtmlContent = (html: string): string => {
    const sections = [
      "About the job",
      "What You'll Do",
      "What We're Looking For",
      "Requirements",
      "Responsibilities",
      "Qualifications",
    ];

    let formattedHtml = html;

    sections.forEach((section) => {
      formattedHtml = formattedHtml.replace(
        new RegExp(`(${section})\\s*`, "gi"),
        `<div class="job-section-title">$1</div>`
      );
    });

    return formattedHtml;
  };

  const enhanceContent = (container: HTMLElement) => {
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      img.classList.add("max-w-full", "h-auto");
    });

    const tables = container.querySelectorAll("table");
    tables.forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("overflow-x-auto", "w-full");
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    const listItems = container.querySelectorAll("ul > li");
    listItems.forEach((li) => {
      if (!li.classList.contains("custom-list-item")) {
        li.classList.add("relative", "pl-4", "custom-list-item");
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not available";

    try {
      const date = new Date(dateString);
      const month = date.toLocaleString("es-ES", { month: "short" });
      const day = date.getDate();
      return `${month} ${day}`;
    } catch (e) {
      return dateString.split("T")[0] || "Date not available";
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleApplyToOffer = async (offerId: string) => {
    if (!offerId) return;
    const { success, message } = await applyToOffer(offerId);
    if (success) {
      addNotification("Offer applied successfully", "success");
      onClose();
    } else {
      if (message === "You have already applied to this job") {
        addNotification(message, "info");
        onClose();
      } else {
        addNotification(message || "Error applying to the offer", "error");
      }
    }
  };

  if (!isOpen || !offer) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <style dangerouslySetInnerHTML={{ __html: descriptionStyles }} />

      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {offer.titulo}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 ml-2"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Fecha */}
          <div className="flex items-center mb-4">
            <Calendar className="flex-shrink-0 mr-1 h-4 w-4 text-[#0097B2]" />
            <span className="text-sm text-gray-500">
              {formatDate(offer.fechaCreacion)}
            </span>
          </div>

          {/* Offer content */}
          <div
            ref={contentRef}
            className="prose prose-sm max-w-none text-gray-600 description-content"
          >
            {/* The offer content will be inserted here */}
          </div>

          {/* Apply button */}
          {!user?.rol.includes("ADMIN") &&
            !user?.rol.includes("EMPLEADO_ADMIN") && (
              <button
                className="w-full py-3 rounded-md font-medium text-white bg-[#0097B2] hover:bg-[#007A8F] mb-6 cursor-pointer"
                onClick={() => {
                  if (!user) {
                    addNotification("You must be logged in to apply", "info");
                    router.push("/auth/login");
                    return;
                  }
                  handleApplyToOffer(offer.id || "");
                }}
              >
                Apply to the offer
              </button>
            )}

          {/* Offer status */}
          <div className="mt-6 flex justify-between items-center">
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                offer.estado === "publicado"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {offer.estado === "publicado" ? "Published" : "Draft"}
            </span>

            <span className="text-xs text-gray-500">
              {offer.fechaActualizacion
                ? `Updated: ${formatDate(offer.fechaActualizacion)}`
                : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
