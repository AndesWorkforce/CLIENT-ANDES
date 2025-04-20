"use client";

import {
  useState,
  useEffect,
  Component,
  ErrorInfo,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { Offer } from "@/app/types/offers";
import { X } from "lucide-react";
import { useNotificationStore } from "@/store/notifications.store";
import QuillEditor from "@/app/admin/dashboard/components/QuillEditor";

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
              Error in the editor
            </h3>
            <p className="text-sm text-gray-700">
              There was an error loading the editor. Please try refreshing the
              page.
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
  const { addNotification } = useNotificationStore();
  const [isEditing] = useState(!readOnly);
  const [title, setTitle] = useState<string>("");
  const [editorHTML, setEditorHTML] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [editorKey, setEditorKey] = useState<number>(Date.now());
  const firstRenderRef = useRef<boolean>(true);
  const mountCountRef = useRef<number>(0);

  const resetEditor = useCallback(() => {
    const allToolbars = document.querySelectorAll(".ql-toolbar");
    allToolbars.forEach((toolbar) => {
      toolbar.parentNode?.removeChild(toolbar);
    });

    setEditorKey(Date.now());
  }, []);

  useEffect(() => {
    mountCountRef.current++;

    return () => {
      const allToolbars = document.querySelectorAll(".ql-toolbar");
      allToolbars.forEach((toolbar) => {
        toolbar.parentNode?.removeChild(toolbar);
      });
    };
  }, []);

  const resetForm = useCallback(async () => {
    setTitle("");
    setEditorHTML("");

    await new Promise((resolve) => setTimeout(resolve, 50));

    resetEditor();
  }, [resetEditor]);

  useEffect(() => {
    if (isOpen) {
      if (firstRenderRef.current) {
        setEditorKey(Date.now());

        const allToolbars = document.querySelectorAll(".ql-toolbar");
        allToolbars.forEach((toolbar) => {
          toolbar.parentNode?.removeChild(toolbar);
        });

        firstRenderRef.current = false;
      }
    } else {
      firstRenderRef.current = true;
    }
  }, [isOpen]);

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

    try {
      setTitle(initialData.titulo || "");

      let contenido = "";

      if (typeof initialData.descripcion === "string") {
        contenido = initialData.descripcion;
      } else if (
        typeof initialData.descripcion === "object" &&
        initialData.descripcion !== null
      ) {
        contenido = "<p>Contenido migrado desde formato anterior</p>";
      }

      setEditorHTML(contenido);

      // Solo regeneramos la key del editor, sin llamar a resetEditor
      // para evitar un bucle infinito
      setEditorKey(Date.now());
    } catch (error) {
      console.error("[EDIT-OFFER] Error procesando contenido:", error);
      setEditorHTML("");
      setEditorKey(Date.now());
    }
  }, [initialData, offerId, isOpen, resetForm]);

  const handleEditorChange = (content: string) => {
    setEditorHTML(content);
  };

  const handleSave = async () => {
    if (!title || !editorHTML || editorHTML === "<p><br></p>") {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
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
      addNotification("Please complete all fields", "error");
      return;
    }

    setLoading(true);
    try {
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
      addNotification("Error al publicar oferta", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    resetForm();
    onClose();
  };

  const handleModalClose = () => {
    resetEditor();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#08252A33] z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto custom-scrollbar">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {offerId ? "Edit offer" : "New offer"}
          </h2>
          <button
            onClick={handleModalClose}
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
                  Offer title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Graphic design service"
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
                Offer description
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
                  key={editorKey}
                  value={editorHTML}
                  onChange={handleEditorChange}
                  placeholder="Describe the job position..."
                  editorId={`description-${editorKey}`}
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
                {loading ? "Saving..." : "Publish offer"}
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full p-3 rounded-md bg-[#E6F7FA] text-[#0097B2] font-medium hover:bg-[#d6f0f5] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : "Save as draft"}
              </button>
              <button
                onClick={handleDiscard}
                disabled={loading}
                className="w-full p-3 text-[#FF3B30] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Discard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
