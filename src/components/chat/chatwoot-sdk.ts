import type { User } from "@/store/auth.store";

export type ChatwootIdentityKind = "contractor" | "client" | "candidate";

export interface ChatwootIdentity {
  identifier: string;
  email: string;
  name: string;
  kind: ChatwootIdentityKind;
}

export interface ChatwootUserPayload {
  email: string;
  name: string;
  identifier_hash?: string;
  custom_attributes?: Record<string, string>;
}

export interface ChatwootWidgetApi {
  toggle: (state?: "open" | "close") => void;
  reset: () => void;
  setUser: (identifier: string, user: ChatwootUserPayload) => void;
  toggleBubbleVisibility: (visibility: "show" | "hide") => void;
  isOpen?: boolean;
}

declare global {
  interface Window {
    chatwootSettings?: Record<string, unknown>;
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    $chatwoot?: ChatwootWidgetApi;
  }
}

const IDENTIFY_SETTLE_MS = 500;
const CHATWOOT_API_POLL_MS = 200;
const CHATWOOT_IFRAME_ID = "chatwoot_live_chat_widget";
const CHATWOOT_MESSAGES_HASH = "#/messages";

function getChatwootIframe(): HTMLIFrameElement | null {
  return document.getElementById(CHATWOOT_IFRAME_ID) as HTMLIFrameElement | null;
}

function clickStartConversationButton(iframe: HTMLIFrameElement): boolean {
  try {
    const doc = iframe.contentDocument;
    if (!doc) return false;

    const tagged = doc.querySelector<HTMLElement>(
      "button.start-conversation, .start-conversation button, a.start-conversation, .start-conversation",
    );
    if (tagged) {
      tagged.click();
      return true;
    }

    const clickable = Array.from(
      doc.querySelectorAll<HTMLElement>("button, a, [role='button']"),
    ).find((el) =>
      /start conversation|continue conversation|start chatting/i.test(
        el.textContent ?? "",
      ),
    );
    if (clickable) {
      clickable.click();
      return true;
    }
  } catch {
    // Cross-origin widget: parent cannot inspect iframe contents.
  }

  return false;
}

/** Skip Chatwoot's home / Start Conversation screen and open the composer. */
export function enterChatwootConversationView(): void {
  const iframe = getChatwootIframe();
  if (!iframe) return;

  if (clickStartConversationButton(iframe)) {
    iframe.dataset.andesChatView = "messages";
    return;
  }

  if (iframe.dataset.andesChatView === "messages") {
    return;
  }

  const currentSrc = iframe.getAttribute("src") || iframe.src;
  if (!currentSrc) return;

  iframe.dataset.andesChatView = "messages";
  const [base] = currentSrc.split("#");
  iframe.setAttribute("src", `${base}${CHATWOOT_MESSAGES_HASH}`);
}

async function waitForChatwootIframe(
  timeoutMs = 8000,
): Promise<HTMLIFrameElement | undefined> {
  const existing = getChatwootIframe();
  if (existing) {
    return existing;
  }

  return new Promise((resolve) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const iframe = getChatwootIframe();
      if (iframe || Date.now() - started >= timeoutMs) {
        window.clearInterval(timer);
        resolve(iframe ?? undefined);
      }
    }, CHATWOOT_API_POLL_MS);
  });
}

async function openConversationComposer(): Promise<void> {
  await waitForChatwootIframe();
  enterChatwootConversationView();
  window.setTimeout(enterChatwootConversationView, 250);
  window.setTimeout(enterChatwootConversationView, 800);
}

export function getChatwootApi(): ChatwootWidgetApi | undefined {
  return window.$chatwoot;
}

export function waitForChatwootApi(
  timeoutMs = 10000,
): Promise<ChatwootWidgetApi | undefined> {
  const existing = getChatwootApi();
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const api = getChatwootApi();
      if (api || Date.now() - started >= timeoutMs) {
        window.clearInterval(timer);
        resolve(api);
      }
    }, CHATWOOT_API_POLL_MS);
  });
}

export function buildDisplayName(user: User): string {
  return (
    `${user.nombre} ${user.apellido}`.trim() ||
    user.correo
  );
}

/** Primer nombre para mostrar en Chatwoot y saludos del bot */
export function buildFirstName(user: User): string {
  if (user.nombre?.trim()) {
    return user.nombre.trim().split(/\s+/)[0];
  }

  return user.correo.split("@")[0] || user.correo;
}

export function identityFromUser(user: User): ChatwootIdentity {
  return {
    identifier: String(user.id),
    email: user.correo,
    name: buildFirstName(user),
    kind: "contractor",
  };
}

export async function fetchChatwootIdentityHash(
  identity?: ChatwootIdentity,
): Promise<string | undefined> {
  try {
    const isGuest = identity && identity.kind !== "contractor";
    const response = isGuest
      ? await fetch("/api/chatwoot/guest-identity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: identity.email,
            kind: identity.kind,
          }),
        })
      : await fetch("/api/chatwoot/identity", {
          credentials: "include",
        });

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return data?.data?.identifierHash ?? data?.identifierHash ?? undefined;
  } catch {
    return undefined;
  }
}

export function identifyChatwootUser(
  identity: ChatwootIdentity | User,
  identifierHash?: string,
): Promise<void> {
  const resolved: ChatwootIdentity =
    "kind" in identity ? identity : identityFromUser(identity);

  return new Promise((resolve) => {
    const api = getChatwootApi();
    if (!api) {
      resolve();
      return;
    }

    api.setUser(resolved.identifier, {
      email: resolved.email,
      name: resolved.name,
      custom_attributes: {
        andes_user_id: resolved.identifier,
        andes_visitor_kind: resolved.kind,
      },
      ...(identifierHash ? { identifier_hash: identifierHash } : {}),
    });

    window.setTimeout(resolve, IDENTIFY_SETTLE_MS);
  });
}

/** Sincroniza contacto en API + setUser en widget (critico tras reset()) */
export async function ensureChatwootIdentity(
  identity: ChatwootIdentity | User,
  identifierHash?: string,
): Promise<void> {
  const resolved: ChatwootIdentity =
    "kind" in identity ? identity : identityFromUser(identity);
  const hash = identifierHash ?? (await fetchChatwootIdentityHash(resolved));
  await waitForChatwootApi();
  await identifyChatwootUser(resolved, hash);
  await identifyChatwootUser(resolved, hash);
}

export async function openChatwootWidget(
  identity?: ChatwootIdentity | User,
  identifierHash?: string,
): Promise<void> {
  const api = await waitForChatwootApi();
  if (!api) return;

  if (identity) {
    await ensureChatwootIdentity(identity, identifierHash);
  }

  await openConversationComposer();
  api.toggle("open");
  window.setTimeout(enterChatwootConversationView, 300);
}

export function closeChatwootWidget(): void {
  getChatwootApi()?.toggle("close");
}

export async function startNewChatwootSession(
  identity: ChatwootIdentity | User,
  identifierHash?: string,
): Promise<void> {
  const api = await waitForChatwootApi();
  if (!api) return;

  const resolved: ChatwootIdentity =
    "kind" in identity ? identity : identityFromUser(identity);
  const hash = identifierHash ?? (await fetchChatwootIdentityHash(resolved));

  api.reset();
  getChatwootIframe()?.removeAttribute("data-andes-chat-view");
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  await ensureChatwootIdentity(resolved, hash);
  await openConversationComposer();
  api.toggle("open");
  window.setTimeout(enterChatwootConversationView, 300);
  window.setTimeout(enterChatwootConversationView, 900);
}
