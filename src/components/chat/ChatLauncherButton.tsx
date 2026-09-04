"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypingDots } from "./TypingDots";

const GREETING_DURATION_MS = 3000;
const CROSSFADE_MS = 700;

interface ChatLauncherButtonProps {
  isOpen: boolean;
  isLoading?: boolean;
  onToggle: () => void;
  disabled?: boolean;
  ariaLabel: string;
  badge?: number;
}

function WaitingBubble() {
  return (
    <span className="absolute left-[5px] top-[5px] size-[70px] overflow-hidden">
      <img
        src="/chatbot/chat-bubble.svg"
        alt=""
        width={53}
        height={45}
        className="absolute left-[11%] top-[20%] h-[45px] w-[53px] object-contain"
      />
      <TypingDots className="absolute left-1/2 top-[calc(50%-4px)] -translate-x-1/2 -translate-y-1/2" />
    </span>
  );
}

/**
 * On page enter: Andy greeting + "Need help? Just ask" for 3s,
 * then a blurred crossfade into the Figma waiting-bubble loop.
 */
export function ChatLauncherButton({
  isOpen,
  isLoading = false,
  onToggle,
  disabled = false,
  ariaLabel,
  badge,
}: ChatLauncherButtonProps) {
  const [greetingDone, setGreetingDone] = useState(false);
  const [greetingUnmounted, setGreetingUnmounted] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setGreetingDone(true);
    }, GREETING_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!greetingDone) return;

    const timeoutId = window.setTimeout(() => {
      setGreetingUnmounted(true);
    }, CROSSFADE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [greetingDone]);

  const showWaiting = !isOpen && greetingDone;
  const showSpeech = !isOpen && !greetingUnmounted;

  return (
    <div
      className={cn(
        "relative flex flex-col items-end justify-end overflow-visible",
        showSpeech ? "size-20 sm:h-[106px] sm:w-[255px]" : "size-20",
      )}
    >
      {showSpeech && (
        <div
          className={cn(
            "chat-launcher-speech pointer-events-none absolute left-0 top-0 z-10 hidden sm:block",
            greetingDone && "chat-launcher-speech--leaving",
          )}
        >
          <div className="relative w-[203px]">
            <div className="rounded-2xl bg-white px-[25px] py-2.5 shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)]">
              <p className="whitespace-nowrap text-center text-base leading-[22px] tracking-[-0.31px] text-[#1e2939]">
                Need help? Just ask
              </p>
            </div>
            <span className="absolute left-[159px] top-[42px] h-[12px] w-[18px]">
              <img
                src="/chatbot/speech-tail.svg"
                alt=""
                width={18}
                height={12}
                className="block size-full"
              />
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-busy={isLoading || showWaiting}
        className={cn(
          "chat-launcher-icon relative z-20 size-20 shrink-0 rounded-[20px] border-[1.08px] border-[#3FC6E0] bg-white shadow-[0_8px_20px_rgba(0,79,94,0.18)] focus:outline-none focus:ring-4 focus:ring-[#3FC6E0]/30 disabled:cursor-wait disabled:opacity-90",
          !isOpen && !greetingDone && "chat-launcher-icon--andy",
        )}
      >
        <span className="absolute inset-0 overflow-hidden rounded-[20px]">
          {isOpen ? (
            <span className="flex size-full items-center justify-center text-[#044E5C]">
              <X className="h-7 w-7" strokeWidth={2.2} />
            </span>
          ) : (
            <>
              {!greetingUnmounted && (
                <img
                  src="/chatbot/andy-wave.gif"
                  alt=""
                  className={cn(
                    "chat-launcher-layer chat-launcher-layer--greeting absolute inset-0 h-full w-[178%] max-w-none object-cover object-[20%_center]",
                    greetingDone && "is-leaving",
                  )}
                />
              )}
              <span
                className={cn(
                  "chat-launcher-layer chat-launcher-layer--waiting",
                  greetingDone && "is-visible",
                )}
              >
                <WaitingBubble />
              </span>
            </>
          )}
        </span>

        {typeof badge === "number" && badge > 0 && !isOpen && (
          <span className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </button>
    </div>
  );
}
