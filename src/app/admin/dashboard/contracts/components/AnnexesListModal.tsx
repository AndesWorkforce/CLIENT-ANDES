import React from "react";
import { X, FileText, ExternalLink } from "lucide-react";
import { Anexo } from "../interfaces/contracts.interface";

interface AnnexesListModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  annexes: Anexo[];
}

export default function AnnexesListModal({
  isOpen,
  onClose,
  candidateName,
  annexes,
}: AnnexesListModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Annexes for {candidateName}
          </h2>
          <button
            onClick={onClose}
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
              {annexes.map((annex) => (
                <div
                  key={annex.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {(annex.titulo && annex.titulo.trim()) ||
                          `Annex - ${candidateName}`}
                      </h3>
                      {annex.descripcion && (
                        <p className="text-sm text-gray-600 mt-1">
                          {annex.descripcion}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
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
                    <div className="flex gap-2">
                      {annex.archivoFirmadoUrl ? (
                        <a
                          href={annex.archivoFirmadoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#0097B2] hover:bg-[#0097B2]/10 rounded-full transition-colors"
                          title="View Signed Document"
                        >
                          <ExternalLink size={20} />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic px-2 py-1">
                          Not signed yet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
