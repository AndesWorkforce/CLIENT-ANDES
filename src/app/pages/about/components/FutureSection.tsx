import Image from "next/image";

export default function FutureSection() {
  return (
    <section className="w-full bg-white py-8 sm:py-24">
      <div className="max-w-[1480px] mx-auto px-[18px] sm:px-10 md:px-20 flex flex-col-reverse lg:flex-row gap-[33px] lg:gap-14 items-center">
        {/* Image — left on desktop, below text on mobile */}
        <div className="relative w-full aspect-[16/9] lg:w-[611px] lg:h-[456px] lg:aspect-auto shrink-0 overflow-hidden">
          <Image
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/The+future+we%E2%80%99re+building+-+Mission.png"
            alt="The future we're building"
            fill
            className="object-cover"
          />
        </div>

        {/* Text — right on desktop, above image on mobile */}
        <div className="flex-1 w-full">
          <h2 className="text-[24px] sm:text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            The future we&apos;re{" "}
            <span className="text-[#0bc8e9]">building</span>
          </h2>
          <p className="mt-[22px] sm:mt-8 text-[14px] sm:text-lg md:text-[20px] text-black leading-[1.5]">
            To become a <strong>leading reference</strong> in the development of{" "}
            <strong>sustainable organizations</strong>, where both our clients
            and collaborators <strong>grow together</strong>, driven by{" "}
            <strong>collaborative</strong> and{" "}
            <strong>innovative solutions</strong> that benefit everyone involved.
          </p>
        </div>
      </div>
    </section>
  );
}
