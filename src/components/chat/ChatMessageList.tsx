"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "./useChat";
import { cn } from "@/lib/utils";
import { AndiAvatar } from "./AndiAvatar";
import { TypingDots } from "./TypingDots";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-end gap-2",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          {message.role !== "user" && <AndiAvatar compact />}
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
              message.role === "user"
                ? "bg-[var(--andes-blue)] text-white rounded-br-md"
                : "bg-gray-100 text-gray-800 rounded-bl-md",
            )}
          >
            {message.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex items-end justify-start gap-2">
          <AndiAvatar compact />
          <div
            className="flex items-center rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3"
            aria-label="Andy is typing"
          >
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
