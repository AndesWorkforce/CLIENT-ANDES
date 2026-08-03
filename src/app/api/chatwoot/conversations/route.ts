import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiUrl } from "@/services/axios.server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required." },
        { status: 401 },
      );
    }

    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}chatwoot/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Chatwoot Conversations Route]", error);
    return NextResponse.json(
      { message: "Unable to load conversations." },
      { status: 502 },
    );
  }
}
