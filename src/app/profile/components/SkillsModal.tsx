"use client";

import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skills: { id: string; nombre: string }[]) => void;
  initialSkills?: { id: string; nombre: string }[];
}

export default function SkillsModal({
  isOpen,
  onClose,
  onSave,
  initialSkills = [],
}: SkillsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [skills, setSkills] =
    useState<{ id: string; nombre: string }[]>(initialSkills);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleAddSkill = () => {
    if (
      inputValue.trim() &&
      !skills.some((skill) => skill.nombre === inputValue.trim())
    ) {
      setSkills([
        ...skills,
        { id: inputValue.trim(), nombre: inputValue.trim() },
      ]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: { id: string; nombre: string }) => {
    setSkills(skills.filter((skill) => skill.id !== skillToRemove.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAddSkill();
    }
    onSave(skills);
    onClose();
  };

  console.log(skills);

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
          <button onClick={onClose} className="text-gray-400 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          <div>
            <label className="block text-gray-700 mb-3">
              Agrega tus habilidades<span className="text-red-500">*</span>
            </label>

            <div className="border border-gray-300 rounded-md min-h-[200px] p-3 focus-within:ring-1 focus-within:ring-[#0097B2] focus-within:border-[#0097B2]">
              {/* Contenedor para las habilidades y el input */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center bg-[#0097B2] text-white px-3 py-1 rounded-md"
                  >
                    <span>{skill.nombre}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 focus:outline-none cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow min-w-[150px] outline-none border-0 py-1 px-0"
                  placeholder={
                    skills.length === 0
                      ? "Escribe cuales son tus habilidades"
                      : ""
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              disabled={skills.length === 0}
              className={`w-full py-2.5 px-6 rounded-md font-medium cursor-pointer ${
                skills.length === 0
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-[#0097B2] hover:bg-[#0097B2]/80 text-white"
              }`}
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#0097B2] hover:text-[#0097B2]/80 py-1 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
