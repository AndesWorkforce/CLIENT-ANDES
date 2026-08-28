"use client";

import { useEffect, useState } from "react";

type AndiAvatarProps = {
  active?: boolean;
  compact?: boolean;
  /** Reproduce el saludo animado y luego deja solo la cabeza. */
  greeting?: boolean;
};

const POSES = {
  head: "/chatbot/andy-still.png",
  greeting: "/chatbot/andy-wave.gif",
};

const GREETING_DURATION_MS = 3800;

/**
 * Avatar del asistente Andy.
 * En el lanzador saluda con el GIF completo y luego queda solo la cabeza.
 */
export function AndiAvatar({
  active = false,
  compact = false,
  greeting = false,
}: AndiAvatarProps) {
  const [greetingDone, setGreetingDone] = useState(!greeting);

  useEffect(() => {
    if (!greeting) {
      setGreetingDone(true);
      return;
    }

    setGreetingDone(false);
    const timeoutId = window.setTimeout(() => {
      setGreetingDone(true);
    }, GREETING_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [greeting]);

  const showFullGreeting = greeting && !greetingDone;
  const pose = showFullGreeting ? POSES.greeting : POSES.head;

  const className = [
    "andi-avatar",
    compact ? "andi-avatar--compact" : "",
    !compact && !showFullGreeting ? "andi-avatar--head" : "",
    showFullGreeting ? "andi-avatar--greeting" : "",
    active ? "andi-avatar--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} aria-hidden="true">
      <img key={pose} src={pose} alt="" className="andi-avatar__image" />
      <span className="andi-avatar__status" />
    </span>
  );
}
