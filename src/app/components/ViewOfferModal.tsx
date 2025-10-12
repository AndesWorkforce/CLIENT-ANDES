"use client";

import { useRef, useEffect, useState } from "react";
import { X, Calendar, FileText } from "lucide-react";
import { Offer } from "@/app/types/offers";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useNotificationStore } from "@/store/notifications.store";
import { applyToOffer } from "../pages/offers/actions/jobs.actions";

interface ViewOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer?: Offer;
  // When provided, shows an admin-only history button in the header
  onOpenHistory?: () => void;
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
  onOpenHistory,
}: ViewOfferModalProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasApplied, setHasApplied] = useState(false);

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

  useEffect(() => {
    if (isOpen && offer?.id && user?.id) {
      // Verificar en localStorage si ya aplicó
      const storedAppliedOffers = localStorage.getItem(
        `applied_offers_${user.id}`
      );
      if (storedAppliedOffers) {
        try {
          const appliedOffers = JSON.parse(storedAppliedOffers);
          setHasApplied(appliedOffers.includes(offer.id));
        } catch (error) {
          console.error(
            "[ViewOfferModal] Error al verificar ofertas aplicadas:",
            error
          );
          setHasApplied(false);
        }
      }
    }
  }, [isOpen, offer, user]);

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
      console.error("[ViewOfferModal] Error al formatear la fecha:", e);
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
      const storedAppliedOffers = localStorage.getItem(
        `applied_offers_${user?.id}`
      );
      const appliedOffers = storedAppliedOffers
        ? JSON.parse(storedAppliedOffers)
        : [];
      if (!appliedOffers.includes(offerId)) {
        appliedOffers.push(offerId);
        localStorage.setItem(
          `applied_offers_${user?.id}`,
          JSON.stringify(appliedOffers)
        );
      }

      setHasApplied(true);
      addNotification("Your application has been submitted", "success");
      onClose();
    } else {
      if (message === "You have already applied to this job") {
        addNotification("You have already applied to this job", "info");
        onClose();
      } else {
        addNotification("Error applying to the offer", "error");
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
            {onOpenHistory && (
              <button
                title="Applicants history"
                onClick={onOpenHistory}
                className="text-[#0097B2] hover:bg-[#E6F7FA] border border-gray-200 rounded-md p-1 cursor-pointer"
                aria-label="Open applicants history"
              >
                <FileText size={18} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 ml-2"
            >
              <X size={20} className="cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {!user ? (
            // Usuario no autenticado - mostrar mensaje de autenticación mejorado
            <div className="text-center py-8 px-2">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-lg"></div>

              <div className="relative z-10">
                {/* Icon with gradient background */}
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0097B2] to-cyan-500 rounded-full opacity-20 animate-pulse mx-auto w-16 h-16"></div>
                  <div className="relative bg-gradient-to-r from-[#0097B2] to-cyan-500 p-3 rounded-full mx-auto w-16 h-16 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 11-4 0c0-1.1.9-2 2-2zM9 7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2H9z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Unlock This Opportunity
                </h3>

                {/* Subtitle */}
                <p className="text-gray-600 mb-2 text-base font-medium">
                  Join Andes Workforce
                </p>

                {/* Description */}
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                  Create your free account to view complete job details and
                  apply instantly to this position.
                </p>

                {/* Quick benefits */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-center text-xs text-gray-600">
                    <svg
                      className="h-3 w-3 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Free registration in under 2 minutes
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-600">
                    <svg
                      className="h-3 w-3 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Access to exclusive job opportunities
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/auth/register");
                    }}
                    className="w-full bg-gradient-to-r from-[#0097B2] to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-[#007A8F] hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/auth/login");
                    }}
                    className="w-full bg-white/80 backdrop-blur-sm text-gray-700 py-2.5 px-4 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 text-sm"
                  >
                    Already registered? Sign In
                  </button>
                </div>

                {/* Trust indicator */}
                <div className="mt-4 text-xs text-gray-400 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure & private registration
                </div>
              </div>
            </div>
          ) : (
            // Usuario autenticado - mostrar contenido completo
            <>
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
                    className={`w-full py-3 rounded-md font-medium text-white ${
                      hasApplied
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#0097B2] hover:bg-[#007A8F] cursor-pointer"
                    } mb-6`}
                    onClick={() => {
                      if (!user) {
                        addNotification(
                          "You must be logged in to apply",
                          "info"
                        );
                        router.push("/auth/login");
                        return;
                      }
                      if (!hasApplied) {
                        handleApplyToOffer(offer.id || "");
                      }
                    }}
                    disabled={hasApplied}
                  >
                    {hasApplied ? "Applied" : "Apply"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
