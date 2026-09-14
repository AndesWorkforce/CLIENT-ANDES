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
const ANDY_SESSION_KEY = "andes_andy_session";

interface AndyWidgetSession {
  stableId: string;
  identifier: string;
  identifierHash?: string;
}

function readAndySession(stableId: string): AndyWidgetSession | null {
  try {
    const raw = window.sessionStorage.getItem(ANDY_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AndyWidgetSession;
    if (parsed?.stableId !== stableId || !parsed.identifier) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeAndySession(
  stableId: string,
  identifier: string,
  identifierHash?: string,
): void {
  window.sessionStorage.setItem(
    ANDY_SESSION_KEY,
    JSON.stringify({ stableId, identifier, identifierHash }),
  );
}

export function clearAndySession(): void {
  try {
    window.sessionStorage.removeItem(ANDY_SESSION_KEY);
  } catch {
    // sessionStorage may be unavailable
  }
}

function getChatwootIframe(): HTMLIFrameElement | null {
  return document.getElementById(CHATWOOT_IFRAME_ID) as HTMLIFrameElement | null;
}

function widgetSrcWithoutConversation(src: string): string {
  try {
    const url = new URL(src, window.location.origin);
    url.hash = "";
    url.searchParams.delete("cw_conversation");
    return url.toString();
  } catch {
    return src
      .split("#")[0]
      .replace(/([?&])cw_conversation=[^&]*/g, "")
      .replace(/[?&]$/, "");
  }
}

function waitForIframeLoad(
  iframe: HTMLIFrameElement,
  timeoutMs = 8000,
): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      iframe.removeEventListener("load", done);
      resolve();
    };
    iframe.addEventListener("load", done);
    window.setTimeout(done, timeoutMs);
  });
}

function clickStartConversationButton(
  iframe: HTMLIFrameElement,
  preferNew = false,
): boolean {
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

    const labels = preferNew
      ? /start new conversation|new conversation|start conversation|start chatting/i
      : /start conversation|continue conversation|start chatting/i;

    const clickable = Array.from(
      doc.querySelectorAll<HTMLElement>("button, a, [role='button']"),
    ).find((el) => labels.test(el.textContent ?? ""));
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
export function enterChatwootConversationView(preferNew = false): void {
  const iframe = getChatwootIframe();
  if (!iframe) return;

  if (clickStartConversationButton(iframe, preferNew)) {
    iframe.dataset.andesChatView = "messages";
    return;
  }

  if (preferNew) {
    return;
  }

  if (iframe.dataset.andesChatView === "messages") {
    return;
  }

  const currentSrc = iframe.getAttribute("src") || iframe.src;
  if (!currentSrc) return;

  iframe.dataset.andesChatView = "messages";
  iframe.setAttribute(
    "src",
    `${widgetSrcWithoutConversation(currentSrc)}${CHATWOOT_MESSAGES_HASH}`,
  );
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

    const session = readAndySession(resolved.identifier);
    const widgetIdentifier = session?.identifier ?? resolved.identifier;
    const hash = session?.identifierHash ?? identifierHash;

    api.setUser(widgetIdentifier, {
      email: resolved.email,
      name: resolved.name,
      custom_attributes: {
        andes_user_id: resolved.identifier,
        andes_visitor_kind: resolved.kind,
      },
      ...(hash ? { identifier_hash: hash } : {}),
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

async function requestAndyRestart(
  identity: ChatwootIdentity,
): Promise<AndyWidgetSession | null> {
  try {
    const response = await fetch("/api/chatwoot/new-conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        identifier: identity.identifier,
        email: identity.email,
        name: identity.name,
        kind: identity.kind,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    const data = payload?.data ?? payload;
    if (!response.ok || !data?.identifier) {
      return null;
    }

    return {
      stableId: identity.identifier,
      identifier: data.identifier,
      identifierHash: data.identifierHash,
    };
  } catch {
    return null;
  }
}

export async function startNewChatwootSession(
  identity: ChatwootIdentity | User,
  identifierHash?: string,
): Promise<void> {
  const api = await waitForChatwootApi();
  if (!api) return;

  const resolved: ChatwootIdentity =
    "kind" in identity ? identity : identityFromUser(identity);

  const fresh = await requestAndyRestart(resolved);
  if (fresh) {
    storeAndySession(fresh.stableId, fresh.identifier, fresh.identifierHash);
  }

  api.reset();
  const iframe = getChatwootIframe();
  if (iframe) {
    await waitForIframeLoad(iframe);
  }
  await new Promise((resolve) => window.setTimeout(resolve, 400));

  const apiAfterReset = await waitForChatwootApi(8000);
  if (!apiAfterReset) return;

  await ensureChatwootIdentity(
    resolved,
    fresh?.identifierHash ?? identifierHash,
  );
  await new Promise((resolve) => window.setTimeout(resolve, 400));

  apiAfterReset.toggle("open");
  window.setTimeout(() => {
    enterChatwootConversationView(true);
    apiAfterReset.toggle("open");
  }, 400);
}
