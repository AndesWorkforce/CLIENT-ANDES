import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiUrl } from "@/services/axios.server";

interface RestartBody {
  identifier?: string;
  email?: string;
  name?: string;
  kind?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RestartBody;
    const apiUrl = getApiUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token && (!body.kind || body.kind === "contractor")) {
      const response = await fetch(`${apiUrl}chatwoot/restart-session`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }
      return NextResponse.json(data, { status: response.status });
    }

    if (body.email && (body.kind === "client" || body.kind === "candidate")) {
      const response = await fetch(`${apiUrl}chatwoot/guest-restart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: body.email, kind: body.kind }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(
      { message: "Unable to restart the chat session." },
      { status: 400 },
    );
  } catch (error) {
    console.error("[Chatwoot New Conversation Route]", error);
    return NextResponse.json(
      { message: "Unable to start a new chat session." },
      { status: 502 },
    );
  }
}
