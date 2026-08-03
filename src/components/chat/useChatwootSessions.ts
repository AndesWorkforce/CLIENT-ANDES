"use client";

import { useCallback, useEffect, useState } from "react";

export interface ChatwootConversationSummary {
  id: number;
  status: string;
  createdAt: string;
  lastMessage?: string;
  assigneeName?: string;
  teamName?: string;
  isBotSession: boolean;
}

export function useChatwootSessions(enabled: boolean) {
  const [conversations, setConversations] = useState<
    ChatwootConversationSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setConversations([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/chatwoot/conversations", {
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setConversations([]);
        return;
      }

      setConversations(data?.data?.conversations ?? data?.conversations ?? []);
    } catch {
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const humanConversations = conversations.filter((c) => !c.isBotSession);
  const botConversations = conversations.filter((c) => c.isBotSession);

  return {
    conversations,
    humanConversations,
    botConversations,
    isLoading,
    refresh,
  };
}
