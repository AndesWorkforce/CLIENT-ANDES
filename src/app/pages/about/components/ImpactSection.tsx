import Image from "next/image";

export default function ImpactSection() {
  return (
    <section className="w-full bg-white pt-12 sm:pt-[101px] pb-8 sm:pb-0">
      <div className="max-w-[1092px] mx-auto px-[18px] sm:px-6 flex flex-col lg:flex-row gap-[33px] lg:gap-[44px] items-center">
        <div className="flex-1 w-full">
          <h2 className="text-[24px] sm:text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            How we <span className="text-[#0097b2]">create impact</span>
          </h2>
          <p className="mt-[22px] sm:mt-[33px] text-[14px] sm:text-lg md:text-[20px] text-black leading-[1.5]">
            To{" "}
            <strong className="font-semibold">
              empower organizations and our collaborators
            </strong>{" "}
            by building{" "}
            <strong className="font-semibold">high-performing teams</strong>,
            optimizing processes, and implementing
            <strong className="font-semibold"> innovative solutions</strong>. We
            aim to create{" "}
            <strong className="font-semibold">continuous value</strong> for all
            parties involved while fostering{" "}
            <strong className="font-semibold">
              mutual growth and shared success.
            </strong>
          </p>
        </div>

        <div className="relative w-full aspect-[528/364] lg:w-[528px] lg:h-[364px] lg:aspect-auto shrink-0 overflow-hidden rounded-[16px]">
          <Image
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/How+we+create+impact+-+Vision.webp"
            alt="How we create impact"
            fill
            className="object-cover rounded-[16px]"
          />
        </div>
      </div>
    </section>
  );
}
