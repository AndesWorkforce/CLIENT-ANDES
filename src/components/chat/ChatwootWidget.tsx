"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = [
  "/admin",
  "/companies",
  "/profile",
  "/applications",
  "/auth",
];

function isPublicRoute(pathname: string): boolean {
  return !HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

declare global {
  interface Window {
    chatwootSettings?: Record<string, unknown>;
    chatwootSDK?: { run: (config: { websiteToken: string; baseUrl: string }) => void };
  }
}

export function ChatwootWidget() {
  const pathname = usePathname();
  const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL;
  const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;
  const enabled = process.env.NEXT_PUBLIC_CHATWOOT_ENABLED === "true";

  useEffect(() => {
    if (!enabled || !baseUrl || !websiteToken || !isPublicRoute(pathname)) {
      return;
    }

    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      locale: "en",
      type: "standard",
      launcherTitle: "Chat with us",
    };

    const script = document.createElement("script");
    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken,
        baseUrl,
      });
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [enabled, baseUrl, websiteToken, pathname]);

  if (!enabled || !isPublicRoute(pathname)) {
    return null;
  }

  return null;
}
