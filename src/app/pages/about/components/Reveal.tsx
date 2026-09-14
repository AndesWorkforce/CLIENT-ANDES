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
const StaggerContext = createContext(false);

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

/** Sequences child FadeIn/SlideIn so the next title waits for the one above. */
export function Stagger({
  children,
  className,
  stagger = 0.32,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const skip = useSkipMotion();

  return (
    <StaggerContext.Provider value={true}>
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={aboutViewport}
        variants={{
          hidden: {},
          visible: {
            transition: skip
              ? { staggerChildren: 0, delayChildren: 0 }
              : { staggerChildren: stagger },
          },
        }}
      >
        {children}
      </motion.div>
    </StaggerContext.Provider>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = ABOUT_MOTION.fadeDuration,
  ...props
}: RevealProps) {
  const skip = useSkipMotion();
  const inStagger = useContext(StaggerContext);
  const hidden = skip ? { opacity: 1 } : { opacity: 0 };
  const visible = { opacity: 1 };
  const transition = {
    duration: skip ? 0 : duration,
    delay: skip || inStagger ? 0 : delay,
    ease: ABOUT_MOTION.ease,
  };

  if (inStagger) {
    return (
      <motion.div
        className={className}
        variants={{
          hidden,
          visible: { ...visible, transition },
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={aboutViewport}
      transition={transition}
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
  const inStagger = useContext(StaggerContext);
  const x = from === "left" ? -offset : offset;
  const hidden = skip ? { x: 0, opacity: 1 } : { x, opacity: 0 };
  const visible = { x: 0, opacity: 1 };
  const transition = {
    duration: skip ? 0 : duration,
    delay: skip || inStagger ? 0 : delay,
    ease: ABOUT_MOTION.ease,
  };

  if (inStagger) {
    return (
      <motion.div
        className={className}
        variants={{
          hidden,
          visible: { ...visible, transition },
        }}
      >
        {children}
      </motion.div>
    );
  }

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
          hidden,
          visible,
        }}
        transition={transition}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
