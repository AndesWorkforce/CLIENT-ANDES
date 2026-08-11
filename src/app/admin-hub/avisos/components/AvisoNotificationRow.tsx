"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Check, 
  MoreVertical, 
  X, 
  AlertCircle, 
  AlertTriangle,
  Circle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AvisoNotification } from "../types/avisos.types";
import AvisoCategoryBadge from "./AvisoCategoryBadge";
import { updateAlert, type UpdateAlertParams } from "../actions/avisos.actions";

type BackendPrioridadAlerta = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";

interface AvisoNotificationRowProps {
  aviso: AvisoNotification;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function AvisoNotificationRow({
  aviso,
  isFirst = false,
  isLast = false,
}: AvisoNotificationRowProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowPriorityMenu(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleUpdate = async (params: UpdateAlertParams) => {
    setIsUpdating(true);
    setIsMenuOpen(false);
    setShowPriorityMenu(false);

    try {
      const result = await updateAlert(aviso.id, params);
      
      if (result.success) {
        // Recargar la página para reflejar los cambios
        router.refresh();
      } else {
        console.error("Error al actualizar:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el aviso");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsRead = () => handleUpdate({ estado: "RESUELTO" });
  const handleMarkAsUnread = () => handleUpdate({ estado: "PENDIENTE" });
  const handleChangePriority = (prioridad: BackendPrioridadAlerta) => {
    handleUpdate({ prioridad });
  };

  // Marcar como leído al hacer clic en el enlace de acción
  const handleActionLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Solo marcar como leído si el aviso no está leído
    if (!aviso.leida) {
      // Marcar como leído de forma asíncrona sin bloquear la navegación
      updateAlert(aviso.id, { estado: "RESUELTO" }).catch(error => {
        console.error("Error al marcar aviso como leído:", error);
      });
    }
    // Permitir que la navegación continúe normalmente
  };

  return (
    <article
      className={`flex bg-white ${
        isLast ? "rounded-b-[12px]" : "border-b border-[#EFEFEF]"
      }`}
    >
      <div
        className={`flex w-16 shrink-0 items-start justify-center border-[#EFEFEF] bg-white px-6 pt-[34px] ${
          isFirst ? "rounded-tl-[12px] border-l border-t" : "border-l"
        } ${isLast ? "rounded-bl-[12px]" : ""}`}
      >
        {!aviso.leida ? (
          <span className="size-2 shrink-0 rounded-full bg-[#0097B2]" aria-hidden />
        ) : (
          <span className="size-2 shrink-0" aria-hidden />
        )}
      </div>

      <div
        className={`min-w-0 flex-1 bg-white py-6 pl-3 pr-6 ${
          isFirst ? "border-t border-[#EFEFEF]" : ""
        }`}
      >
        <div className="flex flex-col gap-[7px]">
          <div className="flex flex-wrap items-center gap-[7px]">
            <h3 className="text-[16px] font-semibold leading-[1.3] text-[#343434]">
              {aviso.titulo}
            </h3>
            <AvisoCategoryBadge category={aviso.categoria} />
          </div>
          <p className="text-[14px] leading-[1.3] tracking-[0.28px] text-[#858585]">
            {aviso.descripcion}
          </p>
          <Link
            href={aviso.actionUrl}
            onClick={handleActionLinkClick}
            className="inline-flex w-fit items-center gap-1 text-[12px] font-semibold leading-[1.3] text-[#0097B2] transition-colors hover:text-[#007A8F]"
          >
            {aviso.actionLabel}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>

      <div
        className={`hidden w-[102px] shrink-0 bg-white py-6 pl-3 pr-[18px] sm:block ${
          isFirst ? "border-t border-[#EFEFEF]" : ""
        }`}
      >
        <p className="whitespace-nowrap text-[14px] leading-[1.3] tracking-[0.28px] text-[#858585]">
          {aviso.tiempoRelativo}
        </p>
      </div>

      <div
        className={`flex w-[69px] shrink-0 items-start justify-center bg-white px-6 py-6 ${
          isFirst ? "rounded-tr-[12px] border-r border-t border-[#EFEFEF]" : "border-r border-[#EFEFEF]"
        } ${isLast ? "rounded-br-[12px]" : ""}`}
      >
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label={`Opciones de ${aviso.titulo}`}
            className="text-[#707070] transition-colors hover:text-[#0097B2] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            disabled={isUpdating}
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && !showPriorityMenu && (
            <div className="absolute right-0 top-8 z-50 min-w-[200px] rounded-lg border border-[#EFEFEF] bg-white shadow-lg">
              <div className="py-1">
                {!aviso.leida ? (
                  <button
                    type="button"
                    onClick={handleMarkAsRead}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F5F5F5]"
                  >
                    <Check size={16} className="text-[#0097B2]" />
                    Marcar como leído
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkAsUnread}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F5F5F5]"
                  >
                    <X size={16} className="text-[#858585]" />
                    Marcar como no leído
                  </button>
                )}
                
                <div className="my-1 h-px bg-[#EFEFEF]" />
                
                <button
                  type="button"
                  onClick={() => setShowPriorityMenu(true)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F5F5F5]"
                >
                  <span className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-[#858585]" />
                    Cambiar prioridad
                  </span>
                  <ArrowRight size={14} className="text-[#858585]" />
                </button>
              </div>
            </div>
          )}

          {isMenuOpen && showPriorityMenu && (
            <div className="absolute right-0 top-8 z-50 min-w-[200px] rounded-lg border border-[#EFEFEF] bg-white shadow-lg">
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => setShowPriorityMenu(false)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-[14px] text-[#858585] transition-colors hover:bg-[#F5F5F5]"
                >
                  <X size={16} />
                  Volver
                </button>
                
                <div className="my-1 h-px bg-[#EFEFEF]" />
                
                <button
                  type="button"
                  onClick={() => handleChangePriority("CRITICA")}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F5F5F5]"
                >
                  <AlertTriangle size={16} className="text-red-600" />
                  Crítica
                </button>
                
                <button
                  type="button"
                  onClick={() => handleChangePriority("ALTA")}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F5F5F5]"
                >
                  <AlertCircle size={16} className="text-orange-500" />
                  Alta
                </button>
                
                <button
                  type="button"
                  onClick={() => handleChangePriority("MEDIA")}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F5F5F5]"
                >
                  <AlertCircle size={16} className="text-yellow-500" />
                  Media
                </button>
                
                <button
                  type="button"
                  onClick={() => handleChangePriority("BAJA")}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-[14px] text-[#343434] transition-colors hover:bg-[#F5F5F5]"
                >
                  <Circle size={16} className="text-green-500" />
                  Baja
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
