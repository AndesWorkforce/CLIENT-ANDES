"use client";

import { useState, useEffect, useRef } from "react";
import { createOffer } from "./actions/offers.actions";
import { useNotificationStore } from "@/store/notifications.store";

// Estilos CSS para el editor
const editorStyles = `
.custom-editor {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.ql-toolbar {
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.editor-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 12px;
  min-height: 150px;
  font-size: 16px;
}

.editor-container:focus-visible {
  outline: 2px solid #0097B2;
  outline-offset: -2px;
}

.placeholder {
  color: #94a3b8;
  pointer-events: none;
}

/* Asegurar que el editor mantiene el foco correctamente */
.ql-editor {
  min-height: 150px;
  max-height: 250px;
  overflow-y: auto;
}

/* Corregir el comportamiento del cursor con formatos */
.ql-editor p {
  margin-bottom: 0.5em;
}

/* Asegurar que los saltos de línea sean respetados */
.ql-editor br {
  display: block;
  content: "";
  margin-top: 0.5em;
}
`;

// Componente Editor personalizado que usará Quill de manera compatible con React 19
function QuillEditor({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  editorId,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editorId: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const initializedRef = useRef(false);

  // Inicializar el editor cuando el componente se monta
  useEffect(() => {
    // Solo inicializar en el cliente
    if (typeof window === "undefined") return;

    // Limpiar cualquier editor previo para evitar duplicación
    if (editorRef.current) {
      // Eliminar cualquier toolbar previa que pudiera haberse quedado
      const prevToolbars =
        editorRef.current.parentElement?.querySelectorAll(".ql-toolbar");
      prevToolbars?.forEach((toolbar) => {
        if (toolbar.parentNode) {
          toolbar.parentNode.removeChild(toolbar);
        }
      });

      // Limpiar el contenido del editor
      editorRef.current.innerHTML = "";
    }

    if (editorRef.current && !initializedRef.current) {
      const loadQuill = async () => {
        try {
          // Cargar Quill dinámicamente
          const Quill = (await import("quill")).default;

          // Configuración básica de Quill con opciones personalizadas para el Enter
          const quill = new Quill(editorRef.current!, {
            modules: {
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            },
            placeholder: placeholder,
            theme: "snow",
            formats: [
              "header",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "bullet",
              "link",
              "background",
              "color",
            ],
          });

          // Establecer el contenido inicial
          if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
          } else {
            // Establecer contenido vacío si no hay valor
            quill.setText("");
          }

          // Escuchar cambios en el editor
          quill.on("text-change", () => {
            const html =
              editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
            onChange(html);
          });

          quillInstanceRef.current = quill;
          initializedRef.current = true;
        } catch (error) {
          console.error("Error al cargar Quill:", error);
        }
      };

      loadQuill();
    }

    // Limpiar cuando el componente se desmonta
    return () => {
      if (quillInstanceRef.current) {
        // Limpiar el editor
        quillInstanceRef.current = null;
        initializedRef.current = false;
      }
    };
  }, [editorId]); // Dependencia solo en editorId para asegurar reinicialización cuando cambia la key

  // Actualizar el contenido cuando cambia el valor externamente
  useEffect(() => {
    if (
      quillInstanceRef.current &&
      value !== undefined &&
      initializedRef.current
    ) {
      if (value === "") {
        quillInstanceRef.current.setText("");
      } else if (
        editorRef.current?.querySelector(".ql-editor")?.innerHTML !== value
      ) {
        quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  // Exponer método para limpiar el editor externamente
  useEffect(() => {
    // Si el valor es vacío, asegurarse de que el editor esté limpio
    if (value === "" && quillInstanceRef.current && initializedRef.current) {
      quillInstanceRef.current.setText("");
    }
  }, [value]);

  return (
    <div className="custom-editor">
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      <div ref={editorRef} className="editor-container" />
    </div>
  );
}

export default function OfferDetailPage() {
  const { addNotification } = useNotificationStore();
  const [title, setTitle] = useState("");
  const [descriptionHTML, setDescriptionHTML] = useState("");
  const [editorKey, setEditorKey] = useState(Date.now());

  const handleDescriptionChange = (content: string) => {
    console.log("[DEBUG] Actualización descripción HTML");
    setDescriptionHTML(content);
  };

  const isContentEmpty = (htmlContent: string) => {
    // Verifica si el contenido está vacío o solo contiene un párrafo vacío
    return !htmlContent || htmlContent === "" || htmlContent === "<p><br></p>";
  };

  const handlePublish = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!title || isContentEmpty(descriptionHTML)) {
      addNotification("Debes completar el título y la descripción", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", descriptionHTML);
    formData.append("estado", "publicado");

    console.log("[DEBUG] Publicando oferta:", {
      title,
      description: descriptionHTML.substring(0, 50) + "...",
    });

    const response = await createOffer(formData);
    if (response.success) {
      addNotification("Oferta publicada", "success");
      console.log("[DEBUG] Oferta publicada, limpiando formulario");
      await resetForm();
    } else {
      addNotification("Error al publicar oferta", "error");
      console.log("Error al publicar oferta:", response.message);
    }
  };

  const handleSave = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!title || isContentEmpty(descriptionHTML)) {
      addNotification("Debes completar el título y la descripción", "error");
      return;
    }

    // Guardar borrador
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", descriptionHTML);
    formData.append("estado", "borrador");

    console.log("[DEBUG] Guardando borrador:", {
      title,
      description: descriptionHTML.substring(0, 50) + "...",
    });

    const response = await createOffer(formData);
    if (response.success) {
      addNotification("Oferta guardada como borrador", "success");
      console.log("[DEBUG] Borrador guardado, limpiando formulario");
      await resetForm();
    } else {
      addNotification("Error al guardar cambios", "error");
      console.log("Error al guardar cambios:", response.message);
    }
  };

  const resetForm = async () => {
    // Primero establecer los estados a vacío
    setTitle("");
    setDescriptionHTML("");

    // Dar tiempo para que los estados se actualicen
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Luego forzar la recreación del componente actualizando la clave
    setEditorKey(Date.now());

    console.log("[DEBUG] Formulario limpiado, nueva clave:", editorKey);
  };

  const handleDiscard = () => {
    resetForm();
    addNotification("Cambios descartados", "info");
  };

  console.log(
    "[DEBUG] descriptionHTML",
    descriptionHTML ? descriptionHTML.length + " caracteres" : "vacío"
  );

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

          {/* Descripción del puesto con Quill */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descripción del puesto
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <QuillEditor
                value={descriptionHTML}
                onChange={handleDescriptionChange}
                placeholder="Describe el puesto de trabajo..."
                editorId={`description-${editorKey}`}
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col space-y-3 pt-4">
            <button
              onClick={handlePublish}
              className="w-full p-3 rounded-md bg-[#0097B2] text-white font-medium hover:bg-[#008aa2] transition-colors cursor-pointer"
            >
              Publicar oferta
            </button>
            <button
              onClick={handleSave}
              className="w-full p-3 rounded-md bg-[#E6F7FA] text-[#0097B2] font-medium hover:bg-[#d6f0f5] transition-colors cursor-pointer"
            >
              Guardar como borrador
            </button>
            <button
              onClick={handleDiscard}
              className="w-full p-3 text-[#FF3B30] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Descartar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
