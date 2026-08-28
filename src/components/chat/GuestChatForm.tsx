"use client";

import { FormEvent, useState } from "react";
import { AndiAvatar } from "./AndiAvatar";
import { ChatLauncherButton } from "./ChatLauncherButton";
import {
  buildGuestIdentifier,
  type ChatVisitor,
  type ChatVisitorKind,
} from "./chat-visitor";

interface GuestChatFormProps {
  onSubmit: (visitor: ChatVisitor) => void;
}

export function GuestChatForm({ onSubmit }: GuestChatFormProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<ChatVisitorKind | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setError("Enter a valid email address.");
      return;
    }
    if (kind !== "client" && kind !== "candidate") {
      setError("Tell us if you are a client or a candidate.");
      return;
    }

    setError(null);
    onSubmit({
      email: normalized,
      kind,
      identifier: buildGuestIdentifier(normalized),
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <form
          onSubmit={handleSubmit}
          className="w-[min(340px,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
        >
          <div className="mb-3 flex items-center gap-3">
            <AndiAvatar compact />
            <div>
              <p className="text-sm font-semibold text-gray-900">Chat with Andy</p>
              <p className="text-xs text-gray-600">
                Leave your email so we can help you faster.
              </p>
            </div>
          </div>

          <label className="mb-3 block text-xs font-medium text-gray-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0097B2] focus:ring-2 focus:ring-[#0097B2]/20"
            />
          </label>

          <p className="mb-2 text-xs font-medium text-gray-700">I am a</p>
          <div className="mb-3 grid grid-cols-1 gap-2">
            <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm has-[:checked]:border-[#0097B2] has-[:checked]:bg-[#F6FBFC]">
              <input
                type="radio"
                name="visitor-kind"
                value="client"
                checked={kind === "client"}
                onChange={() => setKind("client")}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold text-gray-900">Client</span>
                <span className="block text-xs text-gray-600">
                  I want to hire LATAM talent or learn about staffing.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm has-[:checked]:border-[#0097B2] has-[:checked]:bg-[#F6FBFC]">
              <input
                type="radio"
                name="visitor-kind"
                value="candidate"
                checked={kind === "candidate"}
                onChange={() => setKind("candidate")}
                className="mt-1"
              />
              <span>
                <span className="block font-semibold text-gray-900">
                  Candidate
                </span>
                <span className="block text-xs text-gray-600">
                  I am looking for a remote job. Application tracking comes later.
                </span>
              </span>
            </label>
          </div>

          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0097B2] px-3 py-2 text-sm font-semibold text-white hover:bg-[#007f96]"
          >
            Continue to chat
          </button>
        </form>
      )}

      <ChatLauncherButton
        isOpen={open}
        onToggle={() => setOpen((prev) => !prev)}
        ariaLabel={open ? "Close chat form" : "Open chat with Andy"}
      />
    </div>
  );
}
