import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FieldDraft {
  id: string;
  pageNumber: number;
  x: number; // 0..1
  y: number; // 0..1
  width: number; // 0..1
  height: number; // 0..1
  assignedToRecipientId?: string;
  fieldType?: string;
}

interface Props {
  pdfUrl: string;
  fields: FieldDraft[];
  onChange: (fields: FieldDraft[]) => void;
  numPages?: number;
}

// Componente canvas de administración: posiciona campos por porcentaje.
export const EsignFieldCanvas: React.FC<Props> = ({
  pdfUrl,
  fields,
  onChange,
}) => {
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) =>
    setNumPages(numPages);

  const startDrag = (id: string) => setDraggingId(id);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onChange(
      fields.map((f) =>
        f.id === draggingId
          ? {
              ...f,
              x: Math.min(Math.max(x, 0), 1),
              y: Math.min(Math.max(y, 0), 1),
            }
          : f
      )
    );
  };

  const stopDrag = () => setDraggingId(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="border p-2 text-sm bg-gray-50 rounded">
        Arrastra los campos para posicionarlos. Coordenadas guardadas como
        proporción.
      </div>
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        className="relative select-none"
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_, i) => (
            <Page key={`page_${i + 1}`} pageNumber={i + 1} width={600} />
          ))}
        </Document>
        {fields.map((f) => (
          <div
            key={f.id}
            onMouseDown={() => startDrag(f.id)}
            className="absolute bg-blue-500/40 border border-blue-600 text-[10px] text-white cursor-move"
            style={{
              left: `${f.x * 100}%`,
              top: `${f.y * 100}%`,
              width: `${f.width * 100}%`,
              height: `${f.height * 100}%`,
            }}
          >
            {f.fieldType || "SIGN"}
          </div>
        ))}
      </div>
    </div>
  );
};
