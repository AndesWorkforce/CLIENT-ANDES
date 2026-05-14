import Image from "next/image";

export default function ImpactSection() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col lg:flex-row gap-14 items-center">
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-[48px] font-bold text-[#343434] leading-[1.3]">
            How we{" "}
            <span className="text-[#0097b2]">create impact</span>
          </h2>
          <p className="mt-8 text-lg md:text-[20px] text-black leading-[1.5]">
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
        <div className="relative w-full lg:w-[611px] h-[480px] shrink-0">
          <Image
            src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/How+we+create+impact+-+Vision.jpg"
            alt="How we create impact"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
