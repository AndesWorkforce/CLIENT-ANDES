"use client";

import { useState } from "react";
import { XCircle, AlertTriangle } from "lucide-react";
import { ProcesoContratacion } from "../interfaces/contracts.interface";

interface CancelContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ProcesoContratacion | null;
  onConfirm: (data: {
    motivo: string;
    observaciones?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function CancelContractModal({
  isOpen,
  onClose,
  contract,
  onConfirm,
  isSubmitting,
}: CancelContractModalProps) {
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const handleSubmit = async () => {
    if (!motivo.trim()) return;

    await onConfirm({
      motivo: motivo.trim(),
      observaciones: observaciones.trim() || undefined,
    });

    // Reset form
    setMotivo("");
    setObservaciones("");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setMotivo("");
      setObservaciones("");
      onClose();
    }
  };

  if (!isOpen || !contract) return null;

  // Check if contract can be cancelled
  const nonCancellableStates = [
    "FIRMADO_COMPLETO",
    "CONTRATO_FINALIZADO",
    "CANCELADO",
  ];

  const canBeCancelled = !nonCancellableStates.includes(
    contract.estadoContratacion
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <XCircle className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Cancel Contract
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!canBeCancelled ? (
            // Cannot be cancelled warning
            <div className="mb-6">
              <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    Contract Cannot Be Cancelled
                  </h3>
                  <p className="text-sm text-red-700">
                    This contract is in state &quot;
                    {contract.estadoContratacion}&quot; and cannot be cancelled.
                    Only contracts that haven&apos;t been fully signed or
                    finalized can be cancelled.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Contract Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Contract Details
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Candidate:</span>{" "}
                    {contract.nombreCompleto}
                  </p>
                  <p>
                    <span className="font-medium">Position:</span>{" "}
                    {contract.puestoTrabajo}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {contract.estadoContratacion}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {contract.correo}
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="mb-6">
                <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">
                      Important Notice
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Cancelling this contract will:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
                      <li>Mark the contract as cancelled in SignWell</li>
                      <li>
                        {" "}
                        Change the contract status to &quot;CANCELLED&quot;
                      </li>
                      <li>Allow you to send a corrected contract</li>
                      <li>Be logged for audit purposes</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Incorrect salary amount, wrong candidate, data entry error"
                  disabled={isSubmitting}
                  maxLength={200}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {motivo.length}/200 characters
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional observations
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Additional details about the cancellation (optional)"
                  disabled={isSubmitting}
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {observaciones.length}/500 characters
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {canBeCancelled ? "Cancel" : "Close"}
          </button>
          {canBeCancelled && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !motivo.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle size={16} className="mr-2" />
                  Cancel Contract
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
