"use client";

import { useAuthStore } from "@/store/auth.store";
import CreateDocumentForm from "./components/CreateDocumentForm";
import { useEffect, useState } from "react";
import {
  listTemplates,
  uploadTemplate,
  instantiateTemplate,
} from "@/features/esign/api/esignClient";
import { useRouter } from "next/navigation";

export default function EsignDashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.rol === "ADMIN" || user?.rol === "ADMIN_RECLUTAMIENTO";

  const [activeTab, setActiveTab] = useState<"docs" | "templates">("docs");
  const [templates, setTemplates] = useState<any[]>([]);
  const [tituloTpl, setTituloTpl] = useState("");
  const [descripcionTpl, setDescripcionTpl] = useState("");
  const [fileTpl, setFileTpl] = useState<File | null>(null);
  const [variableDefinitions, setVariableDefinitions] = useState(
    '{\n  "variables": ["nombreCompleto", "puestoTrabajo", "fechaInicio", "tarifa"]\n}'
  );
  const [loadingTpl, setLoadingTpl] = useState(false);
  const router = useRouter();

  const loadTemplates = async () => {
    try {
      const data = await listTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === "templates") loadTemplates();
  }, [activeTab]);

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl font-semibold text-red-600">Not authorized</h1>
        <p className="text-sm text-gray-600">
          You don&apos;t have permissions to view this section.
        </p>
      </div>
    );
  }

  const onUploadTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileTpl) {
      alert("Selecciona un PDF");
      return;
    }
    setLoadingTpl(true);
    try {
      const form = new FormData();
      form.append("titulo", tituloTpl);
      if (descripcionTpl) form.append("descripcion", descripcionTpl);
      if (variableDefinitions)
        form.append("variableDefinitions", variableDefinitions);
      form.append("file", fileTpl);
      await uploadTemplate(form);
      setTituloTpl("");
      setDescripcionTpl("");
      setFileTpl(null);
      await loadTemplates();
    } catch (err) {
      console.error(err);
      alert("Error subiendo plantilla");
    } finally {
      setLoadingTpl(false);
    }
  };

  const onInstantiate = async (id: string) => {
    try {
      const instance = await instantiateTemplate(id, {});
      router.push(`/admin/dashboard/esign/${instance.id}/builder`);
    } catch (err) {
      console.error(err);
      alert("Error instanciando plantilla");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-[#08252A] mb-2">eSign</h1>
      <p className="text-sm text-gray-600 mb-4">
        Administra documentos de firma electrónica: crea documentos, agrega
        firmantes y campos, y envía para firma.
      </p>

      <div className="flex items-center gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded border ${
            activeTab === "docs"
              ? "bg-[#B6B4B4] text-white border-[#B6B4B4]"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          onClick={() => setActiveTab("docs")}
        >
          Documentos
        </button>
        <button
          className={`px-3 py-1 rounded border ${
            activeTab === "templates"
              ? "bg-[#B6B4B4] text-white border-[#B6B4B4]"
              : "bg-white text-gray-700 border-gray-300"
          }`}
          onClick={() => setActiveTab("templates")}
        >
          Plantillas
        </button>
      </div>

      {activeTab === "docs" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h2 className="font-semibold mb-2">Próximos pasos</h2>
            <ol className="list-decimal ml-5 text-sm text-gray-700 space-y-1">
              <li>Crear documento base (título, PDF origen).</li>
              <li>Agregar firmantes con su orden.</li>
              <li>Posicionar campos y asignarlos a firmantes.</li>
              <li>Enviar invitaciones para firma.</li>
            </ol>
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h2 className="font-semibold mb-2">Crear documento</h2>
            <CreateDocumentForm />
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-md p-4 bg-white">
            <h2 className="font-semibold mb-2">Crear plantilla</h2>
            <form onSubmit={onUploadTemplate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Título</label>
                <input
                  value={tituloTpl}
                  onChange={(e) => setTituloTpl(e.target.value)}
                  required
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Descripción</label>
                <input
                  value={descripcionTpl}
                  onChange={(e) => setDescripcionTpl(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Archivo PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFileTpl(e.target.files?.[0] || null)}
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
                disabled={loadingTpl}
                className="bg-[#0097B2] text-white px-3 py-1 rounded"
              >
                {loadingTpl ? "Subiendo..." : "Crear plantilla"}
              </button>
            </form>
          </div>
          <div className="border border-gray-200 rounded-md p-4 bg-white">
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
                      <div className="text-xs text-gray-600">
                        {t.descripcion}
                      </div>
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
      )}
    </div>
  );
}
