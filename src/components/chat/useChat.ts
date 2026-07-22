"use client";

import { useCallback, useMemo, useState } from "react";
import type { User } from "@/store/auth.store";
import { buildDisplayName } from "./chatwoot-sdk";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

function createWelcomeMessage(user?: User): ChatMessage {
  const displayName = user ? buildDisplayName(user) : undefined;
  const firstName = displayName?.split(/\s+/)[0];

  return {
    id: "welcome",
    role: "assistant",
    content: firstName
      ? `¡Hola, ${firstName}! Soy Andi, tu asistente de Andes Workforce. Pregúntame sobre tu contrato, perfil o beneficios.`
      : "Hi! I'm your Andes Workforce assistant. Ask me about your contract, benefits, or how to reach our team.",
  };
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat(user?: User) {
  const welcomeMessage = useMemo(() => createWelcomeMessage(user), [user]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(user),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const history = nextMessages
        .filter((m) => m.id !== "welcome")
        .slice(-4)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messages: history }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          "The assistant is temporarily unavailable.";
        throw new Error(message);
      }

      const assistantContent =
        data?.data?.message || data?.message || data?.data;

      if (!assistantContent || typeof assistantContent !== "string") {
        throw new Error("Invalid response from assistant.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: assistantContent,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages]);

  const clearChat = useCallback(() => {
    setMessages([welcomeMessage]);
    setError(null);
  }, [welcomeMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
