"use client";

import { useState } from "react";
import { uploadDocument } from "@/features/esign/api/esignClient";
import { useRouter } from "next/navigation";

export default function CreateDocumentForm() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [procesoContratacionId, setProcesoContratacionId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!file) {
        alert("Selecciona un PDF");
        setLoading(false);
        return;
      }
      const form = new FormData();
      form.append("titulo", titulo);
      if (descripcion) form.append("descripcion", descripcion);
      if (procesoContratacionId)
        form.append("procesoContratacionId", procesoContratacionId);
      form.append("file", file);
      const doc = await uploadDocument(form);
      router.push(`/admin/dashboard/esign/${doc.id}/builder`);
    } catch (err) {
      console.error("Create document error", err);
      alert("Error creando documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Archivo PDF origen</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">
          ProcesoContratación ID (opcional)
        </label>
        <input
          value={procesoContratacionId}
          onChange={(e) => setProcesoContratacionId(e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-[#0097B2] text-white px-3 py-1 rounded"
      >
        {loading ? "Creando..." : "Crear documento"}
      </button>
    </form>
  );
}
