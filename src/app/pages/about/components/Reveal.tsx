"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
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

const MotionPrefsContext = createContext({ staticOnMobile: false });

/** Disables entrance motion below the Tailwind `md` breakpoint (768px). */
export function StaticOnMobile({ children }: { children: ReactNode }) {
  return (
    <MotionPrefsContext.Provider value={{ staticOnMobile: true }}>
      {children}
    </MotionPrefsContext.Provider>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

function useSkipMotion() {
  const reduce = useReducedMotion();
  const { staticOnMobile } = useContext(MotionPrefsContext);
  const isMobile = useIsMobile();
  return Boolean(reduce || (staticOnMobile && isMobile));
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = ABOUT_MOTION.fadeDuration,
  ...props
}: RevealProps) {
  const skip = useSkipMotion();

  return (
    <motion.div
      className={className}
      initial={skip ? { opacity: 1 } : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={aboutViewport}
      transition={{
        duration: skip ? 0 : duration,
        delay: skip ? 0 : delay,
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
  const skip = useSkipMotion();
  const x = from === "left" ? -offset : offset;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={aboutViewport}
    >
      <motion.div
        className="h-full w-full"
        variants={{
          hidden: skip ? { x: 0 } : { x },
          visible: { x: 0 },
        }}
        transition={{
          duration: skip ? 0 : duration,
          delay: skip ? 0 : delay,
          ease: ABOUT_MOTION.ease,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
