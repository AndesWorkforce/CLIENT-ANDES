import Image from "next/image";

export default function ImpactSection() {
  return (
    <section className="w-full bg-white py-8 sm:py-24">
      <div className="max-w-[1440px] mx-auto px-[18px] sm:px-10 md:px-20 flex flex-col lg:flex-row gap-[33px] lg:gap-14 items-center">
        {/* Text */}
        <div className="flex-1 w-full">
          <h2 className="text-[24px] sm:text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            How we{" "}
            <span className="text-[#0097b2]">create impact</span>
          </h2>
          <p className="mt-[22px] sm:mt-8 text-[14px] sm:text-lg md:text-[20px] text-black leading-[1.5]">
            To{" "}
            <strong>empower organizations and our collaborators</strong> by
            building <strong>high-performing teams</strong>, optimizing
            processes, and implementing
            <strong> innovative solutions</strong>. We aim to create{" "}
            <strong>continuous value</strong> for all parties involved while
            fostering{" "}
            <strong>mutual growth and shared success.</strong>
          </p>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-[16/9] lg:w-[611px] lg:h-[480px] lg:aspect-auto shrink-0 overflow-hidden rounded-[15px]">
          <Image
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/How+we+create+impact+-+Vision.jpg"
            alt="How we create impact"
            fill
            className="object-cover rounded-[15px]"
          />
        </div>
      </div>
    </section>
  );
}
