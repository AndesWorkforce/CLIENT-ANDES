import Image from "next/image";

export default function FutureSection() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1480px] mx-auto px-10 md:px-20 flex flex-col lg:flex-row gap-14 items-center">
        {/* Image — left on desktop */}
        <div className="relative w-full lg:w-[611px] h-[456px] shrink-0 overflow-hidden">
          <Image
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/The+future+we%E2%80%99re+building+-+Mission.png"
            alt="The future we're building"
            fill
            className="object-cover"
          />
        </div>

        {/* Text — right on desktop */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            The future we&apos;re{" "}
            <span className="text-[#0097b2]">building</span>
          </h2>
          <p className="mt-8 text-lg md:text-[20px] text-black leading-[1.5]">
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
