"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { axiosBase } from "@/services/axios.instance";
import SignaturePad from "signature_pad";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import PdfSignViewer, { type PdfField } from "../components/PdfSignViewer";

type Field = {
  id: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fieldType: "SIGNATURE" | "DATE" | "TEXT" | "INITIAL";
  assignedToRecipientId?: string;
  label?: string;
};

const getRoleDisplay = (role?: string) => {
  if (!role) return "—";
  const map: Record<string, string> = {
    CANDIDATO: "Contractor",
    EMPRESA: "Company",
    PROVEEDOR: "Provider",
  };
  return map[role.toUpperCase()] || role;
};

function PublicSignClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  // Prefer token from query string; fallback to pathname segment
  const searchParams = useSearchParams();
  const pathname = usePathname();
  let token = searchParams.get("token") || "";
  if (!token && pathname) {
    const m = pathname.match(/\/esign\/public\/sign\/(.+)$/);
    if (m && m[1]) token = decodeURIComponent(m[1]);
  }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<{
    id: string;
    titulo: string;
    archivoOrigenUrl?: string;
    archivoFirmadoUrl?: string;
  } | null>(null);
  const [recipient, setRecipient] = useState<{
    id: string;
    orden: number;
    rol?: string;
  } | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [overlays, setOverlays] = useState<
    Array<{
      pageNumber: number;
      x: number;
      y: number;
      width: number;
      height: number;
      imageBase64: string;
    }>
  >([]);
  const [signedImages, setSignedImages] = useState<Record<string, string>>({});
  const [signTarget, setSignTarget] = useState<{
    field: Field;
    bbox: DOMRect;
  } | null>(null);
  const [mode, setMode] = useState<"DRAW" | "TYPED">("DRAW");
  const [typedName, setTypedName] = useState("");
  const [justSigned, setJustSigned] = useState(false);
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", window.location.href);
        router.push("/auth/login");
      }
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchPayload = async () => {
      try {
        if (!token) {
          setError("Token not specified");
          setLoading(false);
          return;
        }
        const res = await axiosBase.get(
          `/esign/public/sign/${encodeURIComponent(token)}`
        );
        setDoc(res.data.documento);
        setRecipient(res.data.recipient);
        const fetchedFields: Field[] = res.data.fields || [];
        setFields(fetchedFields);

        // Initialize text values for TEXT/DATE fields with sensible defaults
        const tv: Record<string, string> = {};
        // Local persisted hints, if any
        let persistedName = "";
        let persistedCountry = "";
        let persistedId = "";
        if (typeof window !== "undefined") {
          persistedName = localStorage.getItem("esign_name") || "";
          persistedCountry = localStorage.getItem("esign_country") || "";
          persistedId = localStorage.getItem("esign_id_number") || "";
        }
        // Pre-fill typed name state from persisted value (if any)
        if (persistedName) setTypedName(persistedName);

        fetchedFields.forEach((f: Field) => {
          if (f.fieldType === "DATE") {
            const today = new Date().toISOString().slice(0, 10);
            tv[f.id] = today;
          }
          if (f.fieldType === "TEXT") {
            const label = (f.label || "").trim().toLowerCase();
            if (label === "name" && persistedName) tv[f.id] = persistedName;
            if (label === "country" && persistedCountry)
              tv[f.id] = persistedCountry;
            if (
              (label.includes("identification") || label === "id") &&
              persistedId
            )
              tv[f.id] = persistedId;
          }
        });
        setTextValues(tv);
        setAlreadySigned(Boolean(res.data.alreadySigned));
        setOverlays(res.data.signedOverlays || []);
        setLoading(false);
      } catch (e: any) {
        if (e?.response?.status === 401) {
          // Si el token es inválido o expiró, cerrar sesión para forzar re-login
          useAuthStore.getState().logout();
          return;
        }
        setError(e?.response?.data?.message || "Error loading document");
        setLoading(false);
      }
    };
    fetchPayload();
  }, [token]);

  // Keep the "Name" TEXT field in sync with the typed signature name
  useEffect(() => {
    if (!fields.length) return;
    const nameField = fields.find(
      (f) =>
        f.fieldType === "TEXT" &&
        (f.label || "").trim().toLowerCase() === "name"
    );
    if (!nameField) return;
    setTextValues((prev) => {
      if ((prev[nameField.id] || "") === (typedName || "")) return prev;
      return { ...prev, [nameField.id]: typedName };
    });
    // Persist for future sessions
    if (typeof window !== "undefined") {
      if (typedName) localStorage.setItem("esign_name", typedName);
    }
  }, [typedName, JSON.stringify(fields)]);

  // Inicialización robusta del SignaturePad: se activa cuando el canvas está listo y el modo es DRAW
  useEffect(() => {
    const tryInit = () => {
      if (mode !== "DRAW") return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Si ya existe, no re-crear
      if (padRef.current) return;
      // Ajustar tamaño antes de crear el pad para evitar glitch inicial
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = 140 * ratio;
      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);
      const pad = new SignaturePad(canvas, {
        minWidth: 0.8,
        maxWidth: 2.0,
        penColor: "#08252A",
        backgroundColor: "#FFFFFF",
      });
      padRef.current = pad;
    };
    // Intento inmediato y luego un pequeño retraso por si el layout aún no está
    tryInit();
    const t = setTimeout(tryInit, 50);
    // Resize handler para mantener la resolución correcta
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !padRef.current) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = 140 * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      padRef.current.clear();
    };
    window.addEventListener("resize", resize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", resize);
    };
  }, [mode]);

  const clearPad = () => padRef.current?.clear();

  const handleFieldClick = (field: Field, bbox: DOMRect) => {
    setSignTarget({ field, bbox });
    setMode("DRAW");
    setTimeout(() => {
      // Ensure pad is initialized when modal appears
      if (!padRef.current && canvasRef.current) {
        padRef.current = new SignaturePad(canvasRef.current, {
          minWidth: 0.8,
          maxWidth: 2.0,
          penColor: "#08252A",
          backgroundColor: "#FFFFFF",
        });
      }
    }, 50);
  };

  const submit = async () => {
    setError(null);
    try {
      let firmaBase64: string | undefined = undefined;

      if (mode === "DRAW") {
        if (!padRef.current || padRef.current.isEmpty()) {
          setError("Please draw your signature");
          return;
        }
        firmaBase64 = padRef.current.toDataURL("image/png");
      } else if (mode === "TYPED") {
        if (!typedName.trim()) {
          setError("Type your name to sign");
          return;
        }
        // Generate image from text
        const canvas = document.createElement("canvas");
        // High resolution for better quality
        canvas.width = 600;
        canvas.height = 150;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#ffffff"; // transparent or white? PDF overlay usually transparent but let's see
          // Actually transparent is better for overlay, but let's ensure text is visible
          // ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.font = "italic 48px 'Dancing Script', cursive, sans-serif";
          ctx.fillStyle = "#000000";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(typedName.trim(), canvas.width / 2, canvas.height / 2);
          firmaBase64 = canvas.toDataURL("image/png");
        }
      }

      // Validate required TEXT/DATE fields must be filled
      const missingText = fields.filter(
        (f) =>
          (f.fieldType === "TEXT" || f.fieldType === "DATE") &&
          !String(textValues[f.id] || "").trim()
      );
      if (missingText.length) {
        setError("Please complete the required text fields before signing");
        return;
      }

      const payload: any = {
        mode,
        firmaBase64,
      };
      if (mode === "TYPED") {
        payload.typedName = typedName.trim();
      }
      // Include typed values for TEXT/DATE fields
      const relevant = fields.filter(
        (f) => f.fieldType === "TEXT" || f.fieldType === "DATE"
      );
      if (relevant.length) {
        payload.textValues = {} as Record<string, string>;
        relevant.forEach((f) => {
          const v = String(textValues[f.id] || "").trim();
          if (v) (payload.textValues as any)[f.id] = v;
        });
      }

      // Update local preview immediately
      if (firmaBase64) {
        const targetIds = signTarget
          ? [signTarget.field.id]
          : fields.filter((f) => f.fieldType === "SIGNATURE").map((f) => f.id);
        const next: Record<string, string> = { ...signedImages };
        targetIds.forEach((id) => (next[id] = firmaBase64!));
        setSignedImages(next);
      }

      // Enviamos solo los campos esperados por el backend (SignDto)
      await axiosBase.post(
        `/esign/public/sign/${encodeURIComponent(token)}`,
        payload
      );
      // Refrescar payload para mostrar estado/archivo actualizado
      const res = await axiosBase.get(
        `/esign/public/sign/${encodeURIComponent(token)}`
      );
      setDoc(res.data.documento);
      setRecipient(res.data.recipient);
      setFields(res.data.fields || []);
      setAlreadySigned(Boolean(res.data.alreadySigned));
      setOverlays(res.data.signedOverlays || []);
      setJustSigned(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Could not sign");
    }
  };

  if (loading || authLoading) return <div className="container mx-auto p-6">Loading...</div>;
  if (!isAuthenticated)
    return <div className="container mx-auto p-6">Redirecting to login...</div>;
  if (error)
    return <div className="container mx-auto p-6 text-red-600">{error}</div>;
  if (!doc || !recipient)
    return <div className="container mx-auto p-6">Not found</div>;

  if (justSigned) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Document Signed!
          </h2>
          <p className="text-gray-600 mb-6">
            You have successfully signed <strong>{doc.titulo}</strong>.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("redirectAfterLogin");
              router.push("/currentApplication");
            }}
            className="w-full bg-[#0097B2] hover:bg-[#00869e] text-white font-medium px-4 py-3 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold leading-tight text-gray-900">
          Sign Document
        </h1>
        <div className="text-sm text-gray-500 mt-1">{doc.titulo}</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0">
          {alreadySigned ? (
            <div className="border border-gray-300 rounded-lg shadow-sm bg-white p-8 text-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium text-lg text-gray-900">
                  You have already signed this document.
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("redirectAfterLogin");
                    router.push("/currentApplication");
                  }}
                  className="text-[#0097B2] hover:underline font-medium"
                >
                  Return to Dashboard
                </button>
              </div>
              {doc.archivoFirmadoUrl ? (
                <div>
                  <div className="mb-3 text-gray-700 font-medium">
                    Final signed document:
                  </div>
                  <iframe
                    src={doc.archivoFirmadoUrl}
                    className="w-full h-[800px] border border-gray-200 rounded"
                  />
                </div>
              ) : (
                <div className="text-gray-600">
                  Waiting for the provider/responsible party to sign. We will
                  notify you when it is completed.
                </div>
              )}
            </div>
          ) : (
            doc.archivoOrigenUrl && (
              <div className="border border-gray-300 rounded-lg shadow-sm bg-white overflow-hidden">
                <PdfSignViewer
                  pdfUrl={doc.archivoOrigenUrl}
                  fields={fields as unknown as PdfField[]}
                  signedImages={signedImages}
                  typedTexts={textValues}
                  overlays={overlays}
                  onFieldClick={handleFieldClick}
                />
              </div>
            )
          )}
        </div>

        <aside className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 lg:sticky lg:top-6 h-max">
          <div className="text-xs text-gray-500 mb-4 uppercase tracking-wide font-semibold">
            Your Role:{" "}
            <span className="text-gray-900">
              {getRoleDisplay(recipient.rol)}
            </span>{" "}
            · Order {recipient.orden}
          </div>

          <h2 className="font-semibold text-gray-900 mb-4 text-lg">
            Your Signature
          </h2>
          {alreadySigned && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              This recipient has already signed.
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={mode === "DRAW"}
                onChange={() => setMode("DRAW")}
                className="text-[#0097B2] focus:ring-[#0097B2]"
              />
              Draw
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={mode === "TYPED"}
                onChange={() => setMode("TYPED")}
                className="text-[#0097B2] focus:ring-[#0097B2]"
              />
              Type
            </label>
          </div>

          {!alreadySigned && mode === "DRAW" && (
            <div>
              <div className="text-xs text-gray-500 mb-2">
                Draw your signature and click on a document field to preview it.
              </div>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={() => {
                    // Si por timing no se creó aún, reintentar al primer click
                    if (!padRef.current) {
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const ratio = Math.max(window.devicePixelRatio || 1, 1);
                      canvas.width = canvas.offsetWidth * ratio;
                      canvas.height = 140 * ratio;
                      canvas.getContext("2d")?.scale(ratio, ratio);
                      padRef.current = new SignaturePad(canvas, {
                        minWidth: 0.8,
                        maxWidth: 2.0,
                        penColor: "#08252A",
                        backgroundColor: "#FFFFFF",
                      });
                    }
                  }}
                  style={{
                    width: "100%",
                    height: 140,
                    touchAction: "none",
                    display: "block",
                  }}
                />
              </div>
              <button
                onClick={clearPad}
                className="mt-2 text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          {!alreadySigned && mode === "TYPED" && (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">Type your full name</div>
              <input
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
                placeholder="Full Name"
              />
            </div>
          )}

          {!alreadySigned && (
            <button
              onClick={submit}
              className="mt-6 w-full bg-[#0097B2] hover:bg-[#00869e] text-white font-medium px-4 py-2.5 rounded-md text-sm transition-colors shadow-sm"
            >
              Sign Document
            </button>
          )}
          {error && <div className="mt-3 text-xs text-red-600">{error}</div>}

          {/* Inputs for TEXT/DATE fields */}
          {!alreadySigned &&
            fields.some(
              (f) => f.fieldType === "TEXT" || f.fieldType === "DATE"
            ) && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3 text-sm">
                  Required Details
                </h3>
                <div className="space-y-3">
                  {fields
                    .filter(
                      (f) => f.fieldType === "TEXT" || f.fieldType === "DATE"
                    )
                    .map((f) => (
                      <div key={f.id} className="space-y-1">
                        <label className="block text-xs text-gray-600">
                          {f.label ||
                            (f.fieldType === "DATE" ? "Date" : "Text")}
                        </label>
                        <input
                          type={f.fieldType === "DATE" ? "date" : "text"}
                          value={textValues[f.id] || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTextValues((prev) => ({
                              ...prev,
                              [f.id]: val,
                            }));
                            const label = (f.label || "").trim().toLowerCase();
                            // Keep typed name in sync when editing the "Name" field directly
                            if (label === "name") setTypedName(val);
                            // Persist useful hints
                            if (typeof window !== "undefined") {
                              if (label === "country")
                                localStorage.setItem("esign_country", val);
                              if (
                                label.includes("identification") ||
                                label === "id"
                              )
                                localStorage.setItem("esign_id_number", val);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0097B2] focus:border-[#0097B2]"
                          placeholder={
                            f.label ||
                            (f.fieldType === "DATE"
                              ? "YYYY-MM-DD"
                              : "Enter text")
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
        </aside>
      </div>
    </div>
  );
}

export default function PublicSignPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto p-6">Loading...</div>}
    >
      <PublicSignClient />
    </Suspense>
  );
}
