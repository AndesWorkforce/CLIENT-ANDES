import Image from "next/image";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="relative w-full h-[356px] overflow-hidden">
      {/* Background image */}
      <Image
        src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us/Call+to+Action+-Fondo.jpg"
        alt=""
        fill
        className="object-cover"
        aria-hidden
      />
      {/* Dark teal overlay */}
      <div className="absolute inset-0 bg-[rgba(4,78,92,0.85)]" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-10 md:px-20">
        <div className="flex flex-col gap-6 max-w-[666px]">
          <h2 className="text-4xl md:text-[48px] font-bold text-white leading-[1.3] drop-shadow-[0px_4px_4px_#11525e]">
            Ready to take the next step?
          </h2>
          <p className="text-lg md:text-[22px] font-medium text-white leading-[1.2]">
            Connecting businesses and talent to build stronger teams.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/pages/contact"
              className="bg-white rounded-[20px] px-6 py-3 text-[rgba(4,78,92,0.85)] text-lg md:text-[20px] font-semibold leading-[1.3] shadow-[0px_4px_2px_rgba(255,255,255,0.15)] hover:bg-gray-100 transition-colors"
            >
              Find Talent Now
            </Link>
            <Link
              href="/pages/jobs"
              className="border border-white rounded-[20px] px-6 py-3 text-white text-lg md:text-[20px] font-semibold leading-[1.3] shadow-[0px_4px_4px_0px_rgba(255,255,255,0.15)] hover:bg-white/10 transition-colors"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
