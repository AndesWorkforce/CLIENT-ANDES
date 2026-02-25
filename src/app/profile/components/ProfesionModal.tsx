"use client";

import { useState, useEffect } from "react";
import { useProfileContext } from "../context/ProfileContext";
import { useAuthStore } from "@/store/auth.store";
import { useNotificationStore } from "@/store/notifications.store";
import { updateProfesion } from "../actions/profesion.actions";

interface ProfesionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DatosPersonalesConProfesion {
  profesion?: string | null;
}

export default function ProfesionModal({ isOpen, onClose }: ProfesionModalProps) {
  const { profile } = useProfileContext();
  const { user } = useAuthStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const datosPersonales = profile.datosPersonales as unknown as DatosPersonalesConProfesion;

  const [value, setValue] = useState(datosPersonales.profesion ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue(datosPersonales.profesion ?? "");
      setError("");
    }
  }, [isOpen, datosPersonales.profesion]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    const trimmed = value.trim();
    if (trimmed.length > 100) {
      setError("Profession must be at most 100 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await updateProfesion(user.id, trimmed || null);
      if (res.success) {
        addNotification("Profession updated successfully.", "success");
        onClose();
      } else {
        setError(res.message ?? "An error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-1 text-[#17323A]">Profession</h2>
          <p className="text-sm text-gray-500 mb-5">
            Add your professional title or occupation. This is optional and will be displayed on your profile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job title / Profession
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Software Developer, Accountant…"
                maxLength={100}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0097B2]"
              />
              {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              <p className="mt-1 text-xs text-gray-400 text-right">{value.length}/100</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-[#0097B2] text-white text-sm font-medium hover:bg-[#007a91] transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
