"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import styles from "./styles.module.css";
import dynamic from "next/dynamic";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  editorId: string;
}

const QuillEditor = ({
  value,
  onChange,
  placeholder = "Escribe aquí...",
  editorId,
}: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Memoizar la configuración de Quill
  const quillConfig = useMemo(
    () => ({
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      },
      placeholder,
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
      ],
    }),
    [placeholder]
  );

  // Memoizar la función de destrucción
  const destroyQuill = useCallback(() => {
    if (quillRef.current) {
      quillRef.current.off("text-change");
      if (editorRef.current) {
        const toolbar = editorRef.current.previousSibling;
        if (toolbar) {
          toolbar.remove();
        }
        editorRef.current.innerHTML = "";
      }
      quillRef.current = null;
      setIsQuillLoaded(false);
    }
  }, []);

  // Memoizar el manejador de cambios
  const handleTextChange = useCallback(
    (quill: any) => {
      const html = quill.root.innerHTML;
      onChange(html);
    },
    [onChange]
  );

  // Efecto para la inicialización de Quill
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      destroyQuill();
    };
  }, [destroyQuill]);

  useEffect(() => {
    if (!isMounted || !editorRef.current || isQuillLoaded) return;

    const initQuill = async () => {
      try {
        const Quill = (await import("quill")).default;

        if (!isMounted) return;

        destroyQuill();

        const quill = new Quill(editorRef.current!, quillConfig);

        if (value) {
          quill.clipboard.dangerouslyPasteHTML(value);
        }

        quill.on("text-change", () => handleTextChange(quill));

        quillRef.current = quill;
        setIsQuillLoaded(true);
      } catch (error) {
        console.error("Error al inicializar Quill:", error);
      }
    };

    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(initQuill, 0);
    return () => clearTimeout(timeoutId);
  }, [
    isMounted,
    value,
    quillConfig,
    handleTextChange,
    destroyQuill,
    isQuillLoaded,
  ]);

  // Efecto para actualizar el contenido
  useEffect(() => {
    if (!quillRef.current || value === undefined) return;

    const currentContent = quillRef.current.root.innerHTML;
    if (currentContent !== value) {
      if (value === "") {
        quillRef.current.setText("");
      } else {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }
  }, [value]);

  return (
    <div className={styles.customEditor} id={editorId}>
      <div ref={editorRef} className={styles.editorContainer} />
    </div>
  );
};

// Exportar el componente memoizado
export default dynamic(() => Promise.resolve(QuillEditor), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
});
