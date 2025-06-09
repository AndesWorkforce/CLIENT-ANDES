"use client";
import React from "react";
import { EmailTemplate } from "../page";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  template: EmailTemplate | null;
}
export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  template,
}: ConfirmDeleteModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Delete template?</h2>
        <p className="mb-4">
          Are you sure you want to delete the template <b>{template?.nombre}</b>
          ?
        </p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
