"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

/** Values taken from Figma About Us motion snippets (node 3761:7609). */
export const ABOUT_MOTION = {
  slideOffset: 900,
  slideDuration: 0.5,
  fadeDuration: 0.5,
  heroDuration: 0.8,
  ease: "easeOut" as const,
} as const;

export const aboutViewport = {
  once: true,
  amount: 0.2 as const,
  margin: "0px 0px -40px 0px",
};

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = ABOUT_MOTION.fadeDuration,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={aboutViewport}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease: ABOUT_MOTION.ease,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  from,
  children,
  className,
  delay = 0,
  duration = ABOUT_MOTION.slideDuration,
  offset = ABOUT_MOTION.slideOffset,
}: RevealProps & { from: "left" | "right"; offset?: number }) {
  const reduce = useReducedMotion();
  const x = from === "left" ? -offset : offset;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={aboutViewport}
    >
      <motion.div
        className="w-full"
        variants={{
          hidden: reduce ? { x: 0 } : { x },
          visible: { x: 0 },
        }}
        transition={{
          duration: reduce ? 0 : duration,
          delay: reduce ? 0 : delay,
          ease: ABOUT_MOTION.ease,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
