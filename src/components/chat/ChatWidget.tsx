"use client";

import { useState } from "react";
import { X, RotateCcw } from "lucide-react";
import { ChatLauncherButton } from "./ChatLauncherButton";
import Link from "next/link";
import type { User } from "@/store/auth.store";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { useChat } from "./useChat";
import { AndiAvatar } from "./AndiAvatar";

const IT_SUPPORT_PORTAL_URL =
  "https://teamandes.atlassian.net/servicedesk/customer/portal/2";

interface ChatWidgetProps {
  user: User;
}

export function ChatWidget({ user }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat(user);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          className="flex h-[min(520px,70dvh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          role="dialog"
          aria-label="Andes Workforce chat assistant"
        >
          <div className="flex items-center justify-between bg-[var(--andes-blue)] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <AndiAvatar active compact />
              <div>
                <p className="text-sm font-semibold">Andy</p>
                <p className="text-xs text-white/80">
                  Your Andes Workforce assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                className="rounded-full p-1.5 hover:bg-white/20"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <ChatMessageList messages={messages} isLoading={isLoading} />

          {error && (
            <div className="mx-4 mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <p>{error}</p>
              <p className="mt-1">
                <Link
                  href="/pages/contact"
                  className="underline hover:no-underline"
                >
                  Contact us
                </Link>
                {" · "}
                <a
                  href={IT_SUPPORT_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  IT Support
                </a>
              </p>
            </div>
          )}

          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      )}

      <ChatLauncherButton
        isOpen={isOpen}
        onToggle={() => setIsOpen((prev) => !prev)}
        ariaLabel={isOpen ? "Close chat" : "Open chat assistant"}
      />
    </div>
  );
}
