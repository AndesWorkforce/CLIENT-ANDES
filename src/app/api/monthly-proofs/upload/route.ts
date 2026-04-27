import { NextRequest, NextResponse } from "next/server";
import { uploadMonthlyProofToBackend } from "@/lib/monthly-proof-upload.server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const contratoId = formData.get("contratoId");
    const month = formData.get("month");
    const year = formData.get("year");

    if (!contratoId || typeof contratoId !== "string" || !contratoId.trim()) {
      return NextResponse.json(
        { success: false, error: "Falta contratoId" },
        { status: 400 }
      );
    }
    if (!month || typeof month !== "string" || !month.trim()) {
      return NextResponse.json(
        { success: false, error: "Falta month" },
        { status: 400 }
      );
    }
    if (year == null || typeof year !== "string" || !year.trim()) {
      return NextResponse.json(
        { success: false, error: "Falta year" },
        { status: 400 }
      );
    }
    const yearNum = parseInt(year, 10);
    if (Number.isNaN(yearNum)) {
      return NextResponse.json(
        { success: false, error: "year inválido" },
        { status: 400 }
      );
    }
    if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
      return NextResponse.json(
        { success: false, error: "Falta archivo" },
        { status: 400 }
      );
    }

    const result = await uploadMonthlyProofToBackend(
      contratoId.trim(),
      month.trim(),
      yearNum,
      file as File
    );

    if (!result.success) {
      const status = result.error === "FILE_TOO_LARGE" ? 413 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("[api/monthly-proofs/upload]", e);
    return NextResponse.json(
      { success: false, error: "Error al subir el comprobante" },
      { status: 500 }
    );
  }
}
