"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bold, Italic, List, AlignLeft } from "lucide-react";

export default function OffersPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Estado para simular si el formulario está en modo edición
  const [isEditing, setIsEditing] = useState(false);

  // Simular cierre de sesión
  const handleLogout = () => {
    // Lógica para cerrar sesión
    router.push("/admin/login");
  };

  const handlePublish = () => {
    // Lógica para publicar oferta
    alert("Oferta publicada");
  };

  const handleSave = () => {
    // Lógica para guardar cambios
    alert("Cambios guardados");
  };

  const handleDiscard = () => {
    // Lógica para descartar oferta
    setTitle("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 w-full">
        <div className="space-y-6">
          {/* Título de la oferta */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Título de la oferta
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Servicio de diseño gráfico"
              className="shadow-sm focus:ring-[#0097B2] focus:border-[#0097B2] block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            />
          </div>

          {/* Descripción del puesto */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción del puesto
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              {/* Editor toolbar */}
              <div className="flex items-center space-x-2 px-3 py-1 border-b border-gray-300 bg-gray-50">
                <button className="p-1 rounded hover:bg-gray-200">
                  <Bold size={18} className="text-gray-600" />
                </button>
                <button className="p-1 rounded hover:bg-gray-200">
                  <Italic size={18} className="text-gray-600" />
                </button>
                <button className="p-1 rounded hover:bg-gray-200">
                  <List size={18} className="text-gray-600" />
                </button>
                <button className="p-1 rounded hover:bg-gray-200">
                  <AlignLeft size={18} className="text-gray-600" />
                </button>
              </div>
              {/* Editor content */}
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Diseñar todos manuales de marca de la empresa y los flyers publicitarios"
                className="w-full p-3 min-h-[150px] text-sm focus:outline-none focus:ring-0 resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3 pt-4">
            <button
              onClick={handlePublish}
              className="w-full p-3 rounded-md bg-[#0097B2] text-white font-medium hover:bg-[#008aa2] transition-colors"
            >
              Publicar oferta
            </button>
            <button
              onClick={handleSave}
              className="w-full p-3 rounded-md bg-[#E6F7FA] text-[#0097B2] font-medium hover:bg-[#d6f0f5] transition-colors"
            >
              Guardar cambios
            </button>
            <button
              onClick={handleDiscard}
              className="w-full p-3 text-[#FF3B30] font-medium hover:bg-gray-50 transition-colors"
            >
              Descartar oferta
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
