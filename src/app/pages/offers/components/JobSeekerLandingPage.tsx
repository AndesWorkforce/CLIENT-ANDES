"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Briefcase, Globe, TrendingUp, Shield, Clock, Award } from "lucide-react";

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

const benefits = [
  {
    icon: Globe,
    title: "100% Remote Work",
    description:
      "Work from anywhere in Latin America with top US and international companies",
  },
  {
    icon: Briefcase,
    title: "Competitive Salaries",
    description:
      "Earn between $1,000 – $3,000 USD per month, paid consistently and on time",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Access mentorship, training, and a clear path to advance professionally",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Formal contracts, legal compliance, and full HR support throughout your employment",
  },
  {
    icon: Clock,
    title: "Flexible Opportunities",
    description:
      "Full-time and part-time roles across various industries and specializations",
  },
  {
    icon: Award,
    title: "Performance Bonuses",
    description:
      "Earn extra with referral bonuses, performance incentives, and seniority rewards",
  },
];

const stats = [
  { value: "50+", label: "Partner Companies" },
  { value: "200+", label: "Professionals Hired" },
  { value: "$1K - $3K", label: "Monthly Salary Range" },
  { value: "10+", label: "Countries Represented" },
];

export default function JobSeekerLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative w-full h-[500px] md:h-[600px] flex items-end px-6 sm:px-10 md:px-16 py-16 md:pb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/04.+Join+Our+Team/Banner.webp"
            alt="Team celebrating"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08252A]/90 via-[#08252A]/70 to-[#0097B2]/50" />
        </div>

        <div className="relative z-10 max-w-[660px] text-white flex flex-col gap-6 md:gap-8">

          {/* Heading */}
          <h1 className="text-[34px] sm:text-[46px] md:text-[58px] font-bold leading-tight font-[family-name:var(--font-outfit)]">
            Launch Your Career{" "}
            <span className="text-[#00e5ff]">From Latin America</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-[560px]">
            Join hundreds of professionals collaborating remotely with leading U.S. companies. Attractive compensation, clear agreements, and full career support, all from home.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-[#0097B2] hover:bg-[#007A8F] text-white px-8 py-3 rounded-[20px] text-base font-semibold transition-colors cursor-pointer shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-[20px] text-base font-semibold transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0097B2] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl md:text-4xl font-bold">{stat.value}</span>
                <span className="text-sm text-white/80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold text-[#08252A] mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              From registration to your first paycheck - simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center gap-4"
              >
                <div className="w-[73px] h-[73px] rounded-full bg-[#DFFAFF] border-2 border-[#0097B2] flex items-center justify-center flex-shrink-0 z-10">
                  <span className="text-[#0097B2] font-bold text-[22px]">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[#08252A] text-[20px] mb-2">{step.title}</h3>
                  <p className="text-[14px] text-[#707070] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-[#F4FAFB]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-bold text-[#08252A] mb-4">
              Why Join Andes Workforce?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We offer more than just a job — we offer a career path with support
              at every step
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#0097B2]/10 rounded-lg flex items-center justify-center">
                  <benefit.icon size={24} className="text-[#0097B2]" />
                </div>
                <h3 className="font-bold text-[#08252A]">{benefit.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#08252A] to-[#0097B2] text-white text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold mb-4">
            Ready to start?
          </h2>
          <p className="text-white/90 mb-8 text-base sm:text-lg leading-relaxed">
            Join our growing community of Latin American professionals working remotely with top global companies
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-white text-[#0097B2] hover:bg-gray-100 px-10 py-3 rounded-[20px] text-base font-semibold transition-colors cursor-pointer shadow-md"
            >
              Create Account
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="border border-white text-white hover:bg-white/10 px-10 py-3 rounded-[20px] text-base font-semibold transition-colors cursor-pointer shadow-[0px_4px_4px_rgba(255,255,255,0.15)]"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
