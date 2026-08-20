"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatWidget } from "./ChatWidget";
import { ChatwootWidget } from "./ChatwootWidget";
import { GuestChatForm } from "./GuestChatForm";
import { useChatAccess } from "./useChatAccess";
import {
  clearChatVisitor,
  loadChatVisitor,
  saveChatVisitor,
  type ChatVisitor,
} from "./chat-visitor";
import { identityFromUser, type ChatwootIdentity } from "./chatwoot-sdk";

const useChatwoot =
  process.env.NEXT_PUBLIC_CHATWOOT_ENABLED === "true" &&
  !!process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL &&
  !!process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

function visitorToIdentity(visitor: ChatVisitor): ChatwootIdentity {
  const localPart = visitor.email.split("@")[0] || "there";
  return {
    identifier: visitor.identifier,
    email: visitor.email,
    name: localPart,
    kind: visitor.kind,
  };
}

/** Chat for contractors with an active contract, and for public visitors after a short form. */
export function ChatProvider() {
  const pathname = usePathname();
  const { hasAccess, isLoading, user } = useChatAccess();
  const [chatwootFailed, setChatwootFailed] = useState(false);
  const [visitor, setVisitor] = useState<ChatVisitor | null>(null);
  const handleChatwootUnavailable = useCallback(() => {
    setChatwootFailed(true);
  }, []);

  useEffect(() => {
    setVisitor(loadChatVisitor());
  }, []);

  const handleGuestSubmit = (nextVisitor: ChatVisitor) => {
    saveChatVisitor(nextVisitor);
    setVisitor(nextVisitor);
  };

  const handleChangeVisitor = () => {
    clearChatVisitor();
    setVisitor(null);
    setChatwootFailed(false);
  };

  if (pathname?.startsWith("/admin-hub")) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (hasAccess && user) {
    if (useChatwoot && !chatwootFailed) {
      return (
        <ChatwootWidget
          identity={identityFromUser(user)}
          onUnavailable={handleChatwootUnavailable}
        />
      );
    }
    return <ChatWidget user={user} />;
  }

  if (!visitor) {
    return <GuestChatForm onSubmit={handleGuestSubmit} />;
  }

  if (useChatwoot && !chatwootFailed) {
    return (
      <ChatwootWidget
        identity={visitorToIdentity(visitor)}
        onUnavailable={handleChatwootUnavailable}
        onChangeVisitor={handleChangeVisitor}
      />
    );
  }

  return <GuestChatForm onSubmit={handleGuestSubmit} />;
}
