"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  addFields,
  addRecipients,
  fetchDocument,
  sendDocument,
} from "@/features/esign/api/esignClient";
import { EsignFieldCanvas } from "@/features/esign/components/EsignFieldCanvas";

export default function EsignBuilderPage() {
  const params = useParams();
  const docId = params?.docId as string;
  const [doc, setDoc] = useState<any>(null);
  const [newRecipient, setNewRecipient] = useState({
    email: "",
    nombre: "",
    telefono: "",
    orden: 1,
  });
  const [fieldsDraft, setFieldsDraft] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (docId) {
      fetchDocument(docId).then(setDoc).catch(console.error);
    }
  }, [docId]);

  const refresh = async () => {
    const updated = await fetchDocument(docId);
    setDoc(updated);
  };

  const onAddRecipient = async () => {
    if (!newRecipient.email || !newRecipient.orden) return;
    await addRecipients(docId, [
      {
        email: newRecipient.email,
        nombre: newRecipient.nombre || undefined,
        orden: Number(newRecipient.orden),
      },
    ]);
    setNewRecipient({ email: "", nombre: "", telefono: "", orden: 1 });
    await refresh();
  };

  const onSaveFields = async () => {
    if (!fieldsDraft.length) return;
    setSaving(true);
    await addFields(docId, fieldsDraft);
    setSaving(false);
    await refresh();
  };

  const onSend = async () => {
    setSending(true);
    await sendDocument(docId);
    setSending(false);
    await refresh();
  };

  if (!doc)
    return <div className="container mx-auto px-4 py-6">Cargando...</div>;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Builder eSign</h1>
      <p className="text-sm text-gray-600">
        Documento: {doc.titulo} · Estado: {doc.estado}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4 bg-white">
          <h2 className="font-semibold mb-2">Firmantes</h2>
          <ul className="text-sm space-y-1">
            {doc.recipients?.map((r: any) => (
              <li key={r.id}>
                {r.orden}. {r.email} — {r.estado}
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-2">
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Email"
              value={newRecipient.email}
              onChange={(e) =>
                setNewRecipient({ ...newRecipient, email: e.target.value })
              }
            />
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Nombre (opcional)"
              value={newRecipient.nombre}
              onChange={(e) =>
                setNewRecipient({ ...newRecipient, nombre: e.target.value })
              }
            />
            <input
              className="w-full border rounded px-2 py-1"
              placeholder="Orden"
              type="number"
              value={newRecipient.orden}
              onChange={(e) =>
                setNewRecipient({
                  ...newRecipient,
                  orden: Number(e.target.value),
                })
              }
            />
            <button
              onClick={onAddRecipient}
              className="bg-[#0097B2] text-white px-3 py-1 rounded"
            >
              Agregar
            </button>
          </div>
        </div>
        <div className="border rounded p-4 bg-white">
          <h2 className="font-semibold mb-2">Campos</h2>
          <EsignFieldCanvas
            pdfUrl={`/esign/documents/${docId}/original.pdf`}
            fields={fieldsDraft}
            onChange={setFieldsDraft}
          />
          <div className="mt-3">
            <button
              disabled={saving}
              onClick={onSaveFields}
              className="bg-[#0097B2] text-white px-3 py-1 rounded"
            >
              {saving ? "Guardando..." : "Guardar campos"}
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          disabled={sending || doc.estado !== "DRAFT"}
          onClick={onSend}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          {sending ? "Enviando..." : "Enviar para firma"}
        </button>
      </div>
    </div>
  );
}
