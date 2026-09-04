"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw } from "lucide-react";
import {
  closeChatwootWidget,
  enterChatwootConversationView,
  ensureChatwootIdentity,
  fetchChatwootIdentityHash,
  identifyChatwootUser,
  openChatwootWidget,
  startNewChatwootSession,
  type ChatwootIdentity,
} from "./chatwoot-sdk";
import { useChatwootSessions } from "./useChatwootSessions";
import { ChatLauncherButton } from "./ChatLauncherButton";

interface ChatwootWidgetProps {
  identity: ChatwootIdentity;
  autoOpen?: boolean;
  onUnavailable?: () => void;
  onChangeVisitor?: () => void;
}

export function ChatwootWidget({
  identity,
  autoOpen = false,
  onUnavailable,
  onChangeVisitor,
}: ChatwootWidgetProps) {
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
      const identifierHash = await fetchChatwootIdentityHash(identity);
      identifierHashRef.current = identifierHash;
      await identifyChatwootUser(identity, identifierHash);
    };

    window.chatwootSettings = {
      hideMessageBubble: true,
      position: "right",
      locale: "en",
      type: "standard",
      launcherTitle: "Chat with Andy",
      enableFileUpload: false,
      enableEmojiPicker: false,
      enableEndConversation: true,
    };

    let readyHandled = false;

    const markReady = () => {
      if (readyHandled || cancelled) return;
      readyHandled = true;

      identifyUser().finally(() => {
        if (!cancelled) {
          enterChatwootConversationView();
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
  }, [enabled, baseUrl, websiteToken, identity.identifier, identity.email, identity.kind]);

  if (!enabled) {
    return null;
  }

  return (
    <ChatLauncher
      sdkReady={sdkReady}
      identity={identity}
      autoOpen={autoOpen}
      onChangeVisitor={onChangeVisitor}
    />
  );
}

interface ChatLauncherProps {
  sdkReady: boolean;
  identity: ChatwootIdentity;
  autoOpen?: boolean;
  onChangeVisitor?: () => void;
}

function getChatwootHolder(): HTMLElement | null {
  return (
    document.getElementById("cw-widget-holder") ||
    document.querySelector(".woot-widget-holder") ||
    document.getElementById("chatwoot_live_chat_widget")?.parentElement ||
    null
  );
}

function useChatwootHolderRect(enabled: boolean) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!enabled) {
      setRect(null);
      return;
    }

    const read = () => {
      const holder = getChatwootHolder();
      if (
        !holder ||
        holder.classList.contains("woot--hide") ||
        holder.getClientRects().length === 0
      ) {
        setRect(null);
        return;
      }

      const nextRect = holder.getBoundingClientRect();
      if (nextRect.width < 200 || nextRect.height < 200) {
        setRect(null);
        return;
      }

      setRect(nextRect);
    };

    read();
    const intervalId = window.setInterval(read, 250);
    window.addEventListener("resize", read);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("resize", read);
    };
  }, [enabled]);

  return rect;
}

function RestartConversationButton({
  rect,
  agentTookOver,
  isStartingSession,
  onRestart,
}: {
  rect: DOMRect;
  agentTookOver: boolean;
  isStartingSession: boolean;
  onRestart: () => void;
}) {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <button
      type="button"
      onClick={onRestart}
      disabled={isStartingSession}
      aria-label="Restart conversation with Andy"
      className={`flex items-center justify-center gap-2 border-b px-3 py-2 text-sm font-semibold shadow-sm disabled:opacity-70 ${
        agentTookOver
          ? "bg-[#0097B2] text-white hover:bg-[#007f96]"
          : "bg-white text-[#0097B2] hover:bg-[#F6FBFC]"
      }`}
      style={{
        position: "fixed",
        left: rect.left,
        width: rect.width,
        top: rect.top + 64,
        zIndex: 2147483646,
      }}
    >
      <RotateCcw
        className={`h-4 w-4 ${isStartingSession ? "animate-spin" : ""}`}
      />
      {isStartingSession
        ? "Starting new chat..."
        : agentTookOver
          ? "Restart with Andy"
          : "Restart conversation"}
    </button>,
    document.body,
  );
}

function ChatLauncher({
  sdkReady,
  identity,
  autoOpen = false,
  onChangeVisitor,
}: ChatLauncherProps) {
  const [chatOpen, setChatOpen] = useState(autoOpen);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const pendingOpenRef = useRef(autoOpen);
  const bootstrappedSessionRef = useRef(false);
  const ignoreClosedUntilRef = useRef(0);
  const identityRef = useRef(identity);
  identityRef.current = identity;
  const { humanConversations, refresh } = useChatwootSessions(
    sdkReady && identity.kind === "contractor",
  );
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  const agentTookOver = humanConversations.length > 0;
  const widgetRect = useChatwootHolderRect(sdkReady);

  useEffect(() => {
    const onOpened = () => setChatOpen(true);
    const onClosed = () => {
      if (Date.now() < ignoreClosedUntilRef.current) {
        return;
      }
      setChatOpen(false);
    };
    window.addEventListener("chatwoot:opened", onOpened);
    window.addEventListener("chatwoot:closed", onClosed);
    return () => {
      window.removeEventListener("chatwoot:opened", onOpened);
      window.removeEventListener("chatwoot:closed", onClosed);
    };
  }, []);

  const openAndySession = async (forceNew: boolean) => {
    const currentIdentity = identityRef.current;
    const identifierHash = await fetchChatwootIdentityHash(currentIdentity);
    ignoreClosedUntilRef.current = Date.now() + 2500;

    if (forceNew && bootstrappedSessionRef.current) {
      await startNewChatwootSession(currentIdentity, identifierHash);
    } else {
      await openChatwootWidget(currentIdentity, identifierHash);
    }

    bootstrappedSessionRef.current = true;
    ignoreClosedUntilRef.current = Date.now() + 1500;
    setChatOpen(true);
    void refreshRef.current();
  };

  useEffect(() => {
    if (!sdkReady || !pendingOpenRef.current) {
      return;
    }

    let cancelled = false;

    void (async () => {
      await openAndySession(false);
      if (cancelled) return;
      pendingOpenRef.current = false;
    })();

    return () => {
      cancelled = true;
    };
  }, [sdkReady]);

  const syncIdentity = async (): Promise<string | undefined> => {
    const identifierHash = await fetchChatwootIdentityHash(identity);
    await ensureChatwootIdentity(identity, identifierHash);
    return identifierHash;
  };

  const handleToggleChat = async () => {
    if (chatOpen) {
      pendingOpenRef.current = false;
      closeChatwootWidget();
      setChatOpen(false);
      return;
    }

    await openAndySession(false);
  };

  const handleNewSession = async () => {
    if (!sdkReady || isStartingSession) return;

    setIsStartingSession(true);
    ignoreClosedUntilRef.current = Date.now() + 4000;
    try {
      const identifierHash = await syncIdentity();
      await startNewChatwootSession(identity, identifierHash);
      bootstrappedSessionRef.current = true;
      setChatOpen(true);
      window.setTimeout(refresh, 1500);
    } finally {
      setIsStartingSession(false);
    }
  };

  return (
    <>
      {widgetRect && (
        <RestartConversationButton
          rect={widgetRect}
          agentTookOver={agentTookOver}
          isStartingSession={isStartingSession}
          onRestart={handleNewSession}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {identity.kind !== "contractor" && onChangeVisitor && !chatOpen && (
          <button
            type="button"
            onClick={onChangeVisitor}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Change email
          </button>
        )}
        <ChatLauncherButton
          isOpen={chatOpen}
          isLoading={!sdkReady && !chatOpen}
          onToggle={() => {
            void handleToggleChat();
          }}
          disabled={!sdkReady && !chatOpen}
          ariaLabel={chatOpen ? "Close chat" : "Open chat with Andy"}
          badge={humanConversations.length}
        />
      </div>
    </>
  );
}
