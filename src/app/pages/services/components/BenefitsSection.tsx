"use client";

export default function BenefitsSection() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-white py-[44px] md:py-[77px] px-[18px] md:px-[80px] order-2 md:order-1">
        <div className="max-w-[601px]">
          <div className="mb-[38px]">
            <p className="text-[#0097B2] font-semibold text-[12px] md:text-[14px] leading-[1.3] mb-[11px]">
              WHY ANDES WORKFORCE
            </p>
            <h2 className="text-black font-bold text-[24px] md:text-[48px] leading-[1.3]">
              Elevate your team with{" "}
              <span className="text-[#0097B2]">world-class talent</span>
            </h2>
          </div>

          <div className="flex flex-col gap-[39px] md:gap-[39px] mb-[38px]">
            <div className="flex gap-[11px]">
              <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] md:w-[58px] h-[58px] md:h-[58px] flex items-center justify-center flex-shrink-0">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="#0097B2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z" />
                  <path d="M26 27v-2c0-2.2-1.8-4-4-4h-12c-2.2 0-4 1.8-4 4v2" />
                  <path d="M21 7l2 2 4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#0097B2] font-bold text-[16px] md:text-[18px] leading-[1.3] mb-[7px]">
                  Vetted Elite Talent
                </h3>
                <p className="text-[#525252] font-medium text-[14px] md:text-[18px] leading-[1.2]">
                  Access a pool of highly skilled professionals dedicated to excellence
                </p>
              </div>
            </div>

            <div className="flex gap-[11px]">
              <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] md:w-[58px] h-[58px] md:h-[58px] flex items-center justify-center flex-shrink-0">
                <svg
                  width="31"
                  height="31"
                  viewBox="0 0 31 31"
                  fill="none"
                  stroke="#0097B2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 6l-9.5 9.5-5-5L2 17" />
                  <path d="M17 6h6v6" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#0097B2] font-bold text-[16px] md:text-[18px] leading-[1.3] mb-[7px]">
                  High-Impact Performance
                </h3>
                <p className="text-[#525252] font-medium text-[14px] md:text-[18px] leading-[1.2]">
                  Every role is filled with experts committed to delivering results
                </p>
              </div>
            </div>

            <div className="flex gap-[11px]">
              <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] md:w-[58px] h-[58px] md:h-[58px] flex items-center justify-center flex-shrink-0">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="#0097B2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 13l-5 5-5-5" />
                  <path d="M18 3v15" />
                  <path d="M9 8H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#0097B2] font-bold text-[16px] md:text-[18px] leading-[1.3] mb-[7px]">
                  Exceptional Value
                </h3>
                <p className="text-[#525252] font-medium text-[14px] md:text-[18px] leading-[1.2]">
                  Positions start at $2,000/month with zero compromise on quality
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToContact}
            className="bg-[#0097B2] text-white font-semibold text-[20px] leading-[1.3] px-[25px] py-[12px] rounded-[20px] hover:bg-[#007A8F] transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[350px] md:h-[749px] relative order-1 md:order-2">
        <img
          src="https://www.figma.com/api/mcp/asset/48ef725b-eb9f-4f82-80b7-453bef8d43c7"
          alt="Office professional"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
