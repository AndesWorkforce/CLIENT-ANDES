"use client";

import { useEffect, useRef, useState } from "react";
import {
  MessageSquarePlus,
  MessagesSquare,
  X,
} from "lucide-react";
import type { User } from "@/store/auth.store";
import {
  ensureChatwootIdentity,
  fetchChatwootIdentityHash,
  identifyChatwootUser,
  openChatwootWidget,
  startNewChatwootSession,
} from "./chatwoot-sdk";
import {
  useChatwootSessions,
  type ChatwootConversationSummary,
} from "./useChatwootSessions";
import { AndiAvatar } from "./AndiAvatar";

interface ChatwootWidgetProps {
  user: User;
  onUnavailable?: () => void;
}

export function ChatwootWidget({ user, onUnavailable }: ChatwootWidgetProps) {
  const baseUrl = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL;
  const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;
  const enabled = process.env.NEXT_PUBLIC_CHATWOOT_ENABLED === "true";
  const [sdkReady, setSdkReady] = useState(false);
  const identifierHashRef = useRef<string | undefined>(undefined);
  const onUnavailableRef = useRef(onUnavailable);

  useEffect(() => {
    onUnavailableRef.current = onUnavailable;
  }, [onUnavailable]);

  useEffect(() => {
    if (!enabled || !baseUrl || !websiteToken) {
      return;
    }

    let cancelled = false;

    const fail = () => {
      if (!cancelled) {
        onUnavailableRef.current?.();
      }
    };

    const identifyUser = async () => {
      const identifierHash = await fetchChatwootIdentityHash();
      identifierHashRef.current = identifierHash;
      await identifyChatwootUser(user, identifierHash);
    };

    window.chatwootSettings = {
      hideMessageBubble: true,
      position: "right",
      locale: "en",
      type: "standard",
      launcherTitle: "Chat with Andy",
      enableFileUpload: true,
      enableEmojiPicker: true,
      enableEndConversation: true,
    };

    let readyHandled = false;

    const markReady = () => {
      if (readyHandled || cancelled) return;
      readyHandled = true;

      identifyUser().finally(() => {
        if (!cancelled) {
          setSdkReady(true);
        }
      });
    };

    const onReady = () => {
      if (cancelled) return;
      markReady();
    };

    if (window.$chatwoot) {
      markReady();
    }

    window.addEventListener("chatwoot:ready", onReady);

    const script = document.createElement("script");
    script.src = `${baseUrl}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;

    const timeoutId = window.setTimeout(fail, 8000);

    script.onload = () => {
      window.clearTimeout(timeoutId);
      if (cancelled) return;

      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken,
          baseUrl,
        });

        window.setTimeout(() => {
          if (!cancelled) {
            markReady();
          }
        }, 2500);
        return;
      }

      fail();
    };

    script.onerror = () => {
      window.clearTimeout(timeoutId);
      fail();
    };

    document.body.appendChild(script);

    return () => {
      cancelled = true;
      setSdkReady(false);
      window.clearTimeout(timeoutId);
      window.removeEventListener("chatwoot:ready", onReady);
      script.remove();
    };
  }, [enabled, baseUrl, websiteToken, user.id, user.correo]);

  if (!enabled) {
    return null;
  }

  return (
    <ChatLauncher sdkReady={sdkReady} user={user} />
  );
}

interface ChatLauncherProps {
  sdkReady: boolean;
  user: User;
}

function formatStatus(status: string): string {
  switch (status) {
    case "open":
      return "Con agente";
    case "pending":
      return "Con asistente";
    case "resolved":
      return "Cerrada";
    default:
      return status;
  }
}

function ChatLauncher({ sdkReady, user }: ChatLauncherProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { humanConversations, botConversations, isLoading, refresh } =
    useChatwootSessions(menuOpen);

  const syncIdentity = async (): Promise<string | undefined> => {
    const identifierHash = await fetchChatwootIdentityHash();
    await ensureChatwootIdentity(user, identifierHash);
    return identifierHash;
  };

  const handleOpenCurrent = async () => {
    const identifierHash = await syncIdentity();
    await openChatwootWidget(user, identifierHash);
    setMenuOpen(false);
    refresh();
  };

  const handleNewTopic = async () => {
    const identifierHash = await syncIdentity();
    await startNewChatwootSession(user, identifierHash);
    setMenuOpen(false);
    window.setTimeout(refresh, 1500);
  };

  const handleOpenHumanChat = async (
    _conversation: ChatwootConversationSummary,
  ) => {
    const identifierHash = await syncIdentity();
    await openChatwootWidget(user, identifierHash);
    setMenuOpen(false);
    refresh();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {menuOpen && (
        <div className="w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-[var(--andes-blue)] px-4 py-3 text-white">
            <AndiAvatar active compact />
            <div>
              <p className="text-sm font-semibold">Andy</p>
              <p className="text-xs text-white/80">
                Nuevo tema o continuar con tu agente
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-3">
            <button
              type="button"
              onClick={handleNewTopic}
              className="flex items-center gap-3 rounded-xl border border-[#0097B2]/20 bg-[#F6FBFC] px-3 py-3 text-left transition-colors hover:bg-[#E8F8FB]"
            >
              <MessageSquarePlus className="h-5 w-5 shrink-0 text-[#0097B2]" />
              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  Nuevo tema con el bot
                </span>
                <span className="block text-xs text-gray-600">
                  Inicia una conversacion nueva con el asistente
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpenCurrent}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <MessagesSquare className="h-5 w-5 shrink-0 text-[#0097B2]" />
              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  Abrir chat actual
                </span>
                <span className="block text-xs text-gray-600">
                  Continua la conversacion activa en el widget
                </span>
              </span>
            </button>
          </div>

          {!sdkReady && (
            <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-500">
              Conectando con el asistente...
            </p>
          )}

          {(humanConversations.length > 0 ||
            botConversations.length > 0 ||
            isLoading) && (
            <div className="border-t border-gray-100 px-3 py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tus conversaciones
              </p>
              <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                {isLoading && (
                  <p className="text-xs text-gray-500">Cargando...</p>
                )}
                {humanConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleOpenHumanChat(conversation)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="block text-sm font-medium text-gray-900">
                      {conversation.teamName || conversation.assigneeName || "Soporte"}
                    </span>
                    <span className="block text-xs text-[#0097B2]">
                      {formatStatus(conversation.status)}
                    </span>
                    {conversation.lastMessage && (
                      <span className="mt-1 block truncate text-xs text-gray-500">
                        {conversation.lastMessage}
                      </span>
                    )}
                  </button>
                ))}
                {botConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={handleOpenCurrent}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-left transition-colors hover:bg-gray-50"
                  >
                    <span className="block text-sm font-medium text-gray-900">
                      Asistente virtual
                    </span>
                    <span className="block text-xs text-[#0097B2]">
                      {formatStatus(conversation.status)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="relative flex h-[120px] w-[120px] items-center justify-center transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#0097B2]/30"
        aria-label={menuOpen ? "Cerrar menu de chat" : "Abrir menu de chat"}
        aria-expanded={menuOpen}
        aria-busy={!sdkReady}
      >
        {menuOpen ? (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--andes-blue)] text-white shadow-lg">
            <X className="h-6 w-6" />
          </span>
        ) : (
          <>
            <span className="absolute -left-36 top-1/2 hidden -translate-y-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg sm:block">
              Need help? Chat with Andy
            </span>
            <AndiAvatar greeting />
          </>
        )}
        {humanConversations.length > 0 && !menuOpen && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {humanConversations.length}
          </span>
        )}
      </button>
    </div>
  );
}
