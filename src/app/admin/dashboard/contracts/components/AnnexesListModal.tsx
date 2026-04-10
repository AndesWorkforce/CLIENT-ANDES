"use client";

import React, { useState } from "react";
import { X, FileText, ExternalLink, Trash2, AlertTriangle } from "lucide-react";
import { Anexo } from "../interfaces/contracts.interface";
import { deleteContractAnnex } from "../actions/contracts.actions";
import { useNotificationStore } from "@/store/notifications.store";

interface AnnexesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  /** ID del proceso de contratación (ProcesoContratacion.id) */
  procesoContratacionId: string;
  annexes: Anexo[];
  /** Tras borrar con éxito (para refrescar lista en el padre) */
  onAnnexDeleted?: (annexId: string) => void;
}

/** URL para abrir el anexo: firmado si existe, si no generado u origen. */
function getAnnexViewUrl(annex: Anexo): string | null {
  const url =
    annex.archivoFirmadoUrl ||
    annex.archivoGeneradoUrl ||
    annex.archivoOrigenUrl;
  return url && String(url).trim() ? String(url).trim() : null;
}

export default function AnnexesListModal({
  isOpen,
  onClose,
  candidateName,
  procesoContratacionId,
  annexes,
  onAnnexDeleted,
}: AnnexesListModalProps) {
  const { addNotification } = useNotificationStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [annexPendingDelete, setAnnexPendingDelete] = useState<Anexo | null>(
    null
  );

  if (!isOpen) return null;

  const performDelete = async (annex: Anexo) => {
    setDeletingId(annex.id);
    try {
      const result = await deleteContractAnnex(
        procesoContratacionId,
        annex.id
      );
      if (!result.success) {
        addNotification(result.error || "Could not delete annex", "error");
        return;
      }
      addNotification("Annex deleted successfully", "success");
      setAnnexPendingDelete(null);
      onAnnexDeleted?.(annex.id);
    } catch (e) {
      addNotification(
        e instanceof Error ? e.message : "Could not delete annex",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const displayTitle = annexPendingDelete
    ? annexPendingDelete.titulo?.trim() || `Annex - ${candidateName}`
    : "";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Annexes for {candidateName}
          </h2>
          <button
            type="button"
            onClick={() => {
              setAnnexPendingDelete(null);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {annexes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No annexes found for this contract.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {annexes.map((annex) => {
                const viewUrl = getAnnexViewUrl(annex);
                const isSigned = Boolean(
                  annex.archivoFirmadoUrl &&
                    String(annex.archivoFirmadoUrl).trim()
                );
                const busy = deletingId === annex.id;
                return (
                  <div
                    key={annex.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-800">
                          {(annex.titulo && annex.titulo.trim()) ||
                            `Annex - ${candidateName}`}
                        </h3>
                        {annex.descripcion && (
                          <p className="text-sm text-gray-600 mt-1">
                            {annex.descripcion}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
                          <span>
                            Created:{" "}
                            {new Date(annex.createdAt).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              annex.estado === "COMPLETED" ||
                              annex.estado === "SIGNED"
                                ? "bg-green-100 text-green-800"
                                : annex.estado === "SENT"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {annex.estado}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {viewUrl ? (
                          <a
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[#0097B2] hover:bg-[#0097B2]/10 rounded-full transition-colors"
                            title={
                              isSigned
                                ? "View signed document"
                                : "View document (draft / generated)"
                            }
                          >
                            <ExternalLink size={20} />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic px-2 py-1">
                            No document URL
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setAnnexPendingDelete(annex)}
                          disabled={busy}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete annex"
                        >
                          {busy ? (
                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setAnnexPendingDelete(null);
              onClose();
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Confirmación de borrado (mismo lenguaje visual que CancelContractModal) */}
      {annexPendingDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div
            className="bg-white rounded-lg max-w-md w-full shadow-xl border border-gray-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-annex-title"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h2
                  id="delete-annex-title"
                  className="text-lg font-semibold text-[#17323A]"
                >
                  Delete annex
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAnnexPendingDelete(null)}
                disabled={deletingId === annexPendingDelete.id}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 shrink-0"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Document
                </p>
                <p className="text-sm font-medium text-gray-900 break-words">
                  {displayTitle}
                </p>
              </div>

              <div className="flex items-start p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-amber-900 mb-1">
                    This action cannot be undone
                  </h3>
                  <p className="text-sm text-amber-800">
                    The annex and its signing data will be permanently removed
                    from this contract. If you need a new annex, you can add one
                    again from the contracts table.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setAnnexPendingDelete(null)}
                disabled={deletingId === annexPendingDelete.id}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => performDelete(annexPendingDelete)}
                disabled={deletingId === annexPendingDelete.id}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deletingId === annexPendingDelete.id ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete annex
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
