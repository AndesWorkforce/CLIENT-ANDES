export default function HeroSection() {
  return (
    <section className="relative w-full h-[344px] sm:h-[600px] overflow-hidden">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      >
        <source
          src="https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/about_us_team/optimized/Banner.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[rgba(4,78,92,0.8)]" />

      <div className="relative z-10 h-full flex items-center justify-center px-[18px] sm:px-6">
        <div className="text-center text-white max-w-4xl drop-shadow-[0px_4px_2px_#0c505c]">
          <h1 className="text-[32px] sm:text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.3]">
            We are <span className="text-[#0097b2]">Andes</span> Workforce
          </h1>
          <p className="mt-[10px] sm:mt-4 text-[14px] sm:text-xl md:text-2xl lg:text-[28px] font-semibold leading-[1.3] max-w-3xl mx-auto">
            A company specialized in connecting qualified talent from Latin
            America with global companies
          </p>
        </div>
      </div>
    </section>
  );
}
