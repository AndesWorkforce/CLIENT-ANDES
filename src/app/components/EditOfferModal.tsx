"use client";

import {
  useState,
  useEffect,
  useMemo,
  Component,
  ErrorInfo,
  ReactNode,
  useRef,
} from "react";
import { Offer, OfferWithContent } from "@/app/types/offers";
import { X } from "lucide-react";

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

/* Estilos para el modo solo lectura */
.read-only .ql-toolbar {
  display: none;
}

.read-only .editor-container {
  border: none;
}
`;

// Contador global para evitar múltiples instancias con el mismo ID
let editorInstanceCount = 0;

// Componente Editor personalizado que usará Quill de manera compatible con React 19
function QuillEditor({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  editorId,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editorId: string;
  readOnly?: boolean;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const uniqueIdRef = useRef(`editor-${editorInstanceCount++}`);

  // Función para limpiar todas las toolbars
  const cleanupToolbars = () => {
    // Eliminar todas las toolbars innecesarias del documento
    const allToolbars = document.querySelectorAll(".ql-toolbar");
    console.log(`[EDITOR-CLEANUP] Eliminando ${allToolbars.length} toolbars`);

    allToolbars.forEach((toolbar) => {
      // Solo eliminar si no está dentro de un editor activo
      if (
        toolbar.parentElement &&
        (!editorRef.current ||
          !toolbar.parentElement.contains(editorRef.current))
      ) {
        toolbar.parentNode?.removeChild(toolbar);
      }
    });

    // También limpiar la toolbar dentro de nuestro editor
    if (editorRef.current) {
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
  };

  // Limpiar toolbars al montar el componente
  useEffect(() => {
    console.log(
      `[EDITOR] Montando editor ${uniqueIdRef.current} con ID: ${editorId}`
    );
    cleanupToolbars();

    // Limpiar cuando el componente se desmonta
    return () => {
      console.log(`[EDITOR] Desmontando editor ${uniqueIdRef.current}`);
      if (quillInstanceRef.current) {
        quillInstanceRef.current = null;
        initializedRef.current = false;
      }
      cleanupToolbars();
    };
  }, []);

  // Inicializar el editor cuando el componente se monta
  useEffect(() => {
    // Solo inicializar en el cliente
    if (typeof window === "undefined") return;

    // Limpiar todas las toolbars antes de inicializar
    cleanupToolbars();

    // Si ya existe una instancia, limpiarla
    if (quillInstanceRef.current) {
      console.log(
        `[EDITOR] Limpiando instancia existente ${uniqueIdRef.current}`
      );
      quillInstanceRef.current = null;
      initializedRef.current = false;
    }

    if (editorRef.current && !initializedRef.current) {
      const loadQuill = async () => {
        try {
          // Cargar Quill dinámicamente
          const Quill = (await import("quill")).default;

          // Configuración básica de Quill
          const quill = new Quill(editorRef.current!, {
            modules: {
              toolbar: readOnly
                ? false
                : [
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
            readOnly: readOnly,
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
            if (!readOnly) {
              const html =
                editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
              onChange(html);
            }
          });

          quillInstanceRef.current = quill;
          initializedRef.current = true;

          console.log(
            `[EDITOR] Editor ${uniqueIdRef.current} inicializado con ID: ${editorId}`
          );
        } catch (error) {
          console.error("Error al cargar Quill:", error);
        }
      };

      loadQuill();
    }
  }, [editorId, readOnly]); // Dependencias actualizadas para reinicializar cuando cambia editorId o readOnly

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
    <div
      className={`custom-editor ${readOnly ? "read-only" : ""}`}
      id={uniqueIdRef.current}
    >
      <style dangerouslySetInnerHTML={{ __html: editorStyles }} />
      <div ref={editorRef} className="editor-container" />
    </div>
  );
}

// Error boundary para capturar errores en el editor
class EditorErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[EDITOR-ERROR-BOUNDARY] Error en editor:", error);
    console.error("[EDITOR-ERROR-BOUNDARY] Stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="border border-red-300 p-4 rounded bg-red-50">
            <h3 className="text-red-600 font-medium mb-2">
              Error en el editor
            </h3>
            <p className="text-sm text-gray-700">
              Hubo un problema al cargar el editor. Por favor, intente refrescar
              la página.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

interface EditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerId?: string;
  onSave: (offer: Offer) => Promise<void>;
  readOnly?: boolean;
  initialData?: Offer;
}

export default function EditOfferModal({
  isOpen,
  onClose,
  offerId,
  onSave,
  readOnly = false,
  initialData,
}: EditOfferModalProps) {
  const [isEditing, setIsEditing] = useState(!readOnly);
  const [title, setTitle] = useState("");
  const [editorHTML, setEditorHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(Date.now());
  const firstRenderRef = useRef(true);
  const mountCountRef = useRef(0);

  // Limpiar el DOM al montar/desmontar el componente
  useEffect(() => {
    // Al montar
    mountCountRef.current++;
    console.log(`[MODAL] Montando modal, conteo: ${mountCountRef.current}`);

    // Limpiar al desmontar
    return () => {
      console.log(`[MODAL] Desmontando modal`);
      // Limpiar todas las toolbars al desmontar completamente
      const allToolbars = document.querySelectorAll(".ql-toolbar");
      allToolbars.forEach((toolbar) => {
        toolbar.parentNode?.removeChild(toolbar);
      });
    };
  }, []);

  const resetForm = async () => {
    // Primero establecer los estados a vacío
    setTitle("");
    setEditorHTML("");

    // Dar tiempo para que los estados se actualicen
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Luego forzar la recreación del componente actualizando la clave
    setEditorKey(Date.now());

    console.log("[DEBUG] Formulario limpiado, nueva clave:", editorKey);
  };

  useEffect(() => {
    // Limpiar todas las toolbars existentes al abrir el modal
    if (isOpen) {
      if (firstRenderRef.current) {
        console.log("[MODAL] Primera apertura, limpiando toolbars");
        // Eliminar todas las toolbars al abrir el modal
        const existingToolbars = document.querySelectorAll(".ql-toolbar");
        existingToolbars.forEach((toolbar) => {
          toolbar.parentNode?.removeChild(toolbar);
        });

        firstRenderRef.current = false;
        // Forzar una nueva key en la primera apertura
        setEditorKey(Date.now());
      }
    } else {
      // Resetear flags cuando se cierra el modal
      firstRenderRef.current = true;
    }
  }, [isOpen]);

  // Cargar datos al abrir el modal o cuando cambian los datos iniciales
  useEffect(() => {
    if (!isOpen) return;

    if (!initialData) {
      if (offerId) {
        setLoading(true);
      } else {
        resetForm();
      }
      return;
    }

    console.log("[EDIT-OFFER] Cargando datos:", {
      titulo: initialData.titulo,
      descripcion_tipo: typeof initialData.descripcion,
      desc_muestra:
        typeof initialData.descripcion === "string"
          ? initialData.descripcion.substring(0, 50) + "..."
          : "No es string",
      offerId: offerId,
    });

    try {
      // Establecer título
      setTitle(initialData.titulo || "");

      // Manejar la descripción
      let contenido = "";

      if (typeof initialData.descripcion === "string") {
        // Usar directamente si es HTML
        contenido = initialData.descripcion;
      } else if (
        typeof initialData.descripcion === "object" &&
        initialData.descripcion !== null
      ) {
        // Contenido migrado desde formato anterior
        contenido = "<p>Contenido migrado desde formato anterior</p>";
      }

      // Actualizar estado del editor
      setEditorHTML(contenido);

      // Forzar recreación del editor con nueva clave
      setEditorKey(Date.now());
      console.log("[EDIT-OFFER] Editor key actualizada:", editorKey);
    } catch (error) {
      console.error("[EDIT-OFFER] Error procesando contenido:", error);
      setEditorHTML("");
    }
  }, [initialData, offerId, isOpen]);

  const handleEditorChange = (content: string) => {
    console.log("[EDITOR-CHANGE] Actualizando editor HTML");
    setEditorHTML(content);
  };

  const handleSave = async () => {
    if (!title || !editorHTML || editorHTML === "<p><br></p>") {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log("[SAVE] Guardando contenido HTML");

      const offerData: Offer = {
        id: offerId,
        titulo: title,
        descripcion: editorHTML,
        estado: "borrador",
      };

      await onSave(offerData);

      if (!offerId) {
        await resetForm();
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar oferta:", error);
      alert("Error al guardar oferta");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title || !editorHTML || editorHTML === "<p><br></p>") {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      console.log("[PUBLISH] Publicando contenido HTML");

      const offerData: Offer = {
        id: offerId,
        titulo: title,
        descripcion: editorHTML,
        estado: "publicado",
      };

      await onSave(offerData);
      onClose();
    } catch (error) {
      console.error("Error al publicar oferta:", error);
      alert("Error al publicar oferta");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#08252A33] z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {offerId ? "Editar oferta" : "Nueva oferta"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} className="cursor-pointer" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            {isEditing ? (
              <>
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
              </>
            ) : (
              <h1 className="text-2xl font-bold mb-4">{title}</h1>
            )}
          </div>

          <div>
            {isEditing && (
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción del puesto
              </label>
            )}
            <div
              className={
                isEditing
                  ? "border border-gray-300 rounded-md overflow-hidden"
                  : ""
              }
            >
              <EditorErrorBoundary>
                <QuillEditor
                  value={editorHTML}
                  onChange={handleEditorChange}
                  placeholder="Describe el puesto de trabajo..."
                  editorId={`description-${editorKey}`}
                  readOnly={!isEditing}
                />
              </EditorErrorBoundary>
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col space-y-3 pt-4">
              <button
                onClick={handlePublish}
                disabled={loading}
                className="w-full p-3 rounded-md bg-[#0097B2] text-white font-medium hover:bg-[#008aa2] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Guardando..." : "Publicar oferta"}
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full p-3 rounded-md bg-[#E6F7FA] text-[#0097B2] font-medium hover:bg-[#d6f0f5] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Guardando..." : "Guardar como borrador"}
              </button>
              <button
                onClick={handleDiscard}
                disabled={loading}
                className="w-full p-3 text-[#FF3B30] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Descartar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
