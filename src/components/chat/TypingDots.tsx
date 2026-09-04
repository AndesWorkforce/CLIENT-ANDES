"use client";

import { cn } from "@/lib/utils";

interface TypingDotsProps {
  className?: string;
}

/** Four-frame waiting dots from Figma (3931:3854, 3941:4067, 3941:4082, 3941:4097). */
export function TypingDots({ className }: TypingDotsProps) {
  return (
    <span className={cn("andy-typing-dots", className)} aria-hidden="true">
      <img
        src="/chatbot/typing-1.svg"
        alt=""
        className="andy-typing-dots__frame andy-typing-dots__frame--1"
        width={32}
        height={8}
      />
      <img
        src="/chatbot/typing-2.svg"
        alt=""
        className="andy-typing-dots__frame andy-typing-dots__frame--2"
        width={32}
        height={8}
      />
      <img
        src="/chatbot/typing-3.svg"
        alt=""
        className="andy-typing-dots__frame andy-typing-dots__frame--3"
        width={32}
        height={8}
      />
      <span className="andy-typing-dots__frame andy-typing-dots__frame--4">
        <img src="/chatbot/dot-idle.svg" alt="" width={8} height={8} />
        <img src="/chatbot/dot-idle.svg" alt="" width={8} height={8} />
        <img src="/chatbot/dot-idle.svg" alt="" width={8} height={8} />
      </span>
    </span>
  );
}
