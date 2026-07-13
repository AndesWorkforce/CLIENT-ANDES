"use client";

import { ChatWidget } from "./ChatWidget";
import { ChatwootWidget } from "./ChatwootWidget";

const useChatwoot =
  process.env.NEXT_PUBLIC_CHATWOOT_ENABLED === "true" &&
  !!process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL &&
  !!process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

/** Renders Chatwoot or the legacy FAQ widget based on env */
export function ChatProvider() {
  if (useChatwoot) {
    return <ChatwootWidget />;
  }
  return <ChatWidget />;
}
