"use client";

import { useEffect, useRef, useState } from "react";
// Note: We load pdf.js dynamically on the client to avoid SSR issues
// (Promise.withResolvers in pdfjs-dist v4) and to configure the worker
// with an HTTP URL instead of a local file path.

export type PdfField = {
  id: string;
  pageNumber: number;
  x: number; // 0..1
  y: number; // 0..1 (from top)
  width: number; // 0..1
  height: number; // 0..1
  fieldType: "SIGNATURE" | "DATE" | "TEXT" | "INITIAL";
  label?: string;
};

type Props = {
  pdfUrl: string;
  fields: PdfField[];
  signedImages?: Record<string, string>; // fieldId -> dataURL
  typedTexts?: Record<string, string>; // fieldId -> typed value (for TEXT/DATE preview)
  overlays?: Array<{
    pageNumber: number;
    x: number; // 0..1
    y: number; // 0..1 from top
    width: number; // 0..1
    height: number; // 0..1
    imageBase64: string; // data URL
  }>;
  onFieldClick?: (field: PdfField, bbox: DOMRect) => void;
};

export default function PdfSignViewer({
  pdfUrl,
  fields,
  signedImages = {},
  typedTexts = {},
  overlays = [],
  onFieldClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setPageSizes] = useState<Record<number, { w: number; h: number }>>(
    {}
  );
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        if (fallback) return;
        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";
        // Polyfill Promise.withResolvers for environments that lack it
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        if (typeof (Promise as any).withResolvers !== "function") {
          // disable-next-line @typescript-eslint/ban-ts-comment
          (Promise as any).withResolvers = () => {
            let resolve: (value?: any) => void;
            let reject: (reason?: any) => void;
            const promise = new Promise((res, rej) => {
              resolve = res as any;
              reject = rej as any;
            });
            return { promise, resolve: resolve!, reject: reject! };
          };
        }
        // Dynamically import the legacy build and access default export if present
        const pdfjsLibModule = await import("pdfjs-dist");
        const pdfjsLib: any = (pdfjsLibModule as any).default || pdfjsLibModule;
        // Run without a worker to avoid cross-origin/SSR worker loading issues
        pdfjsLib.disableWorker = true;
        // Also set a local worker path as a fallback (if disableWorker is ignored)
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

        const pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const pageWrapper = document.createElement("div");
          pageWrapper.style.position = "relative";
          pageWrapper.style.margin = "16px 0";
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          pageWrapper.appendChild(canvas);

          const overlay = document.createElement("div");
          overlay.style.position = "absolute";
          overlay.style.left = "0";
          overlay.style.top = "0";
          overlay.style.right = "0";
          overlay.style.bottom = "0";
          pageWrapper.appendChild(overlay);

          if (!cancelled) containerRef.current.appendChild(pageWrapper);

          await page.render({ canvasContext: ctx as any, viewport }).promise;
          setPageSizes((p) => ({
            ...p,
            [i]: { w: viewport.width, h: viewport.height },
          }));

          // Draw fields on this page
          const pageFields = fields.filter((f) => f.pageNumber === i);
          pageFields.forEach((f) => {
            const el = document.createElement("div");
            el.style.position = "absolute";
            el.style.cursor = "pointer";
            const left = f.x * viewport.width;
            const top = f.y * viewport.height;
            const w = Math.max(1, f.width * viewport.width);
            const h = Math.max(1, f.height * viewport.height);
            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            el.style.border =
              f.fieldType === "SIGNATURE"
                ? "2px dashed #0097B2"
                : "1px dashed #999";
            el.style.background = "rgba(0,151,178,0.06)";
            el.title = f.label || f.fieldType;

            // If already signed, show preview image
            const imgData = signedImages[f.id];
            if (imgData) {
              const img = document.createElement("img");
              img.src = imgData;
              img.style.width = "100%";
              img.style.height = "100%";
              img.style.objectFit = "contain";
              img.style.pointerEvents = "none";
              el.appendChild(img);
              el.style.borderStyle = "solid";
              el.style.borderColor = "#20a060";
            }

            // If typed text exists for this field, render a lightweight preview
            const txt = typedTexts[f.id];
            if (
              !imgData &&
              txt &&
              (f.fieldType === "TEXT" || f.fieldType === "DATE")
            ) {
              const span = document.createElement("div");
              span.innerText = String(txt);
              span.style.position = "absolute";
              span.style.left = "2px";
              span.style.right = "2px";
              span.style.top = "50%";
              span.style.transform = "translateY(-50%)";
              span.style.fontSize = Math.max(10, Math.min(14, h - 2)) + "px";
              span.style.color = "#000";
              span.style.whiteSpace = "nowrap";
              span.style.overflow = "hidden";
              span.style.textOverflow = "ellipsis";
              span.style.pointerEvents = "none";
              el.appendChild(span);
            }

            el.addEventListener("click", () => {
              if (!onFieldClick) return;
              onFieldClick(f, el.getBoundingClientRect());
            });
            overlay.appendChild(el);
          });

          // Draw overlays (signatures from other recipients already signed)
          const pageOverlays = overlays.filter((o) => o.pageNumber === i);
          pageOverlays.forEach((o) => {
            const el = document.createElement("div");
            el.style.position = "absolute";
            const left = o.x * viewport.width;
            const top = o.y * viewport.height;
            const w = Math.max(1, o.width * viewport.width);
            const h = Math.max(1, o.height * viewport.height);
            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            const img = document.createElement("img");
            img.src = o.imageBase64;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";
            img.style.pointerEvents = "none";
            el.appendChild(img);
            overlay.appendChild(el);
          });
        }
      } catch (e) {
        console.error("PDF render error", e);
        setFallback(true);
      }
    };
    render();
    return () => {
      cancelled = true;
    };
  }, [
    pdfUrl,
    JSON.stringify(fields),
    JSON.stringify(signedImages),
    JSON.stringify(typedTexts),
    fallback,
  ]);

  return (
    <div style={{ overflow: "auto" }}>
      {fallback ? (
        <iframe
          src={pdfUrl}
          style={{ width: "100%", height: 800, border: "none" }}
          title="Documento PDF"
        />
      ) : (
        <div ref={containerRef} />
      )}
    </div>
  );
}
