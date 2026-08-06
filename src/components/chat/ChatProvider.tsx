"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatWidget } from "./ChatWidget";
import { ChatwootWidget } from "./ChatwootWidget";
import { useChatAccess } from "./useChatAccess";

const useChatwoot =
  process.env.NEXT_PUBLIC_CHATWOOT_ENABLED === "true" &&
  !!process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL &&
  !!process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

/** Chat solo para usuarios autenticados con contrato activo y fuera de admin-hub. */
export function ChatProvider() {
  const pathname = usePathname();
  const { hasAccess, isLoading, user } = useChatAccess();
  const [chatwootFailed, setChatwootFailed] = useState(false);
  const handleChatwootUnavailable = useCallback(() => {
    setChatwootFailed(true);
  }, []);

  if (pathname?.startsWith("/admin-hub")) {
    return null;
  }

  if (isLoading || !hasAccess || !user) {
    return null;
  }

  if (useChatwoot && !chatwootFailed) {
    return (
      <ChatwootWidget
        user={user}
        onUnavailable={handleChatwootUnavailable}
      />
    );
  }

  return <ChatWidget user={user} />;
}
