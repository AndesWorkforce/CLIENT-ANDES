export type ChatVisitorKind = "client" | "candidate";

export interface ChatVisitor {
  email: string;
  kind: ChatVisitorKind;
  identifier: string;
}

const STORAGE_KEY = "andes-chat-visitor";

export function buildGuestIdentifier(email: string): string {
  return `guest:${email.trim().toLowerCase()}`;
}

export function loadChatVisitor(): ChatVisitor | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ChatVisitor>;
    if (
      typeof parsed.email !== "string" ||
      (parsed.kind !== "client" && parsed.kind !== "candidate")
    ) {
      return null;
    }

    const email = parsed.email.trim().toLowerCase();
    if (!email.includes("@")) return null;

    return {
      email,
      kind: parsed.kind,
      identifier: buildGuestIdentifier(email),
    };
  } catch {
    return null;
  }
}

export function saveChatVisitor(visitor: ChatVisitor): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visitor));
}

export function clearChatVisitor(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
