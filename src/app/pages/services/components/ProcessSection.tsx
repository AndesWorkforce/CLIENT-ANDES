export default function ProcessSection() {
  return (
    <section className="w-full bg-white py-[44px] md:py-[117px] px-[18px] md:px-[80px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-[22px] md:mb-[30px]">
          <p className="text-[#0097B2] font-semibold text-[12px] md:text-[14px] leading-[1.3] mb-[11px]">
            MEET OUR TALENT
          </p>
          <h2 className="text-black font-bold text-[24px] md:text-[52px] leading-[1.3] md:leading-[1.2] mb-[22px]">
            From <span className="text-[#0097B2]">request</span> to ready in days, not weeks
          </h2>
          <p className="text-[#343434] md:text-[#525252] font-medium text-[14px] md:text-[22px] leading-[1.2]">
            A simple, transparent process designer to remove friction from your hiring
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-[44px]">
          <div className="flex flex-col gap-[18px] w-full md:w-[287px]">
            <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
              <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">01</p>
            </div>
            <h3 className="text-black font-bold text-[22px] leading-[1.3]">
              Tell us your needs
            </h3>
            <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
              Shre the role, hours, and the exact skills you're looking for
            </p>
          </div>

          <div className="flex flex-col gap-[18px] w-full md:w-[287px]">
            <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
              <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">02</p>
            </div>
            <h3 className="text-black font-bold text-[22px] leading-[1.3]">
              Get matched in 48h
            </h3>
            <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
              We hand-pick 3 vetted candidates from out 300+ talent tool
            </p>
          </div>

          <div className="flex flex-col gap-[18px] w-full md:w-[287px]">
            <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
              <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">03</p>
            </div>
            <h3 className="text-black font-bold text-[22px] leading-[1.3]">
              Select your candidates
            </h3>
            <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
              You interview, we handle contracts, payroll, and compliance.
            </p>
          </div>

          <div className="flex flex-col gap-[18px] w-full md:w-[287px]">
            <div className="bg-[#DFFAFF] rounded-[12px] w-[58px] h-[58px] flex items-center justify-center">
              <p className="text-[#0097B2] font-bold text-[22px] leading-[1.3]">04</p>
            </div>
            <h3 className="text-black font-bold text-[22px] leading-[1.3]">
              Scale with confidence
            </h3>
            <p className="text-[#525252] font-medium text-[18px] leading-[1.5]">
              Ongoing support and a dedicated success manager.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
