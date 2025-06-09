"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { EmailTemplate } from "../page";
import { ALLOWED_VARIABLES } from "../constants/vars";
import { saveEmailTemplate } from "../actions/email.actions";
import { useNotificationStore } from "@/store/notifications.store";

interface EmailTemplateModalProps {
  open: boolean;
  onClose: (refresh?: boolean) => void;
  template: EmailTemplate | null;
}

const QuillEditor = dynamic(() => import("../../components/QuillEditor"), {
  ssr: false,
});

export default function EmailTemplateModal({
  open,
  onClose,
  template,
}: EmailTemplateModalProps) {
  const { addNotification } = useNotificationStore();
  const isEdit = !!template;
  const [form, setForm] = useState({
    nombre: template?.nombre || "",
    asunto: template?.asunto || "",
    contenido: template?.contenido || "",
    descripcion: template?.descripcion || "",
  });
  const [saving, setSaving] = useState(false);

  const handleInsertVariable = (variable: string) => {
    setForm((prev) => ({
      ...prev,
      contenido: prev.contenido + ` {{${variable}}}`,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.set("nombre", form.nombre);
    formData.set("asunto", form.asunto);
    formData.set("contenido", form.contenido);
    formData.set("descripcion", form.descripcion);
    try {
      const result = await saveEmailTemplate(formData, isEdit, template?.id);
      if (!result.success) {
        addNotification(
          result.message || "An error occurred while saving the template.",
          "error"
        );
      } else {
        addNotification(result.message, "success");
        onClose(true);
      }
    } catch (e) {
      console.error("Error saving template:", e);
      addNotification("An error occurred while saving the template", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <form
        className="bg-white rounded shadow-lg p-6 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit" : "Create"} Template
        </h2>
        <div className="mb-3">
          <label className="block mb-1">Title</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Subject</label>
          <input
            name="asunto"
            value={form.asunto}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Content (visual editor)</label>
          <div className="mb-2 flex flex-wrap gap-2">
            {ALLOWED_VARIABLES.map((v) => (
              <button
                type="button"
                key={v}
                className="px-2 py-1 bg-gray-100 border rounded text-xs hover:bg-gray-200"
                onClick={() => handleInsertVariable(v)}
                title={`Insert {{${v}}}`}
              >
                {`{{${v}}}`}
              </button>
            ))}
          </div>
          <QuillEditor
            value={form.contenido}
            onChange={(val: string) =>
              setForm((prev) => ({ ...prev, contenido: val }))
            }
            placeholder={`Example: Hello {{nombre}} {{apellido}}, your email is {{correo}}.`}
            editorId="template-quill-editor"
          />
          <p className="text-xs text-gray-500 mt-1">
            Click on a variable to insert it wherever you want.
            <br />
            You can only use:{" "}
            {ALLOWED_VARIABLES.map((v) => (
              <code key={v} className="mr-2">
                {"{{" + v + "}}"}
              </code>
            ))}
          </p>
        </div>
        <div className="mb-3">
          <label className="block mb-1">Description</label>
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => onClose(false)}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0097B2] text-white rounded hover:bg-[#007a8f]"
            disabled={saving}
          >
            {saving ? "Saving..." : isEdit ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
