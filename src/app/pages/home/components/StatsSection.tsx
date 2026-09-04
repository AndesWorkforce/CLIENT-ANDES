"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, ChartNoAxesColumn, Users, Zap } from "lucide-react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { FadeIn } from "../../about/components/Reveal";

const stats = [
  {
    icon: Users,
    value: "10M+",
    label: "Professionals in our talent network",
  },
  {
    icon: ChartNoAxesColumn,
    value: "95%",
    label: "Client retention after 12 months",
  },
  {
    icon: Zap,
    value: "60%",
    label: "Average payroll cost savings",
  },
  {
    icon: BadgeCheck,
    value: "100%",
    label: "Compliance guaranteed",
  },
];

function parseStatValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { target: 0, suffix: value };
  return { target: Number(match[1]), suffix: match[2] };
}

function CountUpNumber({
  value,
  delay = 0,
  className,
}: {
  value: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const { target, suffix } = parseStatValue(value);
  const [display, setDisplay] = useState(reduce ? value : `0${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(`${target}${suffix}`);
      return;
    }

    let controls: ReturnType<typeof animate> | undefined;
    const timeout = window.setTimeout(() => {
      controls = animate(0, target, {
        duration: 1.4,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplay(`${Math.round(latest)}${suffix}`);
        },
      });
    }, delay * 1000);

    return () => {
      window.clearTimeout(timeout);
      controls?.stop();
    };
  }, [delay, inView, reduce, suffix, target]);

  return (
    <p ref={ref} className={className}>
      {display}
    </p>
  );
}

export default function StatsSection() {
  return (
    <section
      className="px-6 py-16 sm:py-24"
      style={{
        backgroundImage:
          "linear-gradient(160.17deg, rgba(235, 248, 247, 0.9) 0%, rgba(240, 250, 249, 0.9) 50%, rgba(230, 245, 244, 0.9) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 text-center sm:mb-16">
          <FadeIn>
            <p className="mb-3 text-[14px] font-semibold uppercase leading-[1.3] tracking-[1.4px] text-[#0097b2]">
              BY THE NUMBERS
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <h2 className="text-[32px] font-bold leading-[1.3] text-[#0a1628] md:text-[48px]">
              <span className="text-[#0097b2]">Results</span> that speak
              <br />
              for themselves
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const delay = 0.5 + index * 0.22;
            return (
              <FadeIn key={stat.label} delay={delay}>
                <div className="flex flex-col items-center rounded-[16px] border border-[rgba(11,200,233,0.12)] bg-white p-8 text-center">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-[16px] bg-[rgba(11,200,233,0.12)]">
                    <Icon className="size-5 text-[#0097b2]" strokeWidth={2} />
                  </div>
                  <CountUpNumber
                    value={stat.value}
                    delay={delay}
                    className="mb-2 text-[48px] font-black leading-[1] text-black sm:text-[60px] sm:leading-[60px]"
                  />
                  <p className="text-[14px] font-normal leading-[17.5px] text-[#707070]">
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
