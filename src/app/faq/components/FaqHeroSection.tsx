import Image from "next/image";

const FAQ_HERO_IMAGE = "/FAQ%20img.png";

export default function FaqHeroSection() {
  return (
    <section className="relative w-full h-[208px] overflow-hidden">
      <Image
        src={FAQ_HERO_IMAGE}
        alt="Professional workspace"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-[rgba(4,78,92,0.8)]" />
      <div className="relative z-10 h-full flex items-center px-[18px] sm:px-[82px]">
        <div className="max-w-[735px] text-white drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)]">
          <h1 className="text-[32px] font-bold leading-[1.3]">
            Frequently Asked Questions
          </h1>
          <p className="mt-[13px] text-base font-medium leading-[1.2]">
            Helpful information about your account, payments, requests, and daily
            processes.
          </p>
        </div>
      </div>
    </section>
  );
}
