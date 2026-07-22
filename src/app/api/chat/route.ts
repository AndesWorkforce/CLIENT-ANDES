import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getApiUrl(): string {
  const rawUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000/api/";
  let url = rawUrl.trim();
  if (!url.endsWith("/")) url = `${url}/`;
  if (!url.toLowerCase().includes("/api/")) {
    url = `${url}api/`;
    url = url.replace(/([^:]\/)\/+/g, "$1");
  }
  return url;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required to use chat." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        data?.message ||
        data?.meta?.message ||
        "Chat service unavailable";
      return NextResponse.json(
        { message, ...data },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Chat Route] Error forwarding to API:", error);
    return NextResponse.json(
      {
        message:
          "The assistant is temporarily unavailable. Please visit /pages/contact.",
      },
      { status: 502 },
    );
  }
}
