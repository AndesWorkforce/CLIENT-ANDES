"use client";

import { useRef, useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Skill } from "@/app/types/skill";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skills: Skill[]) => void;
  initialSkills?: Skill[];
  isLoading?: boolean;
}

export default function SkillsModal({
  isOpen,
  onClose,
  onSave,
  initialSkills = [],
  isLoading = false,
}: SkillsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [skillText, setSkillText] = useState<string>(
    initialSkills.length > 0 ? initialSkills[0]?.nombre || "" : ""
  );

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = skillText.trim();
    if (trimmedText) {
      // Enviamos un array con un solo elemento para mantener compatibilidad
      onSave([{ id: Date.now().toString(), nombre: trimmedText }]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden"
      >
        <div className="flex justify-between items-center px-4 py-3">
          <div className="w-6" />
          <h2 className="text-[#0097B2] text-lg font-semibold">Skills</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          <div>
            <label className="block text-gray-700 mb-3">
              Describe tus habilidades<span className="text-red-500">*</span>
            </label>

            <div className="border border-gray-300 rounded-md min-h-[200px] focus-within:ring-1 focus-within:ring-[#0097B2] focus-within:border-[#0097B2]">
              <textarea
                ref={textareaRef}
                value={skillText}
                onChange={(e) => setSkillText(e.target.value)}
                className="w-full h-full min-h-[200px] p-3 outline-none resize-none"
                placeholder="Describe todas tus habilidades aquí"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              disabled={skillText.trim().length === 0 || isLoading}
              className={`w-full py-2.5 px-6 rounded-md font-medium cursor-pointer flex items-center justify-center ${
                skillText.trim().length === 0 || isLoading
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-[#0097B2] hover:bg-[#0097B2]/80 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#0097B2] hover:text-[#0097B2]/80 py-1 cursor-pointer"
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
