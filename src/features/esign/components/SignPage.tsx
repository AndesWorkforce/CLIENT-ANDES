import React, { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { getSignPayload, submitSignature } from "../api/esignClient";

// Tipado mínimo para signature_pad
interface ISignaturePad {
  clear(): void;
  isEmpty(): boolean;
  toDataURL(type: string): string;
}

interface SignField {
  id: string;
  pageNumber: number;
}
interface SignPayload {
  documento?: { id: string; titulo: string };
  recipient?: { id: string; orden: number };
  fields?: SignField[];
}

interface Props {
  documentId: string;
  recipientId: string;
  token: string;
}

export const SignPage: React.FC<Props> = ({
  documentId,
  recipientId,
  token,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<ISignaturePad | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [payload, setPayload] = useState<SignPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [typedName, setTypedName] = useState<string>("");
  const [mode, setMode] = useState<"DRAW" | "TYPED">("DRAW");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getSignPayload(documentId, recipientId, token);
        if (active) setPayload(data);
      } catch (e) {
        const msg =
          (e as any)?.response?.data?.message || "Error cargando documento";
        if (active) setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [documentId, recipientId, token]);

  useEffect(() => {
    if (canvasRef.current && mode === "DRAW") {
      // disable-next-line @typescript-eslint/ban-ts-comment
      padRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgba(255,255,255,1)",
      }) as ISignaturePad;
    }
    if (mode === "TYPED") padRef.current = null;
  }, [mode]);

  const clear = () => padRef.current?.clear();

  const buildTypedImage = (): string | null => {
    const name = typedName.trim();
    if (!name) return null;
    const off = document.createElement("canvas");
    off.width = 500;
    off.height = 200;
    const ctx = off.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, off.width, off.height);
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "48px cursive";
    ctx.fillText(name, off.width / 2, off.height / 2);
    return off.toDataURL("image/png");
  };

  const submit = async () => {
    setError(null);
    let base64: string | null = null;
    if (mode === "DRAW") {
      if (!padRef.current || padRef.current.isEmpty()) {
        setError("Debe dibujar su firma antes de enviar");
        return;
      }
      base64 = padRef.current.toDataURL("image/png");
    } else {
      base64 = buildTypedImage();
      if (!base64) {
        setError("Nombre inválido para firma tipográfica");
        return;
      }
    }
    setSubmitting(true);
    try {
      await submitSignature(
        documentId,
        recipientId,
        token,
        base64 as string,
        payload?.fields?.[0]?.id,
        mode,
        typedName
      );
      alert("Firma registrada");
    } catch (e) {
      const msg = (e as any)?.response?.data?.message || "Error al firmar";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <h1 className="text-lg font-semibold">
        Firmar documento: {payload?.documento?.titulo}
      </h1>
      <div className="flex gap-3 items-center text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "DRAW"}
            onChange={() => setMode("DRAW")}
          />{" "}
          Dibujo
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            checked={mode === "TYPED"}
            onChange={() => setMode("TYPED")}
          />{" "}
          Tipográfica
        </label>
      </div>
      {mode === "DRAW" && (
        <>
          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            className="border rounded bg-white"
          />
          <div className="flex gap-2">
            <button onClick={clear} className="px-3 py-1 bg-gray-200 rounded">
              Limpiar
            </button>
          </div>
        </>
      )}
      {mode === "TYPED" && (
        <div className="flex flex-col gap-2">
          <input
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            placeholder="Nombre para firma"
            className="border rounded px-2 py-1"
          />
          <div className="border rounded p-2 bg-white text-center text-3xl font-[cursive]">
            {typedName.trim() || "Vista previa"}
          </div>
        </div>
      )}
      <button
        disabled={submitting}
        onClick={submit}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        {submitting ? "Enviando..." : "Firmar"}
      </button>
      <p className="text-xs text-gray-500">
        Al enviar acepta la captura de IP, User-Agent y almacenamiento de la
        imagen de firma.
      </p>
    </div>
  );
};
