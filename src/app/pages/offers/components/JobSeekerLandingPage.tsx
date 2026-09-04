"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Award,
  Briefcase,
  Clock,
  Globe,
  Shield,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { FadeIn, SlideIn, ABOUT_MOTION } from "../../about/components/Reveal";

const BANNER_SRC =
  "https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/04.+Join+Our+Team/Banner.webp";

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up for free and complete your profile in minutes",
  },
  {
    number: "02",
    title: "Complete Your Profile",
    description: "Add your experience, skills, and upload your documents",
  },
  {
    number: "03",
    title: "Browse Open Contracts",
    description: "Explore available opportunities that match your skillset",
  },
  {
    number: "04",
    title: "Get Hired",
    description: "Apply, get selected, and start your remote career",
  },
];

const benefits: {
  icon: LucideIcon;
  iconSize: number;
  title: string;
  description: string;
}[] = [
  {
    icon: Globe,
    iconSize: 24,
    title: "100% Remote Work",
    description:
      "Work from anywhere in Latin America with top US and international companies",
  },
  {
    icon: Briefcase,
    iconSize: 24,
    title: "Competitive Salaries",
    description:
      "Earn between $1,000 – $3,000 USD per month, paid consistently and on time",
  },
  {
    icon: TrendingUp,
    iconSize: 21,
    title: "Career Growth",
    description:
      "Access mentorship, training, and a clear path to advance professionally",
  },
  {
    icon: Shield,
    iconSize: 24,
    title: "Safe & Secure",
    description:
      "Formal contracts, legal compliance, and full HR support throughout your employment",
  },
  {
    icon: Clock,
    iconSize: 21,
    title: "Flexible Opportunities",
    description:
      "Full-time and part-time roles across various industries and specializations",
  },
  {
    icon: Award,
    iconSize: 24,
    title: "Performance Bonuses",
    description:
      "Earn extra with referral bonuses, performance incentives, and seniority rewards",
  },
];

const stats = [
  { value: "+50", label: "Partner Companies" },
  { value: "+200", label: "Professionals Hired" },
  { value: "$1K - $3K", label: "Monthly Salary Range" },
  { value: "+10", label: "Countries Represented" },
];

export default function JobSeekerLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <section className="relative flex h-[400px] w-full items-center px-[20px] py-16 md:h-[600px] md:px-[82px] md:py-[207px]">
        <div className="absolute inset-0 z-0">
          <Image
            src={BANNER_SRC}
            alt="Team celebrating"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08252A]/90 via-[#08252A]/70 to-[#0097B2]/50" />
        </div>

        <FadeIn
          duration={ABOUT_MOTION.heroDuration}
          className="relative z-10 flex max-w-[758px] flex-col gap-[10px] text-white"
        >
          <h1 className="text-[32px] font-bold leading-[1.3] md:text-[64px]">
            Launch Your Career
            <span className="block text-[#22BCD8]">From Latin America</span>
          </h1>
          <p className="max-w-[758px] text-[14px] font-medium leading-[1.3] md:text-[20px]">
            Join hundreds of professionals collaborating remotely with leading
            U.S. companies. Attractive compensation, clear agreements, and full
            career support, all from home.
          </p>
        </FadeIn>
      </section>

      <section className="bg-[#22BCD8] px-[18px] py-[44px] md:h-[208px] md:px-[84px] md:py-[53px]">
        <FadeIn>
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-8 text-white md:flex md:items-start md:justify-between md:gap-[40px] lg:gap-[80px]">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-[3px]">
                <span className="text-[32px] font-bold leading-[1.3] md:text-[52px]">
                  {stat.value}
                </span>
                <span className="text-[14px] font-semibold leading-[1.3] md:text-[18px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <section className="bg-white px-[18px] py-[44px] md:px-[75px] md:pb-[126px] md:pt-[101px]">
        <div className="mx-auto flex max-w-[1281px] flex-col items-center gap-[41px]">
          <FadeIn className="flex flex-col items-center gap-[22px] text-center">
            <h2 className="text-[24px] font-bold leading-[1.2] text-[#343434] md:text-[52px]">
              How It <span className="text-[#0097B2]">Works</span>
            </h2>
            <p className="max-w-[906px] text-[14px] font-medium leading-[1.2] text-[#525252] md:text-[22px]">
              From registration to your first paycheck - simple and
              straightforward
            </p>
          </FadeIn>

          <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {steps.map((step, i) => (
              <FadeIn
                key={step.title}
                delay={0.25 + i * 0.25}
                className="flex origin-center flex-col items-center gap-[11px] text-center md:transition-transform md:duration-300 md:ease-out md:motion-safe:hover:scale-[1.03]"
              >
                <div className="flex size-[73px] shrink-0 items-center justify-center rounded-full border border-[#0097B2] bg-[#DFFAFF]">
                  <span className="text-[22px] font-bold leading-[1.3] text-[#0097B2]">
                    {step.number}
                  </span>
                </div>
                <div className="flex max-w-[261px] flex-col items-center gap-[7px]">
                  <h3 className="text-[22px] font-bold leading-[1.3] text-black">
                    {step.title}
                  </h3>
                  <p className="max-w-[243px] text-[16px] font-normal leading-[1.3] text-[#707070]">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F6FBFC] px-[18px] py-[44px] md:px-[75px] md:py-[66px]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-[44px]">
          <FadeIn className="flex flex-col items-center gap-[22px] text-center" delay={0.2}>
            <h2 className="text-[24px] font-bold leading-[1.2] text-black md:text-[52px]">
              Why Join <span className="text-[#0097B2]">Andes Workforce?</span>
            </h2>
            <p className="max-w-[906px] text-[14px] font-medium leading-[1.2] text-[#525252] md:text-[22px]">
              We offer more than just a job - we offer a career path with
              support at every step
            </p>
          </FadeIn>

          <div className="grid w-full grid-cols-1 items-stretch gap-[11px] sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <SlideIn
                key={benefit.title}
                from="left"
                offset={400}
                delay={0.15 + i * 0.1}
                className="h-full"
              >
                <div className="flex h-full origin-center flex-col gap-[13px] rounded-[15px] border border-[#D2D2D2] bg-white px-[25px] py-[35px] md:transition-transform md:duration-300 md:ease-out md:motion-safe:hover:scale-[1.03] md:hover:shadow-md">
                  <div className="flex size-[55px] shrink-0 items-center justify-center rounded-[4px] bg-[#DFFAFF]">
                    <benefit.icon
                      size={benefit.iconSize}
                      className="text-[#0097B2]"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <h3 className="min-h-[50px] text-[20px] font-bold leading-[25px] text-[#343434]">
                    {benefit.title}
                  </h3>
                  <p className="flex-1 text-[16px] font-normal leading-[1.5] text-[#707070]">
                    {benefit.description}
                  </p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-auto w-full overflow-hidden md:h-[408px]">
        <Image
          src={BANNER_SRC}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{ background: "rgba(4, 78, 92, 0.85)" }}
        />
        <FadeIn
          delay={0.2}
          className="relative z-10 flex flex-col items-start gap-[22px] px-[18px] py-[44px] md:px-[80px] md:py-[85px]"
        >
          <h2 className="text-[32px] font-bold leading-[1.3] text-white drop-shadow-[0px_4px_4px_#11525e] md:text-[48px]">
            Ready to start?
          </h2>
          <p className="max-w-[869px] text-[16px] font-medium leading-[1.2] text-white md:text-[22px]">
            Join our growing community of Latin American professionals working
            remotely with top global companies
          </p>
          <div className="flex flex-wrap items-center gap-[10px]">
            <button
              type="button"
              onClick={() => router.push("/auth/register")}
              className="cursor-pointer rounded-[20px] bg-white px-[25px] py-[12px] text-[16px] font-semibold leading-[1.3] text-[rgba(4,78,92,0.85)] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] md:text-[20px] md:transition-colors md:hover:bg-gray-100"
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="cursor-pointer rounded-[20px] border border-white px-[25px] py-[12px] text-[16px] font-semibold leading-[1.3] text-white shadow-[0px_4px_4px_rgba(255,255,255,0.15)] md:text-[20px] md:transition-colors md:hover:bg-white/10"
            >
              Sign In
            </button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
