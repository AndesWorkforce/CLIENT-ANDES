import { NextResponse } from "next/server";
import { getApiUrl } from "@/services/axios.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}chatwoot/guest-identity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Chatwoot Guest Identity Route]", error);
    return NextResponse.json(
      { message: "Unable to start a guest chat session." },
      { status: 502 },
    );
  }
}
