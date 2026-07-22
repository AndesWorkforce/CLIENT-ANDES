import type { User } from "@/store/auth.store";

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
    user.alias?.trim() ||
    `${user.nombre} ${user.apellido}`.trim() ||
    user.correo
  );
}

/** Primer nombre para mostrar en Chatwoot y saludos del bot */
export function buildFirstName(user: User): string {
  if (user.nombre?.trim()) {
    return user.nombre.trim().split(/\s+/)[0];
  }

  if (user.alias?.trim()) {
    return user.alias.trim().split(/\s+/)[0];
  }

  return user.correo.split("@")[0] || user.correo;
}

export async function fetchChatwootIdentityHash(): Promise<string | undefined> {
  try {
    const response = await fetch("/api/chatwoot/identity", {
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
  user: User,
  identifierHash?: string,
): Promise<void> {
  return new Promise((resolve) => {
    const api = getChatwootApi();
    if (!api) {
      resolve();
      return;
    }

    api.setUser(String(user.id), {
      email: user.correo,
      name: buildFirstName(user),
      custom_attributes: { andes_user_id: String(user.id) },
      ...(identifierHash ? { identifier_hash: identifierHash } : {}),
    });

    window.setTimeout(resolve, IDENTIFY_SETTLE_MS);
  });
}

/** Sincroniza contacto en API + setUser en widget (critico tras reset()) */
export async function ensureChatwootIdentity(
  user: User,
  identifierHash?: string,
): Promise<void> {
  const hash = identifierHash ?? (await fetchChatwootIdentityHash());
  await waitForChatwootApi();
  await identifyChatwootUser(user, hash);
  await identifyChatwootUser(user, hash);
}

export async function openChatwootWidget(
  user?: User,
  identifierHash?: string,
): Promise<void> {
  const api = await waitForChatwootApi();
  if (!api) return;

  if (user) {
    await ensureChatwootIdentity(user, identifierHash);
  }

  api.toggle("open");
}

export function closeChatwootWidget(): void {
  getChatwootApi()?.toggle("close");
}

export async function startNewChatwootSession(
  user: User,
  identifierHash?: string,
): Promise<void> {
  const api = await waitForChatwootApi();
  if (!api) return;

  const hash = identifierHash ?? (await fetchChatwootIdentityHash());

  api.reset();
  await new Promise((resolve) => window.setTimeout(resolve, 200));
  await ensureChatwootIdentity(user, hash);
  api.toggle("open");
}
