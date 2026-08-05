"use client";

import { useEffect, useState } from "react";

type AndiAvatarProps = {
  active?: boolean;
  compact?: boolean;
  greeting?: boolean;
};

const POSES = {
  idle: "/andi/andi-winks.png",
  greeting: "/andi/hiker_sin_fondo.gif",
  thinking: "/andi/andi-thinking.png",
};

/**
 * Avatar decorativo del asistente. Alterna brevemente la pose para dar
 * presencia al lanzador sin distraer ni bloquear la interacción.
 */
export function AndiAvatar({
  active = false,
  compact = false,
  greeting = false,
}: AndiAvatarProps) {
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    if (active) {
      setIsWaving(true);
      return;
    }

    const intervalId = window.setInterval(() => {
      setIsWaving(true);
      window.setTimeout(() => setIsWaving(false), 1800);
    }, 12000);

    return () => window.clearInterval(intervalId);
  }, [active]);

  const pose = active || greeting
    ? POSES.greeting
    : isWaving
      ? POSES.active
      : POSES.idle;

  return (
    <span
      className={`andi-avatar ${compact ? "andi-avatar--compact" : ""} ${
        active ? "andi-avatar--active" : ""
      }`}
      aria-hidden="true"
    >
      <img
        key={pose}
        src={pose}
        alt=""
        className="andi-avatar__image"
      />
      <span className="andi-avatar__status" />
    </span>
  );
}
