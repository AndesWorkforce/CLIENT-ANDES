"use client";

import { useEffect, useState } from "react";
import {
  listTemplates,
  uploadTemplate,
  instantiateTemplate,
} from "@/features/esign/api/esignClient";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [variableDefinitions, setVariableDefinitions] = useState(
    JSON.stringify(
      {
        variables: ["nombreCompleto", "puestoTrabajo", "fechaInicio", "tarifa"],
      },
      null,
      2
    )
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const load = async () => {
    try {
      const data = await listTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Selecciona un PDF");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("titulo", titulo);
      if (descripcion) form.append("descripcion", descripcion);
      if (variableDefinitions)
        form.append("variableDefinitions", variableDefinitions);
      form.append("file", file);
      await uploadTemplate(form);
      setTitulo("");
      setDescripcion("");
      setFile(null);
      await load();
    } catch (err) {
      console.error(err);
      alert("Error subiendo plantilla");
    } finally {
      setLoading(false);
    }
  };

  const onInstantiate = async (id: string) => {
    try {
      const instance = await instantiateTemplate(id, {
        titulo: undefined,
        descripcion: undefined,
      });
      router.push(`/admin/dashboard/esign/${instance.id}/builder`);
    } catch (err) {
      console.error(err);
      alert("Error instanciando plantilla");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Plantillas eSign</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4 bg-white">
          <h2 className="font-semibold mb-2">Crear plantilla</h2>
          <form onSubmit={onUpload} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Título</label>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="w-full border rounded px-2 py-1"
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
              <label className="block text-sm font-medium">Archivo PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Variables (JSON)
              </label>
              <textarea
                value={variableDefinitions}
                onChange={(e) => setVariableDefinitions(e.target.value)}
                className="w-full border rounded px-2 py-1 h-28"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0097B2] text-white px-3 py-1 rounded"
            >
              {loading ? "Subiendo..." : "Crear plantilla"}
            </button>
          </form>
        </div>
        <div className="border rounded p-4 bg-white">
          <h2 className="font-semibold mb-2">Listado</h2>
          {templates.length === 0 ? (
            <p className="text-sm text-gray-600">Sin plantillas</p>
          ) : (
            <ul className="space-y-2">
              {templates.map((t: any) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between border rounded px-2 py-1"
                >
                  <div>
                    <div className="text-sm font-medium">{t.titulo}</div>
                    <div className="text-xs text-gray-600">{t.descripcion}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onInstantiate(t.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Instanciar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
