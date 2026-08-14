export default function HeroSection() {
  return (
    <section className="relative w-full h-[332px] md:h-[600px] flex items-center justify-start md:justify-start">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://andes-workforce-s3.s3.us-east-2.amazonaws.com/images/page_andesworkforce/03.+Our+Services/optimized/Banner.webp')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, rgba(4,78,92,0.8) 20.19%, rgba(5,100,117,0.76) 53.99%, rgba(8,166,194,0.24) 71.95%)",
        }}
      />
      <div className="relative z-10 max-w-[1440px] mx-auto px-[20px] md:px-[82px] w-full">
        <div className="max-w-[1063px]">
          <h1 className="text-white font-bold text-[32px] md:text-[64px] leading-[1.3] mb-[10px] md:mb-[10px]">
            Hire Top-Tier Talent Tailored to Your Needs
          </h1>
          <p className="text-white font-medium md:font-semibold text-[14px] md:text-[28px] leading-[1.2] md:leading-[1.3] max-w-[353px] md:max-w-[831px]">
            Browse expert profiles and hire secuerly with dedicated support from Andes orkforce
          </p>
        </div>
      </div>
    </section>
  );
}
